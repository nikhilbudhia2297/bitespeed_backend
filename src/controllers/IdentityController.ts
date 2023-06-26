import {Body, JsonController, Post, Res} from "routing-controllers";
import {IdentityRequestCL} from "../classes/RequestCL";
import {IdentityService} from "../services/IdentityService";
import {Container} from "typedi";
import {Response} from "express";

@JsonController()
export class IdentityController{

    private identityService : IdentityService;

    constructor() {
        this.identityService = Container.get(IdentityService);
    }

    @Post('/identify')
    async getOrAddIdentity(@Body() body : IdentityRequestCL,
                           @Res() res : Response){
        const serviceResponse = await this.identityService.getOrAddIdentity(body);
        if(serviceResponse.responseCode == 200){
            return res.status(200).send(serviceResponse.data);
        }
        return res.status(serviceResponse.responseCode).send({ errorMsg : serviceResponse.responseMessage });
    }
}