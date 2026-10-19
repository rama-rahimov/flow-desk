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

    async findAll(id:number): Promise<ProductEntity[] | null | {message:string}> {
       const productAllJson = await this.redisService.get(`productAll_${id}`);
       if(productAllJson !== null){
         return JSON.parse(productAllJson);
       }else {
           const lockKey = `lock:productAll_${id}`;
           const lockToken = crypto.randomUUID();
           const acquired:string|null = await this.redisService.lockSet(lockKey, lockToken,10000);
           if(acquired === "OK"){
               try {
                 const productRepAllJson = await this.redisService.get(`productAll_${id}`);
                 if (productRepAllJson !== null){
                  return JSON.parse(productRepAllJson);
                 }
                  const products =  await this.productDB.findBy({company:{id}});
                  await this.redisService.set(`productAll_${id}`, JSON.stringify(products));
                  return products;
               }finally {
               await this.redisService.eval(lockKey, lockToken);
               }
           }else {
             await new Promise(resolve => setTimeout(resolve, 3000));
               const prAllCash = await this.redisService.get(`productAll_${id}`);
               if(prAllCash !== null){
                 return JSON.parse(prAllCash);
               }
              return {message: 'Please try late!'};
           }
       }
    }

    async findOne(id:number): Promise<ProductEntity|null> {
        const productJson = await this.redisService.get(`product_${id}`);
        if(productJson !== null){
            return JSON.parse(productJson);
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