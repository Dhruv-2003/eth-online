import { arrayify } from "@ethersproject/bytes";
import {
  NotifiContext,
  NotifiInputFieldsText,
  NotifiInputSeparators,
  NotifiSubscriptionCard,
} from "@notifi-network/notifi-react-card";
import "@notifi-network/notifi-react-card/dist/index.css";
import { useEthers } from "@usedapp/core";
import { providers } from "ethers";
import React, { useMemo } from "react";

export const NotifiCard2: React.FC = () => {
  const { account, library } = useEthers();
  const signer = useMemo(() => {
    if (library instanceof providers.JsonRpcProvider) {
      return library.getSigner();
    }
    return undefined;
  }, [library]);

  if (account === undefined || signer === undefined) {
    return null;
  }

  const inputLabels: NotifiInputFieldsText = {
    label: {
      email: "Email",
      sms: "Text Message",
      telegram: "Telegram",
    },
    placeholderText: {
      email: "Email",
    },
  };

  const inputSeparators: NotifiInputSeparators = {
    smsSeparator: {
      content: "OR",
    },
    emailSeparator: {
      content: "OR",
    },
  };

  return (
    <div>
      <p className="text-black text-3xl">open card</p>
      <NotifiContext
        dappAddress="junitest.xyz"
        env="Development"
        signMessage={async (message: Uint8Array) => {
          const result = await signer.signMessage(message);
          return arrayify(result);
        }}
        walletPublicKey={account}
        walletBlockchain="ETHEREUM"
      >
        <NotifiSubscriptionCard
          cardId="005736525c6e40219fd4a704eb0a8374"
          inputLabels={inputLabels}
          inputSeparators={inputSeparators}
        />
      </NotifiContext>
    </div>
  );
};
