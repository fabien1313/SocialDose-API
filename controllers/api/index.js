const router = require('express').Router();

const thoughtRoutes = require('./thoughtRoutes');
const userRoutes = require('./userRoutes');

router.use('/thoughts', thoughtRoutes); // http://localhost:3001/api/thoughts
router.use('/users', userRoutes); // http://localhost:3001/api/users


module.exports = router;