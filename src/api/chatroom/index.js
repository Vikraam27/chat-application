const ChatRoomHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'chat-room',
  version: '1.0.0',
  register: async (server, { controllers, validator, chatControllers }) => {
    const chatRoomHandler = new ChatRoomHandler(controllers, validator, chatControllers);
    server.route(routes(chatRoomHandler));
  },
};
