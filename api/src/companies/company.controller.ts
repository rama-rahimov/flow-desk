import { Controller, Get, Param } from '@nestjs/common';
import { CompanyService } from './company.service.js';

@Controller('api/company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}
  @Get(':link')
  checkCompany(@Param('link') link: string) {
    console.log({ link });
    return this.companyService.checkCompany(link);
  }
}
