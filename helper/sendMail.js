// const sgMail = require("@sendgrid/mail");

// require("dotenv").config();

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const sendMail = async (data, email) => {
//   const mail = {
//     ...data,
//     to: TO_MAIL,
//     from: email,
//     subject: "Sending with SendGrid is Fun",
//     text: "and easy to do anywhere, even with Node.js",
//     html: "<strong>and easy to do anywhere, even with Node.js</strong>",
//   };

//   await sgMail
//     .send(mail)
//     .then(() => {
//       console.log("Email sent");
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };

// module.exports = sendMail;

require("dotenv").config();

const { SENDGRID_API_KEY, TO_MAIL, FROM_MAIL } = process.env;

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(SENDGRID_API_KEY);

const sendMail = async (data) => {
  const msg = {
    ...data,
    to: TO_MAIL, // Change to your recipient
    from: FROM_MAIL, // Change to your verified sender
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = sendMail;
