import { CreateAccount } from "@/components/auth/auth-form";
import Image from "next/image";
import React from "react";
import bunny from "../assets/bunny.gif";
import Link from "next/link";

export default function Onboarding() {
  return (
    <div className=" flex items-center justify-center min-h-screen">
      <div className=" relative px-20 w-1/2 border-r h-screen bg-white text-black flex flex-col items-center justify-center">
        <Link
          href={"/"}
          className=" left-10 text-3xl font-semibold tracking-wide absolute top-10"
        >
          OnBoardr
        </Link>
        <Image src={bunny} className=" mb-10" alt="bunny" />
        <p className=" mt-4 absolute bottom-12">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aspernatur
          laboriosam suscipit dolore hic, quia optio in reiciendis fuga tenetur.
          Perspiciatis veritatis enim explicabo rem ipsum provident repudiandae
          et id dicta?
        </p>
      </div>
      <div className=" h-screen w-1/2  flex-col dark:bg-fixed dark:bg-gradient-to-t from-[#070a12] via-[#0c0214] to-[#120131] flex items-center justify-center">
        <CreateAccount />
      </div>
    </div>
  );
}
