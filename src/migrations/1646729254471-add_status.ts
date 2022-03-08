/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/tslint/config
export class addStatus1646729254471 implements MigrationInterface {
    name = 'addStatus1646729254471';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "CREATE TYPE \"public\".\"user_week_status_enum\" AS ENUM('PLANNED', 'EXECUTING', 'CLOSED')",
        );
        await queryRunner.query(
            'ALTER TABLE "user" ADD "week_status" "public"."user_week_status_enum" NOT NULL DEFAULT \'PLANNED\'',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" ADD "status" boolean NOT NULL DEFAULT false',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" ADD "reason" character varying NOT NULL',
        );
        await queryRunner.query(
            'ALTER TABLE "committed_workload" ADD "status" boolean NOT NULL DEFAULT false',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "committed_workload" DROP COLUMN "status"',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" DROP COLUMN "reason"',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" DROP COLUMN "status"',
        );
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "week_status"');
        await queryRunner.query('DROP TYPE "public"."user_week_status_enum"');
    }
}
