import { Box, Text, VStack, HStack } from '@chakra-ui/react';

interface User {
  id: string;
  name: string;
  birthday: string;
  gender: string;
  email: string;
  phone: string;
  photoUrl?: string;
  address?: {
    street: string;
    city: string;
    zipCode: string;
  };
}

export default function UserDatailsCard({
  user,
  title,
}: {
  user: User;
  title: string;
}) {
  return (
    <Box
      w="full"
      p={4}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
    >
      <VStack gap={3} align="start">
        <Text fontWeight="bold" fontSize="lg">
          {title}
        </Text>

        <VStack gap={2} align="start" w="full">
          <HStack gap={2}>
            <Text fontWeight="medium">Name:</Text>
            <Text color="gray.700">{user.name}</Text>
          </HStack>

          <HStack gap={2}>
            <Text fontWeight="medium">Email:</Text>
            <Text color="gray.700">{user.email}</Text>
          </HStack>

          <HStack gap={2}>
            <Text fontWeight="medium">Phone:</Text>
            <Text color="gray.700">{user.phone}</Text>
          </HStack>

          <HStack gap={2}>
            <Text fontWeight="medium">Gender:</Text>
            <Text color="gray.700">{user.gender}</Text>
          </HStack>

          <HStack gap={2}>
            <Text fontWeight="medium">Birthday:</Text>
            <Text color="gray.700">{user.birthday}</Text>
          </HStack>

          {user.address && (
            <VStack gap={1} align="start" w="full">
              <Text fontWeight="medium">Address:</Text>
              <Text color="gray.700" fontSize="sm">
                {user.address.street}, {user.address.city} -{' '}
                {user.address.zipCode}
              </Text>
            </VStack>
          )}
        </VStack>
      </VStack>
    </Box>
  );
}
