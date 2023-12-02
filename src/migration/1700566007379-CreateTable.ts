import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTable1700566007379 implements MigrationInterface {
    name = 'CreateTable1700566007379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "firstName" character varying NOT NULL,
                "lastName" character varying NOT NULL,
                "isActive" boolean NOT NULL DEFAULT false,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "description" character varying,
                "gender" integer NOT NULL,
                "image" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "community" (
                "id" SERIAL NOT NULL,
                "description" character varying,
                "name" character varying,
                "image" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_cae794115a383328e8923de4193" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "chat" (
                "id" SERIAL NOT NULL,
                "body" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "communityId" integer,
                "userId" integer,
                CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user_community" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" integer,
                "communityId" integer,
                CONSTRAINT "PK_174f1ac4a294f1ffc3d9909329f" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "chat"
            ADD CONSTRAINT "FK_b0af035e835e0243032c8db95ab" FOREIGN KEY ("communityId") REFERENCES "community"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "chat"
            ADD CONSTRAINT "FK_52af74c7484586ef4bdfd8e4dbb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_community"
            ADD CONSTRAINT "FK_ca64cc2e2660e4ec802a90443ab" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_community"
            ADD CONSTRAINT "FK_e0645814ae97917fad5c9086a82" FOREIGN KEY ("communityId") REFERENCES "community"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_community" DROP CONSTRAINT "FK_e0645814ae97917fad5c9086a82"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_community" DROP CONSTRAINT "FK_ca64cc2e2660e4ec802a90443ab"
        `);
        await queryRunner.query(`
            ALTER TABLE "chat" DROP CONSTRAINT "FK_52af74c7484586ef4bdfd8e4dbb"
        `);
        await queryRunner.query(`
            ALTER TABLE "chat" DROP CONSTRAINT "FK_b0af035e835e0243032c8db95ab"
        `);
        await queryRunner.query(`
            DROP TABLE "user_community"
        `);
        await queryRunner.query(`
            DROP TABLE "chat"
        `);
        await queryRunner.query(`
            DROP TABLE "community"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
    }

}
