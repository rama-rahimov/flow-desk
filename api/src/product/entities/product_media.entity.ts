import {Entity, ManyToOne, PrimaryGeneratedColumn, Relation} from "typeorm";
import {ProductEntity} from "./product.entity.js";
import {MediaEntity} from "../../images/entityties/image.entity.js";

@Entity('product_media')
export class ProductMediaEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ProductEntity, product => product.product_medias)
    product: Relation<ProductEntity>;

    @ManyToOne(() => MediaEntity, media => media.product_medias)
    media: Relation<MediaEntity>;
}