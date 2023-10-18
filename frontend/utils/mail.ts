"use strict";
import nodemailer from "nodemailer";

export async function sendEmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "​smtp.gmail.com​",
      port: 587,
      auth: {
        user: "",
        pass: "",
      },
    });

    const mailOptions = {
      from: "",
      to: "",
      subject: "Hello",
      text: "This is the body of the email.",
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

// export async function sendEmail() {
//   const mailchimp = require("@mailchimp/mailchimp_transactional")(
//     "48f610150f9f19f69f67f8c2f1a8c85e-us17"
//   );

//   const message = {
//     from_email: "architmait111@gmail.com.com",
//     subject: "Hello world",
//     text: "Welcome to Mailchimp Transactional!",
//     to: [
//       {
//         email: "architsharma711@gmail.com",
//         type: "to",
//       },
//     ],
//   };

//   const response = await mailchimp.messages.send({
//     message,
//   });
//   console.log(response);
// }

// const mailchimpTx = require("@mailchimp/mailchimp_transactional")("e5baeba7b7e4eb7cd2298aa48c6cdb30-us17");

// export async function run() {
//   const response = await mailchimpTx.users.ping();
//   console.log(response);
// }
