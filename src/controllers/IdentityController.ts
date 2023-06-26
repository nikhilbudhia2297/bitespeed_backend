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

    @Post('/identity')
    async getOrAddIdentity(@Body() body : IdentityRequestCL,
                           @Res() res : Response){
        const response = await this.identityService.getOrAddIdentity(body);
        if(response){
            return res.status(200).send(response);
        }
        return res.status(500).send({ errorMsg : "Something went wrong " });
    }
}