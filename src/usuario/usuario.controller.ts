import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UsuarioDTO } from "./dto/usuario.dto";
import { UsuarioService } from "./usuario.serice";

@ApiBearerAuth()
@ApiTags("Usuario")
@Controller("usuario")
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @ApiResponse({
    status: 200,
    description: "Lista de usuarios",
    type: [UsuarioDTO],
  })
  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: "Usuario encontrado",
    type: UsuarioDTO,
  })
  @ApiResponse({
    status: 200,
    description: "Lista de alunos encontrados com base no termo",
    type: [UsuarioDTO],
  })
  @Get("search")
  search(@Query("term") term: string) {
    return this.usuarioService.search(term);
  }
}