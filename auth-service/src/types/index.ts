import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface RegisterUserRequest extends Request {
  body: UserData;
}

export interface AuthRequest extends Request {
  auth: {
    sub: string;
    role: number;
    id?: string;
  };
}

export type AuthCookie = {
  accessToken: string;
  refreshToken: string;
};

export interface IRefreshTokenPayload extends JwtPayload {
  id: string;
}
