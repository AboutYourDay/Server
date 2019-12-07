const router = require("express").Router();
const User = require("../models/User");

// get User by uid
router.get('/:uid', async (req, res) => {
  try {
    const result = await User.findOne({uid: req.params.uid});
    if(!result) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({success: true, result});
  } catch(e) {
    res.status(500).json({success: false, error: e.message});
  }
});

// Create User document
router.post('/:uid', async (req, res) => {
  try {
    const isThereUser = await User.findOne({ uid: req.params.uid });
    if(isThereUser){
      return res.json({ success: false, error: "Cannot create User object by uid"});
    }
    const result = await User.create(req.body);
    await result.save();
    res.json({success: true});
  } catch(e) {
    res.json({success: false, error: e.message});
  }
});

// Update by uid
router.put('/:uid', async (req, res) => {
  try {
    // params uid
    // query imageURL
    const imageURL = req.query.imageURL;
    // const result = await User.useFindAndModify({ uid: req.params.uid }, { dids: req.body.dids});
    const result = await await User.update(
      { uid: req.params.uid },
      { $push: { imageURLs: imageURL} }
    );
    if(!result) {
      return res.json({success:false, error: 'User not found'});
    }
    res.json({ success: true });
  } catch(e) {
    res.json({ success:false, error: e.message });
  }
});


// Delete by uid
router.delete('/:uid', async (req, res) => {
  try {
    const result = await User.findOneAndDelete({uid: req.params.uid});
    if(!result) {
      return res.json({success: false, error: 'User not found'});
    }
    res.json({ success: true });
  } catch(e) {
    res.json({success: false, error: e.message});
  }
});

module.exports = router;