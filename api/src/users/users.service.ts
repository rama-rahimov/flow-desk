import { UserEntity } from './entities/user.entity.js';
import {BadRequestException, ForbiddenException, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {EditProfileDto} from "./dto/edit.dto.js";
import {AddDto} from "./dto/add.dto.js";
import bcrypt from 'bcrypt';
import {UserDTO} from "../auth/dto/user.dto.js";
import {RedisService} from "../redis/redis.service.js";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private readonly userDB: Repository<UserEntity>,
  private readonly redisService: RedisService) {}
  async editProfile(id: number, email:string, companyId:number, data:EditProfileDto){
    let obj = {email:''};
    for (const idKey in data) {
      if (data.hasOwnProperty(idKey) && data[idKey] !== undefined && !!data[idKey]) {
        obj[idKey] = data[idKey];
      }
    }
      if(obj.email && obj.email !== email){
        const findUser = await this.userDB.findOneBy({ email: obj.email });
        if(findUser?.id){
          throw new BadRequestException("Email already exists");
        }
      }
      const res = await this.userDB.update({id},{...obj});
      if(res.affected){
        await this.redisService.del(`employee_${id}`);
        await this.redisService.del(`employeesCompany_${companyId}`);
        if(obj.email){
          await this.redisService.del(`userId_${id}&email_${email}&companyId_${companyId}`);
        }
        return { success: true, data: 'Updated successfully!' };
      }else {
        return { success: true, data: 'Nothing updated!' };
      }
  }

  async add(data:AddDto, obj:UserDTO){
   if(obj.user.role_id !== 1){
     throw new ForbiddenException('You do not have permission to add employees');
   }else {
     const empCount = (await this.userDB.find({where:{company:{id: obj.user.company.id}}}))?.length;
     if(empCount >= obj.user.company.employments_count){
       throw new ForbiddenException('You have reached the maximum number of employees allowed by your plan.');
     }else {
       const findUser = await this.userDB.findOneBy({ email: data.email });
       if(findUser?.id){
         throw new BadRequestException("A user with this email already exists.");
       }else {
         const salt = await bcrypt.genSalt(10);
         const hash = await bcrypt.hash(data.password, salt);
         const newUser = this.userDB.create({
           firstName: data.firstName,
           lastName: data.lastName,
           email: data.email,
           password: hash,
           role_id: 3,
           company: {id:obj.user.company.id},
         })
         await this.redisService.del(`employeesCompany_${obj.user.company.id}`);
         return this.userDB.save(newUser)
       }
     }
   }
  }

  async getEmployees(obj:UserDTO){
    const employeesJson = await this.redisService.get(`employeesCompany_${obj.user.company.id}`);
    if(employeesJson){
      console.log("all employees json");
    return JSON.parse(employeesJson);
    }else {
      const employeesCompany= await this.userDB.find({where:{company:{id: obj.user.company.id}}});
      await this.redisService.set(`employeesCompany_${obj.user.company.id}`, JSON.stringify(employeesCompany));
      return employeesCompany;
    }
  }

  async deleteEmployee(obj:UserDTO, id:number){
    if(obj.user.role_id !== 1){
      throw new ForbiddenException('You do not have permission to delete employees');
    }else {
      await this.userDB.delete({id, company:{id: obj.user.company.id}});
      await this.redisService.del(`employee_${id}`);
      await this.redisService.del(`employeesCompany_${obj.user.company.id}`);
      return {success: true, data: 'Employee deleted successfully!'};
    }
  }
}
