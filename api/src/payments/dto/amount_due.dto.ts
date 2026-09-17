import {IsDecimal, IsString} from "class-validator";

export class Amount_dueDto{
    @IsString()
    subscription_id:string;
    @IsDecimal()
    price:string;
}