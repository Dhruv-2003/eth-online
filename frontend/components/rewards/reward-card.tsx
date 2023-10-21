import React from "react";
import { useReward } from "react-rewards";
import { Button } from "../ui/button";

interface Props {
  title: string;
  index: number;
}

export default function RewardCard({ title, index }: Props) {
  // Create a unique reward ID for each card based on its index
  const rewardId = `rewardId_${index}`;
  const { reward, isAnimating } = useReward(rewardId, "confetti");

  const handleClaimReward = () => {
    // @ts-ignore
    reward(rewardId); // Call reward with the unique rewardId
  };

  return (
    <div className=" relative w-64 h-64 flex items-center justify-end p-3 flex-col border rounded-xl hover:scale-[1.01] transition-all ease-in-out  ">
      <h1 className="mt-3 mb-auto">{title}</h1>
      <Button
        className=" mb-3 w-[90%]"
        disabled={isAnimating}
        onClick={handleClaimReward} // Pass the unique reward ID
      >
        <span id={rewardId} />
        Claim Reward
      </Button>
    </div>
  );
}
