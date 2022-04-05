import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateIdAbstractEntity implements MigrationInterface {
    name = 'updateIdAbstractEntity1646530420298';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "contributed_value" DROP CONSTRAINT "FK_6aaa0e509108569c9499fd825c9"',
        );
        await queryRunner.query(
            'ALTER TABLE "expertise_scope" DROP CONSTRAINT "PK_263c406fc72bd2389e58ef77497"',
        );
        await queryRunner.query(
            'ALTER TABLE "expertise_scope" DROP COLUMN "id"',
        );
        await queryRunner.query(
            'ALTER TABLE "expertise_scope" ADD "id" SERIAL NOT NULL',
        );
        await queryRunner.query(
            'ALTER TABLE "expertise_scope" ADD CONSTRAINT "PK_263c406fc72bd2389e58ef77497" PRIMARY KEY ("id")',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" DROP CONSTRAINT "FK_dbe91a3b50a5b5db590f5e36209"',
        );
        await queryRunner.query(
            'ALTER TABLE "committed_workload" DROP CONSTRAINT "FK_d5f13da646a869a54c38b523cea"',
        );
        await queryRunner.query(
            'ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760" CASCADE',
        );
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "id"');
        await queryRunner.query('ALTER TABLE "user" ADD "id" SERIAL NOT NULL');
        await queryRunner.query(
            'ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" DROP CONSTRAINT "FK_b630a737d295a90ace36adeba2d"',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" DROP CONSTRAINT "FK_5a52105d7110eeec22ee79a19b5"',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" DROP CONSTRAINT "PK_b19dd1ed73cdbe6eff0880b2ab7"',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" DROP COLUMN "id"',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" ADD "id" SERIAL NOT NULL',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" ADD CONSTRAINT "PK_b19dd1ed73cdbe6eff0880b2ab7" PRIMARY KEY ("id")',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" DROP COLUMN "user_id"',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" ADD "user_id" integer',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" DROP COLUMN "contributed_value_id"',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" ADD "contributed_value_id" integer',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" DROP COLUMN "committed_workload_id"',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" ADD "committed_workload_id" integer',
        );
        await queryRunner.query(
            'ALTER TABLE "contributed_value" DROP CONSTRAINT "FK_97941d40c5eeee52e904cd46591"',
        );
        await queryRunner.query(
            'ALTER TABLE "value_stream" DROP CONSTRAINT "PK_2d55b1018c9f5cba5ab8aae671f"',
        );
        await queryRunner.query('ALTER TABLE "value_stream" DROP COLUMN "id"');
        await queryRunner.query(
            'ALTER TABLE "value_stream" ADD "id" SERIAL NOT NULL',
        );
        await queryRunner.query(
            'ALTER TABLE "value_stream" ADD CONSTRAINT "PK_2d55b1018c9f5cba5ab8aae671f" PRIMARY KEY ("id")',
        );
        await queryRunner.query(
            'ALTER TABLE "committed_workload" DROP CONSTRAINT "FK_b9b60ad9d7f33a013aa9d6b4746"',
        );
        await queryRunner.query(
            'ALTER TABLE "contributed_value" DROP CONSTRAINT "PK_a168345caec92a8ffcc53b67d26"',
        );
        await queryRunner.query(
            'ALTER TABLE "contributed_value" DROP COLUMN "id"',
        );
        await queryRunner.query(
            'ALTER TABLE "contributed_value" ADD "id" SERIAL NOT NULL',
        );
        await queryRunner.query(
            'ALTER TABLE "contributed_value" ADD CONSTRAINT "PK_a168345caec92a8ffcc53b67d26" PRIMARY KEY ("id")',
        );
        await queryRunner.query(
            'ALTER TABLE "contributed_value" DROP COLUMN "expertise_scope_id"',
        );
        await queryRunner.query(
            'ALTER TABLE "contributed_value" ADD "expertise_scope_id" integer',
        );
        await queryRunner.query(
            'ALTER TABLE "contributed_value" DROP COLUMN "value_stream_id"',
        );
        await queryRunner.query(
            'ALTER TABLE "contributed_value" ADD "value_stream_id" integer',
        );
        await queryRunner.query(
            'ALTER TABLE "committed_workload" DROP CONSTRAINT "PK_0bc6100814f8fe5d1ff461f476c"',
        );
        await queryRunner.query(
            'ALTER TABLE "committed_workload" DROP COLUMN "id"',
        );
        await queryRunner.query(
            'ALTER TABLE "committed_workload" ADD "id" SERIAL NOT NULL',
        );
        await queryRunner.query(
            'ALTER TABLE "committed_workload" ADD CONSTRAINT "PK_0bc6100814f8fe5d1ff461f476c" PRIMARY KEY ("id")',
        );
        await queryRunner.query(
            'ALTER TABLE "committed_workload" DROP COLUMN "user_id"',
        );
        await queryRunner.query(
            'ALTER TABLE "committed_workload" ADD "user_id" integer',
        );
        await queryRunner.query(
            'ALTER TABLE "committed_workload" DROP COLUMN "contributed_value_id"',
        );
        await queryRunner.query(
            'ALTER TABLE "committed_workload" ADD "contributed_value_id" integer',
        );
        await queryRunner.query(
            'ALTER TABLE "committed_workload" DROP COLUMN "pic_id"',
        );
        await queryRunner.query(
            'ALTER TABLE "committed_workload" ADD "pic_id" integer',
        );
        await queryRunner.query(
            'ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"',
        );
        await queryRunner.query('ALTER TABLE "users" DROP COLUMN "id"');
        await queryRunner.query('ALTER TABLE "users" ADD "id" SERIAL NOT NULL');
        await queryRunner.query(
            'ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")',
        );
        await queryRunner.query(
            `ALTER TABLE
	"planned_workload"
ADD
	CONSTRAINT "FK_dbe91a3b50a5b5db590f5e36209" 
	FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE
	"planned_workload"
ADD
	CONSTRAINT "FK_b630a737d295a90ace36adeba2d" 
	FOREIGN KEY ("contributed_value_id") REFERENCES "contributed_value"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE
	"planned_workload"
ADD
	CONSTRAINT "FK_5a52105d7110eeec22ee79a19b5" 
	FOREIGN KEY ("committed_workload_id") REFERENCES "committed_workload"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE
	"contributed_value"
ADD
	CONSTRAINT "FK_6aaa0e509108569c9499fd825c9" 
	FOREIGN KEY ("expertise_scope_id") REFERENCES "expertise_scope"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE
	"contributed_value"
ADD
	CONSTRAINT "FK_97941d40c5eeee52e904cd46591" 
	FOREIGN KEY ("value_stream_id") REFERENCES "value_stream"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE
	"committed_workload"
ADD
	CONSTRAINT "FK_d5f13da646a869a54c38b523cea" 
	FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE
	"committed_workload"
ADD
	CONSTRAINT "FK_b9b60ad9d7f33a013aa9d6b4746" 
	FOREIGN KEY ("contributed_value_id") REFERENCES "contributed_value"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE
	"committed_workload"
ADD
	CONSTRAINT "FK_d0f9da109def0b970ec32af1d8d" 
	FOREIGN KEY ("pic_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "committed_workload" DROP CONSTRAINT "FK_d0f9da109def0b970ec32af1d8d"',
        );
        await queryRunner.query(
            'ALTER TABLE "committed_workload" DROP CONSTRAINT "FK_b9b60ad9d7f33a013aa9d6b4746"',
        );
        await queryRunner.query(
            'ALTER TABLE "committed_workload" DROP CONSTRAINT "FK_d5f13da646a869a54c38b523cea"',
        );
        await queryRunner.query(
            'ALTER TABLE "contributed_value" DROP CONSTRAINT "FK_97941d40c5eeee52e904cd46591"',
        );
        await queryRunner.query(
            'ALTER TABLE "contributed_value" DROP CONSTRAINT "FK_6aaa0e509108569c9499fd825c9"',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" DROP CONSTRAINT "FK_5a52105d7110eeec22ee79a19b5"',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" DROP CONSTRAINT "FK_b630a737d295a90ace36adeba2d"',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" DROP CONSTRAINT "FK_dbe91a3b50a5b5db590f5e36209"',
        );
        await queryRunner.query(
            'ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"',
        );
        await queryRunner.query('ALTER TABLE "users" DROP COLUMN "id"');
        await queryRunner.query(
            'ALTER TABLE "users" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()',
        );
        await queryRunner.query(
            'ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")',
        );
        await queryRunner.query(
            'ALTER TABLE "committed_workload" DROP COLUMN "pic_id"',
        );
        await queryRunner.query(
            'ALTER TABLE "committed_workload" ADD "pic_id" uuid',
        );
        await queryRunner.query(
            'ALTER TABLE "committed_workload" DROP COLUMN "contributed_value_id"',
        );
        await queryRunner.query(
            'ALTER TABLE "committed_workload" ADD "contributed_value_id" uuid',
        );
        await queryRunner.query(
            'ALTER TABLE "committed_workload" DROP COLUMN "user_id"',
        );
        await queryRunner.query(
            'ALTER TABLE "committed_workload" ADD "user_id" uuid',
        );
        await queryRunner.query(
            'ALTER TABLE "committed_workload" DROP CONSTRAINT "PK_0bc6100814f8fe5d1ff461f476c"',
        );
        await queryRunner.query(
            'ALTER TABLE "committed_workload" DROP COLUMN "id"',
        );
        await queryRunner.query(
            'ALTER TABLE "committed_workload" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()',
        );
        await queryRunner.query(
            'ALTER TABLE "committed_workload" ADD CONSTRAINT "PK_0bc6100814f8fe5d1ff461f476c" PRIMARY KEY ("id")',
        );
        await queryRunner.query(
            'ALTER TABLE "contributed_value" DROP COLUMN "value_stream_id"',
        );
        await queryRunner.query(
            'ALTER TABLE "contributed_value" ADD "value_stream_id" uuid',
        );
        await queryRunner.query(
            'ALTER TABLE "contributed_value" DROP COLUMN "expertise_scope_id"',
        );
        await queryRunner.query(
            'ALTER TABLE "contributed_value" ADD "expertise_scope_id" uuid',
        );
        await queryRunner.query(
            'ALTER TABLE "contributed_value" DROP CONSTRAINT "PK_a168345caec92a8ffcc53b67d26"',
        );
        await queryRunner.query(
            'ALTER TABLE "contributed_value" DROP COLUMN "id"',
        );
        await queryRunner.query(
            'ALTER TABLE "contributed_value" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()',
        );
        await queryRunner.query(
            'ALTER TABLE "contributed_value" ADD CONSTRAINT "PK_a168345caec92a8ffcc53b67d26" PRIMARY KEY ("id")',
        );
        await queryRunner.query(
            `ALTER TABLE
	"committed_workload"
ADD
	CONSTRAINT "FK_b9b60ad9d7f33a013aa9d6b4746" 
	FOREIGN KEY ("contributed_value_id") REFERENCES "contributed_value"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            'ALTER TABLE "value_stream" DROP CONSTRAINT "PK_2d55b1018c9f5cba5ab8aae671f"',
        );
        await queryRunner.query('ALTER TABLE "value_stream" DROP COLUMN "id"');
        await queryRunner.query(
            'ALTER TABLE "value_stream" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()',
        );
        await queryRunner.query(
            'ALTER TABLE "value_stream" ADD CONSTRAINT "PK_2d55b1018c9f5cba5ab8aae671f" PRIMARY KEY ("id")',
        );
        await queryRunner.query(
            `ALTER TABLE
	"contributed_value"
ADD
	CONSTRAINT "FK_97941d40c5eeee52e904cd46591" 
	FOREIGN KEY ("value_stream_id") REFERENCES "value_stream"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" DROP COLUMN "committed_workload_id"',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" ADD "committed_workload_id" uuid',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" DROP COLUMN "contributed_value_id"',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" ADD "contributed_value_id" uuid',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" DROP COLUMN "user_id"',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" ADD "user_id" uuid',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" DROP CONSTRAINT "PK_b19dd1ed73cdbe6eff0880b2ab7"',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" DROP COLUMN "id"',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()',
        );
        await queryRunner.query(
            'ALTER TABLE "planned_workload" ADD CONSTRAINT "PK_b19dd1ed73cdbe6eff0880b2ab7" PRIMARY KEY ("id")',
        );
        await queryRunner.query(
            `ALTER TABLE
	"planned_workload"
ADD
	CONSTRAINT "FK_5a52105d7110eeec22ee79a19b5" 
	FOREIGN KEY ("committed_workload_id") REFERENCES "committed_workload"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE
	"planned_workload"
ADD
	CONSTRAINT "FK_b630a737d295a90ace36adeba2d" 
	FOREIGN KEY ("contributed_value_id") REFERENCES "contributed_value"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            'ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"',
        );
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "id"');
        await queryRunner.query(
            'ALTER TABLE "user" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()',
        );
        await queryRunner.query(
            'ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")',
        );
        await queryRunner.query(
            `ALTER TABLE
	"committed_workload"
ADD
	CONSTRAINT "FK_d5f13da646a869a54c38b523cea" 
	FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE
	"planned_workload"
ADD
	CONSTRAINT "FK_dbe91a3b50a5b5db590f5e36209" 
	FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            'ALTER TABLE "expertise_scope" DROP CONSTRAINT "PK_263c406fc72bd2389e58ef77497"',
        );
        await queryRunner.query(
            'ALTER TABLE "expertise_scope" DROP COLUMN "id"',
        );
        await queryRunner.query(
            'ALTER TABLE "expertise_scope" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()',
        );
        await queryRunner.query(
            'ALTER TABLE "expertise_scope" ADD CONSTRAINT "PK_263c406fc72bd2389e58ef77497" PRIMARY KEY ("id")',
        );
        await queryRunner.query(
            `ALTER TABLE
	"contributed_value"
ADD
	CONSTRAINT "FK_6aaa0e509108569c9499fd825c9" 
	FOREIGN KEY ("expertise_scope_id") REFERENCES "expertise_scope"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}
