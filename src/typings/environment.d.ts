import { IUser } from '../models/users/user.interface';

declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    NODE_ENV: string;
    CONNECTION_STRING: string;
    JWT_STRING: string;
  }
}

declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
      cookies: string;
    }
  }
}
