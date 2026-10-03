import {Controller, Get, Req, Res} from "@nestjs/common";
import type { Request, Response } from "express";
import {randomUUID} from 'crypto';
@Controller('api/customer')
export class CustomerController {
    @Get()
    setCookie(@Req() req:Request, @Res({passthrough:true}) res:Response) {
        let visitorId = req.cookies.visitorId;
        if(!visitorId){
            visitorId = randomUUID();
            res.cookie('visitorId', visitorId, {
                httpOnly:true,
                secure:true,
                sameSite:'lax',
                maxAge: 1000 * 60 * 60 * 24 * 30,
            })
        }
        return {
            massage: 'Client page'
        }
    }
}