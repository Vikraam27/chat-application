const Joi = require('joi');

const ChatRoomModels = Joi.object({
  username: Joi.string().required(),
  participant: Joi.string().required(),
});

module.exports = { ChatRoomModels };
