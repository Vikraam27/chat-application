class UserHandler {
  constructor(controllers, validator) {
    this._controllers = controllers;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
  }

  async postUserHandler(request, h) {
    try {
      this._validator.validateUserPayload(request.payload);
      const { username, password, fullname } = request.payload;

      const userId = await this._controllers.addUser({ username, password, fullname });

      const response = h.response({
        status: 'success',
        message: 'successfully registered user',
        data: {
          userId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getUserByIdHandler(request) {
    try {
      const { id } = request.auth.credentials;

      const userData = await this._controllers.getUserById(id);

      return {
        status: 'success',
        data: {
          userData,
        },
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

module.exports = UserHandler;
