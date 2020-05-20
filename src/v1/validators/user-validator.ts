import { Validator, ValidatorArgs, Pojo, ValidationError } from 'objection';
import Joi, { CustomHelpers } from '@hapi/joi';
import zxcvbn from 'zxcvbn';
import { extractValidationErrors } from '../../helpers/error-helper';

export default class UserValidator extends Validator {
  static SCHEMA = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email is invalid',
      'any.required': 'Email is required',
    }),

    username: Joi.string()
      .min(1)
      .max(20)
      .pattern(new RegExp('^[a-zA-Z_][a-zA-Z0-9_]*$'))
      .required()
      .messages({
        'string.pattern.base': 'Username is invalid',
        'string.min': 'Username must be between 1-20 characters long',
        'string.max': 'Username must be between 1-20 characters long',
        'any.required': 'Username is required',
      }),

    about: Joi.string().max(400).messages({
      'string.max': 'About cannot be longer than 400 characters',
    }),

    password: Joi.string()
      .custom((value: string, helpers: CustomHelpers) => {
        if (!UserValidator.isPasswordStrong(value)) {
          return helpers.error('password.strength');
        }
        return value;
      }, 'password strength')
      .messages({
        'password.strength': 'Password is too weak',
      }),
  });

  static isPasswordStrong(password: string): boolean {
    const strength = zxcvbn(password);
    return strength.score >= 2;
  }

  // eslint-disable-next-line class-methods-use-this
  validate(args: ValidatorArgs): Pojo {
    // The model instance (may be empty if new)
    const { model } = args;
    // Newly added properties
    const { json } = args;
    const user = { ...model, ...json };

    const errors = UserValidator.SCHEMA.validate(user, { abortEarly: false });
    const errorDetails = errors.error?.details || [];

    if (errorDetails.length) {
      throw new ValidationError({
        data: extractValidationErrors(errorDetails),
        type: 'ModelValidation',
      });
    }

    return json;
  }
}
