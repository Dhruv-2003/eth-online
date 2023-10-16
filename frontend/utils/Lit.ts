import {
  BaseProvider,
  DiscordProvider,
  LitAuthClient,
  StytchOtpProvider,
} from "@lit-protocol/lit-auth-client";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { PKPWalletConnect } from "@lit-protocol/pkp-walletconnect";

import * as publicKeyToAddress from "ethereum-public-key-to-address";
//   import prompts from "prompts";
import dotenv from "dotenv";
dotenv.config();
import * as stytch from "stytch";
import { LitNodeClientNodeJs } from "@lit-protocol/lit-node-client-nodejs";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { ProviderType } from "@lit-protocol/constants";
import {
  AuthCallbackParams,
  AuthMethod,
  IRelayPKP,
  SessionSigs,
} from "@lit-protocol/types";
import {
  LitAbility,
  LitActionResource,
  LitPKPResource,
} from "@lit-protocol/auth-helpers";
import { BigNumber } from "ethers";
import { PKPClient } from "@lit-protocol/pkp-client";

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
      redirectUri: "http://localhost:3000/authenticate",
      clientId: DISCORD_CLIENT_ID,
    }
  );

  await provider.signIn();

  // console.log
  return { authProvider: provider };
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

export const handleDiscordRedirect = async (): Promise<{
  authMethod: AuthMethod;
  authProvider: BaseProvider;
}> => {
  const provider = litAuthClient.initProvider<DiscordProvider>(
    ProviderType.Discord,
    {
      redirectUri: "http://localhost:3000/authenticate",
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

export const generateSessionSigs = async (
  authMethod: AuthMethod,
  pkp: IRelayPKP
) => {
  await litNodeClient.connect();

  const resourceAbilities = [
    {
      resource: new LitPKPResource("*"), // might need to check the tokenId
      ability: LitAbility.PKPSigning,
    },
  ];

  const sessionKeyPair = litNodeClient.getSessionKey();
  console.log(sessionKeyPair);

  const authNeededCallback = async (params: AuthCallbackParams) => {
    console.log(params);
    const response = await litNodeClient.signSessionKey({
      sessionKey: sessionKeyPair,
      statement: params.statement,
      authMethods: [authMethod],
      pkpPublicKey: pkp.publicKey,
      expiration: params.expiration,
      resources: params.resources,
      chainId: 1,
    });
    return response.authSig;
  };

  try {
    const sessionSigs = await litNodeClient
      .getSessionSigs({
        chain: "ethereum",
        expiration: new Date(
          Date.now() + 1000 * 60 * 60 * 24 * 7
        ).toISOString(),
        resourceAbilityRequests: resourceAbilities,
        sessionKey: sessionKeyPair,
        authNeededCallback,
      })
      .catch((err) => {
        console.log(
          "error while attempting to access session signatures: ",
          err
        );
        throw err;
      });

    console.log(sessionSigs);
  } catch (error) {
    console.log(error);
  }
};

export const preparePKPWallet = (
  pkp: IRelayPKP,
  sessionSigs: SessionSigs,
  rpc: string
): PKPEthersWallet => {
  const pkpWallet = new PKPEthersWallet({
    pkpPubKey: pkp.publicKey,
    rpc: rpc, // e.g. https://rpc.ankr.com/eth_goerli
    controllerSessionSigs: sessionSigs,
  });

  return pkpWallet;
};

export const preparePKPClientWithWalletConnect = async (
  pkp: IRelayPKP,
  sessionSigs: SessionSigs
) => {
  const pkpClient = new PKPClient({
    pkpPubKey: pkp.publicKey,
    controllerSessionSigs: sessionSigs,
  });
  await pkpClient.connect();
  return pkpClient;
};

class pkpWalletConnect {
  pkpClient: PKPClient;
  pkpWcClient: PKPWalletConnect;

  constructor(pkp: IRelayPKP, sessionSigs: SessionSigs) {
    const pkpClient = new PKPClient({
      pkpPubKey: pkp.publicKey,
      controllerSessionSigs: sessionSigs,
    });
    const wcClient = new PKPWalletConnect();
    this.pkpClient = pkpClient;
    this.pkpWcClient = wcClient;
    this.initialise();
  }

  async initialise() {
    const config = {
      projectId: "<Your WalletConnect project ID>",
      metadata: {
        name: "Test Lit Wallet",
        description: "Test Lit Wallet",
        url: "https://litprotocol.com/",
        icons: ["https://litprotocol.com/favicon.png"],
      },
    };
    await this.pkpClient.connect();
    await this.pkpWcClient.initWalletConnect(config);
    this.pkpWcClient.addPKPClient(this.pkpClient);

    await this.subscribeSessionReq();
  }

  async subscribeSessionReq() {
    this.pkpWcClient.on("session_proposal", async (proposal) => {
      console.log("Received session proposal: ", proposal);

      // Accept session proposal
      await this.pkpWcClient.approveSessionProposal(proposal);

      // Log active sessions
      const sessions = Object.values(this.pkpWcClient.getActiveSessions());
      for (const session of sessions) {
        const { name, url } = session.peer.metadata;
        console.log(`Active Session: ${name} (${url})`);
      }
    });
  }

  async pair(uri: string) {
    await this.pkpWcClient.pair({ uri: uri });
  }

  async subscribeSigingReq() {
    this.pkpWcClient.on("session_request", async (requestEvent) => {
      console.log("Received session request: ", requestEvent);
      const signClient = this.pkpWcClient.getSignClient();

      const { topic, params } = requestEvent;
      const { request } = params;
      const requestSession = signClient.session.get(topic);
      const { name, url } = requestSession.peer.metadata;

      // Accept session request
      console.log(
        `\nApproving ${request.method} request for session ${name} (${url})...\n`
      );
      await this.pkpWcClient.approveSessionRequest(requestEvent);
      console.log(
        `Check the ${name} dapp to confirm whether the request was approved`
      );
    });
  }
}
