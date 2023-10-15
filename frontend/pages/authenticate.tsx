import { computePublicKey } from "@/utils/Lit";
import { getUser } from "@/utils/Stych";
import React, { useState } from "react";

const STYTCH_PROJECT_ID: string | undefined =
  process.env.NEXT_PUBLIC_STYTCH_PROJECT_ID;
const DISCORD_CLIENT_ID: string | undefined =
  process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;

export default function authenticate() {
  const [email, setEmail] = useState<string>();
  const [mobile, setMobile] = useState<string>();

  const getPubKey = async () => {
    let mobile;
    let email = "dhruvagarwal2017@gmail.com";

    try {
      const res = await fetch("/api/getUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile, email }),
      });
      const result = await res.json();
      const user_id = result.user[0].user_id;
      console.log(user_id);

      if (!STYTCH_PROJECT_ID) {
        throw Error("Could not find stytch project secret or id in enviorment");
      }

      // compute public Key
      //   console.log(user_id, STYTCH_PROJECT_ID);
      const publicKey = await computePublicKey(user_id, STYTCH_PROJECT_ID);
      console.log(publicKey);
    } catch (error) {
      console.log(error);
    }
  };

  const getDiscordPubKey = async () => {
    try {
      const user_id = "0xdhruv";
      console.log(user_id);

      if (!DISCORD_CLIENT_ID) {
        throw Error("Could not find discord Client Id in enviorment");
      }

      // compute public Key
      //   console.log(user_id, STYTCH_PROJECT_ID);
      const publicKey = await computePublicKey(user_id, DISCORD_CLIENT_ID);
      console.log(publicKey);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      authenticate
      <br />
      <input type="text" onChange={(e) => setEmail(e.target.value)}></input>
      <br />
      <button onClick={getDiscordPubKey}>Get PubKey</button>
    </div>
  );
}
