// eslint-disable-next-line max-classes-per-file
import {
  ValidationError,
  NotFoundError,
  UniqueViolationError,
  NotNullViolationError,
  ForeignKeyViolationError,
  CheckViolationError,
  DataError,
  ErrorHash,
} from 'objection';
import { Context, Next } from 'koa';
import { logger } from './logger-helper';

export class UnauthorizedError extends Error {}

export class BadRequestError extends Error {}

const getValidationErrors = (data: ErrorHash): { field: string; messages: string[] }[] => {
  return Object.entries(data).map(([field, errors]) => ({
    field,
    messages: errors.map((error) => `Field ${error.message}`),
  }));
};

const errorHelper = (err: Error, ctx: Context): void => {
  logger.error(err.message);
  if (err instanceof ValidationError) {
    switch (err.type) {
      case 'ModelValidation':
        ctx.status = 400;
        ctx.body = {
          message: 'Validation failed.',
          errors: getValidationErrors(err.data),
        };
        break;
      default:
        ctx.status = 400;
        ctx.body = {
          message: 'Validation failed.',
        };
        break;
    }
  } else if (err instanceof NotFoundError) {
    ctx.status = 404;
    ctx.body = {
      message: 'Could not find the requested resource.',
    };
  } else if (
    err instanceof UniqueViolationError ||
    err instanceof NotNullViolationError ||
    err instanceof ForeignKeyViolationError ||
    err instanceof CheckViolationError ||
    err instanceof DataError ||
    err instanceof BadRequestError
  ) {
    ctx.status = 400;
    ctx.body = {
      message: 'Invalid request.',
    };
  } else if (err instanceof UnauthorizedError) {
    ctx.status = 401;
    ctx.body = {
      message: err.message || 'Unauthorized access',
    };
  } else {
    ctx.status = 500;
    ctx.body = {
      message: 'There was an internal error. Please try again.',
    };
  }
};

export default async function errorHandler(ctx: Context, next: Next): Promise<void> {
  try {
    await next();
  } catch (err) {
    errorHelper(err, ctx);
  }
}
