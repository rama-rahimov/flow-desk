import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    constructor(private readonly configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.getOrThrow<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.getOrThrow<string>('CLOUDINARY_API_KEY'),
            api_secret: this.configService.getOrThrow<string>('CLOUDINARY_API_SECRET'),
        })
    }

    async upload(file: Express.Multer.File): Promise<any> {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream({
              resource_type: 'auto',
          }, (err, res) => {
              if(err){
                  reject(err)
                  return;
              }
              if(!res){
                  reject(new Error('Cloudinary upload failed'));
                  return;
              }
              resolve(res);
          });

          uploadStream.end(file.buffer);
        })
    }

    async delete(publicId: string): Promise<any> {
        return cloudinary.uploader.destroy(publicId)
    }
}