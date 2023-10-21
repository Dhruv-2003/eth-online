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
import { AuthMethod } from "@lit-protocol/types";
import { BaseProvider, isSignInRedirect } from "@lit-protocol/lit-auth-client";
import { useRouter } from "next/router";
import { useStytchSession, useStytchUser } from "@stytch/nextjs";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { POLYGON_ZKEVM } from "@/constants/networks";
import { Payments } from "@/utils/payments";
import { ethers } from "ethers";

export function CreateAccount() {
  const [email, setEmail] = useState<string>();
  const [mobile, setMobile] = useState<string>();
  const [OTP, setOTP] = useState<string>();
  const [sendRes, setSendRes] = useState<OTPsLoginOrCreateResponse>();
  const router = useRouter();
  const { user } = useStytchUser();
  const { session } = useStytchSession();

  const { setAuthMethod, setAuthProvider } = useAuth();
  const { mintOrClaimPKP, fetchPKPsandPrepare } = useAuth();
  const {
    authMethod,
    authProvider,
    pkpWallet,
  }: {
    authMethod: AuthMethod;
    authProvider: BaseProvider;
    pkpWallet: PKPEthersWallet;
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
    } else if (queryParams.provider == "discord") {
      console.log("Redirect Called Discord");
      const response = await handleDiscordRedirect();
      setAuthMethod(response.authMethod);
      setAuthProvider(response.authProvider);
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

  // const signMessage = async () => {
  //   try {
  //     if (pkpWallet) {
  //       await pkpWallet.init();
  //       await pkpWallet.setRpc(POLYGON_ZKEVM);
  //       // const signature = await pkpWallet?.signMessage("GM Frens");
  //       // console.log(signature);
  //       console.log(pkpWallet?._isSigner);

  //       // const tx = await Payments();
  //       // const signature2 = await pkpWallet?.signTransaction(tx);
  //       // console.log(signature2);
  //       pkpWallet.rpcProvider;

  //       console.log(pkpWallet.rpcProvider);

  //       // pkpWallet.connect();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <>
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
            <CardFooter>
              {/* <Button onClick={fetchPKPsandPrepare} className=" w-full">
                Complete Auth
              </Button> */}
              {/* <Button onClick={signMessage} className=" w-full">
                Sign
              </Button> */}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      {/* // dark:bg-fixed dark:bg-gradient-to-t to-[#070a12] via-[#0c0214]
      from-[#120131] */}
    </>
  );
}
