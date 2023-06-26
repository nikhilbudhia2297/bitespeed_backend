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


            let contactsByEmail : any[] = await this.contactRepository.getContactsByEmail(body.email);
            let contactsByPhone : any[] = await this.contactRepository.getContactsByPhone(body.phoneNumber);

            /** no details same : create new  */
            if(contactsByEmail.length == 0 && contactsByPhone.length == 0){
                let newContact = Contact.getInstance()
                    .setPhoneNumber(body.phoneNumber)
                    .setEmail(body.email)
                    .setLinkPrecedence(LinkPrecedence.PRIMARY);

                newContact = await this.contactRepository.saveInstance(newContact);

                response.contact = await this.getLinkedContacts(newContact);
                return ResponseData.build(200, 'success', response);
            }

            /** any 1 (email/phone) is new : create new */
            // todo : handle null case in input
            if((body.email && contactsByEmail.length == 0) || (body.phoneNumber && contactsByPhone.length == 0)){
                let primaryContactId : number = 0;
                if(contactsByEmail.length == 0){
                    primaryContactId = this.getPrimaryContactIdFromList(contactsByPhone);
                }
                if(contactsByPhone.length == 0){
                    primaryContactId = this.getPrimaryContactIdFromList(contactsByEmail);
                }

                let newContact = Contact.getInstance()
                    .setPhoneNumber(body.phoneNumber)
                    .setEmail(body.email)
                    .setLinkPrecedence(LinkPrecedence.SECONDARY)
                    .setPrimaryId(primaryContactId);

                newContact = await this.contactRepository.saveInstance(newContact);

                response.contact = await this.getLinkedContacts(newContact);
                return ResponseData.build(200, 'success', response);
            }

            const primaryContactByEmail : Contact = contactsByEmail.find((contact : Contact) => contact.getLinkPrecedence() == LinkPrecedence.PRIMARY);
            const primaryContactByPhone : Contact = contactsByPhone.find((contact : Contact) => contact.getLinkPrecedence() == LinkPrecedence.PRIMARY);

            /** both primary and not same : update newer as secondary */
            if(primaryContactByEmail && primaryContactByPhone && primaryContactByEmail.getId() != primaryContactByPhone.getId()){
                if(primaryContactByEmail.getCreatedAt() > primaryContactByPhone.getCreatedAt()){
                    primaryContactByEmail
                        .setLinkPrecedence(LinkPrecedence.SECONDARY)
                        .setPrimaryId(primaryContactByPhone.getId());
                    await this.contactRepository.saveInstance(primaryContactByEmail);
                    response.contact = await this.getLinkedContacts(primaryContactByPhone);
                }else {
                    primaryContactByPhone
                        .setLinkPrecedence(LinkPrecedence.SECONDARY)
                        .setPrimaryId(primaryContactByEmail.getId());
                    await this.contactRepository.saveInstance(primaryContactByPhone);
                    response.contact = await this.getLinkedContacts(primaryContactByEmail);
                }
                return ResponseData.build(200, 'success', response);
            }

            const contact = contactsByEmail.length ? contactsByEmail[0] : contactsByPhone[0];
            response.contact = await this.getLinkedContacts(contact);
            return ResponseData.build(200, 'success', response);

        } catch (err : any) {
            console.log(`error in getOrAddIdentity ${err.message}`);
            if(err.httpCode){
                return ResponseData.build(err.httpCode, err.message);
            }
        }
        return ResponseData.build(500, 'something went wrong');
    }

    getPrimaryContactIdFromList(arr : Contact[]){
        if(!arr.length){
            return 0;
        }
        const primary = arr.find(contact => contact.getLinkPrecedence() == LinkPrecedence.PRIMARY);
        if(primary){
            return primary.getId();
        }
        return arr[0].getPrimaryId();
    }

    async getLinkedContacts(contact : Contact){
        let primaryContactDetails : Contact;
        let responseObj : ContactResponseCL = new ContactResponseCL();
        if(contact.getLinkPrecedence() == LinkPrecedence.PRIMARY){
            primaryContactDetails = contact;
        } else{
            const primaryContactId = contact.getPrimaryId();
            if(!primaryContactId){
                throw new IdentityException(400, 'invalid data in db');
            }
            primaryContactDetails = await this.contactRepository.getById(primaryContactId);
        }

        this.addPrimaryContactDetails(primaryContactDetails, responseObj);

        const contacts = await this.contactRepository.getContactsLinkedWithPrimaryId(responseObj.primaryContactId);

        contacts.map((item : Contact) => {
            responseObj.secondaryContactIds.push(item.getId());
            if(item.getEmail() && !responseObj.emails.find(email => email == item.getEmail())){
                responseObj.emails.push(item.getEmail());
            }
            if(item.getPhoneNumber() && !responseObj.phoneNumbers.find(email => email == item.getPhoneNumber())){
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