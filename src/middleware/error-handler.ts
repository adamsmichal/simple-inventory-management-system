import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '../errors/app.error';
import { HttpError } from '../errors/http.error';
import { BadRequestError } from '../errors/bad-request.error';

export enum ErrorCode {
  VALIDATION_PARSE = 'error.validation.parse',
  HTTP = 'error.http',
  APP = 'error.app',
  UNKNOWN = 'error.unknown',
}

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  switch (true) {
    case err instanceof BadRequestError:
      res.status((err as BadRequestError).status).json({
        error: { code: 'error.bad_request', message: err.message },
      });
      break;
    case err instanceof HttpError:
      res.status(err.status).json({
        error: { code: ErrorCode.HTTP, message: err.message },
      });
      break;

    case err instanceof AppError:
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: { code: ErrorCode.APP, message: err.message },
      });
      break;

    default:
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: { code: ErrorCode.UNKNOWN },
      });
      break;
  }
};
