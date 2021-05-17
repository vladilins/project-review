import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1621250635637 implements MigrationInterface {
    name = 'Initial1621250635637'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "review" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "text" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "review"`);
    }

}
