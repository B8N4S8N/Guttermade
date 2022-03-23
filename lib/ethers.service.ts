import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import { ethers, utils } from "ethers";
import { omit } from "./helpers";

// getSigner function from injected web3 provider
export const getSigner = () => {
  // handle window is not defined
  if (typeof window === "undefined") {
    return null;
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log("provider: ", provider);
  return provider.getSigner();
};

export const getAddressFromSigner = () => {
  return getSigner().getAddress();
};

export const signedTypeData = (
  domain: TypedDataDomain,
  types: Record<string, TypedDataField[]>,
  value: Record<string, any>,
) => {
  const signer = getSigner();
  // remove the __typedname from the signature!
  return signer._signTypedData(
    omit(domain, "__typename"),
    omit(types, "__typename"),
    omit(value, "__typename"),
  );
};

export const splitSignature = (signature: string) => {
  return utils.splitSignature(signature);
};

export const sendTx = (
  transaction: ethers.utils.Deferrable<ethers.providers.TransactionRequest>,
) => {
  const signer = getSigner();
  return signer.sendTransaction(transaction);
};

export const signText = (text: string) => {
  return getSigner().signMessage(text);
};
