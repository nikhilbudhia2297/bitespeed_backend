import {Service} from "typedi";
import {IdentityRequestCL} from "../classes/RequestCL";
import {ContactRepository} from "../repositories/ContactRepository";
import {getCustomRepository} from "typeorm";
import {ContactResponseCL, IdentityResponseCL} from "../classes/ResponseCL";
import {IdentityException} from "../classes/IdentityException";
import {ResponseData} from "../classes/ResponseData";
import {Contact} from "../entities/Contact";
import {LinkPrecedence} from "../enums/ContactEnums";

@Service()
export class IdentityService{

    private contactRepository : ContactRepository;

    constructor() {
        this.contactRepository = getCustomRepository(ContactRepository);
    }


    async getOrAddIdentity(body : IdentityRequestCL){
        try {
            if(!body.email && !body.phoneNumber){
                throw new IdentityException(400, 'invalid input');
            }
            let response : IdentityResponseCL = new IdentityResponseCL();

            /**
             * find by both (check for both same )
             *  - old contact
             *  - get linked contacts
             *
             * find by email OR find by mobile (either exist )
             *  - add new (SECONDARY)
             *  - link this to primary
             *  - get linked contacts
             *
             * find by email, find by mobile (both exist and different contacts)
             *  - link these 2
             *  - get linked contacts
             *
             * not exist in db
             *  - add new (PRIMARY)
             *  - get linked contacts
             * */

            const contactByEmailAndPhone = await this.contactRepository.getByPhoneAndEmail(body.phoneNumber, body.email);
            if(contactByEmailAndPhone){
                /** same contact */
                response.contact = await this.getLinkedContacts(contactByEmailAndPhone);
                return ResponseData.build(200, 'success', response);
            }

            const contactByPhoneOrEmail = await this.contactRepository.getByPhoneOrEmail(body.phoneNumber, body.email);

            if(!contactByPhoneOrEmail){
                /** new contact (no details same) */
                let newContact = Contact.getInstance();
                newContact.setPhoneNumber(body.phoneNumber)
                    .setEmail(body.email)
                    .setLinkPrecedence(LinkPrecedence.PRIMARY)
                newContact = await this.contactRepository.saveInstance(newContact);

                response.contact = await this.getLinkedContacts(newContact);
                return ResponseData.build(200, 'success', response);
            }


        } catch (err : any) {
            console.log(`error in getOrAddIdentity ${err.message}`);
            if(err.httpCode){
                return ResponseData.build(err.httpCode, err.message);
            }
        }
        return ResponseData.build(500, 'something went wrong');
    }

    async getLinkedContacts(contact : Contact){
        let primaryContactDetails : Contact;
        let responseObj : ContactResponseCL = new ContactResponseCL();
        if(contact.getLinkPrecedence() == LinkPrecedence.PRIMARY){
            primaryContactDetails = contact;
        } else{
            const id = contact.getPrimaryId();
            if(!id){
                throw new IdentityException(400, 'invalid data in db');
            }
            primaryContactDetails = await this.contactRepository.getById(id);
        }

        this.addPrimaryContactDetails(primaryContactDetails, responseObj);

        const contacts = await this.contactRepository.getContactsLinkedWithPrimaryId(responseObj.primaryContactId);

        contacts.map((item : Contact) => {
            responseObj.secondaryContactIds.push(item.getId());
            if(item.getEmail()){
                responseObj.emails.push(item.getEmail());
            }
            if(item.getPhoneNumber()){
                responseObj.phoneNumbers.push(item.getPhoneNumber());
            }
        });

        return responseObj;
    }

    addPrimaryContactDetails(primaryContactDetails : Contact, responseObj : ContactResponseCL){
        responseObj.primaryContactId = primaryContactDetails.getId();
        const primaryPhone = primaryContactDetails.getPhoneNumber();
        if(primaryPhone){
            responseObj.phoneNumbers.push(primaryPhone);
        }

        const primaryEmail = primaryContactDetails.getEmail();
        if(primaryEmail){
            responseObj.emails.push(primaryEmail);
        }
    }

}