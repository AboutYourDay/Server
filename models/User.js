const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  uid: { type: String },
  dids: { type: [String], default: [] },
  imageURLs: { type: [String], default: []}
});

mongoose.set("useCreateIndex", true);
module.exports = mongoose.model('User', UserSchema);