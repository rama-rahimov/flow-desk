import { Injectable } from '@nestjs/common';
import { CompanyEntity } from './entities/company.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyDB: Repository<CompanyEntity>,
  ) {}
  async checkCompany(link: string) {
      const company = await this.companyDB.findOne({
        where: { link },
        select: { id: true, link: true, name: true, employments_count: true },
      });
      if (company?.id) {
        return { success: true, data: company };
      } else {
        return { success: false, message: 'No such company' };
      }
  }
}
