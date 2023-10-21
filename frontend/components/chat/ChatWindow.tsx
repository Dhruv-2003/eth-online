import React, { useState, useRef, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import clsx from "clsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { providers } from "ethers";
import { Client, DecodedMessage } from "@xmtp/xmtp-js";
import { Card, CardTitle } from "../ui/card";
import { InviteFriend } from "../invite-modal";
import { callGenerateEndpoint } from "@/utils/intent";

const sender = " bg-black text-white dark:bg-white dark:text-black";
const receiver = " bg-indigo-600 text-white";

export default function ChatWindow() {
  const [peerAddress, setPeerAddress] = useState<any>(
    "0x3fdF69DA53299Cf8c179B19A644664a3bb6b7bBf"
  );
  const convRef = useRef<any>(null);
  const clientRef = useRef<any>(null);
  const [xmtp_client, setxmtp_client] = useState<Client>();
  const [isOnNetwork, setIsOnNetwork] = useState(false);
  const [outgoingMessage, setOutgoingMessage] = useState<string>("");
  const [messages, setMessages] = useState<DecodedMessage[]>();
  const [users, setUsers] = useState<any>();
  const [option, setOption] = useState<string>("");
  const [intentResult, setIntentResult] = useState<any>();

  const [showChat, setShowChat] = useState<boolean>(true);

  const initXmtp = async () => {
    // @ts-ignore
    const provider = new providers.Web3Provider(window?.ethereum);
    const [address] = await provider.listAccounts();
    const signer = provider.getSigner(address);
    const xmtp = await Client.create(signer, { env: "dev" });
    console.log(xmtp);

    if (await xmtp?.canMessage(peerAddress)) {
      try {
        console.log("can message");
        const conversation = await xmtp.conversations.newConversation(
          peerAddress
        );
        console.log(conversation);
        convRef.current = await conversation;
        console.log(convRef);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("cant message because is not on the network.");
    }
    setIsOnNetwork(!!xmtp.address);
    clientRef.current = xmtp;
    setxmtp_client(xmtp);
  };

  // useEffect(() => {
  //   if (clientRef) {
  //     setIsOnNetwork(true);
  //   }
  //   if (xmtp_client) {
  //     listConverstaions();
  //     fetchAllMessages();
  //   } else {
  //     initXmtp();
  //   }
  // }, [xmtp_client]);

  const startAConversation = async function () {
    const xmtpClient = await xmtp_client;
    if (!xmtpClient) {
      initXmtp();
    }
    if (xmtpClient) {
      const conversation = await xmtpClient.conversations.newConversation(
        peerAddress
      );
      console.log(conversation);
      console.log(conversation.messages());
      convRef.current = conversation;
      await listConverstaions();
    }
  };

  const sendMessage = async () => {
    const xmtpClient = await xmtp_client;
    try {
      console.log(xmtpClient);
      if (!xmtpClient) {
        await initXmtp();
      }
      if (xmtpClient) {
        const conversation = await xmtpClient.conversations.newConversation(
          peerAddress
        );
        console.log(conversation);
        await conversation.send(outgoingMessage);
        await fetchAllMessages();
        setOutgoingMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllMessages = async () => {
    const xmtpClient = await xmtp_client;
    if (!xmtpClient) {
      initXmtp();
    }
    if (xmtpClient) {
      const conversation = await xmtpClient.conversations.newConversation(
        peerAddress
      );
      const messages = await conversation.messages();
      console.log(messages);
      setMessages(messages);
    }
  };

  const listConverstaions = async () => {
    const xmtpClient = await xmtp_client;
    if (!xmtpClient) {
      initXmtp();
    }
    if (xmtpClient) {
      const allConversations = await xmtpClient.conversations.list();
      // for (const conversation of allConversations) {
      //   console.log(`${conversation.peerAddress}`);
      //   setUsers(conversation.peerAddress);
      // }
      console.log(allConversations);
      setUsers(allConversations);
    }
  };

  const checkIfOnNetwork = async () => {
    // @ts-ignore
    const xmtpClient = await xmtp_client;
    if (xmtpClient && window) {
      // @ts-ignore
      const provider = new providers.Web3Provider(window?.ethereum);
      const [address] = await provider.listAccounts();
      const isOnNetwork = await xmtpClient.canMessage(address);
      console.log(isOnNetwork);
    }
  };

  const getIntentResult = async () => {
    const result = await callGenerateEndpoint(outgoingMessage);
    console.log(result);
    await setIntentResult(result);
    console.log(intentResult.address);
  };

  return (
    // dark:bg-[#0a0811] border rounded-xl  border-slate-200 dark:border-slate-700
    <>
      {showChat ? (
        <div className=" flex items-center justify-center gap-x-4">
          <UserList />
          <div className=" min-w-[60vw] mx-auto flex flex-col max-h-[83vh] h-[83vh] border rounded-xl b-[#18181b] p-6">
            <div className="flex flex-col items-start justify-normal w-full">
              {messages &&
                messages.map((message, key) => {
                  return (
                    <div key={key} className="self-start">
                      {message.senderAddress == peerAddress && (
                        <Message color={receiver} message={message} />
                      )}
                    </div>
                  );
                })}
              {messages &&
                messages.map((message, key) => {
                  return (
                    <div key={key} className="self-end">
                      {message.senderAddress != peerAddress && (
                        <Message color={sender} message={message} />
                      )}
                    </div>
                  );
                })}
              <div className="self-end">
                <PayMessage status="S" color={sender} amount={300} />
              </div>
              <div className="self-start">
                <PayMessage status="R" color={sender} amount={300} />
              </div>
            </div>
            {/* <div className=" mt-auto bg-black p-3 border rounded-md border-slate-700 "> */}
            <div className=" flex items-center mt-auto justify-between gap-x-3">
              <div className=" relative w-10/12">
                <Input
                  value={outgoingMessage}
                  onChange={(e) => setOutgoingMessage(e.target.value)}
                  className="  py-7 px-4"
                  placeholder=" Chat or enter amount to pay "
                />
                <Button
                  onClick={() => {
                    if (option === "message") {
                      sendMessage();
                    }
                    if (option === "intent") {
                      getIntentResult();
                    }
                  }}
                  className=" absolute right-20 top-2"
                >
                  Send
                </Button>
                <Button className=" absolute right-3 top-2">Pay</Button>
              </div>
              <Select>
                <SelectTrigger className="w-[180px] py-7">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="message">Message</SelectItem>
                    <SelectItem value="intent">Intent</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ) : (
        <Card className=" min-w-[80vw] mx-auto flex flex-col items-center justify-center max-h-[83vh] h-[83vh] border rounded-xl bg-transparent p-6">
          <CardTitle>Invite your friends to chat with them or pay</CardTitle>
          <div className=" mt-3">
            <InviteFriend />
          </div>
          {/* <Button className=" mt-3">Invite</Button> */}
        </Card>
      )}
    </>
  );
}

const Message = ({
  message,
  color,
}: {
  message: DecodedMessage;
  color: string;
}) => {
  return (
    <div className={clsx(color && `${color}`, "w-max m-2 p-2 px-4 rounded-xl")}>
      <div className="">{message.content}</div>
    </div>
  );
};

const PayMessage = ({
  status,
  amount,
  color,
}: {
  status: "S" | "R";
  amount: number;
  color: string;
}) => {
  return (
    <div
      className={clsx(
        status === "R" && receiver,
        status === "S" && sender,
        " w-44 bg-indigo-600 m-2 p-4 flex flex-col items-center justify-center gap-2 rounded-xl"
      )}
    >
      <div className="">{status === "S" && "You Sent"}</div>
      <div className="">{status === "R" && "You Received"}</div>
      <div className=" text-3xl font-semibold tracking-wide"> $ {amount}</div>
    </div>
  );
};

const UserList = () => {
  return (
    <div className=" border  w-64 max-h-[83vh] h-[83vh] overflow-auto scrollbar-hide  rounded-xl relative">
      {/* fixed w-60 mx-auto  */}
      <div className=" px-4 py-2 text-lg font-semibold tracking-wide  bg-opacity-20 backdrop-blur-md bg-indigo-950  rounded-t-xl">
        Users
      </div>
      <div className="px-4 pt14 py-3">
        <User name="Alice" />
        <User name="Bob" />
        <User name="Dhruv" />
        <User name="Archit" />
        <User name="Kushagra" />
        <User name="Alice" />
        <User name="Bob" />
        <User name="Dhruv" />
        <User name="Archit" />
        <User name="Kushagra" />
        <User name="Alice" />
        <User name="Bob" />
        <User name="Dhruv" />
        <User name="Archit" />
        <User name="Kushagra" />
        <User name="Alice" />
        <User name="Bob" />
        <User name="Dhruv" />
        <User name="Archit" />
        <User name="Kushagra" />
      </div>
    </div>
  );
};
const User = ({ name }: { name: string }) => {
  return (
    <div className=" px-4 py-2.5  w-full h-full rounded-md my-2 bg-indigo-950 bg-opacity-60 hover:bg-indigo-950 hover:bg-opacity-100  hover:cursor-pointer">
      <div>{name}</div>
    </div>
  );
};
