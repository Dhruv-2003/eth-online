import Notifi from "@/components/notifi";
import DashboardNavigation from "@/components/ui/sidebar";
import React from "react";

export default function Campaign() {
  return (
    <DashboardNavigation>
      <div>
        <Notifi/>
      </div>
    </DashboardNavigation>
  );
}
