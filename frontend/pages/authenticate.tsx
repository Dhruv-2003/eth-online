import {
  claim,
  computePublicKey,
  fetchPkps,
  generateSessionSigs,
  prepareStytchAuthMethod,
} from "@/utils/Lit";
import { getUser } from "@/utils/Stych";
import { authenticateOtp, stytchSendOTP } from "@/utils/StychUI";
import { BaseProvider } from "@lit-protocol/lit-auth-client";
import { AuthMethod } from "@lit-protocol/types";
import { useStytchSession, useStytchUser } from "@stytch/nextjs";
import { OTPsLoginOrCreateResponse } from "@stytch/vanilla-js";
import React, { useState } from "react";

const STYTCH_PROJECT_ID: string | undefined =
  process.env.NEXT_PUBLIC_STYTCH_PROJECT_ID;
const DISCORD_CLIENT_ID: string | undefined =
  process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;

export default function authenticate() {
  const { user } = useStytchUser();
  // console.log(user);
  const { session } = useStytchSession();
  // console.log(session);
  const [pubKey, setPubKey] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [mobile, setMobile] = useState<string>();
  const [OTP, setOTP] = useState<string>();
  const [authMethod, setAuthMethod] = useState<AuthMethod>();
  const [provider, setProvider] = useState<BaseProvider>();
  const [sendRes, setSendRes] = useState<OTPsLoginOrCreateResponse>();
  const [user_id, setUser_id] = useState<string>();

  const getPubKey = async () => {
    // let mobile;
    // let email = "dhruvagarwal2017@gmail.com";

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
      setUser_id(user_id);

      if (!STYTCH_PROJECT_ID) {
        throw Error("Could not find stytch project secret or id in enviorment");
      }

      // compute public Key
      //   console.log(user_id, STYTCH_PROJECT_ID);
      const publicKey = await computePublicKey(user_id, STYTCH_PROJECT_ID);
      console.log(publicKey);
      setPubKey(pubKey);
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
      setPubKey(pubKey);
    } catch (error) {
      console.log(error);
    }
  };

  const completeStytchAuth = async () => {
    try {
      if (!OTP) {
        return;
      }
      if (!sendRes) {
        return;
      }
      const res = await authenticateOtp(sendRes?.method_id, OTP);
      console.log(res);
      if (res) {
        const response = await prepareStytchAuthMethod(
          res?.session_jwt,
          res.user_id
        );
        console.log(response);
        const PKPs = await fetchPkps(
          response.authProvider,
          response.authMethod
        );

        setAuthMethod(response.authMethod);
        setProvider(response.authProvider);
        if (PKPs?.length) {
          console.log(PKPs);
        } else {
          const claimRes = await claim(
            response.authMethod,
            response.authProvider
          );
          console.log(claimRes);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPKPs = async () => {
    try {
      if (session && user) {
        const session_jwt = document.cookie;
        // console.log(session_jwt);
        const JWT = session_jwt.split("stytch_session_jwt=")[1];
        // console.log(JWT);
        const response = await prepareStytchAuthMethod(JWT, user?.user_id);
        console.log(response);
        if (response) {
          setAuthMethod(response.authMethod);
          setProvider(response.authProvider);
          const PKPs = await fetchPkps(
            response.authProvider,
            response.authMethod
          );
          if (PKPs?.length) {
            generateSessionSigs(response.authMethod, PKPs[0]);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      authenticate
      <br />
      <input
        type="text"
        className="text-black"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      ></input>
      <br />
      <button onClick={getPubKey}>Get PubKey</button>
      <button onClick={fetchPKPs}>Fetch PubKey</button>
      <a className="text-white">{pubKey && pubKey}</a>
      <br />
      <button
        onClick={async () => {
          const res = await stytchSendOTP(email, mobile);
          setSendRes(res);
        }}
      >
        Send OTP
      </button>
      <br />
      <input
        type="text"
        className="text-black"
        placeholder="OTP"
        onChange={(e) => setOTP(e.target.value)}
      ></input>
      <br />
      <button onClick={completeStytchAuth}>Submit OTP</button>
    </div>
  );
}
