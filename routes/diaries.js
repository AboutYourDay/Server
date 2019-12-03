const router = require("express").Router();
const Diary = require("../models/Diary");

//Find
router.get("/", (req, res) => {
  var uid = req.query.uid;
  var emotion = req.query.emotion;
  if (uid && !emotion) {
    Diary.find({"uid": uid})
      .then(diaries => {
        if (!diaries.n){
        res.json({"success": true, "result": diaries });
        }
      })
      .catch(err => res.json({"success": false, "err": err}));
  } else if (!uid && emotion) {
    Diary.find({"emotion": emotion})
      .then(diaries => {
        if (!diaries.n)
          res.json({ "success": true, "result": diaries });
      })
      .catch(err => res.json({"success": false, "err": err}));
  } else if (uid && emotion) {
    Diary.find({ "uid": uid, "emotion": emotion })
      .then(diaries => {
        if (diaries.n) {
          res.json({ "success": true, "result": diariess });     
        }
      })
      .catch(err => res.json({ "success": false, "err": err }));
  } else {
    return res.status(404).send({ "success": false, err: "Diary not found" });
  }
});

// Find One by did
router.get("/:id", (req, res) => {
  Diary.findOne({ "_id": req.params.id })
    .then(diary => {
      if (!diary) {
        return res.status(404).send({ "success": false, err: "Diary not found" });
      }
      res.json({ "success": true, "result": diary });
    })
    .catch(err => res.status(500).send({ "success": false, "err": err }));
});

// Create new Diary document
router.post("/", (req, res) => {
  Diary.create(req.body)
    .then(diary => diary.save())
    .then(res.json({ "success": true }))
    .catch(err => res.status(500).send({ "success": false, "err": err }));
});

// Update by did
router.put("/:id", (req, res) => {
  Diary.update({ _id: req.params.id }, { $set: req.body }, diary => {
    if (diary.n) res.json({ "success": true });
  }).catch(err => res.json({ "success": false, "message": err }));
});

// Delete by did
router.delete("/:id", (req, res) => {
 Diary.remove({ _id: req.params.id }, () => {
   res.json({ "success": true });
 }).catch(err => res.json({ "success": false, "message": err }));
});

module.exports = router;
