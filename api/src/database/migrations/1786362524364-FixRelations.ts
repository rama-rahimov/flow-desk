import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixRelations1786362524364 implements MigrationInterface {
  name = 'FixRelations1786362524364';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "images_entity" ("id" SERIAL NOT NULL, "name" character varying(200) NOT NULL, "url" character varying(300) NOT NULL, "public_id" integer NOT NULL, "file_name" character varying(200) NOT NULL, "mime_type" character varying(200) NOT NULL, "size" character varying(100) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0af204a246849241bba22acbc29" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_entity" ("id" SERIAL NOT NULL, "name" character varying(250) NOT NULL, "description" text NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_6e8f75045ddcd1c389c765c896e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "company_entity" ("id" SERIAL NOT NULL, "name" character varying(200) NOT NULL, "employments_count" integer NOT NULL, "start_work" date NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_ad727d0b2b2f9bc3f78fff1b19a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "customer_entity" ("id" SERIAL NOT NULL, "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying(255) NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "companyId" integer, "imageId" integer, CONSTRAINT "REL_95ff232f306ab31c1875a2e415" UNIQUE ("imageId"), CONSTRAINT "PK_8898b6830f057f3f5c239796fa7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_status_entity" DROP COLUMN "product_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_status_entity" DROP COLUMN "customer_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_status_entity" DROP COLUMN "manager_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_status_entity" DROP COLUMN "dead_line"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_status_entity" DROP COLUMN "status_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_status_entity" DROP COLUMN "price"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_status_entity" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_status_entity" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(`ALTER TABLE "deal_entity" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "user_entity" DROP COLUMN "company_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_status_entity" ADD "name" character varying(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_entity" ADD "dead_line" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_entity" ADD "price" numeric NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_entity" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_entity" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_entity" ADD "dealStatusId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_entity" ADD "customerId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_entity" ADD "managerId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_entity" ADD "productId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD "companyId" integer`,
    );
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "imageId" integer`);
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "UQ_32147d1eda24c0c99c15f11b7fc" UNIQUE ("imageId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_entity" ADD CONSTRAINT "FK_a29e52b11a9993acc335af481a7" FOREIGN KEY ("companyId") REFERENCES "company_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_entity" ADD CONSTRAINT "FK_95ff232f306ab31c1875a2e4152" FOREIGN KEY ("imageId") REFERENCES "images_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_entity" ADD CONSTRAINT "FK_7c9b64bf04bff887dee9fc8b980" FOREIGN KEY ("dealStatusId") REFERENCES "deal_status_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_entity" ADD CONSTRAINT "FK_0551f33395ebfaab28367649568" FOREIGN KEY ("customerId") REFERENCES "customer_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_entity" ADD CONSTRAINT "FK_0427be4a95b6d312294aae14d35" FOREIGN KEY ("managerId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_entity" ADD CONSTRAINT "FK_f1ec36af44b1f1865a97ca093d9" FOREIGN KEY ("productId") REFERENCES "product_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "FK_d78ff9c278b60cd0cc82907d2d4" FOREIGN KEY ("companyId") REFERENCES "company_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "FK_32147d1eda24c0c99c15f11b7fc" FOREIGN KEY ("imageId") REFERENCES "images_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_entity" DROP CONSTRAINT "FK_32147d1eda24c0c99c15f11b7fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" DROP CONSTRAINT "FK_d78ff9c278b60cd0cc82907d2d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_entity" DROP CONSTRAINT "FK_f1ec36af44b1f1865a97ca093d9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_entity" DROP CONSTRAINT "FK_0427be4a95b6d312294aae14d35"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_entity" DROP CONSTRAINT "FK_0551f33395ebfaab28367649568"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_entity" DROP CONSTRAINT "FK_7c9b64bf04bff887dee9fc8b980"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_entity" DROP CONSTRAINT "FK_95ff232f306ab31c1875a2e4152"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_entity" DROP CONSTRAINT "FK_a29e52b11a9993acc335af481a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" DROP CONSTRAINT "UQ_32147d1eda24c0c99c15f11b7fc"`,
    );
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "imageId"`);
    await queryRunner.query(
      `ALTER TABLE "user_entity" DROP COLUMN "companyId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_entity" DROP COLUMN "productId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_entity" DROP COLUMN "managerId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_entity" DROP COLUMN "customerId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_entity" DROP COLUMN "dealStatusId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_entity" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_entity" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(`ALTER TABLE "deal_entity" DROP COLUMN "price"`);
    await queryRunner.query(
      `ALTER TABLE "deal_entity" DROP COLUMN "dead_line"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_status_entity" DROP COLUMN "name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD "company_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_entity" ADD "name" character varying(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_status_entity" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_status_entity" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_status_entity" ADD "price" numeric NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_status_entity" ADD "status_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_status_entity" ADD "dead_line" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_status_entity" ADD "manager_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_status_entity" ADD "customer_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal_status_entity" ADD "product_id" integer NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "customer_entity"`);
    await queryRunner.query(`DROP TABLE "company_entity"`);
    await queryRunner.query(`DROP TABLE "product_entity"`);
    await queryRunner.query(`DROP TABLE "images_entity"`);
  }
}
