import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { Skeleton, Box, Center, Heading, Image } from "@chakra-ui/react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the authenticated user's data from Firebase Authentication
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false); // Set loading to false after user data is fetched
    });

    return () => {
      // Unsubscribe from the Firebase Authentication listener when the component unmounts
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <Box mt={10}>
        <Center>
          <Skeleton height="40px" width="200px" />
        </Center>
        <Center mt={4}>
          <Skeleton height="200px" width="200px" borderRadius="50%" />
        </Center>
      </Box>
    );
  }

  return (
    <Box mt={10}>
      <Center>
        {user && user.displayName ? (
          <Heading as="h1" size="xl">
            {user.displayName}
          </Heading>
        ) : (
          <Heading as="h1" size="xl">
            User Name
          </Heading>
        )}
      </Center>
      <Center mt={4}>
        {user && user.photoURL ? (
          <Image
            src={user.photoURL}
            alt="Profile"
            borderRadius="50%"
            boxSize="150px"
          />
        ) : (
          <Box
            w="150px"
            h="150px"
            borderRadius="50%"
            bg="gray.200"
            boxShadow="md"
          ></Box>
        )}
      </Center>
    </Box>
  );
};

export default Profile;
