import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'
import MetaTags from '../components/MetaTags'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <MetaTags/>
        <Script id="theme-script" strategy='beforeInteractive' dangerouslySetInnerHTML={{
          __html: `
          const theme = localStorage.getItem("user-theme") || "os";
          document.documentElement.setAttribute("data-theme", theme);
          `
        }} />
        {/* <meta property="og:image" content="" /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}