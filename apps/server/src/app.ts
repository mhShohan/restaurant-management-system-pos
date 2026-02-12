import { config } from '@config';
import { ApiResponse } from '@lib/ApiResponse';
import globalErrorHandler from '@middleware/globalErrorHandler';
import rootRouter from '@routes/index';
import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security HTTP headers
    this.app.use(helmet());

    // CORS
    this.app.use(
      cors({
        origin: config.CORS_ORIGIN,
        credentials: true,
      })
    );

    // Body parser
    this.app.use(express.json({ limit: '100kb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '100kb' }));

    // Request compression
    this.app.use(compression());

    // Development logging
    if (config.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }
  }

  private initializeRoutes(): void {
    // health check route
    this.app.get('/health', (_req, res) => {
      ApiResponse.success(res, {
        statusCode: 200,
        message: 'Server is healthy!',
        data: null,
      });
    });

    // API routes
    this.app.use('/api/v1', rootRouter);
  }

  private initializeErrorHandling(): void {
    this.app.use(globalErrorHandler);
  }
}

export default new App().app;
