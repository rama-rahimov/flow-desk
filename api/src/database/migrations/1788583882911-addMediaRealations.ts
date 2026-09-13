import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMediaRealations1788583882911 implements MigrationInterface {
    name = 'AddMediaRealations1788583882911'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_entity" DROP CONSTRAINT "FK_95ff232f306ab31c1875a2e4152"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_32147d1eda24c0c99c15f11b7fc"`);
        await queryRunner.query(`ALTER TABLE "user_entity" RENAME COLUMN "imageId" TO "avatar_media_id"`);
        await queryRunner.query(`ALTER TABLE "user_entity" RENAME CONSTRAINT "UQ_32147d1eda24c0c99c15f11b7fc" TO "UQ_20f21695ca2d3c18ff45c0793c5"`);
        await queryRunner.query(`CREATE TABLE "media_entity" ("id" SERIAL NOT NULL, "original_name" character varying(200) NOT NULL, "url" character varying(300) NOT NULL, "public_id" character varying(300) NOT NULL, "file_name" character varying(200) NOT NULL, "mime_type" character varying(200) NOT NULL, "size" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7f2f144c5119791dbeac5f5a9c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_media_entity" ("id" SERIAL NOT NULL, "productId" integer, "mediaId" integer, CONSTRAINT "PK_edbc5aa3ad8a4a8ed09ba146100" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "customer_entity" DROP CONSTRAINT "REL_95ff232f306ab31c1875a2e415"`);
        await queryRunner.query(`ALTER TABLE "customer_entity" DROP COLUMN "imageId"`);
        await queryRunner.query(`ALTER TABLE "product_entity" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "product_media_entity" ADD CONSTRAINT "FK_7f4a43696639f20dc753f364e06" FOREIGN KEY ("productId") REFERENCES "product_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_media_entity" ADD CONSTRAINT "FK_7fd0ae0808502a43762172ba190" FOREIGN KEY ("mediaId") REFERENCES "media_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "FK_20f21695ca2d3c18ff45c0793c5" FOREIGN KEY ("avatar_media_id") REFERENCES "media_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_20f21695ca2d3c18ff45c0793c5"`);
        await queryRunner.query(`ALTER TABLE "product_media_entity" DROP CONSTRAINT "FK_7fd0ae0808502a43762172ba190"`);
        await queryRunner.query(`ALTER TABLE "product_media_entity" DROP CONSTRAINT "FK_7f4a43696639f20dc753f364e06"`);
        await queryRunner.query(`ALTER TABLE "product_entity" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "customer_entity" ADD "imageId" integer`);
        await queryRunner.query(`ALTER TABLE "customer_entity" ADD CONSTRAINT "REL_95ff232f306ab31c1875a2e415" UNIQUE ("imageId")`);
        await queryRunner.query(`DROP TABLE "product_media_entity"`);
        await queryRunner.query(`DROP TABLE "media_entity"`);
        await queryRunner.query(`ALTER TABLE "user_entity" RENAME CONSTRAINT "UQ_20f21695ca2d3c18ff45c0793c5" TO "UQ_32147d1eda24c0c99c15f11b7fc"`);
        await queryRunner.query(`ALTER TABLE "user_entity" RENAME COLUMN "avatar_media_id" TO "imageId"`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "FK_32147d1eda24c0c99c15f11b7fc" FOREIGN KEY ("imageId") REFERENCES "images_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_entity" ADD CONSTRAINT "FK_95ff232f306ab31c1875a2e4152" FOREIGN KEY ("imageId") REFERENCES "images_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
