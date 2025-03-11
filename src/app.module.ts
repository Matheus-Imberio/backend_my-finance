import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, RouterModule } from "@nestjs/core";
import { JwtModule, JwtService } from "@nestjs/jwt";
import * as moment from "moment-timezone";
import { AdministradorModule } from "./adm/adm.module";
import { AuthController } from "./auth/auth.controller";
import { AuthGuard } from "./auth/auth.guard";
import { AuthService } from "./auth/auth.service";
import { PrismaService } from "./prisma/prisma.service";
import { UsuarioModule } from "./usuario/usuario.module";

// Definindo o fuso horário para o Brasil
moment.tz.setDefault("America/Sao_Paulo");
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    RouterModule.register([
      {
        path: "api",
        module: AppModule,
        children: [
          {
            path: "adm",
            module: AdministradorModule,
          },
          {
            path: "usuario",
            module: UsuarioModule,
          },
        ],
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: `${process.env.JWT_EXPIRES}s` },
    }),

    AdministradorModule,
    UsuarioModule,
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    AuthService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}