const router = require("express").Router();
const User = require("../models/User");

// get User by uid
router.get('/:uid', async (req, res) => {
  try {
    const result = await User.findOne({_id: req.params.uid});
    if(!result) {
      return res.status(404).send({ success: false, message: 'User not found' });
    }
    res.send({success: true, result});
  } catch(e) {
    res.status(500).send({success: false, error: e});
  }

  // User.findOne({_id: req.params.uid})
  //   .then(user => {
  //     if (!user) return res.status(404).send({ success: false, "err": "User not found" });
  //     res.json({"success": true, "result": user});
  //   })
  //   .catch(err => res.status(500).send({"success": false, "err": err}));
});

// Create User document
router.post('/', async (req, res) => {
  try {
    const result = await User.create(req.body);
    await result.save();
    res.send({success: true});
  } catch(e) {
    res.send({success: false, error: e});
  }
  // User.create(req.body)
  //   .then(user => user.save())
  //   .then(res.json({ success: true }))
  //   .catch(err => res.status(500).send({ "success": false, "err": err }));
});

// Update by uid
router.put('/:uid', async (req, res) => {
  try {
    const result = await User.findOneAndUpdate({ _id: req.params.uid }, { dids: req.body.dids});
    if(!result) {
      return res.send({success:false, message: 'User not found'});
    }
    res.send({ success: true });
  } catch(e) {
    res.send({ success:false, error: e });
  }
  
  // User.update({ _id: req.params.uid }, { $set: req.body }, (user) => {
  //   if (user.n) res.json({ "success": true });
  // })
  // .catch(err => res.json({ "success": false, "message": err }));
});


// Delete by uid
router.delete('/:uid', async (req, res) => {
  try {
    const result = await User.findOneAndDelete({_id: req.params.uid});
    if(!result) {
      return res.send({success: false, message: 'User not found'});
    }
  } catch(e) {
    res.send({success: false, error: e});
  }
  // 복붙이라도 제대로 해라 제발 movie가 왜 나오는데?
  // User.remove({ _id: req.params.id }, movie => {
  //   res.json({ "success": true });
  //   })
  // .catch(err => res.json({ "success": false, "message": err }));
});


module.exports = router;
