import { Provider } from "wagmi";
import { SessionProvider } from "next-auth/react";

import { connectors } from "lib/connectors";

import "@/styles/globals.css";

import type { AppProps } from "next/app";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <Provider autoConnect connectors={connectors}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </Provider>
  );
}
