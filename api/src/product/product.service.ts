import {Injectable} from "@nestjs/common";
import {productDto} from "./dto/addProduct.dto.js";
import {InjectRepository} from "@nestjs/typeorm";
import {ProductEntity} from "./entities/product.entity.js";
import {Repository} from "typeorm";
import {editProductDto} from "./dto/editProductDto.js";
@Injectable()
export class ProductService {
    constructor(@InjectRepository(ProductEntity) private productDB: Repository<ProductEntity>) {}
   async addProduct(product:productDto): Promise<any> {
        try {
            const {companyId, ...pr} = product;
            const newProduct = this.productDB.create({...pr, company:{ id:companyId }});
            await this.productDB.save(newProduct);
            return { success: true };
        }catch(error) {
         console.log({ error });
         return { success: false, message: (error as Error).message };
        }
    }

   async editProduct(product:editProductDto): Promise<any> {
        try {
            const {id, ...pr} = product;
            let obj = {};
            for (const idKey in pr) {
                if (pr.hasOwnProperty(idKey) && pr[idKey] !== undefined && !!pr[idKey]) {
                    obj[idKey] = pr[idKey];
                }
            }
           const result =  await this.productDB.update({id},{...obj});
            return { success: true };
        }catch(error) {
            console.log({ error });
            return { success: false, message: (error as Error).message };
        }
   }

    async deleteProduct(id:number): Promise<any> {
        try {
            await this.productDB.delete(id);
            return { success: true };
        }catch(error) {
            console.log({ error });
            return { success: false, message: (error as Error).message };
        }
    }

    async findAll(id:number): Promise<any> {
        try {
           return (await this.productDB.findBy({company:{id}}));
        }catch(error) {
            console.log({ error });
            return { success: false, message: (error as Error).message };
        }
    }

    async findOne(id:number): Promise<any> {
        try {
            return (await this.productDB.findOneBy({id}));
        }catch(error) {
            console.log({ error });
            return { success: false, message: (error as Error).message };
        }
    }
}