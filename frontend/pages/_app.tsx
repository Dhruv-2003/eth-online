import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createStytchUIClient } from "@stytch/nextjs/ui";
import { StytchProvider } from "@stytch/nextjs";
import { AuthContext } from "@/context/authContext";
// import { QueryClient, QueryClientProvider, useQuery } from "react-query";
// import {
//   WagmiConfig,
//   createConfig,
//   mainnet,
//   sepolia,
//   configureChains,
// } from "wagmi";
// import { createPublicClient, http } from "viem";
// import { alchemyProvider } from "wagmi/providers/alchemy";
// import { publicProvider } from "wagmi/providers/public";
// import { InjectedConnector } from "wagmi/connectors/injected";

// const { chains, publicClient, webSocketPublicClient } = configureChains(
//   [sepolia],
//   [alchemyProvider({ apiKey: "yourAlchemyApiKey" }), publicProvider()]
// );

// const config = createConfig({
//   autoConnect: true,
//   connectors: [
//     new InjectedConnector({
//       chains,
//       options: {
//         name: "Injected",
//         shimDisconnect: true,
//       },
//     }),
//   ],
//   publicClient: createPublicClient({
//     chain: mainnet,
//     transport: http(),
//   }),
// });

const STYTCH_PUBLIC_TOKEN: string | undefined =
  process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN;

if (!STYTCH_PUBLIC_TOKEN) {
  throw Error("Could not find stytch project secret or id in enviorment");
  // console.log("Could not find stytch project secret or id in enviorment");
}

const stytchClient = createStytchUIClient(STYTCH_PUBLIC_TOKEN);
// const queryClient = new QueryClient();

// const stytchClient = new StytchUIClient(STYTCH_PUBLIC_TOKEN);

export default function App({ Component, pageProps }: AppProps) {
  const value = {};
  return (
    // <QueryClientProvider client={queryClient}>
    // <WagmiConfig config={config}>
    <AuthContext.Provider value={value}>
      <StytchProvider stytch={stytchClient}>
        <Component {...pageProps} />
      </StytchProvider>
    </AuthContext.Provider>
    // </WagmiConfig>
    // </QueryClientProvider>
  );
}
