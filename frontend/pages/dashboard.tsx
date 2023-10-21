import DashboardNavigation from "@/components/ui/sidebar";
import Image from "next/image";
import React from "react";
import mascoot from "@/assets/mascoot.png";
import { InviteFriend } from "@/components/invite-modal";

export default function Dashboard() {
  return (
    <DashboardNavigation>
      <div className="">
        <div className=" flex items-center justify-between">
          <h1>Dashboard</h1>
          <InviteFriend />
        </div>
        {/* <Image src={mascoot}
        className=" max-h-[600px] object-cover object-center" alt="mascoot" /> */}
      </div>
    </DashboardNavigation>
  );
}
