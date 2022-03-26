/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/tslint/config
export class addDataIntoDatabase1647339475418 implements MigrationInterface {
    name = 'addDataIntoDatabase1647339475418';

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
		'user_314',
		'short_name - 142',
		'phone - 142',
		'user_314@geekup.io',
		'http://api.sente.geekup.io/vatar - 142',
		'USER',
		'EXECUTING',
		'2021-12-30 00:00:00',
		'2021-12-30 00:00:00'
	),
	(
		'quang.hm',
		'Hồ Quang',
		'0977890453',
		'quang.hm@geekup.vn',
		'https://link1.com',
		'USER',
		'PLANNING',
		'2021-12-30 00:00:00',
		'2021-12-30 00:00:00'
	),
	(
		'loc.pt',
		'Lộc Phạm',
		'0372168817',
		'loc.pt@geekup.vn',
		'https://link1.com',
		'USER',
		'PLANNING',
		'2021-12-30 00:00:00',
		'2021-12-30 00:00:00'
	),
	(
		'chuong.tk',
		'Chương Tăng',
		'0923512562',
		'chuong.tk@geekup.vn',
		'https://link1.com',
		'USER',
		'PLANNING',
		'2021-12-30 00:00:00',
		'2021-12-30 00:00:00'
	),
	(
		'tuan.lq',
		'Tuấn Lê',
		'0962001540',
		'tuan.lq@geekup.vn',
		'https://link1.com',
		'USER',
		'PLANNING',
		'2021-12-30 00:00:00',
		'2021-12-30 00:00:00'
	),
	(
		'tuan.pa',
		'Tuấn Phạm',
		'0778821404',
		'tuan.pa@geekup.vn',
		'https://link1.com',
		'USER',
		'PLANNING',
		'2021-12-30 00:00:00',
		'2021-12-30 00:00:00'
	),
	(
		'nhi.ny',
		'Yến Nhi',
		'0885502434',
		'nhi.ny@geekup.vn',
		'https://link1.com',
		'USER',
		'PLANNING',
		'2021-12-30 00:00:00',
		'2021-12-30 00:00:00'
	),
	(
		'nam.dp',
		'Nam Đỗ',
		'0764641209',
		'nam.dp@geekup.vn',
		'https://link1.com',
		'ADMIN',
		'PLANNING',
		'2021-12-30 00:00:00',
		'2021-12-30 00:00:00'
	),
	(
		'user_315',
		'short_name - 142',
		'phone - 143',
		'user_315@geekup.io',
		'http://api.sente.geekup.io/vatar - 142',
		'USER',
		'EXECUTING',
		'2021-12-30 00:00:00',
		'2021-12-30 00:00:00'
	),
	(
		'user_3',
		'short_name - 14',
		'phone - 14',
		'user_3@geekup.io',
		'http://api.sente.geekup.io/vatar - 14',
		'USER',
		'PLANNING',
		'2021-12-30 00:00:00',
		'2021-12-30 00:00:00'
	),
	(
		'user_264',
		'short_name - 94',
		'phone - 94',
		'user_264@geekup.io',
		'http://api.sente.geekup.io/vatar - 94',
		'USER',
		'PLANNING',
		'2021-12-30 00:00:00',
		'2021-12-30 00:00:00'
	),
	(
		'user_177',
		'short_name - 44',
		'phone - 44',
		'user_177@geekup.io',
		'http://api.sente.geekup.io/vatar - 44',
		'ADMIN',
		'PLANNING',
		'2021-12-30 00:00:00',
		'2021-12-30 00:00:00'
	);
            `,
        );
        await queryRunner.query(
            `INSERT INTO
	value_stream (id, name)
VALUES
	(1, 'Delivery'),
	(2, 'Capacity'),
	(3, 'Individual'),
	(4, 'Alignment');
            `,
        );
        await queryRunner.query(
            `INSERT INTO
	expertise_scope (id, name)
VALUES
	(1, 'Engagement'),
	(2, 'Integration'),
	(3, 'Product Analysis'),
	(4, 'Product Design'),
	(5, 'Product Frontend'),
	(6, 'Product Backend'),
	(7, 'Product UI'),
	(8, 'Product UX'),
	(9, 'Product Alignment'),
	(10, 'Program Operation'),
	(11, 'People Operation');
            `,
        );
        await queryRunner.query(
            `INSERT INTO
	contributed_value (id, value_stream_id, expertise_scope_id)
VALUES
	(1, 1, 3),
	(2, 1, 4),
	(3, 1, 5),
	(4, 1, 6),
	(5, 1, 7),
	(6, 1, 8),
	(7, 1, 10),
	(8, 1, 11),
	(9, 2, 3),
	(10, 2, 4),
	(11, 2, 5),
	(12, 2, 6),
	(13, 2, 7),
	(14, 2, 8),
	(15, 2, 10),
	(16, 2, 11),
	(17, 3, 1),
	(18, 3, 2),
	(19, 4, 9);
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
	(1, 2, 20, '2022-01-01', '2022-04-30', 12),
	(1, 3, 20, '2022-01-03', '2022-04-30', 12),
	(2, 8, 40, '2022-02-05', '2022-04-30', 12),
	(3, 2, 30, '2022-01-01', '2022-04-30', 12),
	(3, 5, 10, '2022-01-01', '2022-04-30', 12),
	(4, 4, 40, '2022-01-08', '2022-04-30', 12),
	(5, 6, 40, '2022-02-05', '2022-04-30', 12),
	(6, 9, 40, '2022-01-01', '2022-04-30', 12),
	(7, 4, 40, '2022-01-08', '2022-04-30', 12),
	(8, 6, 40, '2022-02-05', '2022-04-30', 12),
	(9, 9, 40, '2022-01-01', '2022-04-30', 12),
	(10, 6, 40, '2022-02-05', '2022-04-30', 12),
	(11, 9, 40, '2022-01-01', '2022-04-30', 12),
	(12, 8, 40, '2022-01-01', '2022-04-30', 12);
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
    ( 1, 2, 1, 21, '2022-01-01', 'ACTIVE', 'update planned workload w1', '2021-12-31 14:02:01', '2021-12-31 14:02:01'),
    ( 1, 3, 2, 20, '2022-01-01', 'ACTIVE', 'update planned workload w1', '2021-12-31 14:02:01', '2021-12-31 14:02:01'),
    ( 1, 2, 1, 20, '2022-01-08', 'ACTIVE', 'update planned workload w2', '2022-01-06 15:02:01', '2022-01-06 15:02:01'),
    ( 1, 3, 2, 20, '2022-01-08', 'ACTIVE', 'update planned workload w2', '2022-01-06 15:02:01', '2022-01-06 15:02:01'),
    ( 1, 2, 1, 20, '2022-01-15', 'ACTIVE', 'update planned workload w3', '2022-01-14 07:02:01', '2022-01-14 07:02:01'),
    ( 1, 3, 2, 20, '2022-01-15', 'ACTIVE', 'update planned workload w3', '2022-01-14 07:02:01', '2022-01-14 07:02:01'),
    ( 1, 2, 1, 20, '2022-01-22', 'ACTIVE', 'update planned workload w4', '2022-01-21 05:02:01', '2022-01-21 05:02:01'),
    ( 1, 3, 2, 20, '2022-01-22', 'ACTIVE', 'update planned workload w4', '2022-01-21 05:02:01', '2022-01-21 05:02:01'),
    ( 1, 2, 1, 20, '2022-01-29', 'ACTIVE', 'update planned workload w5', '2022-01-28 08:02:01', '2022-01-28 08:02:01'),
    ( 1, 3, 2, 20, '2022-01-29', 'ACTIVE', 'update planned workload w5', '2022-01-28 08:02:01', '2022-01-28 08:02:01'),
    ( 1, 2, 1, 20, '2022-02-12', 'ACTIVE', 'update planned workload w6', '2022-02-11 16:12:01', '2022-02-11 16:12:01'),
    ( 1, 3, 2, 20, '2022-02-12', 'ACTIVE', 'update planned workload w6', '2022-02-11 16:12:01', '2022-02-11 16:12:01'),
    ( 1, 2, 1, 20, '2022-02-19', 'ACTIVE', 'update planned workload w7', '2022-02-16 16:12:01', '2022-02-16 16:12:01'),
    ( 1, 3, 2, 20, '2022-02-19', 'ACTIVE', 'update planned workload w7', '2022-02-16 16:12:01', '2022-02-16 16:12:01'),
    ( 1, 2, 1, 20, '2022-02-26', 'ACTIVE', 'update planned workload w8', '2022-02-25 16:12:01', '2022-02-25 16:12:01'),
    ( 1, 3, 2, 20, '2022-02-26', 'ACTIVE', 'update planned workload w8', '2022-02-25 16:12:01', '2022-02-25 16:12:01'),
    ( 1, 2, 1, 20, '2022-03-05', 'ACTIVE', 'update planned workload w9', '2022-03-04 16:12:01', '2022-03-04 16:12:01'),
    ( 1, 3, 2, 20, '2022-03-05', 'ACTIVE', 'update planned workload w8', '2022-03-04 16:12:01', '2022-03-04 16:12:01'),
    ( 1, 2, 1, 20, '2022-03-12', 'ACTIVE', 'update planned workload w10', '2022-03-11 16:12:01', '2022-03-11 16:12:01'),
    ( 1, 3, 2, 20, '2022-03-12', 'ACTIVE', 'update planned workload w10', '2022-03-11 16:12:01', '2022-03-11 16:12:01'),
    ( 1, 2, 1, 20, '2022-03-19', 'ACTIVE', 'update planned workload w11', '2022-03-18 16:12:01', '2022-03-18 16:12:01'),
    ( 1, 3, 2, 20, '2022-03-19', 'ACTIVE', 'update planned workload w11', '2022-03-18 16:12:01', '2022-03-18 16:12:01'),
    ( 1, 2, 1, 25, '2022-03-26', 'ACTIVE', 'update planned workload w12', '2022-03-25 16:12:01', '2022-03-25 16:12:01'),
    ( 1, 3, 2, 25, '2022-03-26', 'ACTIVE', 'update planned workload w12', '2022-03-25 16:12:01', '2022-03-25 16:12:01'),
    ( 1, 2, 1, 20, '2022-04-02', 'ACTIVE', 'update planned workload w13', '2022-04-01 16:12:01', '2022-04-01 16:12:01'),
    ( 1, 3, 2, 20, '2022-04-02', 'ACTIVE', 'update planned workload w13', '2022-04-01 16:12:01', '2022-04-01 16:12:01'),
    ( 1, 2, 1, 20, '2022-04-09', 'ACTIVE', 'update planned workload w14', '2022-04-09 16:12:01', '2022-04-09 16:12:01'),
    ( 1, 3, 2, 20, '2022-04-09', 'ACTIVE', 'update planned workload w14', '2022-04-09 16:12:01', '2022-04-09 16:12:01'),
    ( 1, 2, 1, 20, '2022-04-16', 'ACTIVE', 'update planned workload w15', '2022-04-16 16:12:01', '2022-04-16 16:12:01'),
    ( 1, 3, 2, 20, '2022-04-16', 'ACTIVE', 'update planned workload w16', '2022-04-16 16:12:01', '2022-04-16 16:12:01'),    
    ( 1, 2, 1, 20, '2022-04-23', 'ACTIVE', 'update planned workload w16', '2022-04-23 16:12:01', '2022-04-23 16:12:01'),
    ( 1, 3, 2, 20, '2022-04-23', 'ACTIVE', 'update planned workload w16', '2022-04-23 16:12:01', '2022-04-23 16:12:01'),
    ( 1, 2, 1, 22, '2022-04-30', 'ACTIVE', 'update planned workload w17', '2022-04-30 16:12:01', '2022-04-30 16:12:01'),
    ( 1, 3, 2, 22, '2022-04-30', 'ACTIVE', 'update planned workload w17', '2022-04-30 16:12:01', '2022-04-30 16:12:01'),
    ( 1, 2, 1, 21, '2022-05-07', 'ACTIVE', 'update planned workload w18', '2022-05-07 16:12:01', '2022-05-07 16:12:01'),
    ( 1, 3, 2, 21, '2022-05-07', 'ACTIVE', 'update planned workload w18', '2022-05-07 16:12:01', '2022-05-07 16:12:01'),
    ( 1, 2, 1, 25, '2022-01-01', 'INACTIVE', 'create planned workload w1', '2021-12-28 14:02:01', '2021-12-28 14:02:01'),
    ( 1, 3, 2, 25, '2022-01-01', 'INACTIVE', 'create planned workload w1', '2021-12-28 14:02:01', '2021-12-28 14:02:01'),
    ( 1, 2, 1, 25, '2022-01-08', 'INACTIVE', 'create planned workload w2', '2022-01-05 15:02:01', '2022-01-05 15:02:01'),
    ( 1, 3, 2, 25, '2022-01-08', 'INACTIVE', 'create planned workload w2', '2022-01-05 15:02:01', '2022-01-05 15:02:01'),
    ( 1, 2, 1, 25, '2022-01-15', 'INACTIVE', 'create planned workload w3', '2022-01-12 07:02:01', '2022-01-12 07:02:01'),
    ( 1, 3, 2, 25, '2022-01-15', 'INACTIVE', 'create planned workload w3', '2022-01-12 07:02:01', '2022-01-12 07:02:01'),
    ( 1, 2, 1, 25, '2022-01-22', 'INACTIVE', 'create planned workload w4', '2022-01-19 05:02:01', '2022-01-19 05:02:01'),
    ( 1, 3, 2, 25, '2022-01-22', 'INACTIVE', 'create planned workload w4', '2022-01-19 05:02:01', '2022-01-19 05:02:01'),
    ( 1, 2, 1, 25, '2022-01-29', 'INACTIVE', 'create planned workload w5', '2022-01-27 08:02:01', '2022-01-27 08:02:01'),
    ( 1, 3, 2, 25, '2022-01-29', 'INACTIVE', 'create planned workload w5', '2022-01-27 08:02:01', '2022-01-27 08:02:01'),
    ( 1, 2, 1, 25, '2022-02-12', 'INACTIVE', 'create planned workload w6', '2022-02-10 16:12:01', '2022-02-10 16:12:01'),
    ( 1, 3, 2, 25, '2022-02-12', 'INACTIVE', 'create planned workload w6', '2022-02-10 16:12:01', '2022-02-10 16:12:01'),
    ( 1, 2, 1, 25, '2022-02-19', 'INACTIVE', 'create planned workload w7', '2022-02-15 16:12:01', '2022-02-15 16:12:01'),
    ( 1, 3, 2, 25, '2022-02-19', 'INACTIVE', 'create planned workload w7', '2022-02-15 16:12:01', '2022-02-15 16:12:01'),
    ( 1, 2, 1, 25, '2022-02-26', 'INACTIVE', 'create planned workload w8', '2022-02-24 16:12:01', '2022-02-24 16:12:01'),
    ( 1, 3, 2, 25, '2022-02-26', 'INACTIVE', 'create planned workload w8', '2022-02-24 16:12:01', '2022-02-24 16:12:01'),
    ( 1, 2, 1, 25, '2022-03-05', 'INACTIVE', 'create planned workload w9', '2022-03-03 16:12:01', '2022-03-03 16:12:01'),
    ( 1, 3, 2, 25, '2022-03-05', 'INACTIVE', 'create planned workload w9', '2022-03-03 16:12:01', '2022-03-03 16:12:01'),
    ( 1, 2, 1, 25, '2022-03-12', 'INACTIVE', 'create planned workload w10', '2022-03-10 16:12:01', '2022-03-10 16:12:01'),
    ( 1, 3, 2, 25, '2022-03-12', 'INACTIVE', 'create planned workload w10', '2022-03-10 16:12:01', '2022-03-10 16:12:01'),
    ( 1, 2, 1, 25, '2022-03-19', 'INACTIVE', 'create planned workload w11', '2022-03-17 16:12:01', '2022-03-17 16:12:01'),
    ( 1, 3, 2, 25, '2022-03-19', 'INACTIVE', 'create planned workload w11', '2022-03-17 16:12:01', '2022-03-17 16:12:01'),
    ( 1, 2, 1, 25, '2022-03-26', 'INACTIVE', 'create planned workload w12', '2022-03-24 16:12:01', '2022-03-24 16:12:01'),
    ( 1, 3, 2, 25, '2022-03-26', 'INACTIVE', 'create planned workload w12', '2022-03-24 16:12:01', '2022-03-24 16:12:01'),
    ( 1, 2, 1, 25, '2022-04-02', 'INACTIVE', 'create planned workload w13', '2022-03-31 16:12:01', '2022-03-31 16:12:01'),
    ( 1, 3, 2, 25, '2022-04-02', 'INACTIVE', 'create planned workload w13', '2022-03-31 16:12:01', '2022-03-31 16:12:01'),
    ( 1, 2, 1, 23, '2022-04-09', 'INACTIVE', 'create planned workload w14', '2022-04-08 16:12:01', '2022-04-08 16:12:01'),
    ( 1, 3, 2, 23, '2022-04-09', 'INACTIVE', 'create planned workload w14', '2022-04-08 16:12:01', '2022-04-08 16:12:01'),
    ( 1, 2, 1, 23, '2022-04-16', 'INACTIVE', 'create planned workload w15', '2022-04-15 16:12:01', '2022-04-15 16:12:01'),
    ( 1, 3, 2, 22, '2022-04-16', 'INACTIVE', 'create planned workload w15', '2022-04-15 16:12:01', '2022-04-15 16:12:01'),
    ( 1, 2, 1, 21, '2022-04-23', 'INACTIVE', 'create planned workload w16', '2022-04-22 16:12:01', '2022-04-22 16:12:01'),
    ( 1, 3, 2, 24, '2022-04-23', 'INACTIVE', 'create planned workload w16', '2022-04-22 16:12:01', '2022-04-22 16:12:01'),
    ( 1, 2, 1, 20, '2022-04-30', 'INACTIVE', 'create planned workload w17', '2022-04-29 16:12:01', '2022-04-29 16:12:01'),
    ( 1, 3, 2, 20, '2022-04-30', 'INACTIVE', 'create planned workload w17', '2022-04-29 16:12:01', '2022-04-29 16:12:01'),
    ( 1, 2, 1, 20, '2022-05-07', 'INACTIVE', 'create planned workload w18', '2022-05-06 16:12:01', '2022-05-06 16:12:01'),
    ( 1, 3, 2, 20, '2022-05-07', 'INACTIVE', 'create planned workload w18', '2022-05-06 16:12:01', '2022-05-06 16:12:01')`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM "planned_workload"');
        await queryRunner.query('DELETE FROM "committed_workload"');
        await queryRunner.query('DELETE FROM "contributed_value"');
        await queryRunner.query('DELETE FROM "value_stream"');
        await queryRunner.query('DELETE FROM "expertise_scope"');
        await queryRunner.query('DELETE FROM "user"');
    }
}
