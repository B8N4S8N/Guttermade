import { gql } from "@apollo/client/core";
import { apolloClient } from "./apollo-client";
import { login } from "./auth";
import {
  getAddressFromSigner,
  signedTypeData,
  splitSignature,
  getSigner,
} from "./ethers.service";
import { lensHub } from "./lens-hub";
import { prettyJSON } from "./helpers";
import { pollUntilIndexed } from "./indexer";
import { LENS_FOLLOW_NFT_ABI } from "./config";
import { ethers } from "ethers";

// Follow
const CREATE_FOLLOW_TYPED_DATA = `
  mutation($request: FollowRequest!) { 
    createFollowTypedData(request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          FollowWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          profileIds
          datas
        }
      }
    }
 }
`;

const createFollowTypedData = (followRequestInfo: any) => {
  return apolloClient.mutate({
    mutation: gql(CREATE_FOLLOW_TYPED_DATA),
    variables: {
      request: {
        follow: followRequestInfo,
      },
    },
  });
};

export const follow = async (profileId: string) => {
  const address = await getAddressFromSigner();
  console.log(address);
  console.log("follow: address", address);

  await login(address);

  // hard coded to make the code example clear
  const followRequest = [
    {
      profile: profileId,
    },
  ];

  const result = await createFollowTypedData(followRequest);
  console.log("follow: result", result);

  const typedData = result.data.createFollowTypedData.typedData;
  console.log("follow: typedData", typedData);

  const signature = await signedTypeData(
    typedData.domain,
    typedData.types,
    typedData.value,
  );
  console.log("follow: signature", signature);

  const { v, r, s } = splitSignature(signature);

  const tx = await lensHub.followWithSig({
    follower: getAddressFromSigner(),
    profileIds: typedData.value.profileIds,
    datas: typedData.value.datas,
    sig: {
      v,
      r,
      s,
      deadline: typedData.value.deadline,
    },
  });
  console.log("follow: tx hash", tx.hash);

  // wait for tx to be indexed
  await pollUntilIndexed(tx.hash);

  console.log("follow transactoin has been indexed", tx.hash);

  return tx.hash;
};

// Unfollow
const CREATE_UNFOLLOW_TYPED_DATA = `
  mutation($request: UnfollowRequest!) { 
    createUnfollowTypedData(request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          BurnWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          tokenId
        }
      }
    }
 }
`;

const createUnfollowTypedData = (profile: string) => {
  return apolloClient.mutate({
    mutation: gql(CREATE_UNFOLLOW_TYPED_DATA),
    variables: {
      request: {
        profile,
      },
    },
  });
};

export const unfollow = async (profileId: string) => {
  const address = await getAddressFromSigner();
  console.log("unfollow: address", address);

  await login(address);

  // hard coded to make the code example clear
  const result = await createUnfollowTypedData(profileId);
  console.log("unfollow: result", result);

  const typedData = result.data.createUnfollowTypedData.typedData;
  prettyJSON("unfollow: typedData", typedData);

  const signature = await signedTypeData(
    typedData.domain,
    typedData.types,
    typedData.value,
  );
  console.log("unfollow: signature", signature);

  const { v, r, s } = splitSignature(signature);

  // load up the follower nft contract
  const followNftContract = new ethers.Contract(
    typedData.domain.verifyingContract,
    LENS_FOLLOW_NFT_ABI,
    getSigner(),
  );

  const sig = {
    v,
    r,
    s,
    deadline: typedData.value.deadline,
  };

  // force the tx to send
  const tx = await followNftContract.burnWithSig(typedData.value.tokenId, sig);
  console.log("follow: tx hash", tx.hash);

  // wait for tx to be indexed
  await pollUntilIndexed(tx.hash);
  console.log("unfollow transactoin has been indexed", tx.hash);
};

// Does Follow
const DOES_FOLLOW = `
  query($request: DoesFollowRequest!) {
    doesFollow(request: $request) { 
			followerAddress
    	profileId
    	follows
		}
  }
`;

const doesFollowRequest = (
  followInfos: { followerAddress: string; profileId: string }[],
) => {
  return apolloClient.query({
    query: gql(DOES_FOLLOW),
    variables: {
      request: {
        followInfos,
      },
    },
    fetchPolicy: "no-cache",
  });
};

export const doesFollow = async (
  followerAddress: string,
  profileId: string,
) => {
  const followInfos = [
    {
      followerAddress,
      profileId,
    },
  ];

  const result = await doesFollowRequest(followInfos);
  prettyJSON("does follow: result", result.data);

  return result.data.doesFollow;
};
