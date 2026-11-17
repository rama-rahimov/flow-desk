import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MessageDto {
  @IsNotEmpty()
  @IsString()
  companyLink: string;
  @IsNotEmpty()
  @IsString()
  message: string;
  @IsOptional()
  @IsNotEmpty()
  senderId?: string;
  @IsOptional()
  visitorId?: string;
  conversationId: number | null;
  @IsNotEmpty()
  @IsInt()
  roleId: number;
}
