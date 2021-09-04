import dotenv = require("dotenv")

dotenv.config()

import { TypeOrmModuleOptions } from "@nestjs/typeorm"

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: this.getValue("DB_USERNAME"),
      password: this.getValue("DB_PASSWORD"),
      database: this.getValue("DB_NAME"),
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: false,
      migrations: [__dirname + "/migrations/**/*{.ts,.js}"],
      cli: {
        migrationsDir: "src/migrations"
      }
    }
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true))
    return this
  }

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key]
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`)
    }

    return value
  }
}

const configService = new ConfigService(process.env).ensureValues(["DB_USERNAME", "DB_PASSWORD", "DB_NAME"])

export { configService }
