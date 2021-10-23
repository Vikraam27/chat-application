class ChatRoomHandler {
  constructor(controllers, validator) {
    this._controllers = controllers;
    this._validator = validator;

    this.createRoomChatHandler = this.createRoomChatHandler.bind(this);
    this.getRoomchatsHandler = this.getRoomchatsHandler.bind(this);
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

  async getRoomchatsHandler(request) {
    const { username } = request.auth.artifacts.decoded.payload;

    const roomChat = await this._controllers.getAllRoomchats(username);

    return {
      status: 'success',
      data: {
        roomChat,
      },
    };
  }
}

module.exports = ChatRoomHandler;
