import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createStytchUIClient } from "@stytch/nextjs/ui";
import { StytchProvider } from "@stytch/nextjs";
import { AuthContext } from "@/context/authContext";
import "@notifi-network/notifi-react-card/dist/index.css";
// import { QueryClient, QueryClientProvider, useQuery } from "react-query";
// import {
//   WagmiConfig,
//   createClient
//   mainnet,
//   goerli,
//   configureChains,
// } from "wagmi";
// import { createPublicClient, http } from "viem";
import { Lato as FontLato } from "next/font/google";
import { Navbar } from "@/components/ui/Navbar";
import { ThemeProvider } from "@/components/ui/theme-provider";

export const font = FontLato({
  weight: ["300", "400", "700"],
  style: "normal",
  subsets: ["latin"],
  variable: "--font-lato",
});
// import { alchemyProvider } from "wagmi/providers/alchemy";
// import { publicProvider } from "wagmi/providers/public";
// import { InjectedConnector } from "wagmi/connectors/injected";

// const { chains } = configureChains(
//   [goerli],
//   [alchemyProvider({ apiKey: "yourAlchemyApiKey" }), publicProvider()]
// );

// const config = createClient({
//   autoConnect: true,
// @ts-ignore
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
// @ts-ignore
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

// const queryClient = new QueryClient();

// const stytchClient = new StytchUIClient(STYTCH_PUBLIC_TOKEN);
const stytchClient = createStytchUIClient(STYTCH_PUBLIC_TOKEN as string);

export default function App({ Component, pageProps }: AppProps) {
  const value = {};
  return (
    // <QueryClientProvider client={queryClient}>
    // <WagmiConfig config={config}>
    <AuthContext.Provider value={value}>
      <StytchProvider stytch={stytchClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className={`${font.className}`}>
            <Navbar />
            <Component {...pageProps} />
          </div>
        </ThemeProvider>
      </StytchProvider>
    </AuthContext.Provider>
    // </WagmiConfig>
    // </QueryClientProvider>
  );
}
