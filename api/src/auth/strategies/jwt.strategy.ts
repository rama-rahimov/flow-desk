import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../../users/entities/user.entity.js";
import {Repository} from "typeorm";
import {CustomerEntity} from "../../customers/entities/customer.entity.js";
import {RedisService} from "../../redis/redis.service.js";
dotenv.config();

interface JwtPayload {
  sub: number;
  email: string;
  companyId: number;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService,
    @InjectRepository(UserEntity) private readonly userDB: Repository<UserEntity>,
    @InjectRepository(CustomerEntity) private readonly customerDB: Repository<CustomerEntity>, private readonly redisService: RedisService) {
    super({
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: JwtPayload) {
    const jwtUserJson = await this.redisService.get(`userId_${payload.sub}&email_${payload.email}&companyId_${payload.companyId}`);
    const jwtUser = JSON.parse(jwtUserJson);
    if(jwtUser?.id){
      const user = jwtUser;
      return user;
    }else {
      const user = await this.userDB.findOne({where:{id: payload.sub, email:payload.email, company:{id:payload.companyId}}, select:{
          firstName:true, lastName:true, role_id:true, avatar:{id:true, url:true, public_id:true},
          company:{link:true, employments_count:true, id:true}, email:true, id:true
        }, relations: {avatar: true, company: true}}) ||  await this.customerDB.findOne({where:{id: payload.sub, email: payload.email, company:{id:payload.companyId}}, select:{
          firstName:true, lastName:true, company:{link:true, employments_count:true, id:true}, email:true, id:true
        }, relations: {company: true}});
      await this.redisService.set(`userId_${payload.sub}&email_${payload.email}&companyId_${payload.companyId}`, JSON.stringify(user));
      return user;
    }
  }
}
