import {Injectable} from "@nestjs/common";
import {CloudinaryService} from "./cloudinary.service.js";
import {InjectRepository} from "@nestjs/typeorm";
import {MediaEntity} from "./entityties/image.entity.js";
import {Repository} from "typeorm";
import {UserEntity} from "../users/entities/user.entity.js";
import {ImageDto} from "./dto/image.dto.js";

@Injectable()
export class ImageService {
    constructor(private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(MediaEntity) private readonly mediaDB: Repository<MediaEntity>,
                @InjectRepository(UserEntity) private readonly userDB: Repository<UserEntity>) {}
    async upload(file: Express.Multer.File, type: string, userId: number, public_id:string = '') {
        const uploadFile:ImageDto = await this.cloudinaryService.upload(file);
        const media = this.mediaDB.create({
            original_name: file.originalname,
            url: uploadFile.secure_url,
            public_id: uploadFile.public_id,
            file_name: uploadFile.original_filename ?? file.originalname,
            mime_type: file.mimetype, size: file.size
        });
        const result = await this.mediaDB.save(media);
        if(type === 'avatar'){
           if(public_id){
              await this.mediaDB.delete({public_id});
              await this.cloudinaryService.delete(public_id);
           }
           const update =  await this.userDB.update({id: userId},{avatar:{id:result.id}});
           console.log({update});
        }
        return result;
    }
}