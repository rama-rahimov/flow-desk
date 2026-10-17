import { Injectable } from '@nestjs/common';
import { CompanyEntity } from './entities/company.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {RedisService} from "../redis/redis.service.js";

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyDB: Repository<CompanyEntity>,
    private readonly redisService: RedisService
  ) {}
  async checkCompany(link: string) {
      const redisCompanyJson = await this.redisService.get(`company_${link}`);
      if(redisCompanyJson){
      const redisCompany = JSON.parse(redisCompanyJson);
      return { success: true, data: redisCompany };
      }else {
          const company = await this.companyDB.findOne({
              where: { link },
              select: { id: true, link: true, name: true, employments_count: true},
          });
          if (company?.id) {
              await this.redisService.set(`company_${link}`, JSON.stringify(company));
              return { success: true, data: company };
          } else {
              return { success: false, message: 'No such company' };
          }
      }
  }
}
