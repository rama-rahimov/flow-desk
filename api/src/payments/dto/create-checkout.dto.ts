import {IsInt, IsString, Min} from 'class-validator';

export class CreateCheckoutDto {
  @IsInt()
  companyId: number;

  @IsInt()
  price: number;

  @IsInt()
  @Min(1)
  employeesCount: number;
}
