import * as stytch from "stytch";
// import { StytchUIClient } from "@stytch/vanilla-js";

const STYTCH_PROJECT_ID: string | undefined =
  process.env.NEXT_PUBLIC_STYTCH_PROJECT_ID;
const STYTCH_SECRET: string | undefined = process.env.NEXT_PUBLIC_STYTCH_SECRET;
const STYTCH_PUBLIC_TOKEN: string | undefined =
  process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN;

if (!STYTCH_PROJECT_ID || !STYTCH_SECRET || !STYTCH_PUBLIC_TOKEN) {
  throw Error("Could not find stytch project secret or id in enviorment");
}
// console.log(STYTCH_PROJECT_ID, STYTCH_SECRET);

const stytchClient = new stytch.Client({
  project_id: STYTCH_PROJECT_ID,
  secret: STYTCH_SECRET,
});

// const stytchUI = new StytchUIClient(STYTCH_PUBLIC_TOKEN);

// FLOW
// 1. Search the User via the mobile , email
// 2. If don't exist , create the User via method of choice
// 3. Once User IDs is there , then compute keyID
// 4. Claim the key once when some interaction happense
// 5. Later , Once the user comes on the platform , allow them to authenticate
// 6. Then mint the PKP for the same account
// 7. Use the PKP with an AA method to sign a tx

export const getUser = async (
  mobile: string | undefined,
  email: string | undefined
) => {
  if (mobile || email) {
    const searchResult = await searchUser(mobile, email);
    // console.log(searchResult);
    // if user is there , return the user with data
    if (searchResult?.length) {
      return searchResult;
    } else {
      // create the User
      if (mobile) {
        const res = await createUserIdMobile(mobile);
        return res;
      } else if (email) {
        const res = createUserIdEmail(email);
        return res;
      }
    }
  }
};

export const searchUser = async (
  mobile: string | undefined,
  email: string | undefined
) => {
  // console.log(mobile, email);
  let params: stytch.UsersSearchRequest = {};
  if (mobile) {
    params = {
      query: {
        operator: "OR",
        operands: [
          {
            filter_name: "phone_number",
            filter_value: [mobile],
          },
        ],
      },
    };
  } else if (email) {
    params = {
      query: {
        operator: "OR",
        operands: [
          {
            filter_name: "email_address",
            filter_value: [email],
          },
        ],
      },
    };
  }
  // console.log(params.query?.operands[0]);
  if (params.query) {
    try {
      const response = await stytchClient.users.search(params);
      const result = response.results;
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
};

export const createUserIdEmail = async (email: string) => {
  const params = {
    email: email,
  };

  try {
    const response = await stytchClient.users.create(params);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const createUserIdMobile = async (mobile: string) => {
  const params: stytch.UsersCreateRequest = {
    phone_number: mobile,
  };

  try {
    const response = await stytchClient.users.create(params);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const stytchOtpMethod = async (
  email: string,
  otp: string
): Promise<{ session_jwt: string; user_id: string }> => {
  // we have all the options stytch offers , Email , Phone, Whatsap
  const stytchResponse = await stytchClient.otps.email.loginOrCreate({
    email: email,
  });

  // get Otp from the user
  const authResponse = await stytchClient.otps.authenticate({
    method_id: stytchResponse.email_id,
    code: otp,
    session_duration_minutes: 60 * 24 * 7,
  });

  const session_token = authResponse.session_token;

  const sessionStatus = await stytchClient.sessions.authenticate({
    session_token: authResponse.session_token,
  });

  const session_jwt = sessionStatus.session_jwt;
  const user_id = sessionStatus.session.user_id;

  return {
    session_jwt,
    user_id,
  };
};
