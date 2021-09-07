import { MigrationInterface, QueryRunner } from "typeorm"

export class SeedDB1630697408439 implements MigrationInterface {
  name = "SeedDB1630697408439"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES ('dragons'), ('cofee'), ('nestjs')`
    )

    // password is 12345
    await queryRunner.query(
      `INSERT INTO users (username, email, password) VALUES ('foo', 'foo@gmail.com', '$2b$10$urm5HIIaHE8PGflrtGDXuuYLxp1LZ96pzQCW.d06IDMVt.tpHtUrO')`
    )

    await queryRunner.query(
      `INSERT INTO articles (slug, title, description, "tagList", "authorId") VALUES ('first-article-j21', 'first-article', 'first-article-descr', 'cofee,dragons', 1)`
    )

    await queryRunner.query(
      `INSERT INTO articles (slug, title, description, "tagList", "authorId") VALUES 
      ('second-article-j21', 'second-article', 'second-article-descr', 'cofee,dragons', 1)`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
