import { Validator, ValidatorArgs, Pojo, ValidationError } from 'objection';
import Joi from '@hapi/joi';
import { extractValidationErrors } from '../../helpers/error-helper';

export default class CommentValidator extends Validator {
  static SCHEMA = Joi.object({
    body: Joi.string()
      .max(4000)
      .when('parentId', { is: Joi.exist(), then: Joi.required() })
      .messages({
        'string.max': 'Text cannot be longer than 4000 characters',
        'any.required': 'Text is required',
      }),
  });

  // eslint-disable-next-line class-methods-use-this
  validate(args: ValidatorArgs): Pojo {
    // The model instance (may be empty if new)
    const { model } = args;
    // Newly added properties
    const { json } = args;
    const story = { ...model, ...json };

    const errors = CommentValidator.SCHEMA.validate(story, {
      abortEarly: false,
      allowUnknown: true,
    });
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
