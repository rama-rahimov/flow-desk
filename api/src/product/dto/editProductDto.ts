import {IsNotEmpty, Length, IsNumber, IsEnum, IsOptional, ValidateIf} from 'class-validator';
enum ProductCurrency {
    USD = 'USD',
    EUR = 'EUR',
    AZN = 'AZN'
}
export class editProductDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;
    @ValidateIf((obj:{name:string}) => obj.name !== undefined && obj.name !== '')
    @Length(5, 50)
    name?: string;

    @ValidateIf((obj:{description:string}) => obj.description !== undefined && obj.description !== '')
    @Length(20, 500)
    description?: string;
    @IsOptional()
    @IsNumber({maxDecimalPlaces:2})
    price?: number;
    @IsOptional()
    @IsEnum(ProductCurrency)
    status?: ProductCurrency;
}