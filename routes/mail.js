const express = require('express');
const { sendMail } = require('../controllers/mail');
const { check } = require('express-validator');

const router = express.Router();

router.route('/').post(
  [
    check('email', 'Недійсна пошта').isEmail(),
    check('message', 'Недійсний лист')
      .not()
      .isEmpty()
  ],
  sendMail
);

module.exports = router;
