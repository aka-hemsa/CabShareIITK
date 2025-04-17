// USE NAVBARRESPONSIVE, THIS IS NOT VERY GOOD
import React, { useState } from "react";
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
  Collapse,
} from "@chakra-ui/react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {
  FaGoogle,
  FaMoon,
  FaPlus,
  FaSun,
  FaUser,
  FaBars,
} from "react-icons/fa";
import { auth } from "../firebase";
import useAuth from "../hooks/useAuth";
import { useRouter } from "next/router";

const Navbar = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

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

        {/* Mobile navigation */}
        <IconButton
          icon={<FaBars />}
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          aria-label="Toggle mobile navigation"
          display={{ base: "block", md: "none" }}
        />

        {/* Desktop navigation */}
        <Flex alignItems="center" display={{ base: "none", md: "flex" }}>
          {isLoggedIn ? (
            <>
              <Button
                as={Link}
                leftIcon={<FaUser />}
                onClick={handleMyProfile}
                variant="outline"
                mr={2}
              >
                My Profile
              </Button>

              <Button as={Link} variant="outline" onClick={handleHome} mr={2}>
                Home
              </Button>
              <Button
                as={Link}
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
              as={Link}
              leftIcon={<FaGoogle />}
              onClick={handleAuth}
              variant="outline"
            >
              Login with Google
            </Button>
          )}
        </Flex>
      </Flex>

      {/* Mobile navigation menu */}
      <Collapse in={isMobileNavOpen} animateOpacity>
        <Box mt={4} pb={2} display={{ base: "block", md: "none" }}>
          {isLoggedIn ? (
            <>
              <Button
                as={Link}
                leftIcon={<FaUser />}
                onClick={handleMyProfile}
                variant="outline"
                mb={2}
                width="full"
              >
                My Profile
              </Button>

              <Button
                as={Link}
                variant="outline"
                onClick={handleHome}
                mb={2}
                width="full"
              >
                Home
              </Button>
              <Button
                as={Link}
                leftIcon={<FaPlus />}
                variant="outline"
                onClick={handleAddListing}
                mb={2}
                width="full"
              >
                Create
              </Button>
              <Button
                variant="solid"
                onClick={() => auth.signOut()}
                width="full"
              >
                LogOut
              </Button>
            </>
          ) : (
            <Button
              as={Link}
              leftIcon={<FaGoogle />}
              onClick={handleAuth}
              variant="outline"
              width="full"
            >
              Login with Google
            </Button>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default Navbar;
