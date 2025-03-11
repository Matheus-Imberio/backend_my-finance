import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.usuario.findMany();
  }
  async search(term: string) {
    if (!term) {
      throw {
        statusCode: 400,
        message: "Termo de busca não informado",
      };
    }
    return await this.prisma.usuario.findMany({
        where: {
          OR: [
            {
              email: {
                contains: term.toLowerCase(),
              },
            },
            {
              nome: {
                contains: term.toLowerCase(),
              },
            },
          ],
        },
      })
  }
}