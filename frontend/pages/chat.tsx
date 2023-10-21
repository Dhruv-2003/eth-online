import ChatWindow from "@/components/chat/ChatWindow";
import { Button } from "@/components/ui/button";
import DashboardNavigation from "@/components/ui/sidebar";
import React from "react";

export default function Chat() {
  return (
    <DashboardNavigation>
      {/* <div className=" text-center mb-4">Chat N Pay</div> */}
      {/* <div className=" mb-1">
        <Button>Send new</Button>
      </div> */}
      <div className=" mt-10 w-full flex items-center justify-center">
        <ChatWindow />
      </div>
    </DashboardNavigation>
  );
}
