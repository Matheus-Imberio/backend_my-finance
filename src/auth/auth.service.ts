import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthData, LoginProps } from "./interfaces";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async login(data: LoginProps): Promise<AuthData> {
    const administrador = await this.prisma.administrador.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!administrador) {
      throw {
        statusCode: 400,
        message: "Email ou senha inválidos",
      };
    }

    const isPasswordValid = await bcrypt.compare(
      data.senha,
      administrador.senha,
    );

    if (!isPasswordValid) {
      throw {
        statusCode: 400,
        message: "Email ou senha inválidos",
      };
    }

    const payload = { ...administrador, senha: undefined };

    const jwt = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES,
    });
    return {
      ...payload,
      access_token: jwt,
      expires_in: Number(process.env.JWT_EXPIRES),
    };
  }
}