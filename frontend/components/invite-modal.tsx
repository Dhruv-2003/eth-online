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
import { computePublicKey } from "@/utils/Lit";
import { createSafeWallet } from "@/utils/Safe";
import { addUser } from "./firebase/methods";
import { sendEmail, sendInviteEmail } from "@/utils/mail";

const STYTCH_PROJECT_ID: string | undefined =
  process.env.NEXT_PUBLIC_STYTCH_PROJECT_ID;
const DISCORD_CLIENT_ID: string | undefined =
  process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;

export function InviteFriend({ modalTrigger }: { modalTrigger?: JSX.Element }) {
  const [inviteSuccess, setInviteSuccess] = useState<boolean>(false);
  const [email, setEmail] = useState<string>();
  const [mobile, setMobile] = useState<string>();
  const [name, setName] = useState<string>();
  const [userAddress, setUserAddress] = useState<string>();
  const [safeAddress, setSafeAddress] = useState<string>();

  const completeInvite = async () => {
    try {
      // take the inputs
      // calculate the user address
      const data = await getPubKey();
      console.log(data);

      if (!data) {
        console.log("Pub Key can't be calculate");
        return;
      }
      setUserAddress(data.address);
      // create safeFortheUser
      const safeSDK = await createSafeWallet(data?.address, "9");
      // safe SDK instance is provider & safeAddress
      const safeAddress = await safeSDK?.getAddress();
      setSafeAddress(safeAddress);

      // store data on firebase , add(name , email , pkpAddress, safeAddress) => new Person
      // addUser();

      // add pending invite to the current user => old Person (current)
      // pending message

      // initiate an email invite  , with inviting user to the platform
      // sendEmail()
      // sendInviteEmail(email , )

      setInviteSuccess(true);
    } catch (error) {
      console.log(error);
    }
  };

  const getPubKey = async (): Promise<
    { address: string; pubKey: string } | undefined
  > => {
    try {
      if (email) {
        const res = await fetch("/api/getUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobile, email }),
        });
        const result = await res.json();
        const user_id = result.user[0].user_id;
        console.log(user_id);

        if (!STYTCH_PROJECT_ID) {
          throw Error(
            "Could not find stytch project secret or id in enviorment"
          );
        }

        // compute public Key
        //   console.log(user_id, STYTCH_PROJECT_ID);
        const data = await computePublicKey(user_id, STYTCH_PROJECT_ID);
        console.log(data);
        return data;
      } else {
        console.log("No Input found");
      }
    } catch (error) {
      console.log(error);
    }
  };

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
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Friend&#39;s Name
                </Label>
                <Input
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  id="name"
                  placeholder="Alice"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  placeholder="friend@example.com"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              {/* <Button type="submit" onClick={getPubKey}>
                Get User address
              </Button> */}
              <Button type="submit" onClick={completeInvite}>
                Send Invitataion
              </Button>
            </DialogFooter>
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
