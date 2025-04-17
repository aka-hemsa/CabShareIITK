import React, { useState } from "react";
import { Container, Divider } from "@chakra-ui/react";
import Profile from "../components/Profile";
import MyListingList from "../components/MyListingList";

function MyProfile() {
  return (
    <>
      <Profile />
      <Divider pb="1rem" />
      <Container maxW="7xl" minH="80vh">
        <MyListingList />
      </Container>
    </>
  );
}

export default MyProfile;
