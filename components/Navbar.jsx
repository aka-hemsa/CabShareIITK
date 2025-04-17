import React from "react";
import {
  Box,
  Button,
  Link,
  Text,
  useColorMode,
  Flex,
  Spacer,
  IconButton,
  Heading,
} from "@chakra-ui/react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FaGoogle, FaMoon, FaPlus, FaSun, FaUser } from "react-icons/fa";
import { auth } from "../firebase";
import useAuth from "../hooks/useAuth";
import { useRouter } from "next/router";

const Navbar = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();

  const handleAuth = async () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const handleMyProfile = () => {
    router.push("/myprofile");
  };

  const handleHome = () => {
    router.push("/");
  };

  const handleAddListing = () => {
    router.push("/createListing");
  };

  return (
    <Box
      p={4}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      borderBottom="1px solid"
      borderColor="gray.200"
    >
      <Flex alignItems="center">
        <Heading size="md">IITH-Cab Sharing</Heading>
      </Flex>

      <Flex alignItems="center">
        <IconButton
          icon={colorMode === "dark" ? <FaSun /> : <FaMoon />}
          onClick={toggleColorMode}
          aria-label="Toggle color mode"
          mr={4}
        />

        {isLoggedIn ? (
          <>
            <Button
              leftIcon={<FaUser />}
              onClick={handleMyProfile}
              variant="outline"
              mr={2}
            >
              My Profile
            </Button>

            <Button variant="outline" onClick={handleHome} mr={2}>
              Home
            </Button>
            <Button
              leftIcon={<FaPlus />}
              variant="outline"
              onClick={handleAddListing}
              mr={2}
            >
              Create
            </Button>
            <Button variant="solid" onClick={() => auth.signOut()}>
              LogOut
            </Button>
          </>
        ) : (
          <Button
            leftIcon={<FaGoogle />}
            onClick={handleAuth}
            variant="outline"
          >
            Login with Google
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar;
