import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentStatus1789476086328 implements MigrationInterface {
    name = 'PaymentStatus1789476086328'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment_status" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b59e2e874b077ea7acf724e4711" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment" ("id" SERIAL NOT NULL, "company_id" integer NOT NULL, "status" character varying NOT NULL, "employee_limit" integer NOT NULL, "price" numeric NOT NULL, "currency" character varying NOT NULL, "stripe_customer_id" character varying NOT NULL, "stripe_subscription_id" character varying NOT NULL, "current_period_end" TIMESTAMP WITH TIME ZONE, "cancel_at_period_end" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "paymentStatusId" integer, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_34988ed2115aa51bfafb52c24bb" FOREIGN KEY ("paymentStatusId") REFERENCES "payment_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_34988ed2115aa51bfafb52c24bb"`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TABLE "payment_status"`);
    }

}
