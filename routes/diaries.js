var express = require("express");
var router = express.Router();
const Diary = require("../models/Diary");
const User = require("../models/User");
const History = require("../models/History");
const nodemailer = require("nodemailer");


async function notify(receiver, type, diary){
  const mailOptions = {
    from: "abouturday@gmail.com",
    to: receiver,
    subject: "[AboutURDay]" + "다이어리" + type + "되었습니다.",
    html:
      "<p style ='font-size:24px'> 다이어리가 성공적으로 "+ type + "되었습니다.</p>" +
      "<p style ='font-size:24px'> AboutURDay를 이용해주셔서 감사합니다.</p>" +
      "<p style ='font-size:24px'> 이 날의 기분은 " + diary.emotion + " 이셨습니다:)</p>" +
      "<img src =" +
      "'" +
      diary.imageAttr.imageURL +
      "'>"
  };

  const sender = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "abouturday@gmail.com",
      pass: "zxc123!!"
    }
  });
  try{
    const result = await sender.sendMail(mailOptions);
    if(!result){
        console.log(err);
        return -1;
    }
    console.log("Email sent: " + result.response);
    return 1;
  }catch (e) {
    res.json({ success: false, error: e.message });
  }
}

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
    const countByUid = await Diary.countDocuments({ uid: uid });
    if (!countByUid) {
      return res.json({
        success: false,
        error: "User doesn't have any diaries"
      });
    }
    if (uid && !count && !page && !time && !days) {
      result = await Diary.find({ uid: uid });
    }
    // query parameter로 time과 days가 없을 때 모든 다이어리를 페이지마다 넘겨준다
    // /diary?page=1&count=10
    else if (uid && page && count && !time && !days) {
           result = await Diary.find({
             uid: uid
           })
             // 다이어리가 만들어진 날짜 기준으로 내림차순
             .sort({ createdAt: -1 })
             .skip(page === 1 ? 0 : count * page - count)
             .limit(count);
         }
         // query로 받은 time을 시작점으로 기간 days에 대한 모든 다이어리를 페이지마다 넘겨준다
         // /diary?time=1575431613&days=10
         else if (uid && !page && !count && time && days) {
           result = await Diary.find({
             uid: uid,
             createdAt: { $gte: time, $lte: time + days * 24 * 60 * 60 * 1000 }
           })
             // 다이어리가 만들어진 날짜 기준으로 내림차순
             .sort({ createdAt: -1 });
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
             .skip(count * page - count - 1)
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
    const userData = await User.findOne({ uid: req.body.uid });
    if (!userData) {
      return res.json({ success: false, error: "User not found" });
    }
    const isDiaryDuplicate = await Diary.findOne({
      uid: req.body.uid,
      imageAttr: {
        imageURL: req.body.imageAttr.imageURL
      }
    });
    if (isDiaryDuplicate) {
      return res.json({
        success: false,
        error: "Maybe duplicate diary of user by comparing uid and imgURL"
      });
    }
    const time = new Date().getTime();
    const diaryData = await Diary.create({
      uid: req.body.uid,
      imageAttr: req.body.imageAttr,
      textAttr: req.body.textAttr,
      emotion: req.body.emotion,
      createdAt: time,
      editedAt: 0
    });
    
    const result = await diaryData.save();
    console.log(result);
    new History({
          uid: result.uid,
          did: result._id.toString(),
          writtenAt: time,
          type: "작성"
    }).save(err => console.log("err is :", err));

    // User collection에도 반영해준다.
    await User.updateOne({ uid: req.body.uid }, { $push: { imageURLs: result.imageAttr.imageURL, dids: result._id } });

    notify(req.body.email, "작성", result);

    return res.json({ success: true, result });
    } catch (e) {
    console.log(e.message);
    return res.json({ success: false, error: e.message });
  }
});

// Update Diary by did
router.put("/:did", async (req, res) => {
  try {
    const userData = await User.findOne({ uid: req.body.uid });
    if (!userData) {
      return res.json({ success: false, error: "User not found" });
    }
    const time = new Date().getTime();
    await Diary.updateOne(
      { _id: req.params.did },
      {
        imageAttr: req.body.imageAttr,
        textAttr: req.body.textAttr,
        emotion: req.body.emotion,
        editedAt: time
      }
    );
    const result = await Diary.findOne({ _id: req.params.did });
    
    new History({
      uid: req.body.uid,
      did: req.params.did,
      type: "수정",
      writtenAt: time
    }).save(err => console.log("err is :", err));
  
    notify(req.body.email, "수정", result);
    return res.json({ success: true, result});
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

    // User collection에도 반영해준다.
    await User.updateOne({ uid: result.uid }, { $pull: { dids: req.params.did } });
    res.json({ success: true });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});

module.exports = router;
