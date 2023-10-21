import { SDAI_ABI, SDAI_TOKEN_ZKEVM } from "@/constants/contracts";
import { POLYGON_ZKEVM } from "@/constants/networks";
import { ethers, PopulatedTransaction } from "ethers";
import { prepareSendTransaction } from "wagmi/actions";

export const Payments = async (): Promise<PopulatedTransaction> => {
  const recieverAddress: `0x${string}` =
    "0x898d0DBd5850e086E6C09D2c83A26Bb5F1ff8C33";
  const amount = "1";
  const provider = new ethers.providers.JsonRpcProvider(POLYGON_ZKEVM);

  const tokenContract = new ethers.Contract(
    // polygon mumbai usdc address
    SDAI_TOKEN_ZKEVM,
    SDAI_ABI,
    provider
  );

  let decimals = 18;

  try {
    decimals = await tokenContract.decimals();
  } catch (error) {
    throw new Error("invalid token address supplied");
  }

  const txData = await tokenContract.populateTransaction.transfer(
    recieverAddress, // receiver address
    ethers.utils.parseUnits(amount.toString(), decimals)
  );

  // const tx = {
  //   to: SDAI_TOKEN_ZKEVM,
  //   data: data,
  //   value: "0",
  // };

  return txData;

  // tx can be signed and then sent via relayer or directly
};
