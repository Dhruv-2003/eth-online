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
import React, { useState } from "react";
import { TaskSuccessful } from "./invite-modal";

const STYTCH_PROJECT_ID: string | undefined =
  process.env.NEXT_PUBLIC_STYTCH_PROJECT_ID;
const DISCORD_CLIENT_ID: string | undefined =
  process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;

export function Pay({
  modalTrigger,
  children,
}: {
  modalTrigger?: JSX.Element;
  children: React.ReactNode;
}) {
  const [paySuccess, setPaySuccess] = useState<boolean>(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {modalTrigger ? modalTrigger : <Button>Pay</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        {!paySuccess ? (
          <>
            <DialogHeader>
              <DialogTitle>Pay</DialogTitle>
            </DialogHeader>
            {children}
          </>
        ) : (
          <TaskSuccessful
            message="Funds sent successfully"
            // subHeading="You will recieve your reward once your friend joins OnBoardr"
            // userInfo={
            //   <div>
            //     Lit PKP Address: {}
            //     <br />
            //     Safe Address : {}
            //   </div>
            // }
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
