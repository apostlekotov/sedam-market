const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc      Register user
// @route     POST /api/auth/register
// @access    Private
exports.register = asyncHandler(async (req, res, next) => {
  const { userId, userName } = req.body;
  const user = await User.create({ userId, userName });

  res.status(200).json({ success: true });
});

// @desc      Get all users
// @route     GET /api/auth/users
// @access    Private
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Delete user
// @route     Delete /api/auth/users/:id
// @access    Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc      Get JWT
// @route     POST /api/auth/getToken
// @access    Private
exports.getToken = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;
  const isAdmin = await User.findOne({ userId });

  if (!isAdmin) {
    return next(new ErrorResponse('Адміністратора не знайдено', 404));
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: 36000
  });

  res.status(200).json({ success: true, token });
});
