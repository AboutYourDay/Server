const mongoose = require('mongoose');
const autoInc = require("mongoose-auto-increment");
autoInc.initialize(mongoose.connection);

const DiarySchema = new mongoose.Schema({
  _id: { type: String, required: true },
  uid: { type: String, required: true },
  imageURL: { type: String, default: '' },
  textAttr: { type: {
    text: String,
    alignHorizontal: String,
    alignVertical: String,
    fontSize: Number,
    fontWeight: Number,
    italic: Boolean,
    underline: Boolean,
    color: String
  }, required: true },
  emotion: { type: String, required: true },
  createdAt: { type: Number, required: true },
  editedAt: { type: Number, required: true },
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

DiarySchema.plugin(autoInc.plugin, "Diary");
mongoose.set("useCreateIndex", true);

module.exports = mongoose.model('Diary', DiarySchema);
