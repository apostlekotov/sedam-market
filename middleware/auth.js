const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect routes
exports.auth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization) {
    token = req.headers.authorization;
  }

  if (!token) {
    return next(new ErrorResponse('У доступі відмовлено', 401));
  }

  try {
    // Verify token
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    const isAdmin = await User.findOne({ userId });

    if (!isAdmin) {
      return next(new ErrorResponse('У доступі відмовлено', 404));
    }

    next();
  } catch (err) {
    return next(new ErrorResponse('У доступі відмовлено', 401));
  }
});
