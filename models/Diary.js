const mongoose = require('mongoose');
const DiarySchema = new mongoose.Schema({
    did: {type:String, required: true, unique: true},
    uid: {type:String, required: true},
    imgURL: String,
    createdAt: Number,
    editedAt: Number,
    text: String,
    emotion: String,
});

DiarySchema.statics.create = function(payload){
    const diary = new this(payload);
    return diary.save();
}

// DiarySchema.statics.findAll = function () {
//     return this.find({});
// };

DiarySchema.statics.findByDid = function(did) {
  return this.findOne({ did });
};

DiarySchema.statics.findByUid = function (uid) {
    return this.find({ uid });
};

DiarySchema.statics.findByEmotion = function(emotion) {
  return this.find({ emotion });
};

DiarySchema.statics.updateByDid = function (did, payload) {
    return this.findOneAndUpdate({ did }, payload, { new: true });
};

// Delete by todoid
DiarySchema.statics.deleteByDid = function (did) {
    return this.remove({ did });
};

module.exports = mongoose.model('Diary', DiarySchema);
