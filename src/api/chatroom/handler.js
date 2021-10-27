class ChatRoomHandler {
  constructor(controllers, validator, chatControllers) {
    this._controllers = controllers;
    this._validator = validator;
    this._chatControllers = chatControllers;

    this.createRoomChatHandler = this.createRoomChatHandler.bind(this);
    this.getRoomchatsHandler = this.getRoomchatsHandler.bind(this);
    this.getRoomChatByIdHandler = this.getRoomChatByIdHandler.bind(this);
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
    try {
      const { username } = request.auth.artifacts.decoded.payload;

      const roomChat = await this._controllers.getAllRoomchats(username);

      return {
        status: 'success',
        data: {
          roomChat,
        },
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getRoomChatByIdHandler(request) {
    try {
      const { roomId } = request.params;
      const roomData = await this._controllers.getRoomChatById(roomId);

      return {
        status: 'success',
        data: {
          roomData,
        },
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = ChatRoomHandler;
