import {IsBoolean, IsInt, IsString} from 'class-validator';

export class UpdateSubDto {
    @IsString()
    sub_id: string;
    @IsBoolean()
    cancel_at_period_end: boolean;
    @IsInt()
    paymentId:number;
    @IsInt()
    companyId:number;
}
