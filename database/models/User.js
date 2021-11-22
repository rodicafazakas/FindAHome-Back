const { Schema, model, Types } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  phoneNumber: {
    type: String,
  },
  favourites: {
    type: [Types.ObjectId],
    ref: 'Announcement',
    default: [],
  },
  adverts: {
    type: [Types.ObjectId],
    ref: 'Announcement',
    default: [],
  },
});

const User = model('User', userSchema);

module.exports = User;
