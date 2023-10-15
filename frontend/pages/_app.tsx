import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createStytchUIClient } from "@stytch/nextjs/ui";
import { StytchProvider } from "@stytch/nextjs";
import { AuthContext } from "@/context/authContext";

const STYTCH_PUBLIC_TOKEN: string | undefined =
  process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN;

if (!STYTCH_PUBLIC_TOKEN) {
  throw Error("Could not find stytch project secret or id in enviorment");
}

// const stytchClient = new StytchUIClient(STYTCH_PUBLIC_TOKEN);
const stytchClient = createStytchUIClient(STYTCH_PUBLIC_TOKEN);

export default function App({ Component, pageProps }: AppProps) {
  const value = {};
  return (
    <AuthContext.Provider value={value}>
      <StytchProvider stytch={stytchClient}>
        <Component {...pageProps} />
      </StytchProvider>
    </AuthContext.Provider>
  );
}
