const router = require("express").Router();
const History = require("../models/Diary");
const User = require("../models/User");

// get all history
router.get("/", async (req, res) => {
  const uid = req.query.uid;
  const page = req.query.page ? parseInt(req.query.page) : null;
  const count = req.query.count ? parseInt(req.query.count) : null;
  const time = req.query.time ? parseInt(req.query.time) : null;
  const days = req.query.days ? parseInt(req.query.days) : null;

  let result = null;
  try {
        //해당 uid의 user가 diary를 하나도 가지고 있지 않을 때
        if (!uid) {
          return res.json({
            success: false,
            error: "Please write uid by query parameter"
          });
        }
        const countByUid = await History.countDocuments({ uid: uid });
        if (!countByUid) {
          return res.json({
            success: false,
            error: "User doesn't have any history"
          });
        }
        // query parameter로 time과 days가 있을 때 모든 히스토리를 넘겨준다
        // /history?uid=1
        if (uid && !count && !page && !time && !days) {
          result = await History.find({ uid: uid });
        }
        // query parameter로 page와 count가 있을 때 히스토리를 페이지마다 넘겨준다
        // /history?uid=1&page=1&count=10
        else if (uid && page && count && !time && !days) {
          result = await History.find({
            uid: uid
          })
            // 히스토리가 만들어진 날짜 기준으로 내림차순
            .sort({ writtenAt: -1 })
            .skip(count * page - count)
            .limit(count);
        }
        // query로 받은 time을 시작점으로 기간 days에 대한 모든 히스토리를 페이지마다 넘겨준다
        // /history?page=1&time=1575431613&days=10&count=10
        else if (uid && page && count && time && days) {
          result = await History.find({
            uid: uid,
            writtenAt: { $gte: time, $lte: time + days * 24 * 60 * 60 * 1000 }
          })
            // 다이어리가 만들어진 날짜 기준으로 내림차순
            .sort({ writtenAt: -1 })
            .skip(count * page - count)
            .limit(count);
        }
        res.json({ success: true, result });
      } catch (e) {
    res.json({ success: false, error: e.message });
  }
});

// 하나의 다이어리에 대한 생성 및 수정 기록 보여주기
router.get("/:did", async (req, res) => {
  // /history/3?uid=1
  const uid = req.query.uid;
  try {
    // users collection에 해당 uid가 있는지 확인한다
    const isThereUser = await User.findOne({ uid: uid });
    if (!isThereUser) {
      return res.json({ success: false, error: "User not found" });
    }

    const result = await History.findOne({ uid: uid, _id: req.params.did });
    if (!result) {
      return res.json({ success: false, message: "History not found" });
    }
    res.json({ success: true, result });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});