import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCompanyStatus21787229936279 implements MigrationInterface {
  name = 'AddCompanyStatus21787229936279';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company_entity" RENAME COLUMN "customers" TO "status"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."company_entity_customers_enum" RENAME TO "company_entity_status_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."company_entity_status_enum" RENAME TO "company_entity_customers_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_entity" RENAME COLUMN "status" TO "customers"`,
    );
  }
}
