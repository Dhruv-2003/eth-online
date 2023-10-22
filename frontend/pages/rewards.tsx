import RewardCard from "@/components/rewards/reward-card";
import DashboardNavigation from "@/components/ui/sidebar";
import Image from "next/image";
import React from "react";
import rewards_dribbble from "@/assets/rewards_banner.png";

export default function Rewards() {
  return (
    <DashboardNavigation>
      <div className=" text-center my-4 mb-6 text-2xl mr-auto font-semibold tracking-wide  ">
        Claim your rewards
      </div>
      <div>
        <Image
          className=" max-w-5xl  rounded-xl object-center mx-auto mb-8  max-h-[250px] object-cover"
          src={rewards_dribbble}
          alt="rewards"
        />
        {/* <div className="  mx-auto max-w-6xl flex-wrap flex items-center justify-between gap-4"> */}
        <div className=" relative  mx-auto max-w-6xl flex-wrap grid grid-cols-3 items-center justify-between gap-y-4">
          {/* <div>
            <RewardCard />
          </div>
          <div>
            <RewardCard />
          </div>
          <div>
            <RewardCard />
          </div>
          <div>
            <RewardCard />
          </div>
          <div>
            <RewardCard />
          </div>
          <div>
            <RewardCard />
          </div> */}
        </div>
      </div>
    </DashboardNavigation>
  );
}
