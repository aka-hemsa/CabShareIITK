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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import {
  collection,
  onSnapshot,
  query,
  deleteDoc,
  doc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { FaTrash } from "react-icons/fa";

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

    // Initial check
    handleResize();

    // Event listener for screen size changes
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const refreshData = () => {
    if (!user) {
      setListings([]);
      return;
    }
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

  const handleCopyNumber = (phoneNumber) => {
    navigator.clipboard.writeText(phoneNumber);
    toast({ title: "Phone number copied to clipboard", status: "success" });
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
    if (!user) {
      setListings([]);
      setLoading(false);
      return;
    }

    let q;
    if (date) {
      q = query(collection(db, "listings"), where("date", "==", date));
    } else {
      q = query(collection(db, "listings"));
    }

    onSnapshot(q, (querySnapshot) => {
      let arr = [];
      querySnapshot.forEach((doc) => {
        arr.push({ id: doc.id, ...doc.data() });
      });
      setListings(arr);
      setLoading(false);
    });
  }, [date, user]);

  const handleCopyNumber = (phoneNumber) => {
    navigator.clipboard.writeText(phoneNumber);
    toast({ title: "Phone number copied to clipboard", status: "success" });
  };

  return (
    <>
      {loading ? (
        <SkeletonGrid />
      ) : (
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {listings.length > 0 ? (
            listings.map((listing) => (
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
                width="100%" // Set width to 100%
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
                  <Box display="flex" justifyContent="space-around">
                    <Button
                      mt={2}
                      variant="solid"
                      colorScheme="blue"
                      onClick={() => handleCopyNumber(listing.phoneNumber)}
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
            ))
          ) : (
            <>
              <Text fontSize="lg">No cab listings available for this day.</Text>
            </>
          )}
        </SimpleGrid>
      )}
    </>
  );
};

const SkeletonGrid = () => (
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
);

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
