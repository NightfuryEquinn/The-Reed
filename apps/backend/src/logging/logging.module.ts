import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { KyselyModule } from "src/kysely/kysely.module";
import { LoggingService } from "./logging.service";

@Module({
  imports: [KyselyModule, JwtModule],
  providers: [LoggingService],
  exports: [LoggingService]
})
export class LoggingModule {}