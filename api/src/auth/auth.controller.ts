import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/api/register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('/api/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('/api/login_employment')
  loginEmployment(@Body() loginDto: LoginDto) {
    return this.authService.loginEmployment(loginDto);
  }
}