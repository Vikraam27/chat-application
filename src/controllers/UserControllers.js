const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { hash, compare } = require('bcrypt');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthenticationError = require('../exceptions/AuthenticationError');

class UserControllers {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    await this.verifyUsername(username);

    const userId = `user-${nanoid(10)}`;
    const hashPassword = await hash(password, 10);
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [userId, username, hashPassword, fullname, createdAt],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw InvariantError('Unable to register user');
    }

    return result.rows[0].user_id;
  }

  async getUserById(userId) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('user not found');
    }

    return result.rows[0];
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthenticationError('Invalid username');
    }

    const { user_id: id, password: hashedPassword } = result.rows[0];

    const match = await compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('invalid password');
    }

    return id;
  }

  async verifyUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError('Username already taken');
    }
  }

  async searchUsername({ q }) {
    const query = {
      text: 'SELECT username FROM users WHERE LOWER(username) LIKE \'%\' || $1 || \'%\' LIMIT 10',
      values: [q],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = UserControllers;
