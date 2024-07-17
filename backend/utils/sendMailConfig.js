const nodemailer = require("nodemailer") ;

const mailer = async (email, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: 465,
      secure: true,
      secureConnection: false,
      auth: {
        user: "toukouapp@gmail.com",
        pass: process.env.PASS,
      },
      tls: {
        rejectUnauthorized: true,
      },
      logger: true, // Enable debug logging
      debug: true, // Enable debug mode
    });

    transporter.on("log", console.log);
    transporter.on("error", console.error);

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
      html: html,
    });
    console.log("Email sent");
  } catch (error) {
    console.log("Email not sent");
    console.log(error);
  }
};

module.exports = mailer;
