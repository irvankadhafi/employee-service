import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEmployee1737311308586 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            -- Write your UP migration SQL here
            CREATE TABLE IF NOT EXISTS "positions" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR(255) UNIQUE NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
                "deleted_at" TIMESTAMP
            );
            
            CREATE TABLE IF NOT EXISTS "departments" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR(255) UNIQUE NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
                "deleted_at" TIMESTAMP
            );
            
            CREATE TABLE IF NOT EXISTS "employees" (
                "id" SERIAL PRIMARY KEY,
                "user_id" INTEGER UNIQUE NOT NULL,
                "name" VARCHAR(255) NOT NULL,
                "email" VARCHAR(255) UNIQUE NOT NULL,
                "birth_date" DATE NOT NULL,
                "position_id" INTEGER NOT NULL,
                "department_id" INTEGER NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
                "deleted_at" TIMESTAMP,
                FOREIGN KEY ("position_id") REFERENCES "positions" ("id") ON DELETE CASCADE,
                FOREIGN KEY ("department_id") REFERENCES "departments" ("id") ON DELETE CASCADE
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            -- Write your DOWN migration SQL here
        `);
    }
}
