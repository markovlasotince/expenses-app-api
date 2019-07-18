const sgMail = require("@sendgrid/mail");


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeMessage = (email, name) => {
  sgMail.send({
    to: email,
    from: "markovlasotince@gmail.com",
    subject: "Thanks for joining my app.",
    text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
  });
};

const sendLeavingMessage = (email, name) => {
  sgMail.send({
    to: email,
    from: "markovlasotince@gmail.com",
    subject: "Sorry to see you go.",
    text: `Bye, ${name}. Hope you had a good time using the app.`
  });
};

module.exports = { sendWelcomeMessage, sendLeavingMessage };
