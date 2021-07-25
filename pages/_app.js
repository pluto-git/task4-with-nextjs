import "../styles/globals.css";
import Layout from "../components/layout/layout";
import Head from "next/head";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Penguin Club</title>
        <meta
          name="description"
          content="Authentication and playing with users"
        />
        <meta name="keywords" content="Next.js, Node.js, MySql" />
        <meta
          name="author"
          content="Mykola Liubachenko , pluto-git at Github"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="icon"
          href="/toppng.com-enguin-penguin-logo-transparent-291x431.png"
        />
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
          crossOrigin="anonymous"
        ></link>
      </Head>

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
