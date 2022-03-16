/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/tslint/config
export class updateStatus1647329475065 implements MigrationInterface {
    name = 'updateStatus1647329475065';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "planned_workload" DROP COLUMN "status"',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" ADD "status" character varying NOT NULL DEFAULT \'ACTIVE\'',
        );
        await queryRunner.query(
            'ALTER TABLE "committed_workload" DROP COLUMN "status"',
        );
        await queryRunner.query(
            'ALTER TABLE "committed_workload" ADD "status" character varying NOT NULL DEFAULT \'ACTIVE\'',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "committed_workload" DROP COLUMN "status"',
        );
        await queryRunner.query(
            'ALTER TABLE "committed_workload" ADD "status" boolean NOT NULL DEFAULT false',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" DROP COLUMN "status"',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" ADD "status" boolean NOT NULL DEFAULT false',
        );
    }
}
