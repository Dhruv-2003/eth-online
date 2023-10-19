const accountSid = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
const authToken = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN;
import { Twilio } from "twilio";
const client = new Twilio(accountSid, authToken);

export const sendMessage = async () => {
  await client.messages
    .create({
      body: "This is the ship that made the Kessel Run in fourteen parsecs?",
      from: "+16787122805",
      to: "+918460941226",
    })
    .then((message) => console.log(message.sid))
    .catch((err) => {
      console.log(err);
    });
};
