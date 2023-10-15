import {
  BaseProvider,
  DiscordProvider,
  LitAuthClient,
  StytchOtpProvider,
} from "@lit-protocol/lit-auth-client";
import * as publicKeyToAddress from "ethereum-public-key-to-address";
//   import prompts from "prompts";
import dotenv from "dotenv";
dotenv.config();
import * as stytch from "stytch";
import { LitNodeClientNodeJs } from "@lit-protocol/lit-node-client-nodejs";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { ProviderType } from "@lit-protocol/constants";
import { AuthMethod, IRelayPKP } from "@lit-protocol/types";

const LIT_RELAY_API_KEY: string | undefined =
  process.env.NEXT_PUBLIC_LIT_RELAY_API_KEY;
const DISCORD_CLIENT_ID: string | undefined =
  process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
const STYTCH_PROJECT_ID: string | undefined =
  process.env.NEXT_PUBLIC_STYTCH_PROJECT_ID;
const STYTCH_SECRET: string | undefined = process.env.NEXT_PUBLIC_STYTCH_SECRET;

if (!STYTCH_PROJECT_ID || !STYTCH_SECRET) {
  throw Error("Could not find stytch project secret or id in enviorment");
}
// const litNodeClient = new LitNodeClientNodeJs({
//   litNetwork: "cayenne",
//   debug: true,
// });

const litNodeClient = new LitNodeClient({
  litNetwork: "cayenne",
  debug: true,
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
export const computePublicKey = async (
  userId: string,
  appId: string
): Promise<string | undefined> => {
  await litNodeClient.connect();

  try {
    const keyId = litNodeClient.computeHDKeyId(userId, appId);
    console.log(keyId);
    const managedKeyId = keyId.substring(2);
    const publicKey = litNodeClient.computeHDPubKey(managedKeyId);
    console.log(publicKey);
    const address = publicKeyToAddress(publicKey);
    console.log(address);
    console.log("user public key will be: ", publicKey);
    return publicKey;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const prepareDiscordAuthMethod = async (): Promise<{
  authProvider: BaseProvider;
}> => {
  const provider = litAuthClient.initProvider<DiscordProvider>(
    ProviderType.Discord,
    {
      redirectUri: "http://localhost:3000",
      clientId: DISCORD_CLIENT_ID,
    }
  );

  await provider.signIn();

  // console.log
  return { authProvider: provider };
};

export const handleDiscordRedirect = async (): Promise<{
  authMethod: AuthMethod;
  authProvider: BaseProvider;
}> => {
  const provider = litAuthClient.initProvider<DiscordProvider>(
    ProviderType.Discord,
    {
      redirectUri: "http://localhost:3000",
      clientId: DISCORD_CLIENT_ID,
    }
  );
  const authMethod = await provider.authenticate();
  console.log(authMethod);

  return { authMethod, authProvider: provider };
};

export const claim = async (
  authMethod: AuthMethod,
  authProvider: BaseProvider
) => {
  // claim can be custom , and how the key is registered
  let claimResponse = await authProvider.claimKeyId({
    authMethod,
  });

  console.log(claimResponse);
  return claimResponse;
};

export const mintPkp = async (
  provider: BaseProvider,
  authMethod: AuthMethod
) => {
  if (provider && authMethod) {
    const mintRes = await provider.mintPKPThroughRelayer(authMethod);
    console.log(mintRes);
  } else {
    console.log("Provider and Auth Method not Set");
  }
};

export const fetchPkps = async (
  provider: BaseProvider,
  authMethod: AuthMethod
): Promise<IRelayPKP[] | undefined> => {
  console.log(provider);
  console.log(authMethod);
  if (provider && authMethod) {
    const res = await provider.fetchPKPsThroughRelayer(authMethod);
    console.log(res);
    return res;
  } else {
    console.log("Provider and Auth Method not Set");
    return;
  }
};

// Auth client can be prepared for any method
export const prepareStytchAuthMethod = async (
  session_jwt: string,
  user_id: string
): Promise<{ authMethod: AuthMethod; authProvider: BaseProvider }> => {
  const provider = litAuthClient.initProvider<StytchOtpProvider>(
    ProviderType.StytchOtp,
    {
      userId: user_id,
      appId: STYTCH_PROJECT_ID,
    }
  );

  const authMethod = await provider.authenticate({
    accessToken: session_jwt,
  });

  return { authMethod, authProvider: provider };
};
