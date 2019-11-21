const mongoose = require('mongoose');

mongoose.set("useCreateIndex", true);

const UserSchema = new mongoose.Schema({
    uid: {type: String, required: true, unique: true},
    did: [String],
    createdAt: {type: Number, required: true},
    lastLogin: Number,
});


module.exports = mongoose.model('User', UserSchema);