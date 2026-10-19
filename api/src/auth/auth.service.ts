import { RegisterDto } from './dto/register.dto.js';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto.js';
import { UserEntity } from '../users/entities/user.entity.js';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import {ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from '../companies/entities/company.entity.js';
import { CustomerEntity } from '../customers/entities/customer.entity.js';
import {ConversationEntity} from "../chat/entities/conversation.entity.js";
import {MessageEntity} from "../chat/entities/message.entity.js";
import {RedisService} from "../redis/redis.service.js";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userDB: Repository<UserEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyDB: Repository<CompanyEntity>,
    @InjectRepository(CustomerEntity)
    private readonly customerDB: Repository<CustomerEntity>,
    @InjectRepository(ConversationEntity)
    private readonly convDB: Repository<ConversationEntity>,
    @InjectRepository(MessageEntity)
    private readonly messagesDB: Repository<MessageEntity>,
    private readonly jwt: JwtService, private readonly redisService:RedisService
  ) {}
  async register(dataRegister: RegisterDto, visitorId) {
      const {
        firstName,
        lastName,
        email,
        password,
        companyName,
        link,
        startWork,
        role_id,
        companyId,
      } = dataRegister;
      const saltRounds = await bcrypt.genSalt(10);
      const findUserData = role_id === 1 ? { email, company: { id: companyId } } : { email };
      let findUser: UserEntity|CustomerEntity|null;
      if(role_id === 2) {
        findUser = await this.userDB.findOneBy(findUserData);
      } else {
        findUser = await this.customerDB.findOneBy(findUserData);
      }
      if (findUser?.id) {
        throw new ConflictException('User already exists!');
      } else {
        const hash = await bcrypt.hash(password, saltRounds);
        if (Number(role_id) === 2) {
          const findComLink = await this.companyDB.findOneBy({ link });
          const findComName = await this.companyDB.findOneBy({
            name: companyName,
          });
          if (findComName?.id || findComLink?.id) {
            throw new ConflictException('This company name or link already exists!');
          } else {
            const createCompany = this.companyDB.create({
              name: companyName,
              start_work: startWork,
              link,
            });
            const company = await this.companyDB.save(createCompany);
            const createUser = this.userDB.create({
              firstName,
              lastName,
              email,
              password: hash,
              company: { id: company.id },
              role_id,
            });
            const user = await this.userDB.save(createUser);
            return { success: true, data: { ...user, ...company } };
          }
        } else {
          const conversation = await this.convDB.findOneBy({clientId:visitorId, company:{link}});
          console.log({ conversation, visitorId, link });
          const createCustomer = this.customerDB.create({
            firstName,
            lastName,
            email,
            password: hash,
            company: { id: companyId },
          });
          const customer = await this.customerDB.save(createCustomer);
          if(conversation?.id){
            console.log("Strat, New client updated!");
            await this.convDB.update({id: conversation?.id},{customer: {id: customer.id}});
            await this.messagesDB.update({conversation:{id:conversation?.id}, senderId: visitorId},{senderId: String(customer.id)});
            console.log("End, New client updated!");
          }
          return { success: true, data: customer };
        }
      }
  }

  async login(loginDto: LoginDto, ip = '') {
      const customer = await this.customerDB.findOne({where:{email: loginDto.email}, select:{password:true, id: true,
      email: true, company:{id:true}}, relations:{company: true}});
      const user = await this.userDB.findOne({where:{email: loginDto.email}, select:{password:true, id:true,
      email: true, company:{id:true}}, relations:{company: true}});
      const result = customer ?? user;
    console.log({result});
      if (!result?.id) {
        throw new UnauthorizedException('Invalid email or password!');
      } else {
        const checkPassword = await bcrypt.compare(
          loginDto.password,
          result.password,
        );
        if (!checkPassword) {
          throw new UnauthorizedException('Invalid email or password!');
        } else {
          const payload = { sub: result.id, email: result.email, companyId: result.company?.id };
          return { success: true, data: this.jwt.sign(payload), role_id: user ? 2: 1 };
        }
      }
  }

  async loginEmployment(loginDto: LoginDto) {
      const user = await this.userDB.findOneBy({ email: loginDto.email });
      if (!user?.id) {
        throw new UnauthorizedException('Invalid email or password!');
      } else {
        const checkPassword = await bcrypt.compare(
          loginDto.password,
          user.password,
        );
        if (!checkPassword) {
          throw new UnauthorizedException('Invalid email or password!');
        } else {
          const payload = { sub: user.id, email: user.email };
          return { success: true, data: this.jwt.sign(payload) };
        }
      }
  }
}
