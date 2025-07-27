import Link from 'next/link';
import {
  Container,
  Heading,
  Text,
  VStack,
  Button,
  Box,
} from '@chakra-ui/react';

export default function Home() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={8} align="center">
        <Box textAlign="center">
          <Heading size="2xl" mb={4}>
            Welcome to Eliff
          </Heading>
          <Text fontSize="xl" color="gray.600" mb={4}>
            Case and user management system
          </Text>
        </Box>

        <VStack gap={4} w="full" maxW="md">
          <Link href="/cases" style={{ width: '100%' }}>
            <Button colorScheme="green" size="lg" w="full">
              View Cases
            </Button>
          </Link>

          <Link href="/case" style={{ width: '100%' }}>
            <Button colorScheme="purple" size="lg" w="full">
              Create New Case
            </Button>
          </Link>
        </VStack>
      </VStack>
    </Container>
  );
}
