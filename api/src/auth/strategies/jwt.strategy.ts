import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../../users/entities/user.entity.js";
import {Repository} from "typeorm";
dotenv.config();

interface JwtPayload {
  sub: number;
  email: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService,
    @InjectRepository(UserEntity) private readonly userDB: Repository<UserEntity>,) {
    super({
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: JwtPayload) {
    const user = await this.userDB.findOne({where:{id: payload.sub}, select:{
      firstName:true, lastName:true, role_id:true, avatar:{id:true, url:true, public_id:true},
      company:{link:true, employments_count:true, id:true}, email:true, id:true
      }, relations: {avatar: true, company: true}});
    console.log({user});
    return user;
  }
}
