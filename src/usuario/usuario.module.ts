import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { UsuarioController } from "./usuario.controller";
import { UsuarioService } from "./usuario.serice";

@Module({
  imports: [PrismaModule],
  controllers: [UsuarioController],
  providers: [UsuarioService],
})
export class UsuarioModule {}