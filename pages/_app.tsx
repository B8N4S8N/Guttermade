import PlausibleProvider from "next-plausible";
import { SessionProvider } from "next-auth/react";

import "@/styles/globals.css";

import type { AppProps } from "next/app";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <PlausibleProvider domain="demo.punk3.xyz">
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </PlausibleProvider>
  );
}
