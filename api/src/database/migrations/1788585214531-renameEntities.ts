import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameEntities1788585214531 implements MigrationInterface {
    name = 'RenameEntities1788585214531'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // media already exists but is empty.
        // Remove it so we can rename the old table.
        await queryRunner.query(`DROP TABLE "media"`);

        await queryRunner.renameTable('media_entity', 'media');

        await queryRunner.renameTable('company_entity', 'company');
        await queryRunner.renameTable('customer_entity', 'customer');
        await queryRunner.renameTable('deal_entity', 'deal');
        await queryRunner.renameTable('deal_status_entity', 'deal_status');
        await queryRunner.renameTable('product_entity', 'product');
        await queryRunner.renameTable('product_media_entity', 'product_media');
        await queryRunner.renameTable('role_entity', 'role');
        await queryRunner.renameTable('user_entity', 'users');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameTable('users', 'user_entity');
        await queryRunner.renameTable('role', 'role_entity');
        await queryRunner.renameTable('product_media', 'product_media_entity');
        await queryRunner.renameTable('product', 'product_entity');
        await queryRunner.renameTable('deal_status', 'deal_status_entity');
        await queryRunner.renameTable('deal', 'deal_entity');
        await queryRunner.renameTable('customer', 'customer_entity');
        await queryRunner.renameTable('company', 'company_entity');

        await queryRunner.renameTable('media', 'media_entity');
    }

}
