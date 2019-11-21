const router = require('express').Router();
const Diary = require('../models/Diary');

//Find
router.get('/', (req, res) => {
  var uid = req.param("uid");
  var emotion = req.param("emotion");
  if (uid && !emotion) {
    Diary.findByUid(uid)
      .then(diaries => {
        if (!diaries.length)
          return res.status(404).send({ err: "Diary not found" });
        res.send(`find successfully: ${diaries}`);
      })
      .catch(err => res.status(500).send(err));
  } else if (!uid && emotion) {
    Diary.findByEmotion(emotion)
      .then(diaries => {
        if (!diaries.length)
          return res.status(404).send({ err: "Diary not found" });
        res.send(`find successfully: ${diaries}`);
      })
      .catch(err => res.status(500).send(err));
  } else if (uid && emotion) {
    Diary.findByUid(uid)
      .then(diaries => {
        if (!diaries.length)
          return res.status(404).send({ err: "Diary not found" });
        diaries.findByEmotion(emotion)
          .then(diariesByUid => {
            if (!diariesByUid.length)
              return res.status(404).send({ err: "Diary not found" });
            res.send(`find successfully: ${diariesByUid}`);
          })
          .catch(err => res.status(500).send(err));;
      })
      .catch(err => res.status(500).send(err));
  }
  else{
    return res.status(404).send({ err: "Diary not found" });
  }
});


module.exports = router;
