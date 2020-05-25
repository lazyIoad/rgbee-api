// eslint-disable-next-line max-classes-per-file
import {
  ValidationError,
  NotFoundError,
  UniqueViolationError,
  NotNullViolationError,
  ForeignKeyViolationError,
  CheckViolationError,
  DataError,
} from 'objection';
import { Context, Next } from 'koa';
import { ValidationErrorItem } from '@hapi/joi';
import { logger } from './logger-helper';

export class UnauthorizedError extends Error {}

export class BadRequestError extends Error {}

export class UnknownError extends Error {}

export const ERROR_TYPES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
};

const UNIQUE_CONSTRAINT_TABLE_COLUMN_TO_ERROR_DATA_MAPPINGS = new Map([
  [
    'users',
    new Map([
      [
        'email',
        {
          message: 'Email is already in use',
          field: 'email',
        },
      ],
      [
        'username',
        {
          message: 'Username is already in use',
          field: 'username',
        },
      ],
    ]),
  ],
]);

const getUniqueConstraintViolationErrorData = (
  table: string,
  field: string,
): { message: string; field: string } | undefined => {
  return UNIQUE_CONSTRAINT_TABLE_COLUMN_TO_ERROR_DATA_MAPPINGS.get(table)?.get(field);
};

export const extractValidationErrors = (
  errors: ValidationErrorItem[],
): { message: string; field: string }[] => {
  return errors.flatMap((err) => {
    if (err.type === 'object.oxor') {
      return err.context?.peers.map((peer: string) => ({
        message: err.message,
        field: peer,
      }));
    }
    return {
      message: err.message,
      field: err.path.join('.'),
    };
  });
};

const errorHelper = (err: Error, ctx: Context): void => {
  logger.error(err);
  if (err instanceof ValidationError) {
    switch (err.type) {
      case 'ModelValidation':
        ctx.status = 400;
        ctx.body = {
          type: ERROR_TYPES.VALIDATION_ERROR,
          message: 'Validation failed.',
          errors: err.data,
        };
        break;
      default:
        ctx.status = 400;
        ctx.body = {
          type: ERROR_TYPES.VALIDATION_ERROR,
          message: 'Validation failed.',
        };
        break;
    }
  } else if (err instanceof NotFoundError) {
    ctx.status = 404;
    ctx.body = {
      message: 'Could not find the requested resource.',
    };
  } else if (err instanceof UniqueViolationError) {
    const errorData = getUniqueConstraintViolationErrorData(err.table, err.columns[0]);

    ctx.status = 400;
    ctx.body = {
      type: ERROR_TYPES.VALIDATION_ERROR,
      message: 'Invalid request.',
    };

    if (errorData) {
      ctx.body.errors = [errorData];
    }
  } else if (
    err instanceof NotNullViolationError ||
    err instanceof ForeignKeyViolationError ||
    err instanceof CheckViolationError ||
    err instanceof DataError
  ) {
    ctx.status = 400;
    ctx.body = {
      type: ERROR_TYPES.VALIDATION_ERROR,
      message: 'Invalid request.',
    };
  } else if (err instanceof BadRequestError) {
    ctx.status = 400;
    ctx.body = {
      type: ERROR_TYPES.VALIDATION_ERROR,
      message: err.message || 'Invalid request.',
    };
  } else if (err instanceof UnauthorizedError) {
    ctx.status = 401;
    ctx.body = {
      type: ERROR_TYPES.AUTHENTICATION_ERROR,
      message: err.message || 'Unauthorized access.',
    };
  } else {
    ctx.status = 500;
    ctx.body = {
      type: ERROR_TYPES.SERVER_ERROR,
      message: 'There was an internal error. Please try again later.',
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
