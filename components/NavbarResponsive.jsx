import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  useColorMode,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Switch,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FaGoogle, FaMoon, FaSun, FaUser, FaBars } from "react-icons/fa";
import { auth } from "../firebase";
import useAuth from "../hooks/useAuth";
import { useRouter } from "next/router";
import SigninButton from "./LoginButton";

export default function WithAction() {
  const { toggleColorMode, colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser({ ...currentUser, isVerified: userSnap.data().isVerified });
        } else {
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
    });
  
    return () => unsubscribe();
  }, [isLoggedIn]);
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

  const handleLogout = () => {
    router.push("/");
    auth.signOut();
  };

  return (
    <>
      <Box
        bg={useColorModeValue("gray.100", "gray.900")}
        px={4}
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box>
              <Text fontWeight="bold" fontSize="1.3rem">
                CabSharing IITK
              </Text>
            </Box>
            {isLoggedIn ? (
              <HStack
                as={"nav"}
                spacing={4}
                display={{ base: "none", md: "flex" }}
              >
                <Link onClick={handleHome}>Home</Link>
                <Link onClick={handleMyProfile}>My Profile</Link>
              </HStack>
            ) : null}
          </HStack>
          <Flex alignItems={"center"}>
            {isLoggedIn ? (
              <>
                {user && (
                  user.isVerified ? (
                    <Text mr={4} fontWeight="bold" color="green.500">
                      Verified &#10003;
                    </Text>
                  ) : (
                    <Button colorScheme="blue" size="sm" mr={4} onClick={() => router.push("/verify")}>
                      Verify Institute Email
                    </Button>
                  )
                )}

                <Button
                  variant={"solid"}
                  colorScheme={"teal"}
                  size={"sm"}
                  mr={4}
                  leftIcon={<AddIcon />}
                  onClick={handleAddListing}
                >
                  Add Trip
                </Button>
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar
                      size={"sm"}
                      src={
                        user && isLoggedIn
                          ? user.photoURL
                          : "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                      }
                    />
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={handleMyProfile}>My Profile</MenuItem>
                    <MenuItem onClick={handleHome}>Home</MenuItem>
                    <MenuDivider />
                    <MenuItem>
                      <Flex align="center">
                        <Text marginRight="4">Dark Mode</Text>
                        <Switch
                          isChecked={colorMode === "dark"}
                          onChange={toggleColorMode}
                          colorScheme="teal"
                          size="md"
                          mr={4}
                          icons={{
                            checked: <FaMoon />,
                            unchecked: <FaSun />,
                          }}
                        />
                      </Flex>
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              </>
            ) : (
              <SigninButton />
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              <Link onClick={handleHome}>Home</Link>
              <Link onClick={handleMyProfile}>My Profile</Link>
              <Link onClick={handleLogout}>Logout</Link>
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
