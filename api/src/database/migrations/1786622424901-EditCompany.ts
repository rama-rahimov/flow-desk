import { MigrationInterface, QueryRunner } from "typeorm";

export class EditCompany1786622424901 implements MigrationInterface {
    name = 'EditCompany1786622424901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_entity" ADD "link" character varying(200) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company_entity" ADD CONSTRAINT "UQ_50358a264db0b3e6357d4b09af7" UNIQUE ("link")`);
        await queryRunner.query(`ALTER TABLE "company_entity" ADD CONSTRAINT "UQ_29746807b97adc5fc039c139733" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_entity" DROP CONSTRAINT "UQ_29746807b97adc5fc039c139733"`);
        await queryRunner.query(`ALTER TABLE "company_entity" DROP CONSTRAINT "UQ_50358a264db0b3e6357d4b09af7"`);
        await queryRunner.query(`ALTER TABLE "company_entity" DROP COLUMN "link"`);
    }

}
