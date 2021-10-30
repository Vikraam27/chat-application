const routes = (handler) => [
  {
    method: 'POST',
    path: '/room',
    handler: handler.createRoomChatHandler,
    options: {
      auth: 'chat_app',
    },
  },
  {
    method: 'GET',
    path: '/room',
    handler: handler.getRoomchatsHandler,
    options: {
      auth: 'chat_app',
    },
  },
  {
    method: 'GET',
    path: '/room/{roomId}',
    handler: handler.getRoomChatByIdHandler,
    options: {
      auth: 'chat_app',
    },
  },
  {
    method: 'POST',
    path: '/room/{roomId}/message',
    handler: handler.postMessageHandler,
    options: {
      auth: 'chat_app',
    },
  },
];

module.exports = routes;
