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

  setRoom(key, value) {
    return new Promise((resolve, reject) => {
      this._client.set(key, value, (error, ok) => {
        if (error) {
          return reject(error);
        }

        return resolve(ok);
      });
    });
  }

  async getRoom(key) {
    return new Promise((resolve, reject) => {
      this._client.get(key, (error, reply) => {
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
