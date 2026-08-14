import { RegisterDto } from './dto/register.dto.js';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto.js';
import { UserEntity } from '../users/entities/user.entity.js';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {CompanyEntity} from "../companies/entities/company.entity.js";
import {CustomerEntity} from "../customers/entities/customer.entity.js";

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UserEntity) private readonly userDB: Repository<UserEntity>,
              @InjectRepository(CompanyEntity) private readonly companyDB: Repository<CompanyEntity>,
              @InjectRepository(CustomerEntity) private readonly customerDB: Repository<CustomerEntity>,
              private readonly jwt: JwtService) {}
  async register(dataRegister: RegisterDto) {
    try {
      const { firstName, lastName, email, password, companyName, employmentsCount, startWork, role_id, companyId } = dataRegister;
      const saltRounds = await bcrypt.genSalt(10);
      const userData = {email, role_id};
      const findUserData = role_id === 1 ? {...userData, companyId } : userData;
      const findUser = await this.userDB.findOneBy(findUserData);
      if (findUser?.id) {
        throw  new Error('User already exists');
      } else {
        const hash = await bcrypt.hash(password,saltRounds);
        if(role_id === 2){
          const findCompany = await this.companyDB.findOneBy({name: companyName});
          if(findCompany?.id){
            throw  new Error('This company name already exists!');
          }else {
            const createCompany = this.companyDB.create({name: companyName, employments_count: employmentsCount, start_work: startWork});
            const company = await this.companyDB.save(createCompany);
            const createUser =  this.userDB.create({firstName, lastName, email, password: hash, company:{ id: company.id }, role_id});
            const user = await this.userDB.save(createUser);
            return {success: true, data: {...user, ...company}};
          }
        }else {
          const createCustomer =  this.customerDB.create({firstName, lastName, email, password: hash, company:{id:companyId}});
          const customer = await this.customerDB.save(createCustomer);
          return {success: true, data: customer};
        }
      }
    }catch (error) {
      console.log({ error });
      return {success: false, message: error.message };
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const customer = await this.customerDB.findOneBy({ email: loginDto.email });
      if (!customer?.id) {
        throw new Error("Email is wrong");
      }else {
        const checkPassword = await bcrypt.compare(loginDto.password, customer.password);
        if (!checkPassword) {
          throw new Error('Password is wrong');
        }else {
          const payload = { sub: customer.id, email: customer.email };
          return { success: true, data: await this.jwt.sign(payload) };
        }
      }
    }catch (error) {
      console.log(error);
      return {success: false, message: error.message };
    }
  }

  async loginEmployment(loginDto: LoginDto) {
    try {
      const user = await this.userDB.findOneBy({ email: loginDto.email });
      if (!user?.id) {
        throw new Error("Email is wrong");
      }else {
        const checkPassword = await bcrypt.compare(loginDto.password, user.password);
        if (!checkPassword) {
          throw new Error('Password is wrong');
        }else {
          const payload = { sub: user.id, email: user.email };
          return { success: true, data: await this.jwt.sign(payload) };
        }
      }
    }catch (error) {
      console.log(error);
      return {success: false, message: error.message };
    }
  }
}