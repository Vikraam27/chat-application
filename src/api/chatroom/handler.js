class ChatRoomHandler {
  constructor(controllers, validator) {
    this._controllers = controllers;
    this._validator = validator;

    this.createRoomChatHandler = this.createRoomChatHandler.bind(this);
  }

  async createRoomChatHandler(request, h) {
    try {
      await this._validator.validateChatRoomPayload(request.payload);

      const { username, participant } = request.payload;
      const verifyRoomChat = await this._controllers.verifyRoomChat(username, participant);

      if (verifyRoomChat) {
        return {
          status: 'success',
          message: 'room already created',
          data: {
            roomId: verifyRoomChat.id,
          },
        };
      }
      const roomId = await this._controllers.createRoomChat(username, participant);
      const response = h.response({
        status: 'success',
        message: 'successfully create chat room',
        data: {
          roomId,
        },
      });

      response.code(201);
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

module.exports = ChatRoomHandler;
