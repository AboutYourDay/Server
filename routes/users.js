const router = require("express").Router();
const User = require("../models/User");

//Find User by uid
router.get('/:id', (req, res) => {
  User.findOne({_id: req.params.id})
    .then(user => {
      if (!user) return res.status(404).send({ "success": false, "err": "User not found" });
      res.json({"success": true, "result": user});
    })
    .catch(err => res.status(500).send({"success": false, "err": err}));
});


// Create new User
router.post('/', (req, res) => {
  User.create(req.body)
    .then(user => user.save())
    .then(res.json({ success: true }))
    .catch(err => res.status(500).send({ "success": false, "err": err }));
});

// Update by uid
router.put('/:id', (req, res) => {
  User.update({ _id: req.params.id }, { $set: req.body }, (user) => {
    if (user.n) res.json({ "success": true });
  })
  .catch(err => res.json({ "success": false, "message": err }));
});


// Delete by uid
router.delete('/:id', (req, res) => {
  User.remove({ _id: req.params.id }, movie => {
    res.json({ "success": true });
    })
  .catch(err => res.json({ "success": false, "message": err }));


});


module.exports = router;
