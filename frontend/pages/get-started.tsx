import { CreateAccount } from "@/components/auth/auth-form";
import React from "react";

export default function Onboarding() {
  return (
    <div className=" flex items-center justify-center min-h-screen">
      <div className=" h-full w-1/3">
        <CreateAccount />
      </div>
    </div>
  );
}
