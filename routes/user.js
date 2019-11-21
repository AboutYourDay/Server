const router = require("express").Router();
const User = require("../models/User");

//Find User by uid
router.get('/:uid', (req, res) => {
  User.findby(req.params.uid)
    .then(User => {
      if (!User) return res.status(404).send({ err: "User not found" });
      res.send(`find successfully: ${User}`);
    })
    .catch(err => res.status(500).send(err));
});

// Create new User
router.post('/', (req, res) => {
  User.create(req.body)
      .then(User => res.send(User))
      .catch(err => res.status(500).send(err));
});

// Update by uid
router.put('/:uid', (req, res) => {
  User.updateByUid(req.params.uid, req.body)
      .then(User => res.send(User))
      .catch(err => res.status(500).send(err));
});


// Delete by uid
router.delete('/:uid', (req, res) => {
  User.deleteByUid(req.params.uid)
      .then(() => res.sendStatus(200))
      .catch(err => res.status(500).send(err));
});

module.exports = router;
