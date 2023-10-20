import type { NextApiRequest, NextApiResponse } from "next";
import { EmailTemplate } from "../../components/emailTemplate";
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = req.body;

    // the invite will have the invitee's name and some sort of Id if there ,and also some links to interact with
    // the message will show the user has received a message , a payment or some sort of reward
    // If new user , will get an onboarding message along with the info

    const { to, subject, name, sender, templateType, shortMessage } = body;

    const data = await resend.emails.send({
      from: "Info <info@smood.finance>",
      to: to,
      subject: subject,
      react: EmailTemplate({ firstName: "John" }),
      text: "it works!", // plan Version of text message
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};
