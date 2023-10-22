import React from "react";
import { useReward } from "react-rewards";
import { Button } from "../ui/button";
import Image, { StaticImageData } from "next/image";
import image from "@/assets/panda.jpg";
import { TaskSuccessful } from "../invite-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
interface Props {
  title?: string;
  index?: number;
  image: string | StaticImageData;
}

export default function RewardCard({ title, index, image }: Props) {
  // Create a unique reward ID for each card based on its index
  const rewardId = `rewardId_${index}`;
  const { reward, isAnimating } = useReward(rewardId, "confetti");

  const handleClaimReward = () => {
    // @ts-ignore
    reward(rewardId); // Call reward with the unique rewardId
  };

  return (
    <div className=" mx-auto relative w-64 min-h-[250px] flex items-center justify-end p-3 flex-col border rounded-xl hover:scale-[1.01] transition-all ease-in-out  ">
      {/* <h1 className="mt-3 mb-auto">{title}</h1> */}
      <Image
        src={image}
        className=" w-[90%] rounded-md h-32 object-cover my-auto "
        alt="reward image"
      />
      <RewardClaimed />
      {/* <Button
        className=" mb-3 w-[90%]"
        disabled={isAnimating}
        onClick={handleClaimReward} // Pass the unique reward ID
      >
        <span id={rewardId} />
        Claim Reward
      </Button> */}
    </div>
  );
}

const RewardClaimed = () => {
  return (
    <>
      <div className=" w-full">
        <Dialog>
          <DialogTrigger className=" w-full">
            <div className=" bg-white text-black mx-auto py-2 rounded-md hover:bg-gray-100 mb-3 w-[90%]">
              Claim Reward
            </div>
          </DialogTrigger>
          <DialogContent>
            <TaskSuccessful message="Reward claimed" />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
