import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedData1649174825788 implements MigrationInterface {
    name = 'SeedData1649174825788';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO
	"user" (
		"alias",
		"name",
		"phone",
		"email",
		"avatar",
		"role",
        "created_by",
		"created_at",
		"updated_at",
        "updated_by"
	)
VALUES
	(
		'user_314',
		'short_name - 142',
		'phone - 142',
		'user_314@geekup.io',
		'http://api.sente.geekup.io/vatar',
		'USER',
        -2,
		'2021-12-20 00:00:00',
		'2021-12-20 00:00:00',
        -2
	),
	(
		'quang.hm',
		'Hồ Quang',
		'0977890453',
		'quang.hm@geekup.vn',
		'https://link1.com',
		'USER',
        -2,
		'2021-12-20 00:00:00',
		'2021-12-20 00:00:00',
        -2
	),
	(
		'loc.pt',
		'Lộc Phạm',
		'0372168817',
		'loc.pt@geekup.vn',
		'https://link1.com',
		'USER',
        -2,
		'2021-12-20 00:00:00',
		'2021-12-20 00:00:00',
        -2
	),
	(
		'chuong.tk',
		'Chương Tăng',
		'0923512562',
		'chuong.tk@geekup.vn',
		'https://link1.com',
		'USER',
        -2,
		'2021-12-20 00:00:00',
		'2021-12-20 00:00:00',
        -2
	),
	(
		'tuan.lq',
		'Tuấn Lê',
		'0962001540',
		'tuan.lq@geekup.vn',
		'https://link1.com',
		'USER',
        -2,
		'2021-12-20 00:00:00',
		'2021-12-20 00:00:00',
        -2
	),
	(
		'tuan.pa',
		'Tuấn Phạm',
		'0778821404',
		'tuan.pa@geekup.vn',
		'https://link1.com',
		'USER',
        -2,
		'2021-12-20 00:00:00',
		'2021-12-20 00:00:00',
        -2
	),
	(
		'nhi.ny',
		'Yến Nhi',
		'0885502434',
		'nhi.ny@geekup.vn',
		'https://link1.com',
		'USER',
        -2,
		'2021-12-20 00:00:00',
		'2021-12-20 00:00:00',
        -2
	),
	(
		'nam.dp',
		'Nam Đỗ',
		'0764641209',
		'nam.dp@geekup.vn',
		'https://link1.com',
		'USER',
        -2,
		'2021-12-20 00:00:00',
		'2021-12-20 00:00:00',
        -2
	),
	(
		'user_315',
		'short_name - 142',
		'phone - 143',
		'user_315@geekup.io',
		'http://api.sente.geekup.io/vatar - 142',
		'USER',
        -2,
		'2021-12-20 00:00:00',
		'2021-12-20 00:00:00',
        -2
	),
	(
		'user_3',
		'short_name - 14',
		'phone - 14',
		'user_3@geekup.io',
		'http://api.sente.geekup.io/vatar - 14',
		'USER',
        -2,
		'2021-12-20 00:00:00',
		'2021-12-20 00:00:00',
        -2
	),
	(
		'user_264',
		'short_name - 94',
		'phone - 94',
		'user_264@geekup.io',
		'http://api.sente.geekup.io/vatar - 94',
		'USER',
        -2,
		'2021-12-20 00:00:00',
		'2021-12-20 00:00:00',
        -2
	),
	(
		'user_177',
		'short_name - 44',
		'phone - 44',
		'user_177@geekup.io',
		'http://api.sente.geekup.io/vatar - 44',
		'PEOPLE_OPS',
        -2,
		'2021-12-20 00:00:00',
		'2021-12-20 00:00:00',
        -2
	),
	(
        'thuong.nv',
        'Thuong Nguyen',
        '0381294934',
        'thuong.nv@geekup.vn',
        'https://link22.com',
        'USER',
        -2,
		'2021-12-20 00:00:00',
		'2021-12-20 00:00:00',
        -2
	),
	(
		'nguyen.tk',
		'Nguyen Tran',
		'0933383823',
		'nguyen.tk@geekup.vn',
		'https://link21.com',
		'USER',
        -2,
		'2021-12-20 00:00:00',
		'2021-12-20 00:00:00',
        -2
	),
	(
		'thai.ls',
		'Thai Le',
		'0303403493',
		'thai.ls@geekup.vn',
		'https://link4.com',
		'USER',
        -2,
		'2021-12-20 00:00:00',
		'2021-12-20 00:00:00',
        -2
	),
	(
		'sang.nd',
		'Sang Nguyen',
		'0324523423',
		'sang.nd@geekup.vn',
		'https://link223.vn',
		'USER',
        -2,
		'2021-12-20 00:00:00',
		'2021-12-20 00:00:00',
        -2
	),
	(
		'linh.tt',
		'Linh Tran',
		'0933825355',
		'linh.tt@geekup.vn',
		'https://linkss.com',
		'USER',
		-2,
		'2021-12-20 00:00:00',
		'2021-12-20 00:00:00',
        -2
	),
	(
		'tran.nk',
		'Tran Ngo',
		'0923124234',
		'tran.nk@geekup.vn',
		'https://linkss.com',
		'USER',
        -2,
		'2021-12-20 00:00:00',
		'2021-12-20 00:00:00',
        -2
	),
	(
		'dat.pq',
		'Dat Pham',
		'0384912345',
		'dat.pq@geekup.vn',
		'https://linkss.com',
		'USER',
        -2,
		'2021-12-20 00:00:00',
		'2021-12-20 00:00:00',
        -2
	),
	(
		'van.nt',
		'Van Nguyen',
		'0384235235',
		'van.nt@geekup.vn',
		'https://linkss.com',
		'USER',
		-2,
		'2021-12-20 00:00:00',
		'2021-12-20 00:00:00',
        -2
	),
	(
		'huy.lt',
		'Huy Le',
		'0384934394',
		'huy.lt@geekup.vn',
		'https://linkss.com',
		'USER',
        -2,
		'2021-12-20 00:00:00',
		'2021-12-20 00:00:00',
        -2
	),
	(
		'nam.ll',
		'Nam Le',
		'0933332412',
		'nam.ll@geekup.vn',
		'https://linkss.com',
		'USER',
        -2,
		'2021-12-20 00:00:00',
		'2021-12-20 00:00:00',
        -2
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
                    status,
                    created_by,
                    created_at
                )
            VALUES
                (1, 2, 20, '2022-01-01 00:00:00', '2022-12-30 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (1, 3, 20, '2022-01-01 00:00:00', '2022-12-30 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (2, 8, 40, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (2, 8, 40, '2022-04-30 00:00:00', '2022-12-30 00:00:00', 'INCOMING', 12, '2022-04-20 00:00:00'),
                (3, 2, 30, '2022-01-01 00:00:00', '2022-12-30 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (3, 5, 10, '2022-01-01 00:00:00', '2022-12-30 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (4, 4, 40, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'NOT RENEW', 12, '2021-12-27 00:00:00'),
                (5, 6, 40, '2022-02-05 00:00:00', '2022-04-29 00:00:00', 'ACTIVE', 12, '2022-01-29 00:00:00'),
                (6, 9, 40, '2022-01-01 00:00:00', '2022-12-30 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (7, 4, 40, '2022-01-08 00:00:00', '2022-12-30 00:00:00', 'ACTIVE', 12, '2022-01-01 00:00:00'),
                (8, 6, 40, '2022-02-05 00:00:00', '2022-04-29 00:00:00', 'ACTIVE', 12, '2022-01-29 00:00:00'),
                (8, 6, 40, '2022-04-30 00:00:00', '2022-12-30 00:00:00', 'INCOMING', 12, '2022-04-23 00:00:00'),
                (9, 9, 40, '2022-01-01 00:00:00', '2022-12-30 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (10, 6, 40, '2022-02-05 00:00:00', '2022-04-29 00:00:00', 'ACTIVE', 12, '2022-01-29 00:00:00'),
                (11, 9, 40, '2022-01-01 00:00:00', '2022-12-30 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (12, 8, 40, '2022-01-01 00:00:00', '2022-12-30 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (13, 18, 3, '2022-01-01 00:00:00', '2022-07-15 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (13, 6, 5, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (13, 3, 30, '2022-04-30 00:00:00', '2022-12-30 00:00:00', 'INCOMING', 12, '2022-04-20 00:00:00'),
                (14, 6, 1, '2022-01-01 00:00:00', '2022-03-25 00:00:00', 'INACTIVE', 12, '2021-12-27 00:00:00'),
                (14, 18, 3, '2022-01-01 00:00:00', '2022-03-25 00:00:00', 'INACTIVE', 12, '2021-12-27 00:00:00'),
                (14, 3, 21, '2022-01-01 00:00:00', '2022-03-25 00:00:00', 'INACTIVE', 12, '2021-12-27 00:00:00'),
                (14, 5, 15, '2022-01-01 00:00:00', '2022-03-25 00:00:00', 'INACTIVE', 12, '2021-12-27 00:00:00'),
                (15, 3, 2, '2022-01-01 00:00:00', '2022-03-18 00:00:00', 'INACTIVE', 12, '2021-12-27 00:00:00'),
                (15, 18, 3, '2022-01-01 00:00:00', '2022-03-18 00:00:00', 'INACTIVE', 12, '2021-12-27 00:00:00'),
                (15, 12, 5, '2022-01-01 00:00:00', '2022-03-18 00:00:00', 'INACTIVE', 12, '2021-12-27 00:00:00'),
                (15, 4, 30, '2022-01-01 00:00:00', '2022-03-18 00:00:00', 'INACTIVE', 12, '2021-12-27 00:00:00'),
                (16, 19, 1, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'NOT RENEW', 12, '2021-12-27 00:00:00'),
                (16, 18, 3, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'NOT RENEW', 12, '2021-12-27 00:00:00'),
                (16, 12, 15, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'NOT RENEW', 12, '2021-12-27 00:00:00'),
                (16, 4, 21, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'NOT RENEW', 12, '2021-12-27 00:00:00'),
                (17, 18, 3, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'NOT RENEW', 12, '2021-12-27 00:00:00'),
                (17, 17, 5, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'NOT RENEW', 12, '2021-12-27 00:00:00'),
                (17, 1, 16, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'NOT RENEW', 12, '2021-12-27 00:00:00'),
                (17, 4, 16, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'NOT RENEW', 12, '2021-12-27 00:00:00'),
                (18, 18, 2, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (18, 10, 5, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (18, 5, 8, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (18, 3, 25, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (19, 18, 2, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (19, 5, 10, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (19, 6, 13, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (19, 3, 15, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (20, 18, 2, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (20, 4, 20, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (20, 19, 10, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (20, 1, 8, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (21, 18, 1, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (21, 3, 2, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (21, 12, 10, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (21, 4, 27, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (22, 18, 3, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (22, 3, 5, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00'),
                (22, 4, 35, '2022-01-01 00:00:00', '2022-04-29 00:00:00', 'ACTIVE', 12, '2021-12-27 00:00:00');
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
                    created_by,
                    created_at
                )
            VALUES
                ( 1, 2, 1, 23, '2022-01-01 00:00:00', 'CLOSED', 'create planned workload w1', 1, '2022-01-01 06:02:01'),
                ( 1, 3, 2, 22, '2022-01-01 00:00:00', 'CLOSED', 'create planned workload w1', 1, '2021-01-01 06:02:01'),
                ( 1, 2, 1, 21, '2022-01-08 00:00:00', 'CLOSED', 'create planned workload w2', 1, '2022-01-05 15:02:01'),
                ( 1, 3, 2, 22, '2022-01-08 00:00:00', 'CLOSED', 'create planned workload w2', 1, '2022-01-05 15:02:01'),
                ( 1, 2, 1, 24, '2022-01-15 00:00:00', 'CLOSED', 'create planned workload w3', 1, '2022-01-12 07:02:01'),
                ( 1, 3, 2, 21, '2022-01-15 00:00:00', 'CLOSED', 'create planned workload w3', 1, '2022-01-12 07:02:01'),
                ( 1, 2, 1, 25, '2022-01-22 00:00:00', 'CLOSED', 'create planned workload w4', 1, '2022-01-19 05:02:01'),
                ( 1, 3, 2, 25, '2022-01-22 00:00:00', 'CLOSED', 'create planned workload w4', 1, '2022-01-19 05:02:01'),
                ( 1, 2, 1, 25, '2022-01-29 00:00:00', 'CLOSED', 'create planned workload w5', 1, '2022-01-27 08:02:01'),
                ( 1, 3, 2, 25, '2022-01-29 00:00:00', 'CLOSED', 'create planned workload w5', 1, '2022-01-27 08:02:01'),
                ( 1, 2, 1, 0, '2022-02-05 00:00:00', 'CLOSED', 'create planned workload w6', 1, '2021-02-04 14:02:01'),
                ( 1, 3, 2, 0, '2022-02-05 00:00:00', 'CLOSED', 'create planned workload w6', 1, '2021-02-04 14:02:01'),
                ( 1, 2, 1, 25, '2022-02-12 00:00:00', 'CLOSED', 'create planned workload w7', 1, '2022-02-10 16:12:01'),
                ( 1, 3, 2, 25, '2022-02-12 00:00:00', 'CLOSED', 'create planned workload w7', 1, '2022-02-10 16:12:01'),
                ( 1, 2, 1, 25, '2022-02-19 00:00:00', 'CLOSED', 'create planned workload w8', 1, '2022-02-15 16:12:01'),
                ( 1, 3, 2, 25, '2022-02-19 00:00:00', 'CLOSED', 'create planned workload w8', 1, '2022-02-15 16:12:01'),
                ( 1, 2, 1, 25, '2022-02-26 00:00:00', 'CLOSED', 'create planned workload w9', 1, '2022-02-24 16:12:01'),
                ( 1, 3, 2, 25, '2022-02-26 00:00:00', 'CLOSED', 'create planned workload w9', 1, '2022-02-24 16:12:01'),
                ( 1, 2, 1, 25, '2022-03-05 00:00:00', 'CLOSED', 'create planned workload w10', 1, '2022-03-03 16:12:01'),
                ( 1, 3, 2, 25, '2022-03-05 00:00:00', 'CLOSED', 'create planned workload w10', 1, '2022-03-03 16:12:01'),
                ( 1, 2, 1, 25, '2022-03-12 00:00:00', 'CLOSED', 'create planned workload w11', 1, '2022-03-10 16:12:01'),
                ( 1, 3, 2, 25, '2022-03-12 00:00:00', 'CLOSED', 'create planned workload w11', 1, '2022-03-10 16:12:01'),
                ( 1, 2, 1, 25, '2022-03-19 00:00:00', 'CLOSED', 'create planned workload w12', 1, '2022-03-17 16:12:01'),
                ( 1, 3, 2, 25, '2022-03-19 00:00:00', 'CLOSED', 'create planned workload w12', 1, '2022-03-17 16:12:01'),
                ( 1, 2, 1, 25, '2022-03-26 00:00:00', 'CLOSED', 'create planned workload w13', 1, '2022-03-24 16:12:01'),
                ( 1, 3, 2, 25, '2022-03-26 00:00:00', 'CLOSED', 'create planned workload w13', 1, '2022-03-24 16:12:01'),
                ( 1, 2, 1, 25, '2022-04-02 00:00:00', 'EXECUTING', 'create planned workload w14', 1, '2022-03-31 16:12:01'),
                ( 1, 3, 2, 25, '2022-04-02 00:00:00', 'EXECUTING', 'create planned workload w14', 1, '2022-03-31 16:12:01'),
                ( 1, 2, 1, 23, '2022-04-09 00:00:00', 'PLANNING', 'create planned workload w15', 1, '2022-04-08 16:12:01'),
                ( 1, 3, 2, 23, '2022-04-09 00:00:00', 'PLANNING', 'create planned workload w15', 1, '2022-04-08 16:12:01'),
                ( 1, 2, 1, 23, '2022-04-16 00:00:00', 'PLANNING', 'create planned workload w16', 1, '2022-04-15 16:12:01'),
                ( 1, 3, 2, 22, '2022-04-16 00:00:00', 'PLANNING', 'create planned workload w16', 1, '2022-04-15 16:12:01'),
                ( 1, 2, 1, 21, '2022-04-23 00:00:00', 'PLANNING', 'create planned workload w17', 1, '2022-04-15 16:12:01'),
                ( 1, 3, 2, 24, '2022-04-23 00:00:00', 'PLANNING', 'create planned workload w17', 1, '2022-04-15 16:12:01'),
                ( 1, 2, 1, 21, '2022-04-30 00:00:00', 'PLANNING', 'create planned workload w18', 1, '2022-04-15 16:12:01'),
                ( 1, 3, 2, 21, '2022-04-30 00:00:00', 'PLANNING', 'create planned workload w18', 1, '2022-04-15 16:12:01'),
                ( 1, 2, 1, 23, '2022-05-07 00:00:00', 'PLANNING', 'create planned workload w19', 1, '2022-04-15 16:12:01'),
                ( 1, 3, 2, 24, '2022-05-07 00:00:00', 'PLANNING', 'create planned workload w19', 1, '2022-04-15 16:12:01'),
                ( 1, 2, 1, 23, '2022-05-14 00:00:00', 'PLANNING', 'create planned workload w20', 1, '2022-04-17 18:02:01'),
                ( 1, 3, 2, 24, '2022-05-14 00:00:00', 'PLANNING', 'create planned workload w20', 1, '2022-04-17 18:02:01');
            `,
        );
        await queryRunner.query(
            `INSERT INTO
                notification (
                    message,
                    read,
                    user_id,
                    created_by,
                    created_at
                )
            VALUES
                ('Admin has added 45 hr(s) committed workload for you.', 'UNREAD', 1, 12, '2022-04-12 00:00:00'),
                ('Admin has added 40 hr(s) committed workload for you.', 'READ', 1, 12, '2022-12-20 00:00:00'),
                ('Admin has added 30 hr(s) committed workload for you.', 'READ', 1, 12, '2022-10-30 00:00:00')
            `,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM "user"');
        await queryRunner.query('DELETE FROM "committed_workload"');
        await queryRunner.query('DELETE FROM "planned_workload"');
        await queryRunner.query('DELETE FROM "contributed_value"');
        await queryRunner.query('DELETE FROM "value_stream"');
        await queryRunner.query('DELETE FROM "expertise_scope"');
        await queryRunner.query('DELETE FROM "issue"');
        await queryRunner.query('DELETE FROM "notification"');
    }
}
