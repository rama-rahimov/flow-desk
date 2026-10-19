import {Body, Controller, Post, Req} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import  { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import type {Request} from 'express';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/api/register')
  register(@Req() req: Request, @Body() registerDto: RegisterDto) {
    const visitorId = req.cookies.visitorId;
    console.log("dataRegister", registerDto, visitorId, req.cookies, req.cookies.visitorId);
    return this.authService.register(registerDto, visitorId);
  }

  @Post('/api/login')
  login(@Req() req: Request, @Body() loginDto: LoginDto) {
    const ip = req.ip;
    console.log('req.ip:', req.ip);
    console.log('req.ips:', req.ips);
    console.log('x-forwarded-for:', req.headers['x-forwarded-for']);
    return this.authService.login(loginDto, ip);
  }

  @Post('/api/login_employment')
  loginEmployment(@Body() loginDto: LoginDto) {
    return this.authService.loginEmployment(loginDto);
  }
}
