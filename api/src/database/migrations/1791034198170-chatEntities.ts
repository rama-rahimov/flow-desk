import { MigrationInterface, QueryRunner } from "typeorm";

export class ChatEntities1791034198170 implements MigrationInterface {
    name = 'ChatEntities1791034198170'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."message_sendertype_enum" AS ENUM('CLIENT', 'EMPLOYEE')`);
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "senderId" integer NOT NULL, "senderType" "public"."message_sendertype_enum" NOT NULL, "message" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "conversationId" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "conversation" ("id" SERIAL NOT NULL, "customerId" integer, "companyId" integer, "userId" integer, CONSTRAINT "PK_864528ec4274360a40f66c29845" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_7cf4a4df1f2627f72bf6231635f" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD CONSTRAINT "FK_eecf3c3253bc7a799cd7137eee4" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD CONSTRAINT "FK_3bd0d3cd0928f7348dfaecbb068" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD CONSTRAINT "FK_c308b1cd542522bb66430fa860a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversation" DROP CONSTRAINT "FK_c308b1cd542522bb66430fa860a"`);
        await queryRunner.query(`ALTER TABLE "conversation" DROP CONSTRAINT "FK_3bd0d3cd0928f7348dfaecbb068"`);
        await queryRunner.query(`ALTER TABLE "conversation" DROP CONSTRAINT "FK_eecf3c3253bc7a799cd7137eee4"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_7cf4a4df1f2627f72bf6231635f"`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`DROP TABLE "conversation"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TYPE "public"."message_sendertype_enum"`);
    }

}
