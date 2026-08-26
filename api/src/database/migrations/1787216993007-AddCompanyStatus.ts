import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCompanyStatus1787216993007 implements MigrationInterface {
    name = 'AddCompanyStatus1787216993007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."company_entity_customers_enum" AS ENUM('ACTIVE', 'DISABLED')`);
        await queryRunner.query(`ALTER TABLE "company_entity" ADD "customers" "public"."company_entity_customers_enum" NOT NULL DEFAULT 'DISABLED'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_entity" DROP COLUMN "customers"`);
        await queryRunner.query(`DROP TYPE "public"."company_entity_customers_enum"`);
    }

}
