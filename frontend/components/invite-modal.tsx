import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Confetti from "react-confetti";
import Image from "next/image";
import success from "@/assets/popper.gif";
import check from "@/assets/check.gif";
import { useState } from "react";

export function InviteFriend() {
  const [inviteSuccess, setInviteSuccess] = useState<boolean>(true);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Invite a Friend</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        {!inviteSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle>Invite a Friend</DialogTitle>
              <DialogDescription className="">
                Enter details below to invite your friend on <b>OnBoardr</b> and
                let them kickstart their journey of claiming amazing rewards
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Friend&#39;s Name
                </Label>
                <Input id="name" placeholder="Alice" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="friend@example.com"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Send Invitataion</Button>
            </DialogFooter>
          </>
        ) : (
          <InviteSuccessful />
        )}
      </DialogContent>
    </Dialog>
  );
}

const InviteSuccessful = () => {
  return (
    <div className=" relative w-full h-[350px]">
      {/* <Confetti width={460} height={350} /> */}
      <Image
        className=" w-full ob object-cover z-20  max-h-[350px]"
        src={success}
        alt="Invitation Successful"
      />
      <div className=" py-4 flex flex-col items-center justify-center gap-y-6 bg-gray-950 bg-opacity-10 backdrop-blur-md absolute top-0 w-full h-full">
        <h1 className="text-xl font-semibold tracking-wide">
          Invitation has been sent to your friend
        </h1>
        <div className="  border-4 border-green-600 rounded-full w-24 h-24 p-5 mx-auto">
          <Image className=" max-w-[40px] mx-auto  " src={check} alt="check" />
        </div>
        <p className=" text-center text-gray-400 text-sm">
          You will recieve your reward once your friend joins OnBoardr
        </p>
      </div>
    </div>
  );
};
