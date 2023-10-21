import { ethers } from "ethers";
import { GelatoRelayPack } from "@safe-global/relay-kit";
import Safe, {
  EthersAdapter,
  SafeConfig,
  SafeFactory,
} from "@safe-global/protocol-kit";
import {
  MetaTransactionData,
  MetaTransactionOptions,
  OperationType,
  SafeTransactionData,
  SafeTransactionDataPartial,
} from "@safe-global/safe-core-sdk-types";
import SafeApiKit from "@safe-global/api-kit";

const GELATO_RELAY_API_KEY = process.env.NEXT_PUBLIC_GELATO_RELAY_API_KEY;
console.log(GELATO_RELAY_API_KEY);
const chainId = 5;
const gasLimit = 100000;
const SAFE_API_SERVICE_URL = "https://safe-transaction-zkevm.safe.global/";

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
  signerOrProvider: ethers.Signer | ethers.providers.Provider,
  safeAddress: string,
  isPredicted: boolean,
  ownerAddress: string,
  nonce: string // auth Method Id
): Promise<{ safeSDK: Safe; relayKit: GelatoRelayPack }> => {
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signerOrProvider,
  });

  const owners = [ownerAddress];
  const threshold = 1;

  let config: SafeConfig;
  if (isPredicted) {
    config = {
      ethAdapter,
      predictedSafe: {
        safeAccountConfig: {
          owners,
          threshold,
        },
        safeDeploymentConfig: {
          saltNonce: nonce,
        },
      },
    };
  } else {
    config = {
      ethAdapter,
      safeAddress,
    };
  }

  const safeSDK = await Safe.create(config);

  const relayKit = new GelatoRelayPack(GELATO_RELAY_API_KEY);

  return { safeSDK, relayKit };
};

// txData =  "0x" in case of Native
// prepare Native send tx
export const prepareSendNativeTransactionData = async (
  destinationAddress: string,
  withdrawAmount: string,
  safeSDK: Safe
): Promise<string | undefined> => {
  const safeTransactionData: SafeTransactionDataPartial = {
    to: destinationAddress,
    data: "0x", // leave blank for native token transfers
    value: withdrawAmount,
    operation: OperationType.Call,
  };

  const safeTransaction = await safeSDK.createTransaction({
    safeTransactionData,
  });

  // safeSDK.getContractManager().safeContract?.encode
  console.log(safeTransaction);
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

  console.log(encodedTx);

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

const intializeSafeAPI = (signer: ethers.Signer) => {
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });

  const safeSAPIService = new SafeApiKit({
    txServiceUrl: SAFE_API_SERVICE_URL,
    ethAdapter,
  });

  return safeSAPIService;
};

export const getUserSafe = async (signer: ethers.Signer) => {
  const userAddress = await signer.getAddress();

  const safeService = intializeSafeAPI(signer);

  // console.log(userAddress)
  const safes = await safeService.getSafesByOwner(userAddress);
  // console.log(safes);

  const safeAddress = safes.safes[0];
  // console.log(safeAddress)
  return safeAddress;
};

export const enableModule = async (safeSdk: Safe, moduleAddress: string) => {
  const safeTransaction = await safeSdk.createEnableModuleTx(moduleAddress);
  const txResponse = await safeSdk.executeTransaction(safeTransaction);
  await txResponse.transactionResponse?.wait();

  console.log(txResponse);
  return txResponse;
};

export const createSafeWallet = async (
  signer: ethers.Signer,
  nonce: string // Auth Method Id
): Promise<Safe | undefined> => {
  try {
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    });

    const safeFactory = await SafeFactory.create({
      ethAdapter: ethAdapter,
    });

    const owners = [`${await signer.getAddress()}`];
    const threshold = 1;

    const safeAddress = await getUserSafe(signer);
    console.log(safeAddress);
    if (safeAddress) {
      const safeSDK = await Safe.create({ ethAdapter, safeAddress });
      return safeSDK;
    }

    const safeAccountConfig = {
      owners,
      threshold,
    };

    console.log(safeAccountConfig);
    // / Will it have gas fees to deploy this safe tx
    const safeSdk = await safeFactory.deploySafe({
      safeAccountConfig,
      saltNonce: nonce,
    });

    console.log("Creating and deploying the new safe");

    // / wait for the deployement to be completed
    const newSafeAddress = safeSdk.getAddress();

    console.log(newSafeAddress);

    /// On Continue, direct to the home page
    return safeSdk;
  } catch (error) {
    console.log(error);
  }
};

export const predictSafeWalletAddress = async (
  signerOrProvider: ethers.Signer | ethers.providers.Provider,
  ownerAddress: string,
  nonce: string // auth Method Id
): Promise<string | undefined> => {
  try {
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signerOrProvider,
    });

    const safeFactory = await SafeFactory.create({
      ethAdapter: ethAdapter,
    });

    const owners = [ownerAddress];
    const threshold = 1;

    const safeAccountConfig = {
      owners,
      threshold,
    };

    console.log(safeAccountConfig);
    // / Will it have gas fees to deploy this safe tx
    const predictedSafeAddress = await safeFactory.predictSafeAddress(
      safeAccountConfig,
      nonce
    );

    console.log("Predicted Safe Address", predictSafeWalletAddress);

    /// On Continue, direct to the home page
    return predictedSafeAddress;
  } catch (error) {
    console.log(error);
  }
};
