const routes = (handler) => [
  {
    method: 'POST',
    path: '/room',
    handler: handler.createRoomChatHandler,
    options: {
      auth: 'chat_app',
    },
  },
];

module.exports = routes;
