import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { AdministradorController } from "./adm.controller";
import { AdministradorService } from "./adm.service";

@Module({
  imports: [PrismaModule],
  controllers: [AdministradorController],
  providers: [AdministradorService],
})
export class AdministradorModule {}