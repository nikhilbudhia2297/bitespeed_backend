import {HttpError} from "routing-controllers";

export class IdentityException extends HttpError{
    public httpCode : number;
    public message : string;

    constructor(code : number, message : string) {
        super(code, message);
        this.httpCode = code;
        this.message = message;
    }

}