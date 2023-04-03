import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

const DocsHome = () => {
  return (
    <>
      <Head>
        <title>Safka Online</title>
      </Head>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "80%", gap: 20 }}>
        <h1>Documentation !</h1>
      </div>
    </>
  );
}

export default DocsHome;
