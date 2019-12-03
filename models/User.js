const mongoose = require('mongoose');
const autoInc = require("mongoose-auto-increment");
autoInc.initialize(mongoose.connection);

const UserSchema = new mongoose.Schema({
    did: [String],
    createdAt: {type: Number, required: true},
    lastLogin: Number,
});

UserSchema.statics.create = function(payload) {
  const user = new this(payload);
  return user.save();
};

UserSchema.statics.findByUid = function(uid) {
  return this.find({ uid });
};

UserSchema.statics.updateByUid = function(uid, payload) {
  return this.findOneAndUpdate({ uid }, payload, { new: true });
};

UserSchema.statics.deleteByUid = function(uid) {
  return this.remove({ uid });
};

mongoose.set("useCreateIndex", true);
module.exports = mongoose.model('User', UserSchema);