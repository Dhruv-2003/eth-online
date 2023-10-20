import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import clsx from "clsx";

const sender = " bg-black text-white dark:bg-white dark:text-black";
const receiver = " bg-indigo-600 text-white";

export default function ChatWindow() {
  return (
    <div className=" min-w-[80vw] mx-auto flex flex-col max-h-[83vh] h-[83vh]  b-[#18181b] dark:bg-[#0a0811] border rounded-xl  border-slate-200 dark:border-slate-700 p-6">
      <div className=" flex flex-col items-start justify-normal w-full">
       
        <div className="self-start">
          <Message color={receiver} message={"Hey how have you been"} />
        </div>
        <div className="  self-end">
          <Message color={sender} message={"I'm good what about you"} />
        </div>
        <div className="  self-end">
          <PayMessage status="S" color={sender} amount={300} />
        </div>
        <div className=" self-start">
          <PayMessage status="R" color={sender} amount={300} />
        </div>
      </div>
      {/* <div className=" mt-auto bg-black p-3 border rounded-md border-slate-700 "> */}
      <div className=" relative mt-auto">
        <Input
          className="  py-7 px-4"
          placeholder=" Chat or enter amount to pay "
        />
        <Button className=" absolute right-3 top-2">Send</Button>
      </div>
      {/* </div> */}
    </div>
  );
}

const Message = ({ message, color }: { message: string; color: string }) => {
  return (
    <div className={clsx(color && `${color}`, "w-max m-2 p-2 px-4 rounded-xl")}>
      <div className=" ">{message}</div>
    </div>
  );
};

const PayMessage = ({
  status,
  amount,
  color,
}: {
  status: "S" | "R";
  amount: number;
  color: string;
}) => {
  return (
    <div
      className={clsx(
        status === "R" && receiver,
        status === "S" && sender,
        " w-44 bg-indigo-600 m-2 p-4 flex flex-col items-center justify-center gap-2 rounded-xl"
      )}
    >
      <div className="">{status === "S" && "You Sent"}</div>
      <div className="">{status === "R" && "You Received"}</div>
      <div className=" text-3xl font-semibold tracking-wide"> $ {amount}</div>
    </div>
  );
};
