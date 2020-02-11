const nodemailer = require('nodemailer');

const sendIt = async options => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  const message = {
    from: `Sedam Marker ${options.email}`,
    to: process.env.TO_EMAIL,
    subject: `Відгук від ${options.email} ${
      options.name !== '' ? `<${options.name}>` : ''
    }`,
    text: options.message
  };

  const info = await transporter.sendMail(message);

  console.log('Лист надісланно: %s'.green, info.messageId);
};

module.exports = sendIt;
