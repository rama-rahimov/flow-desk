import {IsNotEmpty, Length, IsNumber, IsEnum} from 'class-validator';
enum ProductCurrency {
    USD = 'USD',
    EUR = 'EUR',
    AZN = 'AZN'
}
export class productDto {
    @Length(5, 50)
    @IsNotEmpty()
    name: string;
    @Length(20, 400)
    @IsNotEmpty()
    description: string;
    @IsNumber({maxDecimalPlaces:2})
    price: number;
    @IsEnum(ProductCurrency)
    status: ProductCurrency;
    @IsNumber()
    companyId: number;
}