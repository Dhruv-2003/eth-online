import type { NextApiRequest, NextApiResponse } from "next";
import { EmailTemplate } from "../../components/emailTemplate";
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = req.body;
    const { to } = body;
    const data = await resend.emails.send({
      from: "Info <info@smood.finance>",
      to: to,
      subject: "Hello world",
      react: EmailTemplate({ firstName: "John" }),
      text: "it works!",
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};
