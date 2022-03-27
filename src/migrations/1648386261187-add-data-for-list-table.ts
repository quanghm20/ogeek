/* eslint-disable @typescript-eslint/tslint/config */
import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/naming-convention
export class addDataForListTable1648386261187 implements MigrationInterface {
    name = 'addNewDataForListtable1648356625810';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER SEQUENCE contributed_value_id_seq RESTART WITH 1',
        );
        await queryRunner.query(
            'ALTER SEQUENCE expertise_scope_id_seq RESTART WITH 1',
        );
        await queryRunner.query(
            'ALTER SEQUENCE planned_workload_id_seq RESTART WITH 1',
        );
        await queryRunner.query('ALTER SEQUENCE user_id_seq RESTART WITH 1');
        await queryRunner.query(
            'ALTER SEQUENCE value_stream_id_seq RESTART WITH 1',
        );
        await queryRunner.query(
            'ALTER SEQUENCE committed_workload_id_seq RESTART WITH 1',
        );
        await queryRunner.query(
            `INSERT INTO
    "user" (
		"alias",
		"name",
		"phone",
		"email",
		"avatar",
		"role",
		"week_status",
		"created_at",
		"updated_at"
	)
VALUES
(
    'thuong.nv,
    'Thuong Nguyen',
    '0381294934',
    'thuong.nv@geekup.vn,
    'https://link22.com',
    'USER',
    'PLANNING',
    '2021-12-30 00:00:00',
	'2021-12-30 00:00:00'
),
(
    'nguyen.tk',
    'Nguyen Tran',
    '0933383823',
    'nguyen.tk@geekup.vn',
    'https://link21.com',
    'USER',
    'PLANNING',
    '2021-12-30 00:00:00',
	'2021-12-30 00:00:00'
),
(
    'thai.ls',
    'Thai Le',
    '0303403493',
    'thai.ls@geekup.vn',
    'https://link4.com',
    'USER',
    'PLANNING',
    '2021-12-30 00:00:00',
	'2021-12-30 00:00:00'
),
(
    'sang.nd',
    'Sang Nguyen',
    '0324523423',
    'sang.nd@geekup.vn',
    'https://link223.vn',
    'USER',
    'PLANNING',
    '2021-12-30 00:00:00',
	'2021-12-30 00:00:00'
),
(
    'linh.tt',
    'Linh Tran',
    '0933825355',
    'linh.tt@geekup.vn',
    'https://linkss.com',
    'USER',
    'PLANNING',
	'2021-12-30 00:00:00'
    '2021-12-30 00:00:00',
),
(
    'tran.nk',
    'Tran Ngo',
    '0923124234',
    'tran.nk@geekup.vn',
    'https://linkss.com',
    'USER',
    'PLANNING',
	'2021-12-30 00:00:00'
    '2021-12-30 00:00:00',
),
(
    'dat.pq',
    'Dat Pham',
    '0384912345',
    'dat.pq@geekup.vn',
    'https://linkss.com',
    'USER',
    'PLANNING',
	'2021-12-30 00:00:00'
    '2021-12-30 00:00:00',
),
(
    'van.nt',
    'Van Nguyen',
    '0384235235',
    'van.nt@geekup.vn',
    'https://linkss.com',
    'USER',
    'PLANNING',
	'2021-12-30 00:00:00'
    '2021-12-30 00:00:00',
),
(
    'huy.lt',
    'Huy Le',
    '0384934394',
    'huy.lt@geekup.vn',
    'https://linkss.com',
    'USER',
    'PLANNING',
	'2021-12-30 00:00:00'
    '2021-12-30 00:00:00',
),
(
    'nam.ll',
    'Nam Le',
    '0933332412',
    'nam.ll@geekup.vn',
    'https://linkss.com',
    'USER',
    'PLANNING',
	'2021-12-30 00:00:00'
    '2021-12-30 00:00:00',
),
`,
        );
        await queryRunner.query(
            `INSERT INTO
            committed_workload (
                user_id,
                contributed_value_id,
                committed_workload,
                start_date,
                expired_date,
                pic_id
            )
            VALUES
                (13, 9, 3, '2022-01-01', '2022-04-30', 12),
                (13, 6, 5, '2022-01-01', '2022-04-30', 12),
                (13, 3, 30, '2022-01-01', '2022-04-30', 12),
                (14, 6, 1, '2022-01-01', '2022-04-30', 12),
                (14, 9, 3, '2022-01-01', '2022-04-30', 12),
                (14, 5, 15, '2022-01-01', '2022-04-30', 12),
                (14, 3, 21, '2022-01-01', '2022-04-30', 12),
                (15, 3, 2, '2022-01-01', '2022-04-30', 12),
                (15, 9, 3, '2022-01-01', '2022-04-30', 12),
                (15, 12, 5, '2022-01-01', '2022-04-30', 12),
                (15, 4, 30, '2022-01-01', '2022-04-30', 12),
            `,
        );
        await queryRunner.query(
            `INSERT INTO
        planned_workload (
            user_id,
            contributed_value_id,
            committed_workload_id,
            planned_workload,
            start_date,
            status,
            reason,
            created_at,
            updated_at
        )
        VALUES
        (
            ( 13, 9, 13, 3, '2022-03-26', 'ACTIVE', 'create planned workload w12', '2022-03-25 16:12:01', '2022-03-25 16:12:01'),
            ( 13, 9, 13, 3, '2022-04-02', 'ACTIVE', 'create planned workload w13', '2022-04-01 16:12:01', '2022-04-01 16:12:01'),
            ( 13, 9, 13, 3, '2022-04-09', 'ACTIVE', 'create planned workload w14', '2022-04-09 16:12:01', '2022-04-09 16:12:01'),
            ( 13, 6, 14, 4, '2022-03-26', 'ACTIVE', 'create planned workload w12', '2022-03-25 16:12:01', '2022-03-25 16:12:01'),
            ( 13, 6, 14, 5, '2022-04-02', 'ACTIVE', 'create planned workload w13', '2022-04-01 16:12:01', '2022-04-01 16:12:01'),
            ( 13, 6, 14, 3, '2022-04-09', 'ACTIVE', 'create planned workload w14', '2022-04-09 16:12:01', '2022-04-09 16:12:01'),
            ( 13, 3, 15, 33, '2022-03-26', 'ACTIVE', 'create planned workload w12', '2022-03-25 16:12:01', '2022-03-25 16:12:01'),
            ( 13, 3, 15, 32, '2022-04-02', 'ACTIVE', 'create planned workload w13', '2022-04-01 16:12:01', '2022-04-01 16:12:01'),
            ( 13, 3, 15, 37, '2022-04-09', 'ACTIVE', 'create planned workload w14', '2022-04-09 16:12:01', '2022-04-09 16:12:01'),
            ( 14, 6, 16, 2, '2022-03-26', 'ACTIVE', 'create planned workload w12', '2022-03-25 16:12:01', '2022-03-25 16:12:01'),
            ( 14, 6, 16, 1, '2022-04-02', 'ACTIVE', 'create planned workload w13', '2022-04-01 16:12:01', '2022-04-01 16:12:01'),
            ( 14, 6, 16, 1, '2022-04-09', 'ACTIVE', 'create planned workload w14', '2022-04-09 16:12:01', '2022-04-09 16:12:01'),
            ( 14, 9, 17, 3, '2022-03-26', 'ACTIVE', 'create planned workload w12', '2022-03-25 16:12:01', '2022-03-25 16:12:01'),
            ( 14, 9, 17, 3, '2022-04-02', 'ACTIVE', 'create planned workload w13', '2022-04-01 16:12:01', '2022-04-01 16:12:01'),
            ( 14, 9, 17, 1, '2022-04-09', 'ACTIVE', 'create planned workload w14', '2022-04-09 16:12:01', '2022-04-09 16:12:01'),
            ( 14, 5, 18, 10, '2022-03-26', 'ACTIVE', 'create planned workload w12', '2022-03-25 16:12:01', '2022-03-25 16:12:01'),
            ( 14, 5, 18, 16, '2022-04-02', 'ACTIVE', 'create planned workload w13', '2022-04-01 16:12:01', '2022-04-01 16:12:01'),
            ( 14, 5, 18, 17, '2022-04-09', 'ACTIVE', 'create planned workload w14', '2022-04-09 16:12:01', '2022-04-09 16:12:01'),
            ( 14, 3, 19, 25, '2022-03-26', 'ACTIVE', 'create planned workload w12', '2022-03-25 16:12:01', '2022-03-25 16:12:01'),
            ( 14, 3, 19, 22, '2022-04-02', 'ACTIVE', 'create planned workload w13', '2022-04-01 16:12:01', '2022-04-01 16:12:01'),
            ( 14, 3, 19, 21, '2022-04-09', 'ACTIVE', 'create planned workload w14', '2022-04-09 16:12:01', '2022-04-09 16:12:01')`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM "planned_workload"');
        await queryRunner.query('DELETE FROM "committed_workload"');
        await queryRunner.query('DELETE FROM "user"');
    }
}
