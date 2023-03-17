import type { AppContext, AppProps } from 'next/app'
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

interface IProps extends AppProps {
  theme?: "light" | "dark"
}

const isProd = isProduction()

export default function App({ Component, pageProps, theme }: IProps) {
  console.log(theme);
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

      <div id='theme' data-theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
    </>
  )
}


App.getInitialProps = async(context: AppContext) => {
  const initialProps = await NextApp.getInitialProps(context);
  const { req, res } = context.ctx;
  const themeCookie = getCookie("user-theme", { req, res });
  
  let theme;
  if (themeCookie == "dark" || themeCookie == "light") {
    theme = themeCookie
  }else {
    theme = null;
  }

  return {
    ...initialProps,
    theme
  }
}
