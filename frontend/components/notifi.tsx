import React, { useState } from "react";
import {
  NotifiClient,
  NotifiEnvironment,
  createGraphQLClient,
  createNotifiService,
} from "@notifi-network/notifi-node";
import { providers } from "ethers";

const Notifi = () => {
  const [notifi_client, setnotifi_client] = useState<NotifiClient>();
  const [userid, setUserId] = useState<string>();
  const [alert, setAlert] = useState({
    user: "",
    alertId: ``,
  });
  const [userEmails, setUserEmails] = useState<string[]>([]);
  const [userPhoneNumbers, setUserPhoneNumbers] = useState<string[]>([]);
  const [result, setResult] = useState<
    Readonly<{
      token: string;
      expiry: string;
    }>
  >();

  const initClient = async () => {
    const env: NotifiEnvironment = "Production"; // Or 'Production'
    const gqlClient = createGraphQLClient(env);
    const notifiService = createNotifiService(gqlClient);
    const client = new NotifiClient(notifiService);
    console.log(client);
    setnotifi_client(client);
  };

  const updateUserEmails = (newEmails: string[]) => {
    setUserEmails(newEmails);
    console.log(newEmails);
  };

  const login = async () => {
    if (!notifi_client) {
      initClient();
    }
    try {
      const result = await notifi_client?.logIn({
        sid: `J2F61ND5951KZ28VD1DA1THBHZHCUHIU`,
        secret: `WE7V6-WMa>kI+L3&8%CbhOzWen0Z2z3jN90a?%V3-V-#hip11No~~MxRggAZa@5i`,
      });
      console.log(result);
      setResult(result);
    } catch (error) {
      console.log(error);
    }
  };

  const createTenantUser = async () => {
    if (!notifi_client) {
      initClient();
    }
    try {
      if (notifi_client) {
        const provider = new providers.Web3Provider(window?.ethereum);
        const [address] = await provider.listAccounts();
        console.log(address);

        // Use the token to create a tenant user
        const userId = await notifi_client?.createTenantUser(result?.token, {
          walletBlockchain: "ETHEREUM",
          walletPublicKey: address,
        });
        console.log(userId);
        setUserId(userId);

        const alertObject = await notifi_client?.createDirectPushAlert(
          result?.token,
          {
            userid,
            emailAddresses: [...userEmails],
            phoneNumbers: [...userPhoneNumbers],
          }
        );
        console.log(alertObject);
        setAlert({ userid: userId, alertId: alertObject?.id });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createAlert = async () => {
    if (userid && result) {
      try {
      } catch (error) {}
    }
  };

  return (
    <div>
      <button onClick={() => initClient()}>init</button>
      <button onClick={() => createTenantUser()}>create</button>
      <button
        onClick={() =>
          updateUserEmails(["email1@example.com", "email2@example.com"])
        }
      >
        Set Email Addresses
      </button>
      <button
        onClick={() => setUserPhoneNumbers(["+1234567890", "+1876543210"])}
      >
        Set Phone Numbers
      </button>
    </div>
  );
};

export default Notifi;
