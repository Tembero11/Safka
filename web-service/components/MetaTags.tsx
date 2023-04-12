export default function MetaTags() {
  return (
    <>
      <link rel="icon" type="image/png" href="/favicon.png" />
      <meta name="theme-color" content="#ff3535" />
      <meta name="description" content="What's on the menu today?" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Safka Online" />
      <meta property="og:description" content="What's on the menu today?" />

      <meta name="application-name" content="Safka Online" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Safka Online" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />

      <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
      <link
        rel="apple-touch-icon"
        sizes="152x152"
        href="/icons/touch-icon-ipad.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/icons/touch-icon-iphone-retina.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="167x167"
        href="/icons/touch-icon-ipad-retina.png"
      />

      <link rel="manifest" href="/manifest.json" />
      <link
        rel="mask-icon"
        href="/icons/safari-pinned-tab.svg"
        color="#5bbad5"
      />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
      />

      <meta property="og:site_name" content="Safka Online" />
      <meta property="og:url" content="https://safka.online/" />
      {/* <meta property="og:image" content="https://yourdomain.com/icons/apple-touch-icon.png" /> */}
    </>
  );
}
