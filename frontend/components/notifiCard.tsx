import { NotifiSubscriptionCard } from "@notifi-network/notifi-react-card";
import React, { SetStateAction, useCallback, useMemo } from "react";
import { useAccount } from "wagmi";
import { useXmtpStore } from "../utils/helpers";
import { NotifiContext } from "@notifi-network/notifi-react-card";
import { useSignMessage } from "wagmi";
import { arrayify } from "ethers/lib/utils.js";
import { providers } from "ethers";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IoNotificationsOutline } from "react-icons/io5";

const NotifiCard = () => {
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
    [buildUserIntroTopic, buildUserInviteTopic]
  );

  const addTopic = (topicName: string) => {
    if (!topics.includes(topicName)) {
      topics.push(topicName);
    }
  };

  // conversations.forEach((e: any) => {
  //   addTopic(e.topic);
  // });

  console.log(conversations);

  return (
    <Dialog>
      <DialogTrigger className="text-2xl">
        <IoNotificationsOutline />
      </DialogTrigger>
      <DialogContent>
        {!address ? (
          <>Loading...</>
        ) : (
          <NotifiContext
            dappAddress="ethonline"
            env="Production"
            signMessage={async (message: Uint8Array) => {
              var stringRes = new TextDecoder().decode(message);
              const result = await signMessageAsync({ message: stringRes });
              return arrayify(result);
            }}
            walletPublicKey={address ?? ""}
            walletBlockchain="ETHEREUM"
          >
            <NotifiSubscriptionCard
              inputs={{ XMTPTopics: topics }}
              cardId="59be5e6037c94b489cecb9a7020cd5af"
              darkMode
            />
          </NotifiContext>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default dynamic(() => Promise.resolve(NotifiCard), { ssr: false });
