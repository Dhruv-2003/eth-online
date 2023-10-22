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
import React, { useState } from "react";
import { computePublicKey } from "@/utils/Lit";
import { createSafeWallet } from "@/utils/Safe";
import { addUser } from "./firebase/methods";
import { sendEmail, sendInviteEmail } from "@/utils/mail";

const STYTCH_PROJECT_ID: string | undefined =
  process.env.NEXT_PUBLIC_STYTCH_PROJECT_ID;
const DISCORD_CLIENT_ID: string | undefined =
  process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;

export function InviteFriend({
  modalTrigger,
  children,
}: {
  modalTrigger?: JSX.Element;
  children: React.ReactNode;
}) {
  const [inviteSuccess, setInviteSuccess] = useState<boolean>(false);
  const [email, setEmail] = useState<string>();
  const [mobile, setMobile] = useState<string>();
  const [name, setName] = useState<string>();
  const [userAddress, setUserAddress] = useState<string>();
  const [safeAddress, setSafeAddress] = useState<string>();




  return (
    <Dialog>
      <DialogTrigger asChild>
        {modalTrigger ? modalTrigger : <Button>Invite a Friend</Button>}
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
            {children}
          </>
        ) : (
          <TaskSuccessful
            message="Invitation has been sent to your friend"
            subHeading="You will recieve your reward once your friend joins OnBoardr"
            userInfo={
              <div>
                Lit PKP Address: {}
                <br />
                Safe Address : {}
              </div>
            }
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export const TaskSuccessful = ({
  message,
  subHeading,
  userInfo,
}: {
  message: string;
  subHeading?: string;
  userInfo?: JSX.Element;
}) => {
  return (
    <div className=" relative w-full h-[350px]">
      {/* <Confetti width={460} height={350} /> */}
      <Image
        className=" w-full ob object-cover z-20  max-h-[350px]"
        src={success}
        alt={message}
      />
      <div className=" py-4 flex flex-col items-center justify-center gap-y-6 bg-gray-950 bg-opacity-10 backdrop-blur-[2px] absolute top-0 w-full h-full">
        <h1 className="text-xl font-semibold tracking-wide">{message}</h1>
        <div className="  border-4 border-green-600 rounded-full w-24 h-24 p-5 mx-auto">
          <Image className=" max-w-[40px] mx-auto  " src={check} alt="check" />
        </div>
        <p className=" text-center text-gray-400 text-sm">{subHeading}</p>
        {userInfo && (
          <p className=" text-center text-gray-400 text-sm">{userInfo}</p>
        )}
      </div>
    </div>
  );
};
