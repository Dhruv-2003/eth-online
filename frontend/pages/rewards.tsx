import RewardCard from "@/components/rewards/reward-card";
import DashboardNavigation from "@/components/ui/sidebar";
import React from "react";

export default function Rewards() {
  return (
    <DashboardNavigation>
      <div className=" text-center my-4 mb-6 text-4xl font-semibold tracking-wide  ">Claim your rewards</div>
      <div className="  mx-auto max-w-6xl flex-wrap flex items-center justify-between gap-4">
        <RewardCard index={0} title="S" />
        <RewardCard index={1} title="S" />

      </div>
    </DashboardNavigation>
  );
}
