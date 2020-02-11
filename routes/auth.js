const express = require('express');
const {
  register,
  getUsers,
  deleteUser,
  getToken
} = require('../controllers/auth');

const User = require('../models/User');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');

const { auth } = require('../middleware/auth');

router.route('/register').post(auth, register);
router.route('/users').get(advancedResults(User), auth, getUsers);
router.route('/users/:id').delete(auth, deleteUser);
router.route('/getToken').post(getToken);

module.exports = router;
