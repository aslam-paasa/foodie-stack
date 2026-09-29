import { expressjwt } from 'express-jwt';
import { Request } from 'express';

import { Config } from '../config';
import { AuthCookie, IRefreshTokenPayload } from '../types';
import { RefreshToken } from '../entity/RefreshToken';
import { AppDataSource } from '../config/data-source';
import logger from '../config/logger';

export default expressjwt({
  secret: Config.REFRESH_TOKEN_SECRET!,
  algorithms: ['HS256'],

  getToken(req: Request) {
    const { refreshToken } = req.cookies as AuthCookie;
    return refreshToken;
  },

  async isRevoked(request: Request, token) {
    const payload = token?.payload as IRefreshTokenPayload | undefined;

    try {
      const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);
      const refreshToken = await refreshTokenRepo.findOne({
        where: {
          id: Number(payload?.id),
          user: {
            id: Number(payload?.sub),
          },
        },
      });
      return refreshToken === null;
    } catch (err) {
      logger.error('Error while getting the refresh token', {
        id: payload?.id,
        error: err,
      });
      return true;
    }
  },
});
