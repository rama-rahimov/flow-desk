import {Injectable} from "@nestjs/common";
import {CompanyEntity} from "./entities/company.entity.js";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class CompanyService {
    constructor(@InjectRepository(CompanyEntity) private readonly companyDB: Repository<CompanyEntity>){}
   async checkCompany(link:string){
        try {
            const company = await this.companyDB.findOne({where:{link}, select:{id:true, link: true, name: true, employments_count:true}});
            console.log({company});
            if(company?.id){
                return {success: true, data: company};
            }else {
                return {success: false, message: 'No such company'};
            }
        }catch(error){
            return {success:false, error:error.message};
        }
    }
}