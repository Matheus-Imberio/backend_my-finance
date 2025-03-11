import { Injectable } from "@nestjs/common";
import { Administrador } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { object, string } from "yup";
import { PrismaService } from "../prisma/prisma.service";
import { createAdministradorProps, resetPasswordProps } from "./interfaces";

@Injectable()
export class AdministradorService {
  constructor(private prisma: PrismaService) {}

  async create(administrador: createAdministradorProps) {
    try {
      const createAdministradorSchema = object().shape({
        nome: string().required(),
        email: string().email().required(),
        senha: string().min(8).required(),
      });
      await createAdministradorSchema.validate(administrador);
    } catch (error) {
      if (error instanceof Error) {
        throw {
          statusCode: 400,
          message: error.message,
        };
      } else {
        throw {
          statusCode: 400,
          message: "Erro desconhecido ao validar dados",
        };
      }
    }

    const existingAdministrador = await this.prisma.administrador.findUnique({
      where: {
        email: administrador.email,
      },
    });

    if (existingAdministrador) {
      throw {
        statusCode: 400,
        message: "Email já cadastrado",
      };
    }
    const salt = 10;
    const hash = await bcrypt.hash(administrador.senha, salt);

    const createdAdministrador = await this.prisma.administrador.create({
      data: {
        nome: administrador.nome,
        email: administrador.email,
        senha: hash,
      },
    });
    if (!createdAdministrador) {
      throw {
        statusCode: 500,
        message: "Erro ao criar administrador",
      };
    }

    return {
      id: createdAdministrador.id,
      nome: createdAdministrador.nome,
      email: createdAdministrador.email,
    };
  }

  async findAll(): Promise<Administrador[]> {
    return this.prisma.administrador.findMany();
  }

  async findOne(id: number) {
    const existingAdministrador = await this.prisma.administrador.findUnique({
      where: { id },
    });

    if (!existingAdministrador) {
      throw {
        statusCode: 404,
        message: "Administrador não encontrado",
      };
    }

    return {
      id: existingAdministrador.id,
      nome: existingAdministrador.nome,
      email: existingAdministrador.email,
    };
  }

  async update(id: number, newAdministrador: createAdministradorProps) {
    const existingAdministrador = await this.prisma.administrador.findUnique({
      where: { id },
    });

    if (!existingAdministrador) {
      throw {
        statusCode: 404,
        message: "Administrador não encontrado",
      };
    }

    try {
      const updateAdministradorSchema = object().shape({
        nome: string().required(),
        email: string().email().required(),
        emailSistema: string().email(),
        chaveEmailSistema: string(),
        idCalendario: string(),
      });
      await updateAdministradorSchema.validate(newAdministrador);
    } catch (error) {
      if (error instanceof Error) {
        throw {
          statusCode: 400,
          message: error.message,
        };
      } else {
        throw {
          statusCode: 400,
          message: "Erro desconhecido ao validar dados",
        };
      }
    }

    const updatedAdministrador = await this.prisma.administrador.update({
      where: { id },
      data: {
        nome: newAdministrador.nome,
        email: newAdministrador.email,
      },
    });

    if (!updatedAdministrador) {
      throw {
        statusCode: 500,
        message: "Erro ao atualizar administrador",
      };
    }

    return {
      id: updatedAdministrador.id,
      nome: updatedAdministrador.nome,
      email: updatedAdministrador.email,
    };
  }

  async resetPassword(id: number, { senha, novaSenha }: resetPasswordProps) {
    const existingAdministrador = await this.prisma.administrador.findUnique({
      where: { id },
    });

    if (!existingAdministrador) {
      throw {
        statusCode: 404,
        message: "Administrador não encontrado",
      };
    }
    const isMatch = await bcrypt.compare(senha, existingAdministrador.senha);
    if (!isMatch) {
      throw {
        statusCode: 400,
        message: "Senha incorreta",
      };
    }

    const newPasswordSchema = object().shape({
      novaSenha: string().min(8).required(),
    });

    try {
      await newPasswordSchema.validate({ novaSenha });
    } catch (error) {
      if (error instanceof Error) {
        throw {
          statusCode: 400,
          message: error.message,
        };
      } else {
        throw {
          statusCode: 400,
          message: "Erro desconhecido ao validar nova senha",
        };
      }
    }

    const salt = 10;
    const hash = await bcrypt.hash(novaSenha, salt);

    try {
      const updatedAdministrador = await this.prisma.administrador.update({
        where: { id },
        data: { senha: hash },
      });

      return {
        id: updatedAdministrador.id,
        nome: updatedAdministrador.nome,
        email: updatedAdministrador.email,
      };
    } catch {
      throw {
        statusCode: 500,
        message: "Erro ao atualizar senha",
      };
    }
  }

  async remove(id: number) {
    try {
      const deletedAdministrador = await this.prisma.administrador.delete({
        where: { id },
      });

      return {
        id: deletedAdministrador.id,
        nome: deletedAdministrador.nome,
        email: deletedAdministrador.email,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw {
          statusCode: 500,
          message: error.message,
        };
      } else {
        throw {
          statusCode: 500,
          message: "Erro desconhecido ao deletar administrador",
        };
      }
    }
  }
}