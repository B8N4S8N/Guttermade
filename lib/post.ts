import { gql } from "@apollo/client/core";
import { apolloClient } from "./apollo-client";
import { login } from "./auth";
import {
  getAddressFromSigner,
  signedTypeData,
  splitSignature,
} from "./ethers.service";
import { uploadIpfs } from "./ipfs";
import { lensHub } from "./lens-hub";
import { enabledCurrencies } from "./currencies";

const CREATE_POST_TYPED_DATA = `
  mutation($request: CreatePublicPostRequest!) { 
    createPostTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          PostWithSig {
            name
            type
          }
        }
      domain {
        name
        chainId
        version
        verifyingContract
      }
      value {
        nonce
        deadline
        profileId
        contentURI
        collectModule
        collectModuleData
        referenceModule
        referenceModuleData
      }
    }
  }
}
`;

//TODO typings
const createPostTypedData = (createPostTypedDataRequest: any) => {
  return apolloClient.mutate({
    mutation: gql(CREATE_POST_TYPED_DATA),
    variables: {
      request: createPostTypedDataRequest,
    },
  });
};

export const createPost = async (profileId: string, ipfsPath: string) => {
  if (!profileId) {
    throw new Error("Must define profiledId to run this");
  }

  const address = await getAddressFromSigner();
  console.log("create post: address", address);

  await login(address);

  const currencies = await enabledCurrencies();

  // hard coded to make the code example clear
  const createPostRequest = {
    profileId,
    contentURI: "ipfs://" + ipfsPath,
    collectModule: {
      // feeCollectModule: {
      //   amount: {
      //     currency: currencies.enabledModuleCurrencies.map(
      //       (c: any) => c.address,
      //     )[0],
      //     value: "0.000001",
      //   },
      //   recipient: address,
      //   referralFee: 10.5,
      // },
      revertCollectModule: true,
      // limitedFeeCollectModule: {
      //   amount: {
      //     currency: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
      //     value: '2',
      //   },
      //   collectLimit: '20000',
      //   recipient: '0x3A5bd1E37b099aE3386D13947b6a90d97675e5e3',
      //   referralFee: 0,
      // },
    },
    referenceModule: {
      followerOnlyReferenceModule: false,
    },
  };

  console.log("--->", createPostRequest);

  const result = await createPostTypedData(createPostRequest);
  console.log("create post: createPostTypedData", result);

  const typedData = result.data.createPostTypedData.typedData;
  console.log("create post: typedData", typedData);

  const signature = await signedTypeData(
    typedData.domain,
    typedData.types,
    typedData.value,
  );
  console.log("create post: signature", signature);

  const { v, r, s } = splitSignature(signature);

  const tx = await lensHub.postWithSig({
    profileId: typedData.value.profileId,
    contentURI: typedData.value.contentURI,
    collectModule: typedData.value.collectModule,
    collectModuleData: typedData.value.collectModuleData,
    referenceModule: typedData.value.referenceModule,
    referenceModuleData: typedData.value.referenceModuleData,
    sig: {
      v,
      r,
      s,
      deadline: typedData.value.deadline,
    },
  });
  console.log("create post: tx hash", tx.hash);
};
