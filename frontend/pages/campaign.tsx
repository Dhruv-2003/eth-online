import Notifi from "@/components/notifi";
import NotifiCard from "@/components/notifiCard";
import DashboardNavigation from "@/components/ui/sidebar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";

export default function Campaign() {
  return (
    <DashboardNavigation>
      <div>
        <Notifi />
        <NotifiCard />
      </div>
    </DashboardNavigation>
  );
}
