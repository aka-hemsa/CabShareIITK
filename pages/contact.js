import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";

export default function ContactPage() {
  return (
    <Container maxW="3xl" py={10}>
      <Heading as="h1" size="xl" mb={6}>
        Contact Us
      </Heading>
      <VStack spacing={4} align="start">
        <Box>
          <Text fontWeight="bold">Hemant Bunker</Text>
          <Text>Roll No: 210431</Text>
          <Text>Email: hemantb21@iitk.ac.in</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Lakshika</Text>
          <Text>Roll No: 210554</Text>
          <Text>Email: lakshika21@iitk.ac.in</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Vanshika Gupta</Text>
          <Text>Roll No: 211146</Text>
          <Text>Email: vanshikag21@iitk.ac.in</Text>
        </Box>
      </VStack>
    </Container>
  );
}
