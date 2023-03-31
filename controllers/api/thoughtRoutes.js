const router = require('express').Router();
const mongoose = require('mongoose');
const { User, Thought } = require('../../models');

// GET all thoughts
router.get('/', (req, res) => {
	Thought.find({})
		.select('-__v') 
		.sort({ createdAt: -1 }) 
		.then((dbUserThoughts) => res.json(dbUserThoughts))
		.catch((e) => { res.status(400).json(e) });
});

// GET a single thought by its _id
router.get('/:id', async (req, res) => {
    try {
      const thought = await Thought.findOne(req.params.id).select('-__v');
      if (thought) {
        return res.json(thought);
      } else {
        return res.status(404).json({ message: 'Thought not found' });
      }
    } catch (e) {
      return res.status(400).json(e);
    }
  });

// POST Create a thought
  router.post('/', async (req, res) => {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { username: req.body.username },
        { $push: { thoughts: thought._id } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'No matching usernames' });
      }
      return res.json(user);
    } catch (e) {
      return res.status(500).json(e);
    }
  });


  // PUT Update a thought by its _id
  router.put('/:id', async (req, res) => {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.id },
        {
          username: req.body.username,
          thoughtText: req.body.thoughtText
        },
        { new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'Thought does not have an assigned ID' });
      }
      return res.json(thought);
    } catch (e) {
      return res.status(500).json(e);
    }
  });

    // DELETE Remove a thought by its _id
  router.delete('/:id', async (req, res) => {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.id });
      if (!thought) {
        return res.status(404).json({ message: 'ID does not match a thought' });
      }
      const user = await User.findOneAndUpdate(
        { username: thought.username },
        { $pull: { thoughts: thought._id } },
        { new: true }
      );
      return res.json(user);
    } catch (e) {
      return res.status(500).json(e);
    }
  });

  // POST REACTION
  router.post('/:id/reactions', async (req, res) => {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { reactions: req.body } },
        { new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'Thought does not match an ID' });
      }
      return res.json(thought);
    } catch (e) {
      return res.status(500).json(e);
    }
  });


    // DELETE REACTION
  router.delete('/:id/reactions/:reactionId', async (req, res) => {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'Thought does not match an ID' });
      }
      return res.json(thought);
    } catch (e) {
      return res.status(500).json(e);
    }
  });
  
    module.exports = router;
  
  
  
