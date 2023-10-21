import {
  claim,
  computePublicKey,
  fetchPkps,
  generateSessionSigs,
  handleGoogleRedirect,
  handleWebAuthnLogin,
  pkpWalletConnect,
  prepareGoogleAuthMethod,
  preparePKPWallet,
  prepareStytchAuthMethod,
  prepareWebAuthnMethod,
} from "@/utils/Lit";
import { getUser } from "@/utils/Stych";
import { authenticateOtp, stytchSendOTP } from "@/utils/StychUI";
import { BaseProvider } from "@lit-protocol/lit-auth-client";
import { AuthMethod, IRelayPKP, SessionSigsMap } from "@lit-protocol/types";
import { useStytchSession, useStytchUser } from "@stytch/nextjs";
import { OTPsLoginOrCreateResponse } from "@stytch/vanilla-js";
import React, { useState } from "react";
import { prepareDiscordAuthMethod, handleDiscordRedirect } from "@/utils/Lit";
import { useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { isSignInRedirect } from "@lit-protocol/lit-auth-client";
import { POLYGON_ZKEVM, POLYGON_ZKEVM_TEST } from "@/constants/networks";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { ethers } from "ethers";
import { intializeSDK, prepareSendNativeTransactionData } from "@/utils/Safe";

const STYTCH_PROJECT_ID: string | undefined =
  process.env.NEXT_PUBLIC_STYTCH_PROJECT_ID;
const DISCORD_CLIENT_ID: string | undefined =
  process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;

export default function Authenticate() {
  const router = useRouter();
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
  const [sessionSigs, setSessionSigs] = useState<SessionSigsMap>();
  const [PKP, setPKP] = useState<IRelayPKP>();
  const [pkpWallet, setPkpWallet] = useState<PKPEthersWallet>();
  const [pkpClient, setPkpClient] = useState<pkpWalletConnect>();

  //1. calculate the pubKey for a new stytch User from the mobile or Email
  const getPubKey = async () => {
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

  //2. calculate the discord Pub key from the UserID which is linked to the username (but not directly)
  // Can be only done if user does provide the userId
  const getDiscordPubKey = async () => {
    try {
      const user_id = "547325934043398144";
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

  //4. handle the redirect for Google or Discord Login
  const handleRedirect = useCallback(async () => {
    console.log("Redirect Called");
    const queryParams = router.query;
    if (queryParams.provider == "google") {
      console.log("Redirect Called google");
      const response = await handleGoogleRedirect();
      setAuthMethod(response.authMethod);
      setProvider(response.authProvider);
    } else if (queryParams.provider == "discord") {
      console.log("Redirect Called Discord");
      const response = await handleDiscordRedirect();
      setAuthMethod(response.authMethod);
      setProvider(response.authProvider);
    }
    console.log(queryParams);
  }, [router]);

  useEffect(() => {
    // Check if app has been redirected from Lit login server
    // console.log(isSignInRedirect(REDIRECT_URI));
    if (isSignInRedirect("http://localhost:3000/authenticate")) {
      console.log(true);
      handleRedirect();
    } else {
      console.log(false);
    }
  }, [handleRedirect]);

  //4. complete stytch OTP and autheticate to prepare the StytchAuthMethod
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
        setAuthMethod(response.authMethod);
        setProvider(response.authProvider);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //5. Safe Creation

  //6. fetch the PKP and mint or Claim the new PKP in case if needed
  const mintOrClaimPKP = async () => {
    try {
      if (authMethod && provider) {
        const PKPs = await fetchPkps(provider, authMethod);
        if (PKPs?.length) {
          console.log(PKPs);
        } else {
          const claimRes = await claim(authMethod, provider);
          console.log(claimRes);
          // const mint = await provider?.mintPKPThroughRelayer(authMethod);
          // console.log(mint);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //7. fetch  the session Jwt from the local state , in case the user is currently logged in via Stytch
  const fetchSessionKeysStytch = async () => {
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
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //7. fetch PKPs for the Authmethod in case the
  const fetchPKPs = async () => {
    try {
      if (authMethod && provider) {
        const PKPs = await fetchPkps(provider, authMethod);
        console.log(PKPs);
        if (PKPs?.length) {
          const sigs = await generateSessionSigs(authMethod, PKPs[1]);
          setPKP(PKPs[1]);
          if (sigs) {
            setSessionSigs(sigs);
            const wallet = await preparePKPWallet(PKPs[1], sigs, POLYGON_ZKEVM);
            console.log(wallet);
            setPkpWallet(wallet);
            const pkpClient = new pkpWalletConnect(PKPs[1], sigs);
            await pkpClient.initialise();
            console.log(pkpClient);
            setPkpClient(pkpClient);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signMessage = async () => {
    try {
      if (pkpWallet) {
        await pkpWallet.init();
        await pkpWallet.setRpc(POLYGON_ZKEVM);
        const signature = await pkpWallet?.signMessage("GM Frens");
        console.log(pkpWallet?._isSigner);
        console.log(signature);
        pkpWallet.connect();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectPKP = async () => {
    try {
      if (pkpClient) {
        await pkpClient.pair(
          `wc:873a3a2c4a65164cd7ab8d17831528a6a7ad726630ad6a5126a781f10a9d7f14@2?relay-protocol=irn&symKey=f8a9dba5db0511f8532ca34e5eda7b035e3e1113965112ef2d095f1291928ebf`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signSafeMessage = async () => {
    try {
      const safeAddress = "0x6F41C6cF94FB847ceb3Dea47f03B5473b7889B51";
      if (pkpWallet) {
        const provider = new ethers.providers.JsonRpcProvider(POLYGON_ZKEVM);
        await pkpWallet.init();
        await pkpWallet.setRpc(POLYGON_ZKEVM);
        const resData = await intializeSDK(provider, safeAddress);
        console.log(resData.safeSDK);
        const amount = ethers.utils.parseEther("1");
        const response = await prepareSendNativeTransactionData(
          "0x62C43323447899acb61C18181e34168903E033Bf",
          `${amount}`,
          resData.safeSDK
        );

        if (response) {
          const signature = await pkpWallet?.signMessage("GM Frens");
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
      <button onClick={() => getDiscordPubKey()}>Get PubKey</button>
      <button onClick={() => fetchPKPs()}>Fetch PubKey</button>
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
      <button onClick={mintOrClaimPKP}>Mint Or Claim</button>
      <br />
      <button onClick={signMessage}>Sign</button>
      {/* <Notifi/> */}
      <br />
      <button onClick={prepareWebAuthnMethod}>Sign in With WebAuthn</button>
      <button onClick={handleWebAuthnLogin}>Auth WebAuthn</button>
      <br />
      <button onClick={prepareDiscordAuthMethod}>Google Auth</button>
    </div>
  );
}
