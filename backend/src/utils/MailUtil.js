//to,from,subject,text
const mailer = require("nodemailer");

///function

const sendingMail = async (to, subject, text) => {
  const transporter = mailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDMAIL_MAIL,
      pass: process.env.SENDMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SENDMAIL_MAIL,
    to: to,
    subject: subject,
    // text: text,
    html: text,
  };

  const mailresponse = await transporter.sendMail(mailOptions);
  console.log(mailresponse);
  return mailresponse;
};

module.exports = {
  sendingMail,
};
