import { Body, Controller, Post } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { Public } from "./constants";
import { AuthDataDTO } from "./dto/auth-data.dto";
import { LoginDataDTO } from "./dto/login-data.dto";
@ApiTags("Autenticação")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 200,
    description: "Retorna informações do usuário e token de acesso",
    type: AuthDataDTO,
  })
  @Public()
  @Post()
  async login(@Body() data: LoginDataDTO) {
    return this.authService.login(data);
  }
}