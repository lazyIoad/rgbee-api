import { Validator, ValidatorArgs, Pojo, ValidationError } from 'objection';
import Joi from '@hapi/joi';
import { extractValidationErrors } from '../../helpers/error-helper';

export default class StoryValidator extends Validator {
  static SCHEMA = Joi.object({
    title: Joi.string().max(100).required().messages({
      'string.max': 'Title cannot be longer than 100 characters',
      'any.required': 'Title is required',
    }),

    url: Joi.string().uri().max(2000).messages({
      'string.uri': 'URL is invalid',
      'string.max': 'URL cannot be longer than 2000 characters',
    }),

    body: Joi.string().max(4000).messages({
      'string.max': 'Text cannot be longer than 4000 characters',
    }),
  })
    .oxor('url', 'body')
    .messages({
      'object.oxor': 'Both URL and text cannot both be present',
    });

  // eslint-disable-next-line class-methods-use-this
  validate(args: ValidatorArgs): Pojo {
    // The model instance (may be empty if new)
    const { model } = args;
    // Newly added properties
    const { json } = args;
    const story = { ...model, ...json };

    const errors = StoryValidator.SCHEMA.validate(story, { abortEarly: false, allowUnknown: true });
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
