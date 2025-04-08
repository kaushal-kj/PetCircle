//to,from,subject,text
const mailer = require("nodemailer");

///function

const sendingMail = async (to, subject, text) => {
  const transporter = mailer.createTransport({
    service: "gmail",
    auth: {
      user: SENDMAIL_MAIL,
      pass: SENDMAIL_PASS,
    },
  });

  const mailOptions = {
    from: SENDMAIL_MAIL,
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
