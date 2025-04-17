import { ChakraProvider } from "@chakra-ui/react";
// import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Navbar from "../components/NavbarResponsive";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </ChakraProvider>
  );
}

export default MyApp;
