const nodemailer = require('nodemailer');

exports.sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
   service: 'yahoo',
   host: 'smtp.mail.yahoo.com',
   port:465,
   secure: false,
   auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
   },
   debug:true,
   logger:true,
  });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.AUTH_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
}

