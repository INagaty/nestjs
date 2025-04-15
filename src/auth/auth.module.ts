import { ConfigModule } from '@nestjs/config';
import { Module, forwardRef } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { BcryptProvider } from './providers/bcrypt.provider';
import { HashingProvider } from './providers/hashing.provider';
import { JwtModule } from '@nestjs/jwt';
import { SignInProvider } from './providers/sign-in.provider';
import { UsersModule } from 'src/users/users.module';
import jwtConfig from './config/jwt.config';
import { AccessTokenGuard } from './guards/access-token/access-token.guard';
@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenGuard, // ✅ Add it here
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    SignInProvider,
  ],
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  exports: [AuthService, HashingProvider, JwtModule, AccessTokenGuard], // ✅ Export it here
})
export class AuthModule {}
