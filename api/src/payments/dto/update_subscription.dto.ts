import {IsBoolean, IsDecimal, IsInt, IsOptional, IsString} from 'class-validator';

export class UpdateSubDto {
    @IsString()
    sub_id: string;
    @IsBoolean()
    cancel_at_period_end: boolean;
    @IsInt()
    paymentId:number;
    @IsOptional()
    @IsInt()
    employee_limit:number;
    @IsOptional()
    @IsDecimal()
    price:number;
}
