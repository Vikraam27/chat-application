/* eslint-disable max-len */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');

class ChatRoomControllers {
  constructor() {
    this._pool = new Pool();
  }

  async verifyRoomChat(usernameCreator, usernameParticipant) {
    const query = {
      text: `SELECT chat_room.id, chat_room.creator, room_participant.participant_username FROM chat_room
      LEFT JOIN room_participant ON room_participant.room_id = chat_room.id
      WHERE room_participant.participant_username = $1 AND chat_room.creator = $2 OR room_participant.participant_username = $2 AND chat_room.creator = $1`,
      values: [usernameParticipant, usernameCreator],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async creatRoomChat(usernameCreator, usernameParticipant) {
    const id = `room-${nanoid(10)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO chat_room VALUES ($1, $2, $3) RETURNING id',
      values: [id, usernameCreator, createdAt],
    };

    const roomId = await this._pool.query(query);

    if (!roomId.rowCount) {
      throw new InvariantError('unable to create room');
    }

    const queryToParticipant = {
      text: 'INSERT INTO room_participant VALUES ($1, $2) RETURNING room_id',
      values: [roomId.rows[0].id, usernameParticipant],
    };
    const roomIds = await this._pool.query(queryToParticipant);
    if (!roomIds.rowCount) {
      throw new InvariantError('unable to join room');
    }

    return roomIds.rows[0].room_id;
  }
}

module.exports = ChatRoomControllers;
