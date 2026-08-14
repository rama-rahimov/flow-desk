import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1784786518119 implements MigrationInterface {
    name = 'Init1784786518119'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" SERIAL NOT NULL, "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying(255) NOT NULL, "role_id" integer NOT NULL, "company_id" integer NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_entity" ("id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, CONSTRAINT "PK_7bc1bd2364b6e9bf7c84b1e52e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "deal_status_entity" ("id" SERIAL NOT NULL, "product_id" integer NOT NULL, "customer_id" integer NOT NULL, "manager_id" integer NOT NULL, "dead_line" date NOT NULL, "status_id" integer NOT NULL, "price" numeric NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_aaaa1968dd110a59fb2cb32a034" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "deal_entity" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_66b945df17e88e0b4c6ef2909ec" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "deal_entity"`);
        await queryRunner.query(`DROP TABLE "deal_status_entity"`);
        await queryRunner.query(`DROP TABLE "role_entity"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
    }

}
