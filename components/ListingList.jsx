import {
  Badge,
  Box,
  Button,
  Heading,
  SimpleGrid,
  Text,
  useClipboard,
  useToast,
  Skeleton,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import {
  collection,
  onSnapshot,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { FaTrash } from "react-icons/fa";

const ListingList = () => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);

  const { user } = useAuth();
  const toast = useToast();

  const refreshData = () => {
    if (!user) {
      setListings([]);
      return;
    }
    const q = query(collection(db, "listings"));

    onSnapshot(q, (querySnapshot) => {
      let arr = [];
      querySnapshot.forEach((doc) => {
        arr.push({ id: doc.id, ...doc.data() });
      });
      setListings(arr);
      setLoading(false); // Set loading to false after data is fetched
    });
  };

  const handleCopyNumber = (phoneNumber) => {
    navigator.clipboard.writeText(phoneNumber);
    toast({ title: "Phone number copied to clipboard", status: "success" });
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  return (
    <Box mt={5}>
      {loading ? ( // Show skeletons when loading is true
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(
            (index) => (
              <Box
                key={index}
                p={4}
                boxShadow="2xl"
                shadow="dark-lg"
                transition="0.2s"
                _hover={{ boxShadow: "sm" }}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                display="flex"
                justifyContent="space-between"
              >
                <Box>
                  <Skeleton height="20px" mb={2} />
                  <Skeleton height="16px" mb={2} />
                  <Skeleton height="16px" mb={2} />
                  <Skeleton height="12px" />
                  <Skeleton height="16px" mt={2} />
                  <Skeleton height="32px" width="120px" mt={2} />
                </Box>
                <Skeleton height="24px" width="24px" />
              </Box>
            )
          )}
        </SimpleGrid>
      ) : (
        // Render actual listings when loading is false
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {listings.map((listing) => (
            <Box
              key={listing.id}
              p={4}
              boxShadow="2xl"
              shadow="dark-lg"
              transition="0.2s"
              _hover={{ boxShadow: "sm" }}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              display="flex"
              justifyContent="space-between"
            >
              <Box>
                <Text fontSize="2xl" fontWeight="bold" mb={2}>
                  {listing.startPlace} --&gt; {listing.destination}
                </Text>
                <Heading as="h3" fontSize="xl" my={2}>
                  {listing.date.split("-")[2]}{" "}
                  {new Date(listing.date).toLocaleString("default", {
                    month: "long",
                  })}
                  {" - "}({listing.time})
                </Heading>
                <Text fontSize="lg" mt={2}>
                  {listing.name}
                </Text>
                <Text fontSize="lg" mt={2}>
                  Phone: {listing.phoneNumber}
                </Text>
                <Button
                  mt={2}
                  variant="outline"
                  colorScheme="teal"
                  onClick={() => handleCopyNumber(listing.phoneNumber)}
                >
                  Copy Number
                </Button>
              </Box>
              {listing.creator === user.uid && (
                <Button
                  variant="outline"
                  colorScheme="red"
                  onClick={() => handleListingDelete(listing.id)}
                >
                  <FaTrash />
                </Button>
              )}
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default ListingList;
