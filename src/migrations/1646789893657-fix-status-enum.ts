/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/tslint/config
export class fixStatusEnum1646789893657 implements MigrationInterface {
    name = 'fixStatusEnum1646789893657';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TYPE "public"."user_week_status_enum" RENAME TO "user_week_status_enum_old"',
        );
        await queryRunner.query(
            "CREATE TYPE \"public\".\"user_week_status_enum\" AS ENUM('PLANNED', 'PLANNING', 'EXECUTING', 'CLOSED')",
        );
        await queryRunner.query(
            'ALTER TABLE "user" ALTER COLUMN "week_status" DROP DEFAULT',
        );
        await queryRunner.query(
            `ALTER TABLE "user" ALTER COLUMN "week_status" 
            TYPE "public"."user_week_status_enum" USING "week_status"::"text"::"public"."user_week_status_enum"`,
        );
        await queryRunner.query(
            'ALTER TABLE "user" ALTER COLUMN "week_status" SET DEFAULT \'PLANNING\'',
        );
        await queryRunner.query(
            'DROP TYPE "public"."user_week_status_enum_old"',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "CREATE TYPE \"public\".\"user_week_status_enum_old\" AS ENUM('PLANNED', 'EXECUTING', 'CLOSED')",
        );
        await queryRunner.query(
            'ALTER TABLE "user" ALTER COLUMN "week_status" DROP DEFAULT',
        );
        await queryRunner.query(
            `ALTER TABLE "user" ALTER COLUMN "week_status" 
            TYPE "public"."user_week_status_enum_old" USING "week_status":: "text":: "public"."user_week_status_enum_old"`,
        );
        await queryRunner.query(
            'ALTER TABLE "user" ALTER COLUMN "week_status" SET DEFAULT \'PLANNED\'',
        );
        await queryRunner.query('DROP TYPE "public"."user_week_status_enum"');
        await queryRunner.query(
            'ALTER TYPE "public"."user_week_status_enum_old" RENAME TO "user_week_status_enum"',
        );
    }
}
