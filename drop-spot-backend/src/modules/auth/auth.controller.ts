import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  async register(@Body() body: RegisterDto, @Res({ passthrough: true }) res) {
    const { user, token } = await this.authService.register(body);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.PROJECT_ENV === 'prod',
      maxAge: 1000 * 60 * 60,
      sameSite: 'lax',
    });

    return {
      success: true,
      message: 'Registration successful',
      data: user,
    };
  }
  @HttpCode(200)
  @Post('login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res) {
    const { token, user } = await this.authService.login(body);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.PROJECT_ENV === 'prod',
      maxAge: 1000 * 60 * 60,
      sameSite: 'lax',
    });

    return {
      success: true,
      message: 'Login successful',
      data: user,
    };
  }

  @HttpCode(200)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: any) {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.PROJECT_ENV === 'prod',
      sameSite: 'lax',
    });

    return {
      success: true,
      message: 'Logout successful',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return {
      success: true,
      data: req.user,
    };
  }
}
