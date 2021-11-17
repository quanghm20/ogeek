import { MigrationInterface, QueryRunner } from 'typeorm';

export class SocialProfileTable1637154859969 implements MigrationInterface {
    name = 'socialProfileTable1637154859969';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "social_profile" (
                "id" SERIAL, 
                "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                "deleted_by" character varying NOT NULL, 
                "facebook_link" character varying NOT NULL, 
                CONSTRAINT "PK_50727a3d0f93a9069ddbe8e6d97" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "social_profile"');
    }
}
