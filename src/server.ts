import 'reflect-metadata';
import AuthController from './api/auth/auth.controller';
import GroupController from './api/group/group.controller';
import App from './app';

const app = new App([new AuthController(), new GroupController()]);
app.listen();
