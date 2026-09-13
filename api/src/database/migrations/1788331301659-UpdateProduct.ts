import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProduct1788331301659 implements MigrationInterface {
    name = 'UpdateProduct1788331301659'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_entity" ADD "price" numeric NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."product_entity_status_enum" AS ENUM('USD', 'EUR', 'AZN')`);
        await queryRunner.query(`ALTER TABLE "product_entity" ADD "status" "public"."product_entity_status_enum" NOT NULL DEFAULT 'USD'`);
        await queryRunner.query(`ALTER TABLE "product_entity" ADD "companyId" integer`);
        await queryRunner.query(`ALTER TABLE "product_entity" ADD CONSTRAINT "FK_a4e0379080134373c5c187d1944" FOREIGN KEY ("companyId") REFERENCES "company_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_entity" DROP CONSTRAINT "FK_a4e0379080134373c5c187d1944"`);
        await queryRunner.query(`ALTER TABLE "product_entity" DROP COLUMN "companyId"`);
        await queryRunner.query(`ALTER TABLE "product_entity" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."product_entity_status_enum"`);
        await queryRunner.query(`ALTER TABLE "product_entity" DROP COLUMN "price"`);
    }

}
