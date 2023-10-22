import Image from "next/image";
import * as stytch from "stytch";
import { prepareDiscordAuthMethod, prepareGoogleAuthMethod } from "@/utils/Lit";
import hero from "@/assets/hero.jpeg";
import Spline from "@splinetool/react-spline";

export default function Home() {
  return (
    <main
      // p-24
      className={`flex min-h-screen flex-col items-center justify-between `}
    >
      {/* <h1>OnBoardr</h1> */}
      {/* <Image src={hero} alt="hero" className=" object-cover  max-w-2xl" /> */}
      <div className=" min-h-[70vh] h-[70vh] relative -t-12 z-10 flex items-center justify-center">
        <Spline
          style={{ width: "1900px" }}
          scene="https://prod.spline.design/flKmgqviZqhLSP8V/scene.splinecode"
          // scene="https://prod.spline.design/ce9WbbgeYFxtSThn/scene.splinecode"
          // scene="https://prod.spline.design/wX6k307vnslKevcB/scene.splinecode"
        />
        <p className=" text-xl font-semibold tracking-wide absolute bottom-4 ml-4 text-center max-w-3xl leading-[30px] mx-auto">
          Experience onboarding innovation with Onboardr.
        </p>
      </div>
      {/* bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#] via-[#161825] */}
      <div className=" w-full bg-blend-darken bg-[#0a090a] flex-col flex items-center justify-center min-h-screen h-screen">
        <h1 className=" text-2xl font-semibold tracking-wide text-gray-300">
          OnBoardr Features
        </h1>
        <p className=" my-2 max-w-2xl text-center text-gray-300">
          Generate pre-calculated blockchain addresses using socials or email,
          initiate messaging, payments, and rewards for newcomers. The power to
          connect before they&#29;re onboarded
        </p>
        <div className=" mt-8 grid gap-5 grid-cols-2 items-stretch ju">
          <FeatureCard
            title="Pre-Calculated Addresses"
            desc={"Generate blockchain addresses before joining."}
          />
          <FeatureCard
            title="Direct Messaging"
            desc={"Communicate with newcomers easily."}
          />
          <FeatureCard
            title="Payments and Rewards"
            desc={"Send money and NFTs to non-blockchain users"}
          />
          <FeatureCard
            title="On-Chain Marketing"
            desc={"Seamlessly invite new users to the blockchain"}
          />
        </div>
      </div>
    </main>
  );
}

const FeatureCard = ({ title, desc }: { title: string; desc: string }) => {
  return (
    <div className=" cursor-pointer hover:scale-105 hover:bg-indigo-500 hover:delay-75 hover:transition-all hover:ease-in-out max-w-md p-6 text-gray-300 rounded-2xl border border-gray-500 flex flex-col items-center justify-center">
      <h1 className=" text-xl font-semibold">{title}</h1>
      <p className=" text-center mt-4">{desc}</p>
    </div>
  );
};
