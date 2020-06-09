const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'Помилка з отриманням ID'],
    unique: true,
    match: [
      /\b\d{7}\b|\b\d{8}\b|\b\d{9}\b|\b\d{10}\b/,
      'Помилка з отриманням ID',
    ],
  },
  userName: {
    type: String,
    required: [true, "Ім'я обов'язкове"],
    unique: true,
  },
});

module.exports = mongoose.model('User', UserSchema);
