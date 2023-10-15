import {
  OTPsAuthenticateResponse,
  StytchUIClient,
  OTPsLoginOrCreateResponse,
} from "@stytch/vanilla-js";
import { createStytchUIClient } from "@stytch/nextjs/ui";

const STYTCH_PUBLIC_TOKEN: string | undefined =
  process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN;

if (!STYTCH_PUBLIC_TOKEN) {
  throw Error("Could not find stytch project secret or id in enviorment");
}

// const stytchClient = new StytchUIClient(STYTCH_PUBLIC_TOKEN);
const stytchClient = createStytchUIClient(STYTCH_PUBLIC_TOKEN);

// User can be authenticated with any methods they want
// Some method might require User Id to be sent, like OAuth all methods
export const stytchSendOTP = async (
  email: string | undefined,
  phone: string | undefined
) => {
  try {
    if (email) {
      const res = await stytchClient.otps.email.loginOrCreate(email);
      return res;
    } else if (phone) {
      const res = await stytchClient.otps.sms.loginOrCreate(phone);
      return res;
    }
  } catch (error) {
    console.log(error);
  }
};

// session JWT to be used for auth Method
export const authenticateOtp = async (
  method_id: string,
  otp: string
): Promise<OTPsAuthenticateResponse | undefined> => {
  try {
    const res = await stytchClient.otps.authenticate(otp, method_id, {
      session_duration_minutes: 60,
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
