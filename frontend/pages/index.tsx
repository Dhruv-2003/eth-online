import Image from "next/image";
import * as stytch from "stytch";
import { prepareDiscordAuthMethod, prepareGoogleAuthMethod } from "@/utils/Lit";

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 `}
    >
      <h1>OnBoardr</h1>
    </main>
  );
}
