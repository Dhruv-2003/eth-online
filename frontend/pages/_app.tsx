import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createStytchUIClient } from "@stytch/nextjs/ui";
import { StytchProvider } from "@stytch/nextjs";
import { AuthContext } from "@/context/authContext";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { WagmiConfig, createConfig, mainnet } from "wagmi";
import { createPublicClient, http } from "viem";

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: mainnet,
    transport: http(),
  }),
});

const STYTCH_PUBLIC_TOKEN: string | undefined =
  process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN;

if (!STYTCH_PUBLIC_TOKEN) {
  // throw Error("Could not find stytch project secret or id in enviorment");
  console.log("Could not find stytch project secret or id in enviorment");
}

const queryClient = new QueryClient();

// const stytchClient = new StytchUIClient(STYTCH_PUBLIC_TOKEN);
const stytchClient = createStytchUIClient(STYTCH_PUBLIC_TOKEN);

export default function App({ Component, pageProps }: AppProps) {
  const value = {};
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <AuthContext.Provider value={value}>
          <StytchProvider stytch={stytchClient}>
            <Component {...pageProps} />
          </StytchProvider>
        </AuthContext.Provider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
