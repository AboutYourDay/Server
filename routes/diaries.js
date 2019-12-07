const router = require("express").Router();
const Diary = require("../models/Diary");
const User = require("../models/User");

// get all diaries
router.get("/", async (req, res) => {
  const uid = req.query.uid;

  const page = req.query.page ? parseInt(req.query.page) : null;
  const count = req.query.count ? parseInt(req.query.count) : null;
  const time = req.query.time ? parseInt(req.query.time) : null;
  const days = req.query.days ? parseInt(req.query.days) : null;
  let result = null;
  try {
    //해당 uid의 user가 diary를 하나도 가지고 있지 않을 때
    if(!uid){
      return res.json({success:false, error: "Please write uid by query parameter"});
    }
    const countByUid = await Diary.count({ uid: uid });
    if (!countByUid) {
      return res.json({
        success: false,
        error: "User doesn't have any diaries"
      });
    }

    if (uid && !count && !page && !time && !days) {
      result = await Diary.find({ uid: uid });
    }
    // query로 받은 time을 시작점으로 기간 days에 대한 모든 다이어리를 페이지마다 넘겨준다
    // /diary?page=1&time=1575431613&days=10&count=10
    else if (uid && page && count && time && days) {
      result = await Diary.find({
        uid: uid,
        createdAt: { $gte: time, $lte: time + days * 24 * 60 * 60 * 1000 }
      })
        // 다이어리가 만들어진 날짜 기준으로 내림차순
        .sort({ createdAt: -1 })
        .skip(count * page - count)
        .limit(count);
    }

    // query parameter로 time과 days가 없을 때 모든 다이어리를 페이지마다 넘겨준다
    // /diary?page=1&count=10
    else if (uid && page && count && !time && !days) {
      result = await Diary.find({
        uid: uid
      })
        // 다이어리가 만들어진 날짜 기준으로 내림차순
        .sort({ createdAt: -1 })
        .skip(count * page - count)
        .limit(count);
    }

    res.json({ success: true, result });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});

router.get("/:did", async (req, res) => {
  // /diary/3?uid=1
  const uid = req.query.uid;
  try {
    // users collection에 해당 uid가 있는지 확인한다
    const isThereUser = await User.findOne({ uid: uid });
    if (!isThereUser) {
      return res.json({ success: false, error: "User not found" });
    }
    const result = await Diary.findOne({ uid: uid, _id: req.params.did });
    if (!result) {
      return res.json({ success: false, message: "Diary not found" });
    }
    res.json({ success: true, result });
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

    // User collecion에도 반영해준다.
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
      return res.json({ success: false, error: "Diary not found" });
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
      return res.json({ success: false, error: "Diary not found" });
    }

    // User collecion에도 반영해준다.
    await User.update({ uid: result.uid }, { $pull: { dids: req.params.did } });
    res.json({ success: true });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});

module.exports = router;
