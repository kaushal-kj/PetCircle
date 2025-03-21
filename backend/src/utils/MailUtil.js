//to,from,subject,text
const mailer = require("nodemailer");

///function

const sendingMail = async (to, subject, text) => {
  const transporter = mailer.createTransport({
    service: "gmail",
    auth: {
      user: "petcircle500@gmail.com",
      pass: "oywh lmqd gysx ucoi",
    },
  });

  const mailOptions = {
    from: "petcircle500@gmail.com",
    to: to,
    subject: subject,
    text: text,
    //html:"<h1>"+text+"</h1>"
  };

  const mailresponse = await transporter.sendMail(mailOptions);
  console.log(mailresponse);
  return mailresponse;
};

module.exports = {
  sendingMail,
};
