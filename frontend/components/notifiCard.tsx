import { NotifiSubscriptionCard } from "@notifi-network/notifi-react-card";
import React, { SetStateAction, useCallback, useMemo } from "react";
import { useAccount } from "wagmi";
import { useXmtpStore } from "../utils/helpers";
import { NotifiContext } from "@notifi-network/notifi-react-card";
// import { Modal } from "./Modal";
import { useSignMessage } from "wagmi";
import { arrayify } from "ethers/lib/utils.js";

// type Props = {
//   show: boolean;
//   setShowNotifiModal: React.Dispatch<SetStateAction<boolean>>;
// };

export const NotifiCard = () => {
  const { conversations } = useXmtpStore();
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const buildContentTopic = (name: string): string => `/xmtp/0/${name}/proto`;

  const buildUserInviteTopic = useCallback((): string => {
    return buildContentTopic(`invite-${address}`);
  }, [address]);

  const buildUserIntroTopic = useCallback((): string => {
    return buildContentTopic(`intro-${address}`);
  }, [address]);

  let topics = useMemo<string[]>(
    () => [buildUserInviteTopic(), buildUserIntroTopic()],
    [buildUserIntroTopic, buildUserInviteTopic],
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
    <Modal
      title=""
      size="sm"
      show={true}
      onClose={() => console.log("closed")}>
      {!address ? (
        <>Loading...</>
      ) : (
        <NotifiContext
          dappAddress="<YOUR DAPP ADDRESS HERE>"
          env="Production"
          signMessage={async (message: Uint8Array) => {
            const result = await signMessageAsync({ message });
            return arrayify(result);
          }}
          walletPublicKey={address ?? ""}
          walletBlockchain="ETHEREUM"
        >
          <NotifiSubscriptionCard
            inputs={{ XMTPTopics: topics }}
            cardId="<YOUR CARD ID HERE>"
          />
        </NotifiContext>
      )}
    </Modal>
  );
};
