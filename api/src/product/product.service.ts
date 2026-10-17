import {Injectable} from "@nestjs/common";
import {productDto} from "./dto/addProduct.dto.js";
import {InjectRepository} from "@nestjs/typeorm";
import {ProductEntity} from "./entities/product.entity.js";
import {Repository} from "typeorm";
import {editProductDto} from "./dto/editProductDto.js";
import {objDto} from "./dto/obj.dto.js";
import {RedisService} from "../redis/redis.service.js";
@Injectable()
export class ProductService {
    constructor(@InjectRepository(ProductEntity) private productDB: Repository<ProductEntity>,
    private readonly redisService: RedisService) {}
   async addProduct(product:productDto): Promise<objDto> {
     const {companyId, ...pr} = product;
     const newProduct = this.productDB.create({...pr, company:{ id:companyId }});
     await this.productDB.save(newProduct);
     await this.redisService.del(`productAll_${companyId}`);
     return { success: true };
    }

   async editProduct(product:editProductDto): Promise<objDto> {
       const {id, ...pr} = product;
       let obj = {};
       for (const idKey in pr) {
        if (Object.prototype.hasOwnProperty.call(pr, idKey) && pr[idKey] !== undefined && !!pr[idKey]) {
         obj[idKey] = pr[idKey];
        }
       }
       await this.productDB.update({id},{...obj});
       await this.redisService.del(`product_${id}`);
       return { success: true };
   }

    async deleteProduct(id:number, companyId:number): Promise<objDto> {
       await this.productDB.delete(id);
       await this.redisService.del(`product_${id}`);
       await this.redisService.del(`productAll_${companyId}`);
       return { success: true };
    }

    async findAll(id:number): Promise<ProductEntity[] | null> {
       const productAllJson = await this.redisService.get(`productAll_${id}`);
       const productAll = JSON.parse(productAllJson);
       if((productAll||[]).length > 0){
           return productAll;
       }else {
          const products =  await this.productDB.findBy({company:{id}});
          await this.redisService.set(`productAll_${id}`, products);
          return products;
       }
    }

    async findOne(id:number): Promise<ProductEntity|null> {
        const productJson = await this.redisService.get(`product_${id}`);
        const product = JSON.parse(productJson);
        if(product?.id){
            return product;
        }else {
          const getProduct= await this.productDB.findOneBy({id});
          if(getProduct?.id){
             await this.redisService.set(`product_${id}`, JSON.stringify(getProduct));
             return getProduct;
          }else {
              return null;
          }
        }
    }
}