import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameImagesToMedia1788584462452 implements MigrationInterface {
    name = 'RenameImagesToMedia1788584462452';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameTable('images_entity', 'media');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameTable('media', 'images_entity');
    }
}