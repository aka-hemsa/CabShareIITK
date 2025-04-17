import { Box, SimpleGrid, Skeleton } from "@chakra-ui/react";

const rangeArray = (count) => {
  const array = [];
  for (let i = 1; i <= count; i++) {
    array.push(i);
  }
  return array;
};

const SkeletonGrid = ({ count }) => (
  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
    {rangeArray(count).map((index) => (
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
    ))}
  </SimpleGrid>
);

export default SkeletonGrid;
