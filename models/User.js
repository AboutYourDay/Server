const mongoose = require('mongoose');

mongoose.set("useCreateIndex", true);

const UserSchema = new mongoose.Schema({
    uid: {type: String, required: true, unique: true},
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

module.exports = mongoose.model('User', UserSchema);