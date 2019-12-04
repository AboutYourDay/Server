const router = require("express").Router();
const Diary = require("../models/Diary");

// get all diaries by id
router.get("/", async (req, res) => {
  const uid = req.query.uid;
  try {
    const result = await Diary.find({uid});
    res.send({success: true, result});
  } catch(e) {
    res.send({success: false, error: e});
  }
  // if (uid && !emotion) {
  //   Diary.find({"uid": uid})
  //     .then(diaries => {
  //       if (!diaries.n){
  //       res.json({"success": true, "result": diaries });
  //       }
  //     })
  //     .catch(err => res.json({"success": false, "err": err}));
  // } else if (!uid && emotion) {
  //   Diary.find({"emotion": emotion})
  //     .then(diaries => {
  //       if (!diaries.n)
  //         res.json({ "success": true, "result": diaries });
  //     })
  //     .catch(err => res.json({"success": false, "err": err}));
  // } else if (uid && emotion) {
  //   Diary.find({ "uid": uid, "emotion": emotion })
  //     .then(diaries => {
  //       if (diaries.n) {
  //         res.json({ "success": true, "result": diariess });     
  //       }
  //     })
  //     .catch(err => res.json({ "success": false, "err": err }));
  // } else {
  //   res.status(404).send({ "success": false, err: "Diary not found" });
  // }
});

// get diary by did
router.get("/:_id/:uid", async (req, res) => {
  try {
    const result = await Diary.findOne({ "_id": req.params._id });
    if (!result) {
      res.send({ success: false, message: "Diary not found" });
      return;
    }
    if (result.uid !== req.params.uid) {
      res.send({ success: false, error: "No permission" });
      return;
    }
    res.send({ success: true, result });
  } catch(e) {
    res.status(500).send({success: false, error: e.message});
  }
  // Diary.findOne({ "_id": req.params.id })
  //   .then(diary => {
  //     if (!diary) {
  //       res.status(404).send({ "success": false, err: "Diary not found" });
  //     }
  //     else{
  //       res.json({ success: true, result: diary });
  //     }
  //   })
  //   .catch(err => res.status(500).send({ "success": false, "err": err }));
});

// Create Diary document
router.post("/", async (req, res) => {
  const time = new Date().getTime();
  try {
    const result = await Diary.create({
      uid: req.body.uid,
      imageURL: req.body.imageURL,
      textAttr: req.body.textAttr,
      emotion: req.body.emotion,
      createdAt: time,
      editedAt: time,
    });
    await result.save();
    res.send({ success: true });
  } catch(e) {
    res.status(500).send({ success: false, error: e});
  }
});

// Update Dirary by did
router.put("/:_id", async (req, res) => {
  try {
    const result = await Diary.findOneAndUpdate({ _id: req.params._id }, {
        imageURL: req.body.imageURL,
        textAttr: req.body.textAttr,
        emotion: req.body.emotion,
        editedAt: new Date().getTime()
      });
    if (!result) {
      res.send({ success: false, message: 'Diary not found' });
      return;
    }
    res.send({success: true});
  } catch(e) {
    res.send({success: false, error: e});
  }
  // Diary.update({ _id: req.params.id }, { $set: req.body }, diary => {
  //   if (diary.n) res.json({ "success": true });
  // }).catch(err => res.json({ "success": false, "message": err }));
});

// Delete Diary by did
  // TODO
router.delete("/:_id", async (req, res) => {
  try {
    const result = await Diary.findOneAndDelete({_id: req.params._id});
    if (!result) {
      res.send({success: false, message: "Diary not found"});
      return;
    }
    res.send({success: true});
  } catch(e) {
    res.send({success: false, error: e.message});
  }
//  Diary.remove({ _id: req.params.id }, () => {
//    res.json({ "success": true });
//  }).catch(err => res.json({ "success": false, "message": err }));
});

module.exports = router;
