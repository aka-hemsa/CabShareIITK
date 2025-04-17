import React from "react";
import {
  Box,
  Input,
  Button,
  Textarea,
  Stack,
  Select,
  useToast,
} from "@chakra-ui/react";
import { addListing } from "../api/listing"; // Import the modified addListing function
import useAuth from "../hooks/useAuth";

const AddListing = () => {
  const { user } = useAuth();
  const [name, setName] = React.useState("");
  const [startPlace, setStartPlace] = React.useState("");
  const [destination, setDestination] = React.useState("");
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const toast = useToast();

  const handleListingCreate = async () => {
    setIsLoading(true);
    const listing = {
      name,
      startPlace,
      destination,
      date,
      time,
      phoneNumber,
      creatorId: user.uid, // Include the user ID in the listing data
      creatorEmail: user.email,
    };
    await addListing(listing);
    setIsLoading(false);

    setName("");
    setStartPlace("");
    setDestination("");
    setDate("");
    setTime("");
    setPhoneNumber("");

    toast({ title: "Listing created successfully", status: "success" });
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/; // Regular expression for a 10-digit phone number

    return phoneRegex.test(phoneNumber);
  };

  return (
    <Box
      w={{ base: "80%", md: "40%" }}
      margin={"0 auto"}
      display="block"
      mt={5}
      minH={"80vh"}
    >
      <Stack direction="column">
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="Starting Place"
          value={startPlace}
          onChange={(e) => setStartPlace(e.target.value)}
        />

        <Input
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />

        <Input
          type="date"
          placeholder="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <Input
          type="time"
          placeholder="Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <Input
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        <Button
          onClick={() => handleListingCreate()}
          disabled={
            name.length < 1 ||
            startPlace.length < 1 ||
            destination.length < 1 ||
            date.length < 1 ||
            time.length < 1 ||
            phoneNumber.length < 1 ||
            isLoading ||
            !isValidPhoneNumber(phoneNumber)
          }
          variantColor="teal"
          variant="solid"
        >
          Add
        </Button>
      </Stack>
    </Box>
  );
};

export default AddListing;
