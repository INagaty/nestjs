/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UsersService } from 'src/users/providers/users.service';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfigurtion: ConfigType<typeof jwtConfig>,

    private readonly generateTokensProvider: GenerateTokensProvider,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}
  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    //verify the refresh token
    try {
      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'>
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfigurtion.secret,
        audience: this.jwtConfigurtion.audience,
        issuer: this.jwtConfigurtion.issuer,
      });
      //Fetch User from database
      const user = await this.usersService.findOneById(sub);

      //Generate Tokens
      return await this.generateTokensProvider.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException(error, {
        description: 'Invalid refresh token',
      });
    }
  }
}
