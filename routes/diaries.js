const router = require("express").Router();
const Diary = require("../models/Diary");
const User = require("../models/User");

// get all diaries by id
router.get("/", async (req, res) => {
  const uid = req.query.uid;
  try {
    const result = await Diary.find({uid});
    res.json({success: true, result});
  } catch(e) {
    res.json({success: false, error: e});
  }
});
router.get("/:id", async (req, res) => {
  const uid = req.query.uid;
  try {
    const result = await Diary.find({uid, _id: req.params.id});
    if (result.length === 0) {
      res.json({ success: false, message: 'Diary not found' });
    } else {
      res.json({ success: true, result: result[0] });
    }
  } catch(e) {
    res.json({success: false, error: e});
  }
})

// Create Diary document
router.post("/", async (req, res) => {
  const time = new Date().getTime();
  console.log(req.body);
  try {
    const data = await Diary.create({
      uid: req.body.uid,
      imageURL: req.body.imageURL,
      textAttr: req.body.textAttr,
      emotion: req.body.emotion,
      createdAt: time,
      editedAt: time,
    });
    const result = await data.save();
    res.json({ success: true, result });
  } catch(e) {
    console.log(e);
    res.status(500).json({ success: false, error: e});
  }
});

// Update Dirary by did
router.put("/:did", async (req, res) => {
  try {
    const result = await Diary.findOneAndUpdate({ _id: req.params.did }, {
        imageURL: req.body.imageURL,
        textAttr: req.body.textAttr,
        emotion: req.body.emotion,
        editedAt: new Date().getTime()
      });
    if (!result) {
      res.json({ success: false, message: 'Diary not found' });
      return;
    }
    res.json({success: true});
  } catch(e) {
    res.json({success: false, error: e});
  }
});

// Delete Diary by did

router.delete("/:did", async (req, res) => {
  try {
    const result = await Diary.findOneAndDelete({_id: req.params.did});
    if (!result) {
      res.json({success: false, message: "Diary not found"});
      return;
    }
    // TODO
    // user의 dids 에서 제거
    // test 필요!
    const userData = await User.findOne();
    const updatedDids = userData.dids.filter((d) => d !== req.params.did);
    await User.update({uid: userData.uid}, {dids: updatedDids});
    res.json({success: true});
  } catch(e) {
    res.json({success: false, error: e.message});
  }
});

module.exports = router;
