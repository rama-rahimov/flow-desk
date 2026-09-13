import { UserEntity } from './entities/user.entity.js';
import {BadRequestException, ForbiddenException, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {EditProfileDto} from "./dto/edit.dto.js";
import {AddDto} from "./dto/add.dto.js";
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private readonly userBD: Repository<UserEntity>) {}
  async editProfile(id: number, email:string, data:EditProfileDto){
    let obj = {email:''};
    for (const idKey in data) {
      if (data.hasOwnProperty(idKey) && data[idKey] !== undefined && !!data[idKey]) {
        obj[idKey] = data[idKey];
      }
    }
      if(obj.email && obj.email !== email){
        const findUser = await this.userBD.findOneBy({ email: obj.email });
        if(findUser?.id){
          throw new BadRequestException("Email already exists");
        }
      }
      const res = await this.userBD.update({id},{...obj});
      if(res.affected){
        return { success: true, data: 'Updated successfully!' };
      }else {
        return { success: true, data: 'Nothing updated!' };
      }
  }

  async add(data:AddDto, user){
   if(user.role_id !== 1){
     throw new ForbiddenException('You do not have permission to add employees');
   }else {
     const empCount = (await this.userBD.find({where:{company:{id: user.company.id}}}))?.length;
     if(empCount >= user.company.employments_count){
       throw new ForbiddenException('You have reached the maximum number of employees allowed by your plan.');
     }else {
       const findUser = await this.userBD.findOneBy({ email: data.email });
       if(findUser?.id){
         throw new BadRequestException("A user with this email already exists.");
       }else {
         const salt = await bcrypt.genSalt(10);
         const hash = await bcrypt.hash(data.password, salt);
         const newUser = this.userBD.create({
           firstName: data.firstName,
           lastName: data.lastName,
           email: data.email,
           password: hash,
           role_id: 3,
           company: {id:user.company.id},
         })
         return this.userBD.save(newUser)
       }
     }
   }
  }

  async getEmployees(user){
    return this.userBD.find({where:{company:{id:user.company.id}}});
  }

  async deleteEmployee(user, id:number){
    if(user.role_id !== 1){
      throw new ForbiddenException('You do not have permission to delete employees');
    }else {
      await this.userBD.delete({id, company:{id: user.company.id}});
      return {success: true, data: 'Employee deleted successfully!'};
    }
  }
}
