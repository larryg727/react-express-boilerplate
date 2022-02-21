import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUserDate1645398274331 implements MigrationInterface {
    name = 'CreateUserDate1645398274331'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "dateCreated" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "lastUpdated" TIMESTAMP NOT NULL DEFAULT now()
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "lastUpdated"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "dateCreated"
        `);
    }

}
