require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// user
const users = require('./api/users');
const UserControllers = require('./controllers/UserControllers');
const UserValidator = require('./validator/users');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsControllers = require('./controllers/AuthenticationsControllers');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// chat room
const ChatControllers = require('./controllers/redis/ChatControllers');
const chatRoom = require('./api/chatroom');
const ChatRoomControllers = require('./controllers/ChatRoomControllers');
const ChatRoomValidator = require('./validator/chatroom');

// error handler
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const chatControllers = new ChatControllers();
  const userControllers = new UserControllers();
  const authenticationsControllers = new AuthenticationsControllers();
  const chatRoomControllers = new ChatRoomControllers(chatControllers);

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // register external plugin
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // jwt proctected routes
  server.auth.strategy('chat_app', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });
  await server.register([
    {
      plugin: users,
      options: {
        controllers: userControllers,
        validator: UserValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsControllers,
        userControllers,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: chatRoom,
      options: {
        controllers: chatRoomControllers,
        validator: ChatRoomValidator,
        chatControllers,
      },
    },
  ]);

  await server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const ClientErrorResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      ClientErrorResponse.code(response.statusCode);
      return ClientErrorResponse;
    }

    const serverError = h.response({
      status: 'error',
      message: 'sorry server is down',
    });
    serverError.code(500);
    return response.continue || response;
  });

  await server.start();
  console.log(`server running on ${server.info.uri}`);
};

init();
