import Notifi from "@/components/notifi";
import NotifiCard from "@/components/notifiCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardNavigation from "@/components/ui/sidebar";
import { createSafeWallet } from "@/utils/Safe";
import {
  getEncodedPaymentsTx,
  performPayTransactionSafe,
} from "@/utils/payments";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { providers } from "ethers";
import React, { useState } from "react";

export default function Campaign() {
  const [payAmount, setPayAmount] = useState<string>();
  const [reciever, setReciever] = useState<string>();

  const handlePay = async () => {
    try {
      const receiverAddress = "0x8a51D7A312ED079b653D16be724023442f1F3f47";
      const provider = new providers.Web3Provider(window?.ethereum);
      const [address] = await provider.listAccounts();
      const signer = provider.getSigner(address);
      console.log(address);

      if (!receiverAddress) return;
      if (!payAmount) return;

      const tx = await performPayTransactionSafe(
        signer,
        receiverAddress,
        `${payAmount}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DashboardNavigation>
      <div>
        {/* <Notifi />
        <NotifiCard /> */}
        <div>
          <ConnectButton />
          <Input
            value={reciever}
            onChange={(e) => setReciever(e.target.value)}
            className="  py-7 px-4"
            placeholder="reciever"
          />
          <Input
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
            className="  py-7 px-4"
            placeholder="amount"
          />
          <Button onClick={() => handlePay()} className="">
            Pay
          </Button>
        </div>
      </div>
    </DashboardNavigation>
  );
}
