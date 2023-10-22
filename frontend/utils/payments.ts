import { SDAI_ABI, SDAI_TOKEN_ZKEVM } from "@/constants/contracts";
import { POLYGON_ZKEVM } from "@/constants/networks";
import { ethers, PopulatedTransaction } from "ethers";
import { prepareSendTransaction } from "wagmi/actions";
import {
  createSafeWallet,
  intializeSDKNormal,
  sendTransactionSyncFee,
} from "./Safe";

export const performPayTransactionSafe = async (
  signer: ethers.Signer,
  recieverAddress: string,
  amount: string
) => {
  const address = await signer.getAddress();
  const res = await createSafeWallet(address, "1");
  const safeAddress = await res?.getAddress();
  console.log(safeAddress);
  const encodedTx = await getEncodedPaymentsTx(recieverAddress, amount);
  if (!encodedTx.to) return;
  if (!encodedTx.data) return;
  if (!safeAddress) return;
  const sdkData = await intializeSDKNormal(signer, safeAddress);
  const tx = await sendTransactionSyncFee(
    encodedTx.to,
    sdkData.safeSDK,
    sdkData.relayKit,
    encodedTx.data,
    "0"
  );
  console.log(tx);
};

export const getEncodedPaymentsTx = async (
  recieverAddress: string,
  amount: string
): Promise<PopulatedTransaction> => {
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
  console.log(txData);
  return txData;

  // tx can be signed and then sent via relayer or directly
};
