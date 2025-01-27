import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { errors } from 'celebrate';
import { StatusCodes } from 'http-status-codes';

import { NotFoundError } from 'src/errors/not-found.error';
import { errorHandler } from 'src/middleware/error-handler';
import { appConfigFactory } from 'src/config/app';

import { createRouter } from './router';

export type MiddlewareType = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const createApp = async () => {
  const app = express();
  const router = await createRouter();
  const appConfig = appConfigFactory(process.env);

  app.use(cors());
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          scriptSrc: ["'self'", "https: 'unsafe-inline'"],
        },
      },
    }),
  );

  app.use(express.json());

  app.get('/health', (_, res) => {
    res.status(StatusCodes.OK).json({
      status: 'ok',
    });
  });

  app.use('/api', router);
  app.use('*', (_req, _res, next) => next(new NotFoundError('Page not found')));
  app.use(errors());
  app.use(errorHandler);

  return {
    server: app,
    port: appConfig.PORT,
  };
};
