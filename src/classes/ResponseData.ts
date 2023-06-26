export class ResponseData{
    responseCode : number
    responseMessage : string
    data : any

    constructor(code : number, message : string, data? : any) {
        this.responseCode = code;
        this.responseMessage = message;
        this.data = data;
    }

    public static build(code: number, message: string, data: any = undefined) {
        return new ResponseData(code, message, data)
    }
}