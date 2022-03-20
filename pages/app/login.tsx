import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import LoadingDots from "@/components/app/loading-dots";
import toast, { Toaster } from "react-hot-toast";
import { useConnect, useAccount, useNetwork, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { shortAddress } from "@/lib/util";
import useUser from "@/lib/useUser";
import { appServer } from "config";

const pageTitle = "Login";
const logo = "/favicon.ico";
const description =
  "punk3.xyz is a web3 blogging platform for crypto punks.";
export default function Login() {
  const [{ data, error }, connect] = useConnect();
  const [{ data: accountData, error: aerr, loading: aloading }, disconnect] = useAccount({ fetchEns: true });
  const [loading, setLoading] = useState(false);
  const [{ data: networkData }] = useNetwork();
  const [state, setState] = useState<{
    address?: string
    error?: Error
    loading?: boolean
  }>({})
  const [, signMessage] = useSignMessage();

  const signIn = useCallback(async () => {
    try {
      const address = accountData?.address;
      const chainId = networkData?.chain?.id;
      if (!address || !chainId) return;

      setState((x) => ({ ...x, error: undefined, loading: true }));
      // Fetch random nonce, create SIWE message, and sign with wallet
      const nonceRes = await fetch("/api/nonce");
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce: await nonceRes.text(),
      });
      const signRes = await signMessage({ message: message.prepareMessage() });
      if (signRes.error) throw signRes.error;
      console.log("signRes success");

      // signin(verify and create user)
      const signinRes = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, signature: signRes.data }),
      });
      if (!signinRes.ok) throw new Error("Error signin");
      console.log("signin success");

      setState((x) => ({ ...x, address, loading: false }));
    } catch (error) {
      console.log("signin error", error);
      setState((x) => ({ ...x, loading: false }));
    }
  }, [[accountData, networkData]]);

  // Fetch user when:
  useEffect(() => {
    const handler = async () => {
      try {
        const res = await fetch("/api/me");
        const json = await res.json();
        setState((x) => ({ ...x, address: json.address }));
      } finally {
        setState((x) => ({ ...x, loading: false }));
      }
    };
    // 1. page loads
    (async () => await handler())();

    // 2. window is focused (in case user logs out of another window)
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, []);

  // Wher user has signed in, redirect to app
  const { user } = useUser({ redirectTo: appServer, redirectIfFound: true });

  useEffect(() => {
    const errorMessage = error?.message;
    errorMessage && toast.error(errorMessage) && setLoading(false);
    accountData && setLoading(false);
  }, [error, accountData]);


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" href={logo} />
        <link rel="shortcut icon" type="image/x-icon" href={logo} />
        <link rel="apple-touch-icon" sizes="180x180" href={logo} />
        <meta name="theme-color" content="#7b46f6" />

        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta itemProp="name" content={pageTitle} />
        <meta itemProp="description" content={description} />
        <meta itemProp="image" content={logo} />
        <meta name="description" content={description} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={logo} />
        <meta property="og:type" content="website" />

        {/* <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@punk3" />
        <meta name="twitter:creator" content="@punk3" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={logo} /> */}
      </Head>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="/logo.png"
          alt="PUNK3"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          PUNK3
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Build web3 profile with custom domains. <br /> Read the{" "}
          <a
            // href="https://demo.punk3.xyz/platforms-starter-kit"
            target="_blank"
            className="font-medium text-black hover:text-gray-800"
          >
            blog post
          </a>
        </p>
      </div>

      <div className="mt-8 mx-auto sm:w-full w-11/12 sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
          {loading ? (
            <div className={`${loading ? "cursor-not-allowed bg-gray-600" : "bg-black"
              } group flex justify-center items-center space-x-5 w-full sm:px-4 h-16 my-2 rounded-md focus:outline-none`}
            >
              <LoadingDots color="#fff" />
            </div>
          ) :
            accountData ?
              <div className={`${loading ? "cursor-not-allowed bg-gray-600" : "bg-black"
                } group flex justify-center items-center space-x-5 w-full sm:px-4 h-16 my-2 rounded-md focus:outline-none`}
              >
                <span className="text-base text-gray-200">
                  {shortAddress(accountData.address)}
                </span>
                <button
                  className="text-base text-gray-200 underline"
                  onClick={disconnect}
                >
                  Disconnect
                </button>

              </div>
              :
              data.connectors.map((connector) => (
                <button
                  key={connector.id}
                  disabled={loading}
                  onClick={() => {
                    setLoading(true);
                    connect(connector);
                  }}
                  className={`${loading ? "cursor-not-allowed bg-gray-600" : "bg-black"
                    } group flex justify-center items-center space-x-5 w-full sm:px-4 h-16 my-2 rounded-md focus:outline-none`}
                >
                  <span className="text-base text-gray-200">
                    {connector.name}
                    {!connector.ready && " (unsupported)"}
                  </span>
                </button>
              ))
          }

          {accountData && (
            <div className="bg-blue-600 rounded-md">
              {state.address ? (
                <div>
                  {/* <div>Signed in as {state.address}</div> */}
                  <button
                    className="group flex justify-center items-center space-x-5 w-full sm:px-4 h-16 my-2 rounded-md focus:outline-none bg-black text-white"
                    onClick={async () => {
                      await fetch("/api/logout");
                      setState({});
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  className="group flex justify-center items-center space-x-5 w-full sm:px-4 h-16 my-2 rounded-md focus:outline-none btn btn-primary text-white"
                  disabled={state.loading}
                  onClick={signIn}
                >
                  Sign-In with Ethereum
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </div >
  );
}
