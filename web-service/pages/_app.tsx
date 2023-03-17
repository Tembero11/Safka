import type { AppProps } from 'next/app'
import {default as NextApp} from "next/app";
import '../styles/globals.scss';
import '../styles/themes.scss';
import Layout from '../components/Layout'
import Script from 'next/script'
import * as gtag from "../utils/gtag"
import { isProduction } from '../utils/common'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { getCookie } from 'cookies-next';

interface IProps {
  theme: "os" | "light" | "dark"
}

const isProd = isProduction()

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    if (!isProd) return
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      { isProd ? (<>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TAG}`}/>
        <Script id="gtag-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${process.env.NEXT_PUBLIC_GA_TAG}', {
page_path: window.location.pathname,
});
`,
          }}
        /></>) : null }

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}


export const getInitialProps: GetInitialProps<IProps> = async({ req, res }) => {
  const theme = getCookie("user-theme", { req, res })?.toString() || "os";
  NextApp.getInitialProps(appContext)

  if (
    theme == "os" ||
    theme == "dark" ||
    theme == "light"
  ) {
    return {
      props: { theme }
    }
  }

  return { 
    props: { theme: "os" }
  }
}
