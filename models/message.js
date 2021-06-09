const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: String,
  content: String,
  timestamp: Date,
  message_owner: { type: Schema.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Message', MessageSchema);
