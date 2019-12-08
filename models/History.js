const mongoose = require("mongoose");
const autoInc = require("mongoose-auto-increment");
autoInc.initialize(mongoose.connection);

const HistorySchema = new mongoose.Schema({
  uid: { type: String, required: true },
  did: { type: String, required: true },
  historyAt: { type: Number, required: true },
  type: { type: String, required: true }
});

HistorySchema.plugin(autoInc.plugin, "History");
mongoose.set("useCreateIndex", true);

module.exports = mongoose.model("History", HistorySchema);
