const router = require("express").Router();
const Diary = require("../models/Diary");
const User = require("../models/User");

// get all diaries
router.get("/", async (req, res) => {
  const uid = req.query.uid;
  try {
    const result = await Diary.find({ uid });
    res.json({ success: true, result });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});

// Create Diary document
router.post("/", async (req, res) => {
  try {
    if(User.find({uid: req.body.uid})){
      const time = new Date().getTime();
      const data = await Diary.create({
        uid: req.body.uid,
        imageURL: req.body.imageURL,
        textAttr: req.body.textAttr,
        emotion: req.body.emotion,
        createdAt: time,
        editedAt: 0
      });
      const result = await data.save();
      await User.update({ uid: req.body.uid }, { $push: { dids: result._id } });
      res.json({ success: true, result });
    }
    else{
      res.json({success:false, error: "User not found"})
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Update Dirary by did
router.put("/:did", async (req, res) => {
  try {
    const result = await Diary.findOneAndUpdate(
      { _id: req.params.did },
      {
        imageURL: req.body.imageURL,
        textAttr: req.body.textAttr,
        emotion: req.body.emotion,
        editedAt: new Date().getTime()
      }
    );
    if (!result) {
      return res.json({ success: false, message: "Diary not found" });
    }
    res.json({ success: true });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});

// Delete Diary by did

router.delete("/:did", async (req, res) => {
  try {
    const result = await Diary.findOneAndDelete({ _id: req.params.did });
    if (!result) {
      res.json({ success: false, message: "Diary not found" });
    }
    else{
      await User.update({ uid: result.uid }, { $pull: { dids: req.params.did } });
      res.json({ success: true });
    }
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});

module.exports = router;
