import { ValidatorArgs, ValidationError } from 'objection';
import UserValidator from '../../../../src/v1/validators/user-validator';
import User from '../../../../src/v1/models/user-model';

describe('user-validator', () => {
  let user: { email: string; username: string; password: string; about: string | undefined };
  let args: ValidatorArgs;
  const validator = new UserValidator();

  beforeEach(() => {
    user = {
      email: 'test@example.com',
      username: 'testuser',
      password: 't35tp4ssw0rd1sc0mplic4ted',
      about: 'Test user about section',
    };

    args = {
      ctx: {},
      model: new User(),
      options: {},
      json: user,
    };
  });

  test('a valid user passes all checks on create', () => {
    expect(validator.validate(args)).toEqual(user);
  });

  test('an invalid email fails', () => {
    user.email = 'test.com';

    expect(() => validator.validate(args)).toThrow(
      new ValidationError({
        type: 'ModelValidation',
        data: [
          {
            field: 'email',
            message: 'Email is invalid',
          },
        ],
      }),
    );
  });

  test('a too long email fails', () => {
    user.email = `${'a'.repeat(65)}@test.com`;

    expect(() => validator.validate(args)).toThrow(
      new ValidationError({
        type: 'ModelValidation',
        data: [
          {
            field: 'email',
            message: 'Email is invalid',
          },
        ],
      }),
    );
  });

  test('a missing email fails', () => {
    delete user.email;

    expect(() => validator.validate(args)).toThrow(
      new ValidationError({
        type: 'ModelValidation',
        data: [
          {
            field: 'email',
            message: 'Email is required',
          },
        ],
      }),
    );
  });
});
