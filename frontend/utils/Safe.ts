import { ethers } from "ethers";
import { GelatoRelayPack } from "@safe-global/relay-kit";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import {
  MetaTransactionData,
  MetaTransactionOptions,
  OperationType,
  SafeTransactionData,
  SafeTransactionDataPartial,
} from "@safe-global/safe-core-sdk-types";

const GELATO_RELAY_API_KEY = process.env.NEXT_PUBLIC_GELATO_RELAY_API_KEY;
console.log(GELATO_RELAY_API_KEY);
const chainId = 5;
const gasLimit = 100000;

const options = {
  gasLimit: ethers.BigNumber.from(gasLimit),
  isSponsored: true,
};

const optionsSyncFee = {
  gasLimit: ethers.BigNumber.from(gasLimit),
  isSponsored: false,
};

// initialise Safe SDK and relay Kit
export const intializeSDK = async (
  signer: ethers.Signer,
  safeAddress: string
): Promise<{ safeSDK: Safe; relayKit: GelatoRelayPack }> => {
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });

  const safeSDK = await Safe.create({
    ethAdapter,
    safeAddress,
  });
  const relayKit = new GelatoRelayPack(GELATO_RELAY_API_KEY);

  return { safeSDK, relayKit };
};

// txData =  "0x" in case of Native
// prepare Native send tx
export const prepareSendNativeTransactionData = async (
  destinationAddress: string,
  withdrawAmount: string,
  safeSDK: Safe
) => {
  const safeTransactionData: SafeTransactionDataPartial = {
    to: destinationAddress,
    data: "0x", // leave blank for native token transfers
    value: withdrawAmount,
    operation: OperationType.Call,
  };

  const safeTransaction = await safeSDK.createTransaction({
    safeTransactionData,
  });

  const signedSafeTx = await safeSDK.signTransaction(safeTransaction);
  if (!safeSDK) return;
  const encodedTx = safeSDK
    .getContractManager()
    .safeContract?.encode("execTransaction", [
      signedSafeTx.data.to,
      signedSafeTx.data.value,
      signedSafeTx.data.data,
      signedSafeTx.data.operation,
      signedSafeTx.data.safeTxGas,
      signedSafeTx.data.baseGas,
      signedSafeTx.data.gasPrice,
      signedSafeTx.data.gasToken,
      signedSafeTx.data.refundReceiver,
      signedSafeTx.encodedSignatures(),
    ]);

  return encodedTx;
};

// prepare all type of transactions only to for safe
export const prepareSendTransactionData = async (
  destinationAddress: string,
  encodedData: string,
  safeSDK: Safe
) => {
  const safeTransactionData: SafeTransactionDataPartial = {
    to: destinationAddress,
    data: encodedData,
    value: "0",
    operation: OperationType.Call,
  };

  const safeTransaction = await safeSDK.createTransaction({
    safeTransactionData,
  });

  const signedSafeTx = await safeSDK.signTransaction(safeTransaction);
  if (!safeSDK) return;
  const encodedTx = safeSDK
    .getContractManager()
    .safeContract?.encode("execTransaction", [
      signedSafeTx.data.to,
      signedSafeTx.data.value,
      signedSafeTx.data.data,
      signedSafeTx.data.operation,
      signedSafeTx.data.safeTxGas,
      signedSafeTx.data.baseGas,
      signedSafeTx.data.gasPrice,
      signedSafeTx.data.gasToken,
      signedSafeTx.data.refundReceiver,
      signedSafeTx.encodedSignatures(),
    ]);

  return encodedTx;
};

// send any type of encoded Data vias Sync FEE , paid from the Safe
export const sendTokenTransactionSyncFee = async (
  destinationAddress: string,
  safeSDK: Safe,
  relayKit: GelatoRelayPack,
  encodedData: string
) => {
  const safeTransactionData: MetaTransactionData[] = [
    {
      to: destinationAddress,
      data: encodedData, // leave blank for native token transfers
      operation: OperationType.Call,
      value: "0",
    },
  ];

  //   const safeTransaction = await safeSDK.createTransaction({
  //     safeTransactionData,
  //   });

  const safeTransaction = await relayKit.createRelayedTransaction({
    safe: safeSDK,
    transactions: safeTransactionData,
  });

  const signedSafeTransaction = await safeSDK.signTransaction(safeTransaction);

  const response = await relayKit.executeRelayTransaction(
    signedSafeTransaction,
    safeSDK
  );

  console.log(
    `Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`
  );
};

// send any tx via 1 balance , Paid through the gas Tank
export const sendTokenTransaction1Balance = async (
  destinationAddress: string,
  safeSDK: Safe,
  relayKit: GelatoRelayPack,
  encodedData: string
) => {
  const safeTransactionData: MetaTransactionData[] = [
    {
      to: destinationAddress,
      data: encodedData, // leave blank for native token transfers
      operation: OperationType.Call,
      value: "0",
    },
  ];

  const options: MetaTransactionOptions = {
    isSponsored: true,
  };

  //   const safeTransaction = await safeSDK.createTransaction({
  //     safeTransactionData,
  //   });

  const safeTransaction = await relayKit.createRelayedTransaction({
    safe: safeSDK,
    transactions: safeTransactionData,
    options,
  });

  const signedSafeTransaction = await safeSDK.signTransaction(safeTransaction);

  const response = await relayKit.executeRelayTransaction(
    signedSafeTransaction,
    safeSDK,
    options
  );

  console.log(
    `Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`
  );
};
