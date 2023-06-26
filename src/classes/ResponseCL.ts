export class IdentityResponseCL {
    contact : ContactResponseCL;
}

export class ContactResponseCL {
    primaryContactId : number;
    emails : string[]; // first element being email of primary contact
    phoneNumbers : string[]; // first element being phoneNumber of primary contact
    secondaryContactIds : number[] // Array of all Contact IDs that are "secondary" to the primary contact

    constructor() {
        this.emails = [];
        this.phoneNumbers = [];
        this.secondaryContactIds = [];
    }
}