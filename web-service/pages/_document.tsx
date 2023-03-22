import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta name="theme-color" content="#ff3535" />
        <meta name="description" content="What's on the menu today?" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Safka Online" />
        <meta property="og:description" content="What's on the menu today?" />
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