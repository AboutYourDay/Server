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

// Find One by did
router.get('/:did', (req, res) => {
  Diary.findByDid(req.params.did)
      .then((diary) => {
        if (!diary) return res.status(404).send({ err: 'Diary not found' });
        res.send(`find successfully: ${diary}`);
      })
      .catch(err => res.status(500).send(err));
});

// Create new Diary document
router.post('/', (req, res) => {
  Diary.create(req.body)
      .then(Diary => res.send(Diary))
      .catch(err => res.status(500).send(err));
});

// Update by did
router.put('/:did', (req, res) => {
  Diary.updateByDid(req.params.did, req.body)
      .then(Diary => res.send(Diary))
      .catch(err => res.status(500).send(err));
});

// Delete by did
router.delete('/:did', (req, res) => {
  Diary.deleteByDid(req.params.did)
      .then(() => res.sendStatus(200))
      .catch(err => res.status(500).send(err));
});

module.exports = router;
