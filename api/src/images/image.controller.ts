import {Body, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors} from "@nestjs/common";
import {ImageService} from "./image.service.js";
import {FileInterceptor} from "@nestjs/platform-express";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard.js";

@Controller('api/file')
export class ImageController {
    constructor(private readonly imageService: ImageService) {}
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(JwtAuthGuard)
    upload(@Req() req,@UploadedFile() file: Express.Multer.File,
           @Body('type') type: string): Promise<any> {
        console.log({file, type, userId: req.user});
        return this.imageService.upload(file, type, req.user.id, (req.user.avatar || {}).public_id);
    }
}