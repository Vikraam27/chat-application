# ![Node/Hapi.JS/PostgreSQL/Redis chat app](hapi(1).svg) Chat application using Hapi.js

# Getting started

## Install Node

Install [Node.JS LTS version](https://nodejs.org/en/download/) 

## To get the Node server running locally

- Clone this repo
- `cd /path/where/your/cloned/the/repo`
- `npm install` to install all required dependencies
- Install PostgreSQL ([instructions](https://www.postgresql.org/download/)) and run it by executing `systemctl start postgresql`
- Install Redis Stable version ([instructions](https://redis.io/download)) and run it by executing `redis-cli`
- create .env file
- Add your application configuration to your `.env` file in the root of your project:

```shell
# server configuration
HOST=localhost
PORT=5000
 
# node-postgres configuration
PGUSER=<userdb>
PGHOST=localhost
PGPASSWORD=<userpassword>
PGDATABASE=chatapp
PGPORT=5432

# JWT token
ACCESS_TOKEN_KEY=<your secret access Token>
REFRESH_TOKEN_KEY=<your secret refresh token Token>
ACCESS_TOKEN_AGE=<token age >

# Redis
REDIS_SERVER=localhost
```
- `npm run start` to start the local server with nodemon
- The API is available at `http://localhost:5000`

## Dependencies

- [hapijs](https://github.com/hapijs/hapi) - The server for handling and routing HTTP requests
- [hapi-auth-jwt2](https://github.com/dwyl/hapi-auth-jwt2) - Plugin for validating JWTs for authentication
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - For generating JWTs used by authentication
- [mongoose](https://github.com/Automattic/mongoose) - For modeling and mapping MongoDB data to javascript 
- [mongoose-unique-validator](https://github.com/blakehaswell/mongoose-unique-validator) - For handling unique validation errors in Mongoose. Mongoose only handles validation at the document level, so a unique index across a collection will throw an exception at the driver level. The `mongoose-unique-validator` plugin helps us by formatting the error like a normal mongoose `ValidationError`.
- [slug](https://github.com/dodo/node-slug) - For encoding titles into a URL-friendly format
