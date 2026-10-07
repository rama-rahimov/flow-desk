import {IsInt, IsNotEmpty, IsString} from "class-validator";

export class MessageDto {
    @IsNotEmpty()
    @IsString()
    companyLink: string;
    @IsNotEmpty()
    @IsString()
    message: string;
    @IsNotEmpty()
    senderId: string|null;
    visitorId: string;
    conversationId: number|null;
    @IsNotEmpty()
    @IsInt()
    roleId:number;
}