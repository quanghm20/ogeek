/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/tslint/config
export class createDatabase1646473785529 implements MigrationInterface {
    name = 'createDatabase1646473785529';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "expertise_scope" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying NOT NULL,
                CONSTRAINT "PK_263c406fc72bd2389e58ef77497" PRIMARY KEY ("id")
            )`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."user_role_enum" AS 
            ENUM('USER', 'ADMIN')`,
        );
        await queryRunner.query(
            `CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "alias" character varying NOT NULL,
                "name" character varying NOT NULL,
                "phone" character varying,
                "email" character varying NOT NULL,
                "avatar" character varying,
                "role" "public"."user_role_enum" NOT NULL DEFAULT 'USER', 
                CONSTRAINT "UQ_1d5324dc4f0c41f17ebe4bf5aba" UNIQUE ("alias"), 
                CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"), 
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), 
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "planned_workload" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "planned_workload" integer NOT NULL,
                "start_date" TIMESTAMP NOT NULL,
                "user_id" uuid,
                "contributed_value_id" uuid,
                "committed_workload_id" uuid,
                CONSTRAINT "PK_b19dd1ed73cdbe6eff0880b2ab7" PRIMARY KEY ("id")
            )`,
        );
        await queryRunner.query(
            `CREATE TABLE "value_stream" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying NOT NULL,
                CONSTRAINT "PK_2d55b1018c9f5cba5ab8aae671f" PRIMARY KEY ("id")
            )`,
        );
        await queryRunner.query(
            `CREATE TABLE "contributed_value" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "expertise_scope_id" uuid,
                "value_stream_id" uuid,
                CONSTRAINT "PK_a168345caec92a8ffcc53b67d26" PRIMARY KEY ("id")
            )`,
        );
        await queryRunner.query(
            `CREATE TABLE "committed_workload" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "committed_workload" integer NOT NULL,
                "start_date" TIMESTAMP NOT NULL,
                "expired_date" TIMESTAMP NOT NULL,
                "user_id" uuid,
                "contributed_value_id" uuid,
                "pic_id" uuid,
                CONSTRAINT "PK_0bc6100814f8fe5d1ff461f476c" PRIMARY KEY ("id")
            )`,
        );
        await queryRunner.query(
            'CREATE TYPE "public"."users_role_enum" AS ENUM(\'USER\', \'ADMIN\')',
        );
        await queryRunner.query(
            `CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "first_name" character varying,
                "last_name" character varying,
                "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER',
                "email" character varying, "password" character varying, 
                "phone" character varying, "avatar" character varying, 
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), 
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE
                "planned_workload"
            ADD
                CONSTRAINT "FK_dbe91a3b50a5b5db590f5e36209" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE
                "planned_workload"
            ADD
                CONSTRAINT "FK_b630a737d295a90ace36adeba2d" FOREIGN KEY ("contributed_value_id") REFERENCES "contributed_value"("id") 
                    ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE
                "planned_workload"
            ADD
                CONSTRAINT "FK_5a52105d7110eeec22ee79a19b5" FOREIGN KEY ("committed_workload_id") REFERENCES "committed_workload"("id") 
                    ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE
                "contributed_value"
            ADD
                CONSTRAINT "FK_6aaa0e509108569c9499fd825c9" FOREIGN KEY ("expertise_scope_id") REFERENCES "expertise_scope"("id") 
                    ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE
                "contributed_value"
            ADD
                CONSTRAINT "FK_97941d40c5eeee52e904cd46591" FOREIGN KEY ("value_stream_id") REFERENCES "value_stream"("id") 
                    ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE
                "committed_workload"
            ADD
                CONSTRAINT "FK_d5f13da646a869a54c38b523cea" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE
                "committed_workload"
            ADD
                CONSTRAINT "FK_b9b60ad9d7f33a013aa9d6b4746" FOREIGN KEY ("contributed_value_id") REFERENCES "contributed_value"("id") 
                    ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE
                "committed_workload"
            ADD
                CONSTRAINT "FK_d0f9da109def0b970ec32af1d8d" FOREIGN KEY ("pic_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
        await queryRunner.query('DROP TABLE "users"');
        await queryRunner.query('DROP TYPE "public"."users_role_enum"');
        await queryRunner.query('DROP TABLE "committed_workload"');
        await queryRunner.query('DROP TABLE "contributed_value"');
        await queryRunner.query('DROP TABLE "value_stream"');
        await queryRunner.query('DROP TABLE "planned_workload"');
        await queryRunner.query('DROP TABLE "user"');
        await queryRunner.query('DROP TYPE "public"."user_role_enum"');
        await queryRunner.query('DROP TABLE "expertise_scope"');
    }
}
