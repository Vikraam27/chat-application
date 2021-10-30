/* eslint-disable no-new-func */
class ChatRoomHandler {
  constructor(controllers, validator, chatControllers) {
    this._controllers = controllers;
    this._validator = validator;
    this._chatControllers = chatControllers;

    this.createRoomChatHandler = this.createRoomChatHandler.bind(this);
    this.getRoomchatsHandler = this.getRoomchatsHandler.bind(this);
    this.getRoomChatByIdHandler = this.getRoomChatByIdHandler.bind(this);
    this.postMessageHandler = this.postMessageHandler.bind(this);
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
      const message = await this._chatControllers.getAllMessage(roomId);
      const objectStringArray = (new Function(`return [${message}];`)());
      return {
        status: 'success',
        data: {
          roomData: {
            id: roomData.id,
            creator: roomData.creator,
            participant: roomData.participant_username,
            messages: objectStringArray,
          },
        },
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async postMessageHandler(request, h) {
    try {
      this._validator.validateMessagePayload(request.payload);

      const { roomId } = request.params;
      const { sender, message } = request.payload;
      const timestamp = new Date().toISOString();
      const value = JSON.stringify({
        sender,
        message,
        timestamp,
      });
      await this._chatControllers.postMessage(roomId, value);

      const response = h.response({
        status: 'success',
        message: 'successfully send message',
        data: {
          sender,
          message,
          timestamp,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }
}

module.exports = ChatRoomHandler;
