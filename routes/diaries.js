const router = require("express").Router();
const Diary = require("../models/Diary");
const User = require("../models/User");

// get all diaries
router.get("/", async (req, res) => {
  const uid = req.query.uid;
  const page = req.query.page || 1;
  const restPerPage = 9;

  try {
    const result = await Diary.find({ uid: uid })
      .skip(restPerPage * page - restPerPage)
      .limit(restPerPage);
    const numOfProducts = await Diary.count({ uid: uid });
    res.json({
      success: true,
      currentPage: page,
      pages: Math.ceil(numOfProducts / restPerPage),
      foundDiaries: result,
      numOfDiaries: numOfProducts
    });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await Diary.findOne({_id: req.params.id });
    if (!result) {
      return res.json({
          success: false,
          message: "Diary not found"
      });
    }
    res.json({ success: true, result: result });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});

// Create Diary document
router.post("/", async (req, res) => {
  try {
    const isThereUser = await User.findOne({ uid: req.body.uid });
    if (!isThereUser) {
      return res.json({ success: false, error: "User not found" });
    }
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
      return res.json({ success: false, message: "Diary not found" });
    }
    await User.update({ uid: result.uid }, { $pull: { dids: req.params.did } });
    res.json({ success: true });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});

module.exports = router;
