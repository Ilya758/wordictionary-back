import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { connect } from 'mongoose';
import { IController } from './models/IController';
import errorMiddleware from './middlewares/error.middleware';
import { DEFAULT_PORT } from './common/enums/defaultPort';
import * as config from './config';

const {
  default: { connectionString, nodeEnv, port },
} = config;

export default class App {
  private app: express.Application;

  constructor(controllers: IController[]) {
    this.app = express();

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares = (): void => {
    if (nodeEnv !== 'prod') {
      this.app.use(morgan('dev'));
    }

    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.app.use(compression());
    this.app.use(cors());
  };

  private initializeControllers = (controllers: IController[]): void => {
    controllers.forEach(({ router }) => {
      this.app.use('/', router);
    });
  };

  private initializeErrorHandling = (): void => {
    this.app.use(errorMiddleware);
  };

  private connectToTheDatabase = (): void => {
    if (connectionString)
      connect(connectionString).catch((err: Error) => {
        console.error(err.stack);
        process.exit(1);
      });
  };

  public listen = (): void => {
    this.app.listen(port, () => {
      console.log(`Application was running on port ${port || DEFAULT_PORT}`);
    });
  };
}
