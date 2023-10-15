// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getUser } from "@/utils/Stych";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { phone, email } = req.body;
  //   console.log(email, phone);
  const response = await getUser(phone, email);
  //   console.log(response);
  res.status(200).json({ user: response });
}
