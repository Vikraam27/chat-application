const routes = (handler) => [
  {
    method: 'POST',
    path: '/room',
    handler: handler.createRoomChatHandler,
  },
];

module.exports = routes;
