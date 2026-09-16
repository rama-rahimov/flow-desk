import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentStatusNullAble1789541675309 implements MigrationInterface {
    name = 'PaymentStatusNullAble1789541675309'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "status" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "price" TYPE numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "status" SET NOT NULL`);
    }

}
