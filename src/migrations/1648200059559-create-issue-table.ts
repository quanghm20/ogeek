/* eslint-disable @typescript-eslint/tslint/config */
import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/naming-convention
export class createIssueTable1648200059559 implements MigrationInterface {
    name = 'createIssueTable1648200059559';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "issue" (
                "id" SERIAL NOT NULL, 
                "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                "type" character varying NOT NULL DEFAULT 'NOT_ISSUE', 
                "week" integer NOT NULL, "user_id" integer,
                CONSTRAINT "PK_f80e086c249b9f3f3ff2fd321b7" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "issue" 
            ADD CONSTRAINT "FK_2067bb78ce5b812013d3c68357a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "issue" DROP CONSTRAINT "FK_2067bb78ce5b812013d3c68357a"',
        );
        await queryRunner.query('DROP TABLE "issue"');
    }
}
