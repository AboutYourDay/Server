const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  dids: { type: [String], required: true }
});

mongoose.set("useCreateIndex", true);
module.exports = mongoose.model('User', UserSchema);