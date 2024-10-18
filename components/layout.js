import NavBar from "./header";
import Footer from "./footer";
import Head from "next/head";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Design Challenge</title>
      </Head>
      <NavBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
