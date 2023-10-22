import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createStytchUIClient } from "@stytch/nextjs/ui";
import { StytchProvider } from "@stytch/nextjs";
import { AuthContext } from "@/context/authContext";
import "@notifi-network/notifi-react-card/dist/index.css";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { WagmiConfig, configureChains } from "wagmi";
import { createPublicClient, http } from "viem";
import { Montserrat as FontLato } from "next/font/google";
import { Navbar } from "@/components/ui/Navbar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  AuthMethod,
  ClaimKeyResponse,
  IRelayPKP,
  SessionSigsMap,
} from "@lit-protocol/types";
import { BaseProvider } from "@lit-protocol/lit-auth-client";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import {
  claim,
  fetchPkps,
  generateSessionSigs,
  pkpWalletConnect,
  preparePKPWallet,
  prepareStytchAuthMethod,
} from "@/utils/Lit";
import { POLYGON_ZKEVM } from "@/constants/networks";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { createConfig } from "wagmi";
import { polygon, polygonZkEvm, polygonZkEvmTestnet } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";
import { ethers } from "ethers";

export const font = FontLato({
  weight: ["300", "400", "700"],
  style: "normal",
  subsets: ["latin"],
  variable: "--font-lato",
});

const { chains, publicClient } = configureChains(
  [polygon, polygonZkEvm, polygonZkEvmTestnet],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

// const config = createClient({
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
//     chain: goerli,
//     transport: http(),
//   }),
// });

const STYTCH_PUBLIC_TOKEN: string | undefined =
  process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN;

if (!STYTCH_PUBLIC_TOKEN) {
  throw Error("Could not find stytch project secret or id in enviorment");
}

const queryClient = new QueryClient();

const stytchClient = createStytchUIClient(STYTCH_PUBLIC_TOKEN as string);

export default function App({ Component, pageProps }: AppProps) {
  const [authMethod, setAuthMethod] = useState<AuthMethod>();
  const [authProvider, setAuthProvider] = useState<BaseProvider>();
  const [sessionSigs, setSessionSigs] = useState<SessionSigsMap>();
  const [PKP, setPKP] = useState<IRelayPKP>();
  const [pkpWallet, setPkpWallet] = useState<PKPEthersWallet>();
  const [pkpClient, setPkpClient] = useState<pkpWalletConnect>();
  const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider>();

  //6. fetch the PKP and mint or Claim the new PKP in case if needed
  const mintOrClaimPKP = async (): Promise<ClaimKeyResponse | undefined> => {
    try {
      if (authMethod && authProvider) {
        const PKPs = await fetchPkps(authProvider, authMethod);
        if (PKPs?.length) {
          console.log(PKPs);
        } else {
          const claimRes = await claim(authMethod, authProvider);
          console.log(claimRes);
          // const mint = await authProvider?.mintPKPThroughRelayer(authMethod);
          // console.log(mint);
          // create Safe for the user
          return claimRes;
        }
      } else {
        console.log("No Auth Method or Provider found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //7. fetch PKPs for the Authmethod in case the
  const fetchPKPsandPrepare = async (
    authMethod: AuthMethod,
    authProvider: BaseProvider
  ): Promise<IRelayPKP | undefined> => {
    try {
      if (authMethod && authProvider) {
        const PKPs = await fetchPkps(authProvider, authMethod);
        console.log(PKPs);
        if (PKPs?.length) {
          const sigs = await generateSessionSigs(authMethod, PKPs[0]);
          setPKP(PKPs[0]);

          if (sigs) {
            setSessionSigs(sigs);
            const wallet = await preparePKPWallet(PKPs[0], sigs, POLYGON_ZKEVM);
            console.log(wallet);
            setPkpWallet(wallet);
            // const pkpClient = new pkpWalletConnect(PKPs[1], sigs);
            // await pkpClient.initialise();
            // console.log(pkpClient);
            // setPkpClient(pkpClient);
          }
          return PKPs[0];
        } else {
          console.log("No PKPs found");
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    authMethod,
    setAuthMethod,
    authProvider,
    setAuthProvider,
    sessionSigs,
    setSessionSigs,
    PKP,
    setPKP,
    pkpWallet,
    setPkpWallet,
    pkpClient,
    setPkpClient,
    mintOrClaimPKP,
    fetchPKPsandPrepare,
  };

  // if there is not AuthMethod Defined , fetch the sessionKey in case it's a stytch login
  // Redirect to the get-started page
  // useEffect(()=>{},[])

  const router = useRouter();
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <AuthContext.Provider value={value}>
            <StytchProvider stytch={stytchClient}>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {/* , ,  */}
                <div
                  className={`${font.className} dark:bg-fixed dark:bg-gradient-to-t from-[#070a12] via-[#0c0214] to-[#120131]`}
                >
                  {router.asPath !== "/get-started" && <Navbar />}
                  <Component {...pageProps} />
                </div>
              </ThemeProvider>
            </StytchProvider>
          </AuthContext.Provider>
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
