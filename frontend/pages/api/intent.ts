require("dotenv").config();
import { ChatGPTAPI } from "chatgpt";

const chatGPTApi = new ChatGPTAPI({
  apiKey: process.env.NEXT_PUBLIC_GPT_API_KEY,
  debug: true,
});

const getResponse = async (req: any, res: any) => {
  if (!req) return null;
  if (req.method != "POST") {
    return res.status(405).send("Method Not Allowed");
  }
  if (!req.body.userInput) {
    return res.status(400).json({ message: "Input required" });
  }

  const template = `      
  You are given a statement regarding either a token transfer/money transfer or an NFT transfer and you will have to answer the amount and token name and the address or email to send  it to in case of money/token transfer and NFT name and the address to send it to in case of NFT transfer. Return in the answer in form of an object and in case if the answer is not avalaible in the statement please return "-" as answer.
  for example: a statement is : Transfer 100 dollars to archit.eth, here the output should be {amount: 100, address:archit.eth} or statement: send 3 bayc NFTs to 0x8d7A86A304890abaA30Ef6a2aAd037531C071D37, the output should be : {amount:4, nftname: bayc, address:0x8d7A86A304890abaA30Ef6a2aAd037531C071D37 }`;

  try {
    console.log("api starting");
    const prompt = `${template} statement: ${req.body.userInput}`;
    console.log(prompt);
    const response = await chatGPTApi.sendMessage(prompt);
    console.log("res given");
    const output = response.text;
    console.log(output);
    res.status(200).json({ output: output });
  } catch (error) {
    console.log({ error });
  }
};

export default getResponse;
