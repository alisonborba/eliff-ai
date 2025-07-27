import {
  Container,
  Heading,
  Text,
  Box,
  Button,
  VStack,
  HStack,
} from '@chakra-ui/react';

export default function UsersPage() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={8} align="start">
        <Box>
          <Heading size="xl" color="blue.600" mb={4}>
            Manage Users
          </Heading>
          <Text fontSize="lg" color="gray.600" mb={6}>
            View and manage all users in the system.
          </Text>
        </Box>

        <HStack gap={4}>
          <Button colorScheme="blue" size="lg">
            Add User
          </Button>
          <Button colorScheme="green" variant="outline" size="lg">
            Export List
          </Button>
        </HStack>

        <Box
          w="full"
          p={6}
          bg="white"
          borderRadius="lg"
          border="1px"
          borderColor="gray.200"
        >
          <VStack gap={4} align="start">
            <Box
              w="full"
              p={4}
              border="1px"
              borderColor="gray.200"
              borderRadius="md"
            >
              <HStack justify="space-between">
                <VStack align="start" gap={1}>
                  <Text fontWeight="bold" color="gray.800">
                    John Smith
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    john@example.com
                  </Text>
                  <Text fontSize="sm" color="blue.600">
                    Administrator
                  </Text>
                </VStack>
                <HStack gap={2}>
                  <Button size="sm" colorScheme="blue">
                    Edit
                  </Button>
                  <Button size="sm" colorScheme="red" variant="outline">
                    Remove
                  </Button>
                </HStack>
              </HStack>
            </Box>

            <Box
              w="full"
              p={4}
              border="1px"
              borderColor="gray.200"
              borderRadius="md"
            >
              <HStack justify="space-between">
                <VStack align="start" gap={1}>
                  <Text fontWeight="bold" color="gray.800">
                    Mary Johnson
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    mary@example.com
                  </Text>
                  <Text fontSize="sm" color="blue.600">
                    User
                  </Text>
                </VStack>
                <HStack gap={2}>
                  <Button size="sm" colorScheme="blue">
                    Edit
                  </Button>
                  <Button size="sm" colorScheme="red" variant="outline">
                    Remove
                  </Button>
                </HStack>
              </HStack>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
