import { Html, Head, Main, NextScript } from 'next/document'

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
        {/* <meta property="og:image" content="" /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}