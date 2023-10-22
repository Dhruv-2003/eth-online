"use strict";
const USER = process.env.NEXT_PUBLIC_USER;
const PASS = process.env.NEXT_PUBLIC_PASS;
const RESEND_API_KEY = process.env.NEXT_PUBLIC_RESEND;
import * as React from "react";

export async function sendInviteEmail(
  to: string,
  inviteeName: string,
  senderName: string,
  senderEmail: string
) {
  try {
    const response = await fetch("/api/sendEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        inviteeName,
        senderName,
        senderEmail,
        templateType: "invite",
      }),
    });

    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

export async function sendPaymentEmail(
  to: string,
  inviteeName: string,
  senderName: string,
  senderEmail: string,
  paidAmount: string
) {
  try {
    const response = await fetch("/api/sendEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        inviteeName,
        senderName,
        senderEmail,
        templateType: "invite",
        paidAmount,
      }),
    });

    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

// export async function sendEmail() {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "Gmail",
//       host: "​smtp.gmail.com​",
//       port: 587,
//       auth: {
//         user: USER,
//         pass: PASS,
//       },
//     });

//     const mailOptions = {
//       from: "",
//       to: "",
//       subject: "Hello",
//       text: "This is the body of the email.",
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent:", info.messageId);
//   } catch (error) {
//     console.error("Error occurred:", error);
//   }
// }

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
