import {EntityRepository, QueryRunner, Repository} from "typeorm";
import {Contact} from "../entities/Contact";


@EntityRepository(Contact)
export class ContactRepository extends Repository<Contact>{

    async saveInstance(instance : Contact, queryRunner ? : QueryRunner){
        const connection = queryRunner ? queryRunner.manager.getRepository(Contact) : this;
        return await connection.save(instance);
    }

    async getByPhoneOrEmail(phone : string, email : string){
        return await this.createQueryBuilder('C')
            .where('C.phoneNumber = :phone', {phone})
            .orWhere('C.email = :email', {email})
            .getMany();
    }

    async getById(id : number){
        return await this.findOneOrFail(id);
    }

    async getByPhoneAndEmail(phone : string, email : string){
        return await this.createQueryBuilder('C')
            .where('C.phoneNumber = :phone', {phone})
            .andWhere('C.email = :email', {email})
            .getOne();
    }

    async getContactsLinkedWithPrimaryId(primaryContactId : number){
        return await this.createQueryBuilder('C')
            .where('C.linkedId = :primaryContactId', {primaryContactId})
            .getMany();
    }
}