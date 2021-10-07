const InvariantError = require('../../exceptions/InvariantError');
const { UserPayloadModels } = require('./models');

const UserValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadModels.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UserValidator;
