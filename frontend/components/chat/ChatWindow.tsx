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
import { Client, DecodedMessage, Signer } from "@xmtp/xmtp-js";
import { Card, CardTitle } from "../ui/card";
import { InviteFriend } from "../invite-modal";
import { callGenerateEndpoint } from "@/utils/intent";
import Image, { StaticImageData } from "next/image";
import user from "@/assets/panda.jpg";
import user2 from "@/assets/user2.jpg";
import user3 from "@/assets/user3.webp";
import user4 from "@/assets/user4.jpg";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import NotifiCard from "../notifiCard";
import { useAuth } from "@/context/authContext";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { Pay } from "../pay";
import { Label } from "../ui/label";
import { performPayTransactionSafe } from "@/utils/payments";
import { createSafeWallet } from "@/utils/Safe";
import { computePublicKey } from "@/utils/Lit";

const sender = " bg-black text-white dark:bg-white dark:text-black";
const receiver = " bg-indigo-600 text-white";

const STYTCH_PROJECT_ID: string | undefined =
  process.env.NEXT_PUBLIC_STYTCH_PROJECT_ID;
const DISCORD_CLIENT_ID: string | undefined =
  process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;

export default function ChatWindow() {
  const [peerAddress, setPeerAddress] = useState<any>("");
  const convRef = useRef<any>(null);
  const clientRef = useRef<any>(null);
  const [xmtp_client, setxmtp_client] = useState<Client>();
  const [isOnNetwork, setIsOnNetwork] = useState(false);
  const [outgoingMessage, setOutgoingMessage] = useState<string>("");
  const [messages, setMessages] = useState<DecodedMessage[]>();
  const [users, setUsers] = useState<any>();
  const [option, setOption] = useState<string>("message");
  const [intentResult, setIntentResult] = useState<any>();
  const [userAddress, setUserAddress] = useState<any>();
  const [showChat, setShowChat] = useState<boolean>(true);
  const [userName, setUserName] = useState<any>();

  const { pkpWallet }: { pkpWallet: PKPEthersWallet } = useAuth();
  const [amount, setAmount] = useState<number>();

  const [inviteSuccess, setInviteSuccess] = useState<boolean>(false);
  const [email, setEmail] = useState<string>();
  const [mobile, setMobile] = useState<string>();
  const [name, setName] = useState<string>();
  // const [userAddress, setUserAddress] = useState<string>();
  const [safeAddress, setSafeAddress] = useState<string>();

  const initXmtp = async () => {
    // @ts-ignore
    // const provider = new providers.Web3Provider(window?.ethereum);
    // const [address] = await provider.listAccounts();
    // const signer = provider.getSigner(address);
    // setUserAddress(address);
    // console.log(pkpWallet);
    // const signer: Signer = {
    //   getAddress() {
    //     return pkpWallet.getAddress();
    //   },
    //   signMessage(message) {
    //     return pkpWallet.signMessage(message);
    //   },
    // };

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
  //     // fetchAllMessages(peerAddress);
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
        await fetchAllMessages(peerAddress);
        setOutgoingMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllMessages = async (peerAddress: string) => {
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

  const setChats = async (e: any) => {
    setPeerAddress(e);
    await fetchAllMessages(e);
  };

  const resolveAddress = async (e: any) => {
    const colRef = await collection(db, "UserDetails");
    const docRef = await doc(colRef, e);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userNames = await docSnap.data().name;
      console.log(userNames);
      setUserName(userNames);
    } else {
      console.log("No such document!");
    }
  };

  const sendMoneyMessage = async (amount: Number) => {
    setOutgoingMessage(`Payed $${amount} to you`);
  };

  function extractAmount(text: any) {
    const regex = /\$\d+\.\d{2}/;
    const match = text.match(regex);

    if (match) {
      return match[0];
    } else {
      return null;
    }
  }

  const handlePay = async () => {
    try {
      const receiverAddress = "0x8a51D7A312ED079b653D16be724023442f1F3f47";
      const provider = new providers.Web3Provider(window?.ethereum);
      const [address] = await provider.listAccounts();
      const signer = provider.getSigner(address);

      if (!receiverAddress) return;
      if (!amount) return;

      const tx = await performPayTransactionSafe(
        signer,
        receiverAddress,
        `${amount}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  const completeInvite = async () => {
    try {
      // take the inputs
      // calculate the user address
      const data = await getPubKey();
      console.log(data);

      if (!data) {
        console.log("Pub Key can't be calculate");
        return;
      }
      setUserAddress(data.address);
      // create safeFortheUser
      const safeSDK = await createSafeWallet(data?.address, "9");
      // safe SDK instance is provider & safeAddress
      const safeAddress = await safeSDK?.getAddress();
      setSafeAddress(safeAddress);

      // store data on firebase , add(name , email , pkpAddress, safeAddress) => new Person
      // addUser();

      // add pending invite to the current user => old Person (current)
      // pending message

      // initiate an email invite  , with inviting user to the platform
      // sendEmail()
      // sendInviteEmail(email , )

      setInviteSuccess(true);
    } catch (error) {
      console.log(error);
    }
  };

  const getPubKey = async (): Promise<
    { address: string; pubKey: string } | undefined
  > => {
    try {
      if (email) {
        const res = await fetch("/api/getUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobile, email }),
        });
        const result = await res.json();
        const user_id = result.user[0].user_id;
        console.log(user_id);

        if (!STYTCH_PROJECT_ID) {
          throw Error(
            "Could not find stytch project secret or id in enviorment"
          );
        }

        // compute public Key
        //   console.log(user_id, STYTCH_PROJECT_ID);
        const data = await computePublicKey(user_id, STYTCH_PROJECT_ID);
        console.log(data);
        return data;
      } else {
        console.log("No Input found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // dark:bg-[#0a0811] border rounded-xl  border-slate-200 dark:border-slate-700
    <>
      {showChat ? (
        <div className=" flex items-center justify-center gap-x-4">
          {/* <UserList /> */}
          <div className=" border  w-72 max-h-[83vh] h-[83vh] overflow-auto scrollbar-hide  rounded-xl relative">
            {/* fixed w-60 mx-auto  */}
            <div className=" px-4 py-2 text-lg font-semibold tracking-wide flex justify-between bg-opacity-20 backdrop-blur-md bg-indigo-950  rounded-t-xl">
              <div>Users</div>
              <div className="mt-1">
                <NotifiCard />
              </div>
            </div>
            <ConnectButton />
            <div className="px-4 py-3">
              {users &&
                users.map((user: any, key: any) => {
                  return (
                    <div
                      onClick={async () => {
                        await setChats(user.peerAddress);
                        await resolveAddress(user.peerAddress);
                      }}
                      key={key}
                    >
                      <User
                        image={user2}
                        name={
                          userName
                            ? `${userName}`
                            : `${user.peerAddress.slice(0, 14)}...`
                        }
                      />
                    </div>
                  );
                })}
              <div className="mt-auto self-end">
                <InviteFriend>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Friend&#39;s Name
                      </Label>
                      <Input
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                        id="name"
                        placeholder="Alice"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        placeholder="friend@example.com"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <div>
                    {/* <Button type="submit" onClick={getPubKey}>
                Get User address
              </Button> */}
                    <Button type="submit" onClick={completeInvite}>
                      Send Invitataion
                    </Button>
                  </div>
                </InviteFriend>
              </div>
            </div>
          </div>
          <div className=" min-w-[60vw] mx-auto flex flex-col max-h-[83vh] h-[83vh] border rounded-xl b-[#18181b] p-6">
            <div className=" max-h-[70vh] h-[70vh] overflow-auto scrollbar-hide flex flex-col items-start justify-normal w-full">
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
              {messages ? (
                messages.map((message, key) => {
                  return (
                    <div key={key} className="self-end">
                      {message.senderAddress != peerAddress && (
                        <Message color={sender} message={message} />
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-center items-center text-xl mx-auto mt-2">
                  Select a chat
                </p>
              )}
              <div className="self-end">
                {messages &&
                  messages.map((message, key) => {
                    const amount = extractAmount(message.content);
                    if (message.content.slice(0, 5) == "Payed") {
                      return (
                        <PayMessage
                          key={key}
                          status="S"
                          color={amount}
                          amount={300}
                        />
                      );
                    } else {
                      <p></p>;
                    }
                  })}
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
                <div className=" absolute right-3 top-2">
                  <Pay>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-">
                          Enter amount
                        </Label>
                        <Input
                          onChange={(e) => {
                            // @ts-ignore
                            setAmount(e.target.value);
                          }}
                          value={amount}
                          id="amount"
                          type="number"
                          placeholder="Enter Amount"
                          className="col-span-4"
                        />
                      </div>
                      <Button
                        onClick={() => sendMoneyMessage(100)}
                        className=" right-3 top-2"
                      >
                        Pay
                      </Button>
                    </div>
                  </Pay>
                </div>
              </div>
              <Select
                onValueChange={(e) => {
                  console.log(e);
                }}
              >
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
            <InviteFriend>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Friend&#39;s Name
                  </Label>
                  <Input
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    id="name"
                    placeholder="Alice"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    placeholder="friend@example.com"
                    className="col-span-3"
                  />
                </div>
              </div>
              <div>
                {/* <Button type="submit" onClick={getPubKey}>
                Get User address
              </Button> */}
                <Button type="submit" onClick={completeInvite}>
                  Send Invitataion
                </Button>
              </div>
            </InviteFriend>
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
    <div className=" border  w-72 max-h-[83vh] h-[83vh] overflow-auto scrollbar-hide  rounded-xl relative">
      {/* fixed w-60 mx-auto  */}
      <div className=" px-4 py-2 text-lg font-semibold tracking-wide  bg-opacity-20 backdrop-blur-md bg-indigo-950  rounded-t-xl">
        Users
      </div>
      <div className="px-4 pt14 py-3">
        <User
          image={user}
          // lastMessage={"OnBoardr is just amazing"}
          name="Dhruv"
        />
        <User
          image={user2}
          // lastMessage={"Yeah I know about that"}
          name="Alice"
        />
        <User
          image={user3}
          // lastMessage={"Hey saw your tweet about OnBoardr "}
          name="Bob"
        />
        <User
          image={user4}
          //  lastMessage={"What you building"}
          name="Archit"
        />
        <User
          image={user}
          // lastMessage={"How's the hackathon project coming up"}
          name="Kushagra"
        />
      </div>
    </div>
  );
};
const User = ({
  name,
  // lastMessage,
  image,
}: {
  name: string;
  // lastMessage: string;
  image: string | StaticImageData;
}) => {
  return (
    <div className=" flex items-center justify-noraml gap-x-3 px-4 py-3  w-full h-full rounded-md my-3 bg-indigo-950 bg-opacity-60 hover:bg-indigo-950 hover:bg-opacity-100  hover:cursor-pointer">
      <Image
        className=" w-10 h-10 rounded-full border-2 border-indigo-900 "
        src={image}
        alt="user"
      />
      <div>
        <div className=" font-semibold tracking-wide">{name}</div>
        {/* <div className=" line-clamp-1 pt-1.5 text-xs">{lastMessage}</div> */}
      </div>
    </div>
  );
};
