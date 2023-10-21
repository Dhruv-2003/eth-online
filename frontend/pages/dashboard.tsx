import DashboardNavigation from "@/components/ui/sidebar";
import Image from "next/image";
import React from "react";
import mascoot from "@/assets/mascoot.png";

export default function Dashboard() {
  return (
    <DashboardNavigation>
      <div className="">
        Dashboard
        {/* <Image src={mascoot}
        className=" max-h-[600px] object-cover object-center" alt="mascoot" /> */}
      </div>
    </DashboardNavigation>
  );
}
