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
        <p className=" text-lg font-[500] tracking-wide absolute bottom-10 text-center max-w-3xl leading-[30px] mx-auto">
          Experience onboarding innovation with Onboardr. Generate
          pre-calculated blockchain addresses using social or email accounts
          like Google and Discord, initiate messaging, payments, and rewards for
          newcomers. The power to connect before they&#39;re onboarded.
        </p>
      </div>
      {/* bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#] via-[#161825] */}
      <div className=" w-full bg-blend-darken bg-[#0a090a] flex-col flex items-center justify-center min-h-screen h-screen">
        <h1 className=" text-2xl font-semibold tracking-wide">
          OnBoardr Features
        </h1>
        <div className=" mt-8 grid gap-5 grid-cols-2 items-stretch ju">
          <FeatureCard title="Rewards" desc={"bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#] via-[#161825]"} />
          <FeatureCard title="Rewards" desc={"bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#] via-[#161825]"} />
          <FeatureCard title="Rewards" desc={"bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#] via-[#161825]"} />
          <FeatureCard title="Rewards" desc={"bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#] via-[#161825]"} />
        </div>
      </div>
    </main>
  );
}

const FeatureCard = ({ title, desc }: { title: string; desc: string }) => {
  return (
    <div className=" max-w-md p-6 rounded-2xl border border-gray-500 flex flex-col items-center justify-center">
      <h1>{title}</h1>
      <p className=" text-center mt-4">{desc}</p>
    </div>
  );
};
