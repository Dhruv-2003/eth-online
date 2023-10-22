import Notifi from "@/components/notifi";
import NotifiCard from "@/components/notifiCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardNavigation from "@/components/ui/sidebar";
import { createSafeWallet } from "@/utils/Safe";
import { getEncodedPaymentsTx } from "@/utils/payments";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { providers } from "ethers";
import React, { useState } from "react";

export default function Campaign() {
  const [payAmount, setPayAmount] = useState<string>();
  const [reciever, setReciever] = useState<string>();

  const createSafe = async () => {
    try {
      const provider = new providers.Web3Provider(window?.ethereum);
      const [address] = await provider.listAccounts();
      const signer = provider.getSigner(address);
      const res = await createSafeWallet(address, "1");
      const safeAddress = await res?.getAddress();
      console.log(safeAddress);
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
          {/* <ConnectButton /> */}
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
          <Button onClick={() => createSafe()} className="">
            Pay
          </Button>
        </div>
      </div>
    </DashboardNavigation>
  );
}
