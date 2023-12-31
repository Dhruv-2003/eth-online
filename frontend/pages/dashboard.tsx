import DashboardNavigation from "@/components/ui/sidebar";
import Image from "next/image";
import React, { useState } from "react";
import user from "@/assets/panda.jpg";
import user2 from "@/assets/user2.jpg";
import user3 from "@/assets/user3.webp";
import user4 from "@/assets/user4.jpg";
import { InviteFriend } from "@/components/invite-modal";
import { StaticImageData } from "next/dist/shared/lib/get-img-props";
import rewards_dribbble from "@/assets/rewards_banner.png";
import RewardCard from "@/components/rewards/reward-card";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { pkpWalletConnect } from "@/utils/Lit";
import { useAuth } from "@/context/authContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const {
    pkpWallet,
    pkpClient,
  }: { pkpWallet: PKPEthersWallet; pkpClient: pkpWalletConnect } = useAuth();
  const { connectAndInitWallet } = useAuth();

  const [connectURI, setConnectURI] = useState<string>();

  const remove = async () => {
    try {
      const data = await pkpClient.pkpWcClient.getActiveSessions();
      console.log(data);
      await pkpClient.pkpWcClient.disconnectSession({
        topic: "disconnect",
        reason: {
          code: 400,
          message: "invalid",
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DashboardNavigation>
      <div className=" w-[80vw] mx-auto  rounded-2xl h-full px-8 py-4">
        <div className=" flex items-center justify-between">
          <h1 className=" text-3xl font-semibold tracking-wide">
            Welcome to OnBoardr
          </h1>
          {/* <InviteFriend /> */}
        </div>
        <Image
          className=" my-10  rounded-xl object-center mx-auto max-h-[350px] object-cover"
          src={rewards_dribbble}
          alt="rewards"
        />
        {/* <div>
          <ConnectButton />
          <Input
            value={connectURI}
            onChange={(e) => setConnectURI(e.target.value)}
            className="  py-7 px-4"
            placeholder=" uri"
          />
          <Button
            // onClick={() => connectAndInitWallet(connectURI)}
            onClick={remove}
            className=" absolute right-3 top-2"
          >
            connect
          </Button>
        </div> */}
        <div className=" flex items-center justify-between">
          <h1 className=" text-2xl font-semibold tracking-wide">Friends</h1>
        </div>
        <div className=" flex flex-wrap items-center justify-normal gap-16 mt-8">
          <Friend image={user} name="Kushagra " />
          <Friend image={user2} name="Dhruv " />
          <Friend image={user3} name="Archit " />
          <Friend image={user4} name="Alice " />
          <div className=" flex items-center justify-center flex-col gap-2">
            <InviteFriend
              modalTrigger={
                <div className=" font-extralight text-gray-600 cursor-pointer hover:bg-indigo-950 w-14 h-14 rounded-full text-5xl border-2 flex items-center justify-center">
                  +
                </div>
              }
            />

            <div className=" tracking-wide font-semibold text-base">Invite</div>
          </div>
        </div>

        <div className=" flex items-center justify-between">
          <h1 className=" text-2xl font-semibold tracking-wide text-center my-10 mb-6 mr-auto">
            Claim your rewards
          </h1>
        </div>
        <div>
          <div className=" relative grid laptop:grid-cols-4 desktop:grid-cols-5 items-center justify-between gap-y-4">
            <div>
              <RewardCard image={user} />
            </div>
            <div>
              <RewardCard image={user2} />
            </div>
            <div>
              <RewardCard image={user3} />
            </div>
            <div>
              <RewardCard image={user4} />
            </div>
            <div>
              <RewardCard image={user2} />
            </div>
          </div>
        </div>
      </div>
    </DashboardNavigation>
  );
}

const Friend = ({
  name,
  image,
}: {
  name: string;
  image: string | StaticImageData;
}) => {
  return (
    <div className=" flex items-center justify-center flex-col gap-2">
      <Image className=" w-14 rounded-full" src={image} alt="friend" />
      <div className=" tracking-wide font-semibold text-base">{name}</div>
    </div>
  );
};
