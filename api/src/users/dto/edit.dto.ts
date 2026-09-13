import {IsEmail, IsOptional } from "class-validator";

export class EditProfileDto {
  @IsOptional()
  firstName: string;
  @IsOptional()
  lastName: string;
  @IsOptional()
  @IsEmail()
  email: string;
}
