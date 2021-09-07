import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import ormconfig from "@app/ormconfig"
import dotenv = require("dotenv")

dotenv.config()

const seedConfig: TypeOrmModuleOptions = {
  ...ormconfig,
  migrations: [__dirname + "/seeds/**/*{.ts,.js}"],
  cli: {
    migrationsDir: "src/seeds"
  }
}

export default seedConfig
