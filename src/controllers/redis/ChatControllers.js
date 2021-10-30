const redis = require('redis');

class ChatControllers {
  constructor() {
    this._client = redis.createClient({
      host: process.env.REDIS_SERVER,
    });

    this._client.on('error', (error) => {
      throw error;
    });
  }

  async postMessage(key, value) {
    return new Promise((resolve, reject) => {
      this._client.rpush(key, value, (error, ok) => {
        if (error) {
          return reject(error);
        }

        return resolve(ok);
      });
    });
  }

  async getAllMessage(key) {
    return new Promise((resolve, reject) => {
      this._client.lrange(key, 0, -1, (error, reply) => {
        if (error) {
          return reject(error);
        }

        if (reply === null) {
          return reject(new Error('room id not found'));
        }

        return resolve(reply.toString());
      });
    });
  }
}

module.exports = ChatControllers;
