import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";

import type { Meta, WithChildren } from "@/types";
import { follow, unfollow, doesFollow } from "@/lib/follow";
import { useAccount, useConnect } from "wagmi";
import toast, { Toaster } from "react-hot-toast";
import { rootname, server } from "config";
import LoadingDots from "../app/loading-dots";

interface LayoutProps extends WithChildren {
  meta?: Meta;
  siteId?: string;
  subdomain?: string;
}

export default function Layout({ meta, children, subdomain }: LayoutProps) {
  const [scrolled, setScrolled] = useState(false);
  const [{ data, error }, connect] = useConnect();
  const [{ data: accountData }, disconnect] = useAccount({ fetchEns: true });
  const [following, setFollowing] = useState(false);
  const [followed, setFollowed] = useState(false);

  const onScroll = useCallback(() => {
    setScrolled(window.pageYOffset > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  useEffect(() => {
    async function checkFollow() {
      if (!accountData?.address || !meta?.profileId) return;
      const followers = await doesFollow(accountData?.address, meta.profileId);
      if (followers.length < 1) return;
      if (followers[0].follows) {
        setFollowed(true);
      } else {
        setFollowed(false);
      }
    }
    checkFollow();
  }, [accountData, meta, following]);



  const [closeModal, setCloseModal] = useState<boolean>(
    !!Cookies.get("closeModal")
  );

  useEffect(() => {
    if (closeModal) {
      Cookies.set("closeModal", "true");
    } else {
      Cookies.remove("closeModal");
    }
  }, [closeModal]);

  const onFollow = async (profileId: string | undefined) => {
    if (!profileId) return;
    setFollowing(true);
    try {
      await follow(profileId);
    } catch (e: any) {
      toast.error(e.message);
    }
    setFollowing(false);
  }

  const onUnfollow = async (profileId: string | undefined) => {
    if (!profileId) return;
    setFollowing(true);
    try {
      await unfollow(profileId);
    } catch (e: any) {
      toast.error(e.message);
    }
    setFollowing(false);
  }


  return (
    <div>
      <Head>
        <title>{meta?.title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" type="image/x-icon" href={meta?.logo} />
        <link rel="apple-touch-icon" sizes="180x180" href={meta?.logo} />
        <meta name="theme-color" content="#7b46f6" />

        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta itemProp="name" content={meta?.title} />
        <meta itemProp="description" content={meta?.description} />
        <meta itemProp="image" content={meta?.ogImage} />
        <meta name="description" content={meta?.description} />
        <meta property="og:title" content={meta?.title} />
        <meta property="og:description" content={meta?.description} />
        <meta property="og:url" content={meta?.ogUrl} />
        <meta property="og:image" content={meta?.ogImage} />
        <meta property="og:type" content="website" />

        {/* <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@punk3" />
        <meta name="twitter:creator" content="@punk3" />
        <meta name="twitter:title" content={meta?.title} />
        <meta name="twitter:description" content={meta?.description} />
        <meta name="twitter:image" content={meta?.ogImage} /> */}
        {subdomain != "demo" && <meta name="robots" content="noindex" />}
      </Head>
      <div
        className={`fixed w-full ${scrolled ? "drop-shadow-md" : ""
          }  top-0 left-0 right-0 h-16 bg-white z-30 transition-all ease duration-150 flex`}
      >
        <div className="flex items-center justify-between w-full max-w-4xl mx-7 md:mx-auto">
          <div className="flex justify-center items-center space-x-5">
            <Link href="/" passHref>
              <a className="flex justify-center items-center">
                {meta?.logo && (
                  <div className="h-8 w-8 inline-block overflow-hidden align-middle">
                    <Image
                      alt={meta?.title}
                      src={meta?.logo}
                      height={40}
                      width={40}
                    />
                  </div>
                )}
                <span className="inline-block ml-3 font-medium truncate">
                  {meta?.title}
                </span>
              </a>
            </Link>
          </div>
          {accountData ?
            <button
              onClick={() => {
                followed ? onUnfollow(meta?.profileId) : onFollow(meta?.profileId)
              }}
              className={`${following
                ? "cursor-not-allowed bg-gray-300 border-gray-300"
                : followed ?
                  "bg-black border-black text-white hover:bg-pink-100 hover:border-pink-100"
                  : "text-white bg-black border-black hover:bg-white hover:text-black"
                } group inline-block font-cal tracking-wide w-24 border-2 py-2 transition-all ease-in-out duration-150 text-center`}
            >
              {following ? <LoadingDots /> :
                followed ? (<><span className="group-hover:hidden">Following</span><span className="hidden group-hover:inline group-hover:text-red-500">Unfollow</span></>) : "Follow"}
            </button>
            :
            <button
              onClick={() => {
                connect(data.connectors[0]);
              }}
              className="inline-block font-cal tracking-wide text-white bg-black border-black border-2 text-center w-28 py-2 hover:bg-white hover:text-black transition-all ease-in-out duration-150"
            >
              MetaMask
            </button>}
        </div>
      </div>

      <div className="mt-20">{children}</div>

      {
        subdomain == "demo" && (
          <div
            className={`${closeModal ? "h-14 lg:h-auto" : "lg:h-auto sm:h-40 h-60"
              } max-w-screen-xl xl:mx-auto mx-5 rounded-lg px-5 lg:pt-3 pt-0 pb-3 flex flex-col lg:flex-row space-y-3 lg:space-y-0 justify-between items-center sticky bottom-5 bg-white border-t-4 border-black
          drop-shadow-lg transition-all ease-in-out duration-150`}
          >
            <button
              onClick={() => setCloseModal(!closeModal)}
              className={`${closeModal ? "rotate-180" : "rotate-0"
                } lg:hidden absolute top-2 right-3 text-black transition-all ease-in-out duration-150`}
            >
              <svg
                viewBox="0 0 24 24"
                width="30"
                height="30"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                shapeRendering="geometricPrecision"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div className="text-center lg:text-left">
              <p className="font-cal text-lg sm:text-2xl text-black">
                punk3.xyz demo
              </p>
              <p
                className={`${closeModal ? "lg:block hidden" : ""
                  } text-sm text-gray-700 mt-2 lg:mt-0`}
              >
                This is a demo site showcasing how to build a web3 blog with{" "}
                <a
                  href={server()}
                  target="_blank"
                  className="text-black font-semibold underline"
                >
                  punk3.xyz
                </a>{" "}
                support.
              </p>
            </div>
            <div
              className={`${closeModal ? "lg:flex hidden" : ""
                } flex space-y-3 sm:space-y-0 sm:space-x-3 sm:flex-row flex-col lg:w-auto w-full text-center`}
            >
              {/* <a
              href="https://app.punk3.xyz"
              target="_blank"
              className="flex-auto font-cal text-lg rounded-md py-1 sm:py-3 px-5 text-black border border-gray-200 hover:border-black transition-all ease-in-out duration-150 whitespace-no-wrap"
            >
              Create your publication
            </a> */}
              <a
                href={server()}
                target="_blank"
                className="flex-auto font-cal text-lg bg-black text-white border border-black rounded-md py-1 sm:py-3 px-5 hover:text-black hover:bg-white transition-all ease-in-out duration-150 whitespace-no-wrap"
              >
                Create your blog
              </a>
            </div>
          </div>
        )
      }
      <Toaster />
    </div >
  );
}
