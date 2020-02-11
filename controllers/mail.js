const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const sendIt = require('../utils/sendIt');
const { validationResult } = require('express-validator');

// @desc      Send mail
// @route     POST /api/sendmail
// @access    Public
exports.sendMail = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages =
      errors
        .array()
        .map(err => {
          return err.msg;
        })
        .join(', ') || 'Помилка';
    return next(new ErrorResponse(errorMessages, 400));
  }

  const { name = null, email, message } = req.body;

  try {
    await sendIt({
      email,
      name,
      message
    });

    res.status(200).json({ success: true, data: 'Надісланно' });
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse('Помилка', 500));
  }
});
