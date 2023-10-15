import { Client } from "@xmtp/xmtp-js";
import { providers } from "ethers";

export const initXmtp = async (
  peerAddress: any,
  convRef: any,
  clientRef: any
) => {
  // @ts-ignore
  const provider = new providers.Web3Provider(window?.ethereum);
  const [address] = await provider.listAccounts();
  const signer = provider.getSigner(address);
  const xmtp = await Client.create(signer, { env: "production" });

  if (await xmtp?.canMessage(peerAddress)) {
    const conversation = await xmtp.conversations.newConversation(peerAddress);
    convRef.current = conversation;
    console.log(convRef);
  } else {
    console.log("cant message because is not on the network.");
  }
  // setIsOnNetwork(!!xmtp.address);
  clientRef.current = xmtp;
};

export const startAConversation = async function (
  xmtp_client: any,
  peerAddress: any,
  convRef: any,
  clientRef: any
) {
  const xmtpClient = await xmtp_client;
  if (!xmtpClient) {
    initXmtp(peerAddress, convRef, clientRef);
  }
  const conversation = await xmtpClient.conversations.newConversation(
    peerAddress
  );
  console.log(conversation);
  console.log(conversation.messages());
  convRef.current = conversation;
  await listConverstaions(xmtp_client, peerAddress, convRef, clientRef);
};

export const sendMessage = async (
  xmtp_client: any,
  peerAddress: any,
  convRef: any,
  clientRef: any
) => {
  const xmtpClient = await xmtp_client;
  if (!xmtpClient) {
    initXmtp(peerAddress, convRef, clientRef);
  }
  const conversation = await xmtpClient.conversations.newConversation(
    peerAddress
  );
  await conversation.send("");
  console.log(conversation);
  await fetchAllMessages(xmtp_client, peerAddress, convRef, clientRef);
};

export const fetchAllMessages = async (
  xmtp_client: any,
  peerAddress: any,
  convRef: any,
  clientRef: any
) => {
  const xmtpClient = await xmtp_client;
  if (!xmtpClient) {
    initXmtp(peerAddress, convRef, clientRef);
  }
  const conversation = await xmtpClient.conversations.newConversation(
    peerAddress
  );
  const messages = await conversation.messages();
  console.log(messages);
};

export const listConverstaions = async (
  xmtp_client: any,
  peerAddress: any,
  convRef: any,
  clientRef: any
) => {
  const xmtpClient = await xmtp_client;
  if (!xmtpClient) {
    initXmtp(peerAddress, convRef, clientRef);
  }
  const allConversations = await xmtpClient.conversations.list();
  // for (const conversation of allConversations) {
  //   console.log(`${conversation.peerAddress}`);
  //   setUsers(conversation.peerAddress);
  // }
  console.log(allConversations);
};


export const checkIfOnNetwork = async(xmtp_client: any,
  Address: string,) => {
  const isOnNetwork = await xmtp_client.canMessage(
    Address,
    { env: "production" },
  );
}