import { MigrationInterface, QueryRunner } from "typeorm";

export class ChatEntitiesEdit1791283146668 implements MigrationInterface {
    name = 'ChatEntitiesEdit1791283146668'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD "clientId" uuid`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "senderId"`);
        await queryRunner.query(`ALTER TABLE "message" ADD "senderId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD CONSTRAINT "UQ_e4abd0c027342cbc306d44e43f3" UNIQUE ("clientId", "companyId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversation" DROP CONSTRAINT "UQ_e4abd0c027342cbc306d44e43f3"`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "senderId"`);
        await queryRunner.query(`ALTER TABLE "message" ADD "senderId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "conversation" DROP COLUMN "clientId"`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "updated_at"`);
    }

}
