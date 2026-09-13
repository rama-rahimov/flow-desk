import {Injectable} from "@nestjs/common";
import {productDto} from "./dto/addProduct.dto.js";
import {InjectRepository} from "@nestjs/typeorm";
import {ProductEntity} from "./entities/product.entity.js";
import {Repository} from "typeorm";
import {editProductDto} from "./dto/editProductDto.js";
import {objDto} from "./dto/obj.dto.js";
@Injectable()
export class ProductService {
    constructor(@InjectRepository(ProductEntity) private productDB: Repository<ProductEntity>) {}
   async addProduct(product:productDto): Promise<objDto> {
        const {companyId, ...pr} = product;
        const newProduct = this.productDB.create({...pr, company:{ id:companyId }});
        await this.productDB.save(newProduct);
        return { success: true };
    }

   async editProduct(product:editProductDto): Promise<objDto> {
       const {id, ...pr} = product;
       let obj = {};
       for (const idKey in pr) {
         if (pr.hasOwnProperty(idKey) && pr[idKey] !== undefined && !!pr[idKey]) {
           obj[idKey] = pr[idKey];
          }
         }
         await this.productDB.update({id},{...obj});
         return { success: true };
   }

    async deleteProduct(id:number): Promise<objDto> {
       await this.productDB.delete(id);
       return { success: true };
    }

    async findAll(id:number): Promise<ProductEntity[] | null> {
       return (await this.productDB.findBy({company:{id}}));
    }

    async findOne(id:number): Promise<ProductEntity|null> {
       return (await this.productDB.findOneBy({id}));
    }
}