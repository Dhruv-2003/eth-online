import {
  BaseProvider,
  LitAuthClient,
  StytchOtpProvider,
} from "@lit-protocol/lit-auth-client";
//   import prompts from "prompts";
import dotenv from "dotenv";
dotenv.config();
import * as stytch from "stytch";
import { LitNodeClientNodeJs } from "@lit-protocol/lit-node-client-nodejs";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { ProviderType } from "@lit-protocol/constants";
import { AuthMethod } from "@lit-protocol/types";

const STYTCH_PROJECT_ID: string | undefined = process.env.STYTCH_PROJECT_ID;
const STYTCH_SECRET: string | undefined = process.env.STYTCH_SECRET;
const LIT_RELAY_API_KEY: string | undefined = process.env.LIT_RELAY_API_KEY;

if (!STYTCH_PROJECT_ID || !STYTCH_SECRET) {
  throw Error("Could not find stytch project secret or id in enviorment");
}

const stytchClient = new stytch.Client({
  project_id: STYTCH_PROJECT_ID,
  secret: STYTCH_SECRET,
});

// const litNodeClient = new LitNodeClientNodeJs({
//   litNetwork: "cayenne",
//   debug: false,
// });

const litNodeClient = new LitNodeClient({
  litNetwork: "cayenne",
  debug: false,
});

// await litNodeClient.connect();

const litAuthClient = new LitAuthClient({
  litRelayConfig: {
    relayApiKey: LIT_RELAY_API_KEY,
  },
  litNodeClient,
});

/**
 *
 * @param userId
 * @param appId
 * | Auth Method | User ID | App ID |
 * |:------------|:--------|:-------|
 * | Google OAuth | token `sub` | token `aud` |
 * | Discord OAuth | user id | client app identifier |
 * | Stytch OTP |token `sub` | token `aud`|
 * | Lit Actions | user defined | ipfs cid |
 */
// We have to find out some ways around how do we get User ID & AppIds
const computePublicKey = (userId: string, appId: string) => {
  const keyId = litNodeClient.computeHDKeyId(userId, appId);
  const publicKey = litNodeClient.computeHDPubKey(keyId);
  console.log("user public key will be: ", publicKey);
};

const claim = async (authMethod: AuthMethod, authProvider: BaseProvider) => {
  // claim can be custom , and how the key is registered
  let claimResponse = await authProvider.claimKeyId({
    authMethod,
  });

  console.log(claimResponse);
};

// Auth client can be prepared for any method
const prepareStytchAuthMethod = async (
  session_jwt: any
): Promise<{ authMethod: AuthMethod; authProvider: BaseProvider }> => {
  const provider = litAuthClient.initProvider<StytchOtpProvider>(
    ProviderType.StytchOtp,
    {
      userId: "",
      appId: STYTCH_PROJECT_ID,
    }
  );

  const authMethod = await provider.authenticate({
    accessToken: session_jwt,
  });

  return { authMethod, authProvider: provider };
};

const stytchOtpMethod = async (
  email: string,
  otp: string
): Promise<{ session_jwt: string; user_id: string }> => {
  // we have all the options stytch offers , Email , Phone, Whatsap
  const stytchResponse = await stytchClient.otps.email.loginOrCreate({
    email: email,
  });

  // get Otp from the user
  const authResponse = await stytchClient.otps.authenticate({
    method_id: stytchResponse.email_id,
    code: otp,
    session_duration_minutes: 60 * 24 * 7,
  });

  const session_token = authResponse.session_token;

  const sessionStatus = await stytchClient.sessions.authenticate({
    session_token: authResponse.session_token,
  });

  const session_jwt = sessionStatus.session_jwt;
  const user_id = sessionStatus.session.user_id;

  return {
    session_jwt,
    user_id,
  };
};

const mintPkp = async (provider: BaseProvider, authMethod: AuthMethod) => {
  if (provider && authMethod) {
    const mintRes = await provider.mintPKPThroughRelayer(authMethod);
    console.log(mintRes);
  } else {
    console.log("Provider and Auth Method not Set");
  }
};

const fetchPkps = async (provider: BaseProvider, authMethod: AuthMethod) => {
  console.log(provider);
  console.log(authMethod);
  if (provider && authMethod) {
    const res = await provider.fetchPKPsThroughRelayer(authMethod);
    console.log(res);
    return res;
  } else {
    console.log("Provider and Auth Method not Set");
  }
};
