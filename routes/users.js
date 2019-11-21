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


module.exports = router;
