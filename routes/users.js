const router = require("express").Router();
const User = require("../models/User");

// get User by uid
router.get('/:uid', async (req, res) => {
  try {
    const result = await User.findOne({_id: req.params.uid});
    if(!result) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({success: true, result});
  } catch(e) {
    res.status(500).json({success: false, error: e});
  }
});

// Create User document
router.post('/', async (req, res) => {
  try {
    const result = await User.create(req.body);
    await result.save();
    res.json({success: true});
  } catch(e) {
    res.json({success: false, error: e});
  }
});

// Update by uid
router.put('/:uid', async (req, res) => {
  try {
    const result = await User.findOneAndUpdate({ _id: req.params.uid }, { dids: req.body.dids});
    if(!result) {
      return res.json({success:false, message: 'User not found'});
    }
    res.json({ success: true });
  } catch(e) {
    res.json({ success:false, error: e });
  }
});


// Delete by uid
router.delete('/:uid', async (req, res) => {
  try {
    const result = await User.findOneAndDelete({_id: req.params.uid});
    if(!result) {
      return res.json({success: false, message: 'User not found'});
    }
  } catch(e) {
    res.json({success: false, error: e});
  }
});


module.exports = router;
