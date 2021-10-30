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
- ## Usage

Add your application configuration to your `.env` file in the root of your project:

```shell
S3_BUCKET=YOURS3BUCKET
SECRET_KEY=YOURSECRETKEYGOESHERE
```
- `npm start` to start the local server
- The API is available at `http://localhost:8080/api`
