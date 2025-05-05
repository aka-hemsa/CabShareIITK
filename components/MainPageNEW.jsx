import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useClipboard,
  useToast,
  Skeleton,
  useMediaQuery,
  Alert,
  AlertIcon,
  AlertTitle,
  CloseButton,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { getDoc } from "firebase/firestore";

import {
  collection,
  onSnapshot,
  query,
  deleteDoc,
  doc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useRouter } from "next/router";
import SkeletonGrid from "./SkeletonGrid";
import SigninButton from "./LoginButton";

const ListingList = () => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const { user } = useAuth();
  const { isLoggedIn } = useAuth();
  const toast = useToast();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };

    // Initial check {dummy text}
    handleResize();

    // Event listener for screen size changes
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const refreshData = () => {
    let q = query(collection(db, "listings"));

    if (searchDate) {
      q = query(collection(db, "listings"), where("date", "==", searchDate));
    }

    onSnapshot(q, (querySnapshot) => {
      let arr = [];
      querySnapshot.forEach((doc) => {
        arr.push({ id: doc.id, ...doc.data() });
      });
      setListings(arr);
      setLoading(false);
    });
  };

  useEffect(() => {
    refreshData();
  }, [user, searchDate, loading, isMobile]);

  return (
    <Tabs isFitted mt={5}>
      <TabList mb={4}>
        <Tab>All Listings</Tab>
        <Tab>Today</Tab>
        {!isMobile && (
          <>
            <Tab>Tomorrow</Tab>
            <Tab>{getDateLabel(2)}</Tab>
            <Tab>{getDateLabel(3)}</Tab>
            <Tab>{getDateLabel(4)}</Tab>
          </>
        )}
        <Tab>Choose Date</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <ListingDay />
        </TabPanel>
        <TabPanel>
          <ListingDay date={getCurrentDate()} />
        </TabPanel>
        {!isMobile && (
          <TabPanel>
            <ListingDay date={getTomorrowDate()} />
          </TabPanel>
        )}
        {!isMobile && (
          <TabPanel>
            <ListingDay date={getFutureDate(2)} />
          </TabPanel>
        )}
        {!isMobile && (
          <TabPanel>
            <ListingDay date={getFutureDate(3)} />
          </TabPanel>
        )}
        {!isMobile && (
          <TabPanel>
            <ListingDay date={getFutureDate(4)} />
          </TabPanel>
        )}
        <TabPanel>
          <Box mb={4}>
            <Heading as="h2" size="lg" mb={2}>
              Search Listings by Date
            </Heading>
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
            <Button
              ml={2}
              colorScheme="teal"
              onClick={() => {
                setLoading(true);
                setSearchDate("");
              }}
            >
              Clear
            </Button>
          </Box>
          <ListingDay date={searchDate} />
        </TabPanel>
        {isMobile && (
          <>
            <TabPanel>
              <ListingDay date={getFutureDate(2)} />
            </TabPanel>
            <TabPanel>
              <ListingDay date={getFutureDate(3)} />
            </TabPanel>
            <TabPanel>
              <ListingDay date={getFutureDate(4)} />
            </TabPanel>
          </>
        )}
        <TabPanel>
          <ListingDay date={searchDate} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

const ListingDay = ({ date }) => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const fetchListingsAndVerification = async () => {
      setLoading(true);

      let q = date
        ? query(collection(db, "listings"), where("date", "==", date))
        : query(collection(db, "listings"));

      onSnapshot(q, async (querySnapshot) => {
        let arr = [];
        let creatorIds = new Set();

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          creatorIds.add(data.creator);
          arr.push({ id: doc.id, ...data });
        });

        // Fetch all user documents for creators
        const creatorIdList = Array.from(creatorIds);
        const verificationMap = {};

        await Promise.all(
          creatorIdList.map(async (creatorId) => {
            try {
              const userDoc = await getDoc(doc(db, "users", creatorId));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                verificationMap[creatorId] = userData.isVerified || false;
              } else {
                verificationMap[creatorId] = false;
              }
            } catch (error) {
              console.error("Error fetching user data:", error);
              verificationMap[creatorId] = false;
            }
          })
        );

        // Add verification status to listings
        const enrichedListings = arr.map((listing) => ({
          ...listing,
          verified: verificationMap[listing.creator] || false,
        }));

        const now = new Date();

// Filter out past trips and sort upcoming ones
const upcomingSorted = enrichedListings
  .filter((listing) => {
    const dateTime = new Date(`${listing.date}T${listing.time}`);
    return dateTime >= now;
  })
  .sort((a, b) => {
    const aDate = new Date(`${a.date}T${a.time}`);
    const bDate = new Date(`${b.date}T${b.time}`);
    return aDate - bDate;
  });

setListings(upcomingSorted);

        setLoading(false);
      });
    };

    fetchListingsAndVerification();
  }, [date, user]);

  const handleCopyNumber = (phoneNumber) => {
    navigator.clipboard.writeText(phoneNumber);
    toast({ title: "Phone number copied to clipboard", status: "success" });
  };

  const handleCopyEmail = (emailID) => {
    navigator.clipboard.writeText(emailID);
    toast({ title: "Email ID copied to clipboard", status: "success" });
  };

  return (
    <>
      {loading ? (
        <SkeletonGrid count={6} />
      ) : listings.length > 0 ? (
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
              width="100%"
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
                <Text fontSize="lg" mt={2} fontWeight="semibold">
                  {listing.name}
                  {listing.verified && (
                    <Text as="span" color="green.500" fontSize="md" ml={2}>
                      ✓ Verified User
                    </Text>
                  )}
                </Text>
                <Text fontSize="lg" mt={2}>
                  Phone: {listing.phoneNumber}
                </Text>
                <Box display="flex" justifyContent="space-around">
                  <Button
                    mt={2}
                    variant="solid"
                    colorScheme="blue"
                    onClick={() => handleCopyEmail(listing.creatorEmail)}
                  >
                    Copy Email
                  </Button>
                  <Button
                    mt={2}
                    variant="solid"
                    colorScheme="teal"
                    onClick={() => handleCopyNumber(listing.phoneNumber)}
                  >
                    Copy Number
                  </Button>
                </Box>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <NoListingsSkeleton user={user} />
      )}
    </>
  );
};

const NoListingsSkeleton = ({ user }) => {
  const toast = useToast();
  const router = useRouter();

  const handleCreateListing = () => {
    router.push("/createListing");
  };

  return (
    <>
      <Box textAlign="center" p={8}>
        <Text
          fontSize={{ base: "2rem", md: "2rem", lg: "2rem" }}
          fontWeight="bold"
        >
          (╥﹏╥)
          {"\n"} No cabs available for this day.
        </Text>

        <Text fontSize="1.2rem" fontWeight="normal" mb={4}>
          Try creating a new listing; you might find someone.
        </Text>
        {!user ? (
          <>
            <SigninButton />
          </>
        ) : (
          <Button colorScheme="teal" onClick={handleCreateListing}>
            Create Listing
          </Button>
        )}
      </Box>
      <SkeletonGrid count={6} />
    </>
  );
};

// Helper functions
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getFutureDate = (days) => {
  const future = new Date();
  future.setDate(future.getDate() + days);
  const year = future.getFullYear();
  const month = String(future.getMonth() + 1).padStart(2, "0");
  const day = String(future.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDateLabel = (daysLater) => {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + daysLater);

  const options = { day: "numeric", month: "long" };
  return futureDate.toLocaleDateString("en-US", options);
};

export default ListingList;
