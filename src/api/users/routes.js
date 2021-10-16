const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
  {
    method: 'GET',
    path: '/user',
    handler: handler.getUserByIdHandler,
    options: {
      auth: 'chat_app',
    },
  },
  {
    method: 'GET',
    path: '/username',
    handler: handler.searchUsernameHandler,
    options: {
      auth: 'chat_app',
    },
  },
];

module.exports = routes;
