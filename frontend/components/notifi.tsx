import { Uint8SignMessageFunction } from "@notifi-network/notifi-core";
import {
  UserState,
  newFrontendClient,
} from "@notifi-network/notifi-frontend-client";
import { useMemo, useState } from "react";
import { arrayify } from "ethers/lib/utils.js";
import React from "react";
import { useSignMessage } from "wagmi";
import { useAccount, useConnect } from 'wagmi';

const Notifi = () => {
  const [userState, setUserState] = useState<UserState | null>(null);
  const [clientData, setClientData] = useState<any>();
  // const { signMessageAsync } = useSignMessage({message: 'gm wagmi frens',});
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
    const signature = await signMessage({
      message,
    });

    const signatureBuffer = arrayify(signature);
    return signatureBuffer;
  };

  const initClient = async () => {
    if (!client) {
      throw new Error("Client not initialized");
    }
    const newUserState = await client.initialize();
    console.log(newUserState)
    setUserState(newUserState);
  };

  const login = async () => {
    if (!address || !isConnected || !client) {
      throw new Error("Client or wallet not initialized");
    }
    await client.logIn({
      walletBlockchain: "ETHEREUM",
      signMessage,
    });
    console.log(client.userState)
    setUserState(client.userState);
  };

  const fetchData = async () => {
    if (!userState || userState.status !== "authenticated" || !client) {
      throw new Error("Client not initialized or not logged in");
    }
    const data = await client.fetchData();
    console.log(data)
    setClientData(data);
  };

  return <div>
    <button onClick={() => initClient()}>
      init
    </button>
    <button onClick={() => login()}>
      login
    </button>
    <button onClick={() => fetchData()}>
      login
    </button>
  </div>;
};

export default Notifi;
