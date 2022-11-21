import 'reflect-metadata';
import AuthController from './api/auth/auth.controller';
import App from './app';

const app = new App([new AuthController()]);
app.listen();
