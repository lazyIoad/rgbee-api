import { Validator, ValidatorArgs, Pojo, ValidationError } from 'objection';
import Joi from '@hapi/joi';
import { extractValidationErrors } from '../../helpers/error-helper';

export default class StoryValidator extends Validator {
  static SCHEMA = Joi.object({
    title: Joi.string().min(5).max(100).required().messages({
      'string.min': 'Must be at least 5 characters long',
      'string.max': 'Must be at most 100 characters long',
      'any.required': 'Field is required',
    }),

    url: Joi.string().uri().max(2000).messages({
      'string.uri': 'URL is invalid',
      'string.max': 'Must be at most 2000 characters long',
    }),

    body: Joi.string().max(4000).messages({
      'string.max': 'Must be at most 4000 characters long',
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
