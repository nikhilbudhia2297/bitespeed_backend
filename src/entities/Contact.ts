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

}