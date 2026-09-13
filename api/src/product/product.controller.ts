import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put} from "@nestjs/common";
import {ProductService} from "./product.service.js";
import {productDto} from "./dto/addProduct.dto.js";
import {editProductDto} from "./dto/editProductDto.js";

@Controller('api/product')
export class ProductController {
    constructor(private readonly productService: ProductService ) {}
    @Post('add')
    addProduct(@Body() product: productDto): Promise<boolean> {
       return this.productService.addProduct(product);
    }

    @Put('edit')
    editProduct(@Body() product: editProductDto): Promise<boolean> {
        return this.productService.editProduct(product);
    }

    @Delete('delete/:id')
    delProduct(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
        return this.productService.deleteProduct(id);
    }

    @Get('all/:id')
    findAll(@Param('id', ParseIntPipe) id: number) {
        return this.productService.findAll(id);
    }

    @Get('find/:id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productService.findOne(id);
    }
}