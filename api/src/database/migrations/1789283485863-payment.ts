import { MigrationInterface, QueryRunner } from "typeorm";

export class Payment1789283485863 implements MigrationInterface {
    name = 'Payment1789283485863'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deal" DROP CONSTRAINT "FK_cef8a02fad2477f5391c15d28ff"`);
        await queryRunner.query(`CREATE TABLE "customers" ("id" SERIAL NOT NULL, "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying(255) NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "companyId" integer, CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "employments_count" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_568c2136b0779d63539cf84fafc" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deal" ADD CONSTRAINT "FK_cef8a02fad2477f5391c15d28ff" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deal" DROP CONSTRAINT "FK_cef8a02fad2477f5391c15d28ff"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_568c2136b0779d63539cf84fafc"`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "employments_count" DROP DEFAULT`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`ALTER TABLE "deal" ADD CONSTRAINT "FK_cef8a02fad2477f5391c15d28ff" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
