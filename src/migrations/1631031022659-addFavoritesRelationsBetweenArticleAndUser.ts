import { MigrationInterface, QueryRunner } from "typeorm"

export class addFavoritesRelationsBetweenArticleAndUser1631031022659
  implements MigrationInterface
{
  name = "addFavoritesRelationsBetweenArticleAndUser1631031022659"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users_favorties_articles" ("usersId" integer NOT NULL, "articlesId" integer NOT NULL, CONSTRAINT "PK_4526a911c1a1077ecbc82dc042a" PRIMARY KEY ("usersId", "articlesId"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_66ac374e4db49def11d011f309" ON "users_favorties_articles" ("usersId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_abc2b2f6d0f19c076e01d94f03" ON "users_favorties_articles" ("articlesId") `
    )
    await queryRunner.query(
      `ALTER TABLE "users_favorties_articles" ADD CONSTRAINT "FK_66ac374e4db49def11d011f3092" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "users_favorties_articles" ADD CONSTRAINT "FK_abc2b2f6d0f19c076e01d94f033" FOREIGN KEY ("articlesId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_favorties_articles" DROP CONSTRAINT "FK_abc2b2f6d0f19c076e01d94f033"`
    )
    await queryRunner.query(
      `ALTER TABLE "users_favorties_articles" DROP CONSTRAINT "FK_66ac374e4db49def11d011f3092"`
    )
    await queryRunner.query(`DROP INDEX "IDX_abc2b2f6d0f19c076e01d94f03"`)
    await queryRunner.query(`DROP INDEX "IDX_66ac374e4db49def11d011f309"`)
    await queryRunner.query(`DROP TABLE "users_favorties_articles"`)
  }
}
