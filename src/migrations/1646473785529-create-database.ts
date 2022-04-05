import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDatabase1646473785529 implements MigrationInterface {
    name = 'createDatabase1646473785529';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."user_role_enum" AS 
            ENUM('USER', 'ADMIN', 'PP_OPS')`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."notification_status_enum" AS 
            ENUM('UNREAD', 'READ')`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."committed_workload_status_enum" AS 
            ENUM('END', 'RENEW', 'WORKING', NEW)`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."planned_workload_status_enum" AS 
            ENUM('PLANNING', 'EXECUTING', 'CLOSE')`,
        );
        await queryRunner.query(
            `CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "alias" character varying NOT NULL,
                "name" character varying NOT NULL,
                "phone" character varying,
                "email" character varying NOT NULL,
                "avatar" character varying,
                "role" "public"."user_role_enum" NOT NULL DEFAULT 'USER', 
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_ALIAS" UNIQUE ("alias"), 
                CONSTRAINT "UQ_PHONE" UNIQUE ("phone"), 
                CONSTRAINT "UQ_EMAIL" UNIQUE ("email"), 
                CONSTRAINT "PK_USER" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "value_stream" (
                "id" SERIAL NOT NULL,
                "name" character varying(100) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_VALUE_STREAM" PRIMARY KEY ("id")
            )`,
        );
        await queryRunner.query(
            `CREATE TABLE "expertise_scope" (
                "id" SERIAL NOT NULL ,
                "name" character varying(100) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_EXPERTISE_SCOPE" PRIMARY KEY ("id")
            )`,
        );
        await queryRunner.query(
            `CREATE TABLE "contributed_value" (
                "id" SERIAL NOT NULL,
                "value_stream_id" integer,
                "expertise_scope_id" integer,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_CONTRIBUTED_VALUE" PRIMARY KEY ("id"),
                CONSTRAINT "FK_CONTRIBUTED_VALUE_EXPERTISE_SCOPE" 
                    FOREIGN KEY ("expertise_scope_id") REFERENCES "expertise_scope"("id"),
                CONSTRAINT "FK_CONTRIBUTED_VALUE_VALUE_STREAM" 
                    FOREIGN KEY ("value_stream_id") REFERENCES "value_stream"("id")
            )`,
        );
        await queryRunner.query(
            `CREATE TABLE "committed_workload" (
                "id" SERIAL NOT NULL,
                "contributed_value_id" integer,
                "committed_workload" integer NOT NULL,
                "start_date" TIMESTAMP NOT NULL,
                "expired_date" TIMESTAMP NOT NULL,
                "user_id" integer,
                "status" "public"."committed_workload_status_enum" NOT NULL DEFAULT 'NEW',
                "created_by" integer,
                "updated_by" integer,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_COMMITTED_WORKLOAD" PRIMARY KEY ("id"),
                CONSTRAINT "FK_COMMITTED_WORKLOAD_USER" 
                    FOREIGN KEY ("user_id") REFERENCES "user"("id"),
                CONSTRAINT "FK_COMMITTED_WORKLOAD_CREATED_BY" 
                    FOREIGN KEY ("created_by") REFERENCES "user"("id"),
                CONSTRAINT "FK_COMMITTED_WORKLOAD_UPDATED_BY" 
                    FOREIGN KEY ("updated_by") REFERENCES "user"("id"),
                CONSTRAINT "FK_COMMITTED_WORKLOAD_CONTRIBUTED_VALUE" 
                    FOREIGN KEY ("contributed_value_id") REFERENCES "contributed_value"("id"),
                CONSTRAINT "CHK_START_DATE" 
                    CHECK("start_date" >= now() and "start_date" < "expired_date"),
                CONSTRAINT "CHK_COMMITTED_WORKLOAD" 
                    CHECK("committed_workload" >=0),
            )`,
        );
        await queryRunner.query(
            `CREATE TABLE "planned_workload" (
                "id" SERIAL NOT NULL,
                "planned_workload" integer NOT NULL,
                "start_date" TIMESTAMP NOT NULL,
                "user_id" integer,
                "contributed_value_id" bigint,
                "committed_workload_id" bigint,
                "status" "public"."planned_workload_status_enum" NOT NULL DEFAULT 'PLANNING',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_PLANNED_WORKLOAD" PRIMARY KEY ("id"),
                CONSTRAINT "FK_PLANNED_WORKLOAD_CONTRIBUTED_VALUE" 
                    FOREIGN KEY ("contributed_value_id") REFERENCES "contributed_value"("id"),
                CONSTRAINT "FK_PLANNED_WORKLOAD_USER" 
                    FOREIGN KEY ("user_id") REFERENCES "user"("id"),
                CONSTRAINT "FK_PLANNED_WORKLOAD_COMMITTED_WORKLOAD" 
                    FOREIGN KEY ("planned_workload_id") REFERENCES "planned_workload"("id"),
                CONSTRAINT "CHK_PLANNED_WORKLOAD" 
                    CHECK("planned_workload" >=0),

            )`,
        );
        await queryRunner.query(
            `CREATE TABLE "issue" (
                "id" SERIAL NOT NULL, 
                "type" character varying NOT NULL DEFAULT 'NOT_ISSUE', 
                "week" integer NOT NULL, 
                "year" integer NOT NULL DEFAULT EXTRACT(YEAR FROM TIMESTAMP now());,
                "user_id" integer, 
                "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                CONSTRAINT "PK_ISSUE" PRIMARY KEY ("id")),
                CONSTRAINT "FK_ISSUE_USER" 
                    FOREIGN KEY ("user_id") REFERENCES "user"("id")
                `,
        );
        await queryRunner.query(
            `CREATE TABLE "notification" (
                "id" SERIAL NOT NULL, 
                "message" text NOT NULL, 
                "user_id" integer, 
                "status" "public"."notification_status_enum" NOT NULL DEFAULT 'UNREAD'
                "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                CONSTRAINT "PK_ISSUE" PRIMARY KEY ("id")),
                CONSTRAINT "FK_NOTIFICATION_USER" 
                    FOREIGN KEY ("user_id") REFERENCES "user"("id")
                `,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "notification"');
        await queryRunner.query('DROP TABLE "issue"');
        await queryRunner.query('DROP TABLE "planned_workload"');
        await queryRunner.query('DROP TABLE "committed_workload"');
        await queryRunner.query('DROP TABLE "contributed_value"');
        await queryRunner.query('DROP TABLE "expertise_scope"');
        await queryRunner.query('DROP TABLE "value_stream"');
        await queryRunner.query('DROP TABLE "user"');
        await queryRunner.query(
            'DROP TYPE "public"."planned_workload_status_enum"',
        );
        await queryRunner.query(
            'DROP TYPE "public"."committed_workload_status_enum"',
        );
        await queryRunner.query('DROP TYPE "public"."user_role_enum"');
    }
}
