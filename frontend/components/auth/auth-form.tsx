"use client";

import {
  handleDiscordRedirect,
  handleGoogleRedirect,
  prepareDiscordAuthMethod,
  prepareGoogleAuthMethod,
  prepareStytchAuthMethod,
} from "@/utils/Lit";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useCallback, useEffect, useState } from "react";
import { authenticateOtp, stytchSendOTP } from "@/utils/StychUI";
import { OTPsLoginOrCreateResponse } from "@stytch/vanilla-js";
import { useAuth } from "@/context/authContext";
import { AuthMethod, IRelayPKP } from "@lit-protocol/types";
import { BaseProvider, isSignInRedirect } from "@lit-protocol/lit-auth-client";
import { useRouter } from "next/router";
import { useStytchSession, useStytchUser } from "@stytch/nextjs";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { POLYGON_ZKEVM } from "@/constants/networks";
import { Payments } from "@/utils/payments";
import { ethers } from "ethers";
import { TaskSuccessful } from "../invite-modal";
import Image from "next/image";
import check from "@/assets/check.gif";
import Link from "next/link";
import {
  createSafeWallet,
  getUserSafe,
  intializeSDK,
  predictSafeWalletAddress,
  prepareSendNativeTransactionData,
} from "@/utils/Safe";
import { addUser } from "../firebase/methods";
// @ts-ignore
import * as publicKeyToAddress from "ethereum-public-key-to-address";
import { Client } from "@xmtp/xmtp-js";
import dynamic from "next/dynamic";

export function CreateAccount() {
  const [email, setEmail] = useState<string>();
  const [mobile, setMobile] = useState<string>();
  const [OTP, setOTP] = useState<string>();
  const [sendRes, setSendRes] = useState<OTPsLoginOrCreateResponse>();
  const router = useRouter();
  const { user } = useStytchUser();
  const { session } = useStytchSession();
  const [accountCreated, setAccountCreated] = useState<boolean | null>(false);

  const { setAuthMethod, setAuthProvider, setProvider, setSafeSDK } = useAuth();
  const { mintOrClaimPKP, fetchPKPsandPrepare } = useAuth();
  const {
    authMethod,
    authProvider,
    pkpWallet,
    PKP,
    provider,
  }: {
    authMethod: AuthMethod;
    authProvider: BaseProvider;
    pkpWallet: PKPEthersWallet;
    PKP: IRelayPKP;
    provider: ethers.providers.JsonRpcProvider;
  } = useAuth();

  const completeStytchAuth = async () => {
    try {
      if (!OTP) {
        console.log("NO OTP FOUND");
        return;
      }
      if (!sendRes) {
        console.log("RELOGIN AFTER SENDING OTP");
        return;
      }
      const res = await authenticateOtp(sendRes?.method_id, OTP);
      console.log(res);
      if (res) {
        const response = await prepareStytchAuthMethod(
          res?.session_jwt,
          res.user_id
        );
        console.log(response);
        setAuthMethod(response.authMethod);
        setAuthProvider(response.authProvider);
        const pkpData = await fetchPKPsandPrepare(
          response.authMethod,
          response.authProvider
        );
        if (pkpData) {
          setAccountCreated(true);
        } else {
          setAccountCreated(null);
        }
        // Send to the final Auth and Acc creation page
      }
    } catch (error) {
      console.log(error);
    }
  };

  //4. handle the redirect for Google or Discord Login
  const handleRedirect = useCallback(async () => {
    console.log("Redirect Called");
    const queryParams = router.query;
    if (queryParams.provider == "google") {
      console.log("Redirect Called google");
      const response = await handleGoogleRedirect();
      setAuthMethod(response.authMethod);
      setAuthProvider(response.authProvider);
      const pkpData = await fetchPKPsandPrepare(
        response.authMethod,
        response.authProvider
      );
      if (pkpData) {
        setAccountCreated(true);
      } else {
        setAccountCreated(null);
      }
      // setAccountCreated(null);
    } else if (queryParams.provider == "discord") {
      console.log("Redirect Called Discord");
      const response = await handleDiscordRedirect();
      setAuthMethod(response.authMethod);
      setAuthProvider(response.authProvider);
      const pkpData = await fetchPKPsandPrepare(
        response.authMethod,
        response.authProvider
      );
      if (pkpData) {
        setAccountCreated(true);
      } else {
        setAccountCreated(null);
      }
    }
    console.log(queryParams);
  }, [router]);

  useEffect(() => {
    // Check if app has been redirected from Lit login server
    // console.log(isSignInRedirect(REDIRECT_URI));
    if (isSignInRedirect("http://localhost:3000/get-started")) {
      console.log(true);
      handleRedirect();
    } else {
      console.log(false);
    }
  }, [handleRedirect]);

  // Check Stytch Cookie and prepare
  const checkStytch = async () => {
    if (session && user) {
      const session_jwt = document.cookie;
      // console.log(session_jwt);
      const JWT = session_jwt.split("stytch_session_jwt=")[1];
      // console.log(JWT);
      const response = await prepareStytchAuthMethod(JWT, user?.user_id);
      console.log(response);
      if (response) {
        setAuthMethod(response.authMethod);
        setAuthProvider(response.authProvider);
      }
    }
  };

  // complete Signup after fetching the PKP , also creating a Safe Account for this address
  const completeNewUserSignup = async () => {
    try {
      console.log(PKP);
      if (!PKP) {
        // Add firebase Methods ( Name , Email , Pfp ,  )
        // addUser()
        console.log("PKP Not found");

        // add the new user
        const res = await mintOrClaimPKP();
        const provider = new ethers.providers.JsonRpcProvider(POLYGON_ZKEVM);
        setProvider(provider);

        // get the user Address and find the safeAddress
        const address = await publicKeyToAddress(res.pubkey);
        const safeSDK = await createSafeWallet(
          address,
          authMethod.authMethodType.toString()
        );
        // safe SDK instance is provider & safeAddress
        console.log(safeSDK);
        setSafeSDK(safeSDK);
        setAccountCreated(true);
      } else {
        console.log("PKP found");
        const provider = new ethers.providers.JsonRpcProvider(POLYGON_ZKEVM);
        setProvider(provider);

        // get the user Address and find the safeAddress
        const address = PKP.ethAddress;
        const safeSDK = await createSafeWallet(
          address,
          authMethod.authMethodType.toString()
        );
        // safe SDK instance is provider & safeAddress
        console.log(safeSDK);
        setSafeSDK(safeSDK);
        setAccountCreated(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signMessage = async () => {
    try {
      if (pkpWallet) {
        await pkpWallet.init();
        await pkpWallet.setRpc(POLYGON_ZKEVM);
        const signature = await pkpWallet?.signMessage("GM Frens");
        console.log(signature);
        console.log(pkpWallet?._isSigner);

        const xmtp = await Client.create(pkpWallet, { env: "dev" });
        console.log(xmtp);
        // const tx = await Payments();
        // const signature2 = await pkpWallet?.signTransaction(tx);
        // console.log(signature2);
        // pkpWallet.rpcProvider;
        // console.log(pkpWallet.rpcProvider);
        // pkpWallet.connect();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signSafeMessage = async () => {
    try {
      if (pkpWallet) {
        const provider = new ethers.providers.JsonRpcProvider(POLYGON_ZKEVM);
        await pkpWallet.init();
        await pkpWallet.setRpc(POLYGON_ZKEVM);
        const userAddress = pkpWallet.address;
        const safeAddress = await predictSafeWalletAddress(
          provider,
          userAddress,
          `${authMethod.authMethodType}`
        );
        console.log(safeAddress);
        if (safeAddress) {
          const resData = await intializeSDK(
            pkpWallet,
            safeAddress,
            true,
            userAddress,
            `${authMethod.authMethodType}`
          );
          console.log(resData);
          const amount = ethers.utils.parseEther("1");
          const response = await prepareSendNativeTransactionData(
            "0x62C43323447899acb61C18181e34168903E033Bf",
            `${amount}`,
            resData.safeSDK
          );

          console.log(response);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {accountCreated === false && (
        <Tabs defaultValue="email" className="w-2/3">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Account</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>
          <TabsContent value="email">
            <Card className="min-h-[300px]">
              <CardHeader>
                <CardTitle>Email Login</CardTitle>
                <CardDescription>
                  Create a new OnBoardr account using your email.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Email</Label>
                  <Input
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    id="email"
                    placeholder="example@mail.com"
                  />
                  {sendRes && (
                    <Input
                      onChange={(e) => setOTP(e.target.value)}
                      type="password"
                      id="otp"
                      placeholder="enter OTP"
                    />
                  )}
                </div>
              </CardContent>
              <CardFooter>
                {/* Need OTP Input Form */}
                {OTP ? (
                  <Button onClick={completeStytchAuth} className=" w-full">
                    Create Account
                  </Button>
                ) : (
                  <Button
                    onClick={async () => {
                      const res = await stytchSendOTP(email, mobile);
                      setSendRes(res);
                      console.log("OTP SENT");
                    }}
                    className=" w-full"
                  >
                    SendOTP
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card className=" min-h-[300px]">
              <CardHeader>
                <CardTitle>Social Login</CardTitle>
                <CardDescription>
                  Login using your social accounts like Google and Discord
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-6">
                  <Button
                    onClick={prepareGoogleAuthMethod}
                    className=" col-span-2"
                    variant="outline"
                  >
                    <Icons.google className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                  <div className=" col-span-2 relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={prepareDiscordAuthMethod}
                    className=" col-span-2"
                    variant="outline"
                  >
                    <Icons.discord className="mr-2 h-4 w-4" />
                    Discord
                  </Button>
                </div>
              </CardContent>
              {/* <CardFooter>
                <CardFooter>
                  <Button
                    onClick={() =>
                      fetchPKPsandPrepare(authMethod, authProvider)
                    }
                    className=" w-full"
                  >
                    Complete Auth
                  </Button>
                  <Button onClick={signMessage} className=" w-full">
                    Sign
                  </Button>
                </CardFooter>
              </CardFooter> */}
            </Card>
          </TabsContent>
        </Tabs>
      )}
      {accountCreated && (
        <Card className=" w-2/3 py-6 min-h-[300px] flex flex-col items-center justify-center">
          <LoginSuccessful
            message="Your account have been created"
            subHeading="Head over to dashboard to explore OnBoardr and kickstrat your journey "
          />
          <Link href={"/dashboard"} className=" my-2">
            <Button>Dashboard</Button>
          </Link>
        </Card>
      )}
      {/* set this to null in case user don't have a PKP */}
      {accountCreated === null && (
        <Card className=" w-2/3 py-6 min-h-[300px] gap-y-6 flex flex-col items-center justify-center">
          <h1 className="  text-xl font-semibold tracking-wide">
            You need to mint your PKP to create your account
          </h1>

          <Button onClick={completeNewUserSignup}>Mint</Button>
          <p className=" text-center text-gray-400 text-sm max-w-[90%]">
            PKP is blockchain Account associated with their your Social/Email
            Accounts
          </p>
        </Card>
      )}
      {/* // dark:bg-fixed dark:bg-gradient-to-t to-[#070a12] via-[#0c0214]
      from-[#120131] */}
    </>
  );
}

const LoginSuccessful = ({
  message,
  subHeading,
}: {
  message: string;
  subHeading?: string;
}) => {
  return (
    <div className=" py-4 flex flex-col items-center justify-center gap-y-6 w-full h-full">
      <h1 className="  text-xl font-semibold tracking-wide">{message}</h1>
      <div className="  border-4 border-green-600 rounded-full w-24 h-24 p-5 mx-auto">
        <Image className=" max-w-[40px] mx-auto  " src={check} alt="check" />
      </div>
      <p className=" text-center text-gray-400 text-sm">{subHeading}</p>
      {/* <TaskSuccessful message="Your account have been created succesfully" /> */}
    </div>
  );
};

// const MintPKP = ({
//   message,
//   subHeading,
// }: {
//   message: string;
//   subHeading?: string;
// }) => {
//   return (
//     <div className=" py-4 flex flex-col items-center justify-center gap-y-6 w-full h-full">
//       <h1 className="  text-xl font-semibold tracking-wide">{message}</h1>
//       {/* <div className="  border-4 border-green-600 rounded-full w-24 h-24 p-5 mx-auto">
//         <Image className=" max-w-[40px] mx-auto  " src={check} alt="check" />
//       </div> */}
//       <p className=" text-center text-gray-400 text-sm">{subHeading}</p>
//       {/* <TaskSuccessful message="Your account have been created succesfully" /> */}
//     </div>
//   );
// };
