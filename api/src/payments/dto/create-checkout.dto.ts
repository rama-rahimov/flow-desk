import { IsInt, IsUUID, Min } from 'class-validator';

export class CreateCheckoutDto {
    @IsInt()
    companyId: string;

    @IsInt()
    @Min(1)
    employeesCount: number;
}