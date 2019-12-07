const mongoose = require('mongoose');
const autoInc = require("mongoose-auto-increment");
autoInc.initialize(mongoose.connection);

const DiarySchema = new mongoose.Schema({
  uid: { type: String, required: true },
  imageAttr: {
    width: Number,
    height: Number,
    imageURL: { type: String, default: '' }
  },
  textAttr: {
    type: {
      text: String,
      alignHorizontal: String,
      alignVertical: String,
      fontSize: Number,
      fontWeight: Number,
      italic: Boolean,
      underline: Boolean,
      color: String
    },
    required: true
  },
  emotion: { type: String, required: true },
  createdAt: { type: Number, required: true },
  editedAt: { type: Number, required: true }
});

DiarySchema.plugin(autoInc.plugin, "Diary");
mongoose.set("useCreateIndex", true);

module.exports = mongoose.model('Diary', DiarySchema);
