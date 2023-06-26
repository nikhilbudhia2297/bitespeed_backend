import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {LinkPrecedence} from "../enums/ContactEnums";

@Entity()
export class Contact{

    @PrimaryGeneratedColumn()
    private id : number

    @Column({nullable : true})
    @Index()
    private phoneNumber : string

    @Column({nullable : true})
    @Index()
    private email : string

    @Column({nullable : true})
    @Index()
    private linkedId : number

    @Column({ default : LinkPrecedence.PRIMARY })
    private linkPrecedence : LinkPrecedence

    @CreateDateColumn()
    private createdAt : Date

    @UpdateDateColumn()
    private updatedAt : Date

    @Column({nullable : true})
    private deletedAt : Date

    static getInstance(){
        return new Contact();
    }

    setPhoneNumber(phone : string){
        this.phoneNumber = phone;
        return this;
    }

    setEmail(email : string){
        this.email = email;
        return this;
    }

    setLinkPrecedence(precedence : LinkPrecedence){
        this.linkPrecedence = precedence;
        return this;
    }

    setPrimaryId(id : number){
        this.linkedId = id;
        return this;
    }

    getId(){
        return this.id;
    }

    getLinkPrecedence(){
        return this.linkPrecedence;
    }

    getPrimaryId(){
        return this.linkedId;
    }

    getPhoneNumber(){
        return this.phoneNumber;
    }

    getEmail(){
        return this.email;
    }

}