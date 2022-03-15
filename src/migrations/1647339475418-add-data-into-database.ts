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
		"created_at",
		"updated_at"
	)
VALUES
	(
		'thai.ls',
		'Sỹ Thái',
		'0984786432',
		'thai.ls@geekup.vn',
		'https://link1.com',
		'USER',
		NOW(),
		NOW()
	),
	(
		'quang.hm',
		'Hồ Quang',
		'0977890453',
		'quang.hm@geekup.vn',
		'https://link1.com',
		'ADMIN',
		NOW(),
		NOW()
	),
	(
		'loc.pt',
		'Lộc Phạm',
		'0372168817',
		'loc.pt@geekup.vn',
		'https://link1.com',
		'USER',
		NOW(),
		NOW()
	),
	(
		'chuong.tk',
		'Chương Tăng',
		'0923512562',
		'chuong.tk@geekup.vn',
		'https://link1.com',
		'USER',
		NOW(),
		NOW()
	),
	(
		'tuan.lq',
		'Tuấn Lê',
		'0962001540',
		'tuan.lq@geekup.vn',
		'https://link1.com',
		'USER',
		NOW(),
		NOW()
	),
	(
		'tuan.pa',
		'Tuấn Phạm',
		'0778821404',
		'tuan.pa@geekup.vn',
		'https://link1.com',
		'USER',
		NOW(),
		NOW()
	),
	(
		'nhi.ny',
		'Yến Nhi',
		'0885502434',
		'nhi.ny@geekup.vn',
		'https://link1.com',
		'USER',
		NOW(),
		NOW()
	),
	(
		'nam.dp',
		'Nam Đỗ',
		'0764641209',
		'nam.dp@geekup.vn',
		'https://link1.com',
		'ADMIN',
		NOW(),
		NOW()
	);
            `,
        );
        await queryRunner.query(
            `INSERT INTO
	value_stream (name)
VALUES
	('Delivery'),
	('Capacity'),
	('Individual'),
	('Alignment')
            `,
        );
        await queryRunner.query(
            `INSERT INTO
	expertise_scope (name)
VALUES
	('Engagement'),
	('Interation'),
	('Product Analysis'),
	('Product Design'),
	('Product Frontend'),
	('Product Backend'),
	('Product UI'),
	('Product UX'),
	('Product Alignment'),
	('Program Operation'),
	('People Operation')
            `,
        );
        await queryRunner.query(
            `INSERT INTO
	contributed_value (value_stream_id, expertise_scope_id)
VALUES
	(1, 3),
	(1, 4),
	(1, 5),
	(1, 6),
	(1, 7),
	(1, 8),
	(1, 10),
	(1, 11),
	(2, 3),
	(2, 4),
	(2, 5),
	(2, 6),
	(2, 7),
	(2, 8),
	(2, 10),
	(2, 11),
	(3, 1),
	(3, 2),
	(4, 9)
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
	(1, 2, 20, '2022-01-01', '2022-04-30', 2),
	(1, 3, 20, '2022-01-03', '2022-04-30', 8),
	(2, 8, 40, '2022-02-05', '2022-04-30', 2),
	(3, 2, 30, '2022-01-01', '2022-04-30', 8),
	(3, 5, 10, '2022-01-01', '2022-04-30', 2),
	(4, 4, 40, '2022-01-08', '2022-04-30', 8),
	(5, 6, 40, '2022-02-05', '2022-04-30', 2),
	(6, 9, 40, '2022-01-01', '2022-04-30', 8)
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
		reason
	)
VALUES
	(
		1,
		2,
		1,
		20,
		'2022-01-01',
		'create planned workload1'
	),
	(
		1,
		3,
		2,
		20,
		'2022-01-01',
		'create planned workload2'
	),
	(
		2,
		8,
		3,
		40,
		'2022-02-05',
		'create planned workload3'
	),
	(
		3,
		2,
		4,
		30,
		'2022-01-01',
		'create planned workload4'
	),
	(
		3,
		5,
		5,
		10,
		'2022-01-01',
		'create planned workload5'
	),
	(
		4,
		4,
		6,
		40,
		'2022-01-08',
		'create planned workload6'
	),
	(
		5,
		6,
		7,
		40,
		'2022-02-05',
		'create planned workload7'
	),
	(
		6,
		9,
		8,
		40,
		'2022-01-01',
		'create planned workload8'
	),
	(
		1,
		2,
		1,
		20,
		'2022-01-08',
		'create planned workload9'
	),
	(
		1,
		3,
		2,
		20,
		'2022-01-08',
		'create planned workload10'
	),
	(
		2,
		8,
		3,
		40,
		'2022-02-12',
		'create planned workload11'
	),
	(
		3,
		2,
		4,
		30,
		'2022-01-08',
		'create planned workload12'
	),
	(
		3,
		5,
		5,
		10,
		'2022-01-01',
		'create planned workload13'
	),
	(
		4,
		4,
		6,
		40,
		'2022-01-16',
		'create planned workload14'
	),
	(
		5,
		6,
		7,
		40,
		'2022-02-12',
		'create planned workload15'
	),
	(
		6,
		9,
		8,
		40,
		'2022-01-08',
		'create planned workload16'
	),
	(
		1,
		2,
		1,
		20,
		'2022-01-15',
		'create planned workload17'
	),
	(
		1,
		3,
		2,
		20,
		'2022-01-15',
		'create planned workload18'
	),
	(
		2,
		8,
		3,
		40,
		'2022-02-19',
		'create planned workload19'
	),
	(
		3,
		2,
		4,
		30,
		'2022-01-15',
		'create planned workload20'
	),
	(
		3,
		5,
		5,
		10,
		'2022-01-15',
		'create planned workload21'
	),
	(
		4,
		4,
		6,
		40,
		'2022-01-22',
		'create planned workload22'
	),
	(
		5,
		6,
		7,
		40,
		'2022-02-19',
		'create planned workload23'
	),
	(
		6,
		9,
		8,
		40,
		'2022-01-15',
		'create planned workload24'
	),
	(
		1,
		2,
		1,
		20,
		'2022-01-22',
		'create planned workload25'
	),
	(
		1,
		3,
		2,
		20,
		'2022-01-22',
		'create planned workload26'
	),
	(
		2,
		8,
		3,
		40,
		'2022-02-26',
		'create planned workload27'
	),
	(
		3,
		2,
		4,
		30,
		'2022-01-22',
		'create planned workload28'
	),
	(
		3,
		5,
		5,
		10,
		'2022-01-15',
		'create planned workload29'
	),
	(
		4,
		4,
		6,
		40,
		'2022-01-30',
		'create planned workload30'
	),
	(
		5,
		6,
		7,
		40,
		'2022-02-26',
		'create planned workload31'
	),
	(
		6,
		9,
		8,
		40,
		'2022-01-22',
		'create planned workload32'
	)`,
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
