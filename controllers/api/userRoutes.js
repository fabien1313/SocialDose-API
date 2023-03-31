const router = require('express').Router();
const mongoose = require('mongoose');
const { User, Thought } = require('../../models');

// GET thoughts/friends for USER
router.get('/', async (req, res) => {
	try {
		const dbUserData = await User.find({})
			.populate({ path: 'thoughts', select: '-__v' })
			.populate({ path: 'friends', select: '-__v' })
			.select('-__v')
			.sort({ username: 1 });
		res.json(dbUserData);
	} catch (e) {
		res.status(400).json(e);
	}
});

// GET a single user by its _id and populated thought/friend data
router.get('/:id', async (req, res) => {
    try {
      const dbUserData = await User.findOne({ _id: req.params.id })
        .populate({ path: 'thoughts', select: '-__v' })
        .populate({ path: 'friends', select: '-__v' }) 
        .select('-__v'); 
        
      res.json(dbUserData);
    } catch (e) {
      res.status(400).json(e);
    }
  });

// POST 
  router.post('/', async (req, res) => {
    try {
      const newUser = await User.create(req.body);
      res.json(newUser);
    } catch (e) {
      res.status(500).json(e);
    }
  });

 // PUT Update a user by its _id
  router.put('/:id', async (req, res) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.id },
        { 
          username: req.body.username,
          email: req.body.email
        },
        { new: true }
      ); 
      if (!user) {
        return res.status(404).json({ message: 'User does not match an ID' });
      }
      res.json(user);
    } catch (e) {
      res.status(500).json(e);
    }
  });


// DELETE a user by its _id
  router.delete('/:id', async (req, res) => {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.id });
      if (!user) {
        return res.status(404).json({ message: 'User does not match an ID' });
      }
      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: 'User and User thoughts have been deleted.' });
    } catch (e) {
      res.status(500).json(e);
    }
  });
  

  //FRIEND ROUTES
    // POST Add a new friend to a user's friend list
  router.post('/:userId/friends/:friendId', async (req, res) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $push: { friends: req.params.friendId } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'There is no user with that ID' });
      }
      return res.json(user);
    } catch (e) {
      return res.status(500).json(e);
    }
  });

    // DELETE Remove a friend from a user's friend list
  router.delete('/:userId/friends/:friendId', async (req, res) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'There is no user with that ID' });
      }
      return res.json(user);
    } catch (e) {
      return res.status(500).json(e);
    }
  });
  
  
  module.exports = router;


  
  


