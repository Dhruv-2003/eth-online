import { NotifiSubscriptionCard } from "@notifi-network/notifi-react-card";
import React, { SetStateAction, useCallback, useMemo } from "react";
import { useAccount } from "wagmi";
import { useXmtpStore } from "../utils/helpers";
import { NotifiContext } from "@notifi-network/notifi-react-card";
// import { Modal } from "./Modal";
import { useSignMessage } from "wagmi";
import { arrayify } from "ethers/lib/utils.js";
import { providers } from "ethers";

// type Props = {
//   show: boolean;
//   setShowNotifiModal: React.Dispatch<SetStateAction<boolean>>;
// };

export const NotifiCard = () => {
  const { conversations } = useXmtpStore();
  // const { address } = useAccount();
  const address = "0x62C43323447899acb61C18181e34168903E033Bf";
  // const { signMessageAsync } = useSignMessage();

  const provider = new providers.Web3Provider(window?.ethereum);
  const signer = provider.getSigner();

  const buildContentTopic = (name: string): string => `/xmtp/0/${name}/proto`;

  const buildUserInviteTopic = useCallback((): string => {
    return buildContentTopic(`invite-${address}`);
  }, [address]);

  const buildUserIntroTopic = useCallback((): string => {
    return buildContentTopic(`intro-${address}`);
  }, [address]);

  let topics = useMemo<string[]>(
    () => [buildUserInviteTopic(), buildUserIntroTopic()],
    [buildUserIntroTopic, buildUserInviteTopic]
  );

  const addTopic = (topicName: string) => {
    if (!topics.includes(topicName)) {
      topics.push(topicName);
    }
  };

  //   conversations.forEach((e:any) => {
  //     addTopic(e.topic);
  //   });

  return (
    <>
      {!address ? (
        <>Loading...</>
      ) : (
        <NotifiContext
          dappAddress="ethonline"
          env="Production"
          signMessage={async (message: Uint8Array) => {
            const result = await signMessageAsync({ message });
            return arrayify(result);
          }}
          walletPublicKey={address ?? ""}
          walletBlockchain="ETHEREUM"
        >
          <NotifiSubscriptionCard
            inputs={{ XMTP: topics }}
            cardId="59be5e6037c94b489cecb9a7020cd5af"
          />
        </NotifiContext>
      )}
    </>
  );
};
