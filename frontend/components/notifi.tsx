import { Uint8SignMessageFunction } from "@notifi-network/notifi-core";
import {
  UserState,
  newFrontendClient,
} from "@notifi-network/notifi-frontend-client";
import { useMemo, useState, useRef } from "react";
import { arrayify } from "ethers/lib/utils.js";
import React from "react";
// import { useSignMessage } from "wagmi";
// import { useAccount, useConnect } from 'wagmi';
import {
  useNotifiClient,
  SignMessageParams,
} from "@notifi-network/notifi-react-hooks";
import { useConnect, useAccount } from "wagmi";
import { useSignMessage } from "wagmi";
import { initXmtp } from "@/utils/xmtpchat";

const Notifi = () => {
  const { connect, connectors } = useConnect();
  const convRef = useRef<any>(null);
  const clientRef = useRef<any>(null);

  const [userState, setUserState] = useState<UserState | null>(null);
  const [clientData, setClientData] = useState<any>();
  const { signMessageAsync } = useSignMessage();
  const { address, isConnected } = useAccount();

  const client = useMemo(() => {
    if (address && isConnected) {
      return newFrontendClient({
        walletBlockchain: "ETHEREUM",
        account: { publicKey: address },
        tenantId: "9300d12e1dc248fcb2e5f86b1784047d",
        env: "Development",
      });
    }
  }, [address, isConnected]);

  const signMessage: Uint8SignMessageFunction = async (message: Uint8Array) => {
    if (!isConnected) {
      throw new Error("Wallet not connected");
    }
    const signature = signMessageAsync({
      message: "check",
    });

    const signatureBuffer = await arrayify(signature);
    console.log(signatureBuffer);
    return signatureBuffer;
  };

  const initClient = async () => {
    if (!client) {
      throw new Error("Client not initialized");
    }
    const newUserState = await client.initialize();
    console.log(newUserState);
    setUserState(newUserState);
  };

  const logIn = async () => {
    const userState = client?.userState;
    if (userState?.status === "authenticated") {
      return "User is already logged in";
    }

    const loginResult = await client?.logIn({
      walletBlockchain: "ETHEREUM",
      signMessage,
    } as SignMessageParams);
    console.log("loginResult", loginResult);
    return loginResult;
  };

  return (
    <div>
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {connector.name}
          {!connector.ready && " (unsupported)"}
        </button>
      ))}
      <p>{address && address}</p>
      <button onClick={() => initClient()}>init</button>
      <button onClick={() => logIn()}>login</button>
      <button onClick={() => initXmtp("0xA4EF08B30D31b32ba74531B00F82cDD2D3F0a2A3", convRef, clientRef)}>initxmtp</button>
    </div>
  );
};

export default Notifi;

// const fetchData = async () => {
//   if (!userState || userState.status !== "authenticated" || !client) {
//     throw new Error("Client not initialized or not logged in");
//   }
//   const data = await client.fetchData();
//   console.log(data)
//   setClientData(data);
// };

{
  /* <button onClick={() => initClient()}>
      init
    </button>
    <button onClick={() => login()}>
      login
    </button>
    <button onClick={() => fetchData()}>
      login
    </button> */
}

//   const notifiClient = useNotifiClient({
//     dappAddress: "9300d12e1dc248fcb2e5f86b1784047d",
//     walletBlockchain: "ETHEREUM",
//     env: "Development",
//     walletPublicKey: address ?? "",
//   });

//   const { logIn } = notifiClient;

// const handleLogin = async () => {
//   if (!address) {
//     throw new Error('no public key');
//   }
//   if (!signMessage) {
//     throw new Error('no sign message');
//   }
//   const signer: SignMessageParams = {
//     walletBlockchain: "ETHEREUM",
//     signMessage: async (buffer: Uint8Array) => {
//       const result = signMessage(buffer);
//       console.log(result)
//       return arrayify(result);
//     },
//   };
//   await logIn(signer);
// };
