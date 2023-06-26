import {MigrationInterface, QueryRunner} from "typeorm";

export class contactInit1687255738585 implements MigrationInterface {
    name = 'contactInit1687255738585'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contact" ("id" SERIAL NOT NULL, "phone_number" character varying, "email" character varying, "linked_id" integer, "link_precedence" character varying NOT NULL DEFAULT 'primary', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ea7244afe014b693c35932e449" ON "contact" ("phone_number") `);
        await queryRunner.query(`CREATE INDEX "IDX_eff09bb429f175523787f46003" ON "contact" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_eff09bb429f175523787f46003"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ea7244afe014b693c35932e449"`);
        await queryRunner.query(`DROP TABLE "contact"`);
    }

}
