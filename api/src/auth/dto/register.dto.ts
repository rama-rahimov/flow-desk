import {IsEmail, IsNotEmpty, Length, ValidateIf} from "class-validator";

export class RegisterDto {
  @IsNotEmpty()
  firstName: string;
  @IsNotEmpty()
  lastName: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @Length(5,20)
  password: string;
  @IsNotEmpty()
  role_id: number;
  @ValidateIf((obj)=> obj.role_id === 2)
  @IsNotEmpty()
  companyName:string;
  @ValidateIf((obj)=> obj.role_id === 2)
  @IsNotEmpty()
  link:string;
  @ValidateIf((obj)=> obj.role_id === 2)
  @IsNotEmpty()
  employmentsCount:number;
  @ValidateIf((obj)=> obj.role_id === 2)
  @IsNotEmpty()
  startWork:string;
  @ValidateIf((obj)=> obj.role_id === 1)
  @IsNotEmpty()
  companyId:number;
}