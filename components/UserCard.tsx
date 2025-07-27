'use client';

import { Heading, Avatar, Box, Center, Text } from '@chakra-ui/react';
import { useColorModeValue } from './ui/color-mode';
import { User } from '@prisma/client';

export default function UserCard({
  user,
  title,
}: {
  user: User;
  title: string;
}) {
  return (
    <Center w="full">
      <Box
        p={6}
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        textAlign={'center'}
      >
        <Heading fontSize={'2xl'} mb={2}>
          {title}
        </Heading>
        <Avatar.Root size={'xl'}>
          <Avatar.Image src={user.photoUrl || undefined} />
          <Avatar.Fallback name={user.name} />
        </Avatar.Root>
        <Text>{user.name}</Text>
        <Text color={'gray.500'} mb={4}>
          {user.email}
        </Text>

        <Box w="full" mb={4} gap={2} display="flex" flexDirection="row">
          <Text>Phone:</Text>
          <Text>{user.phone}</Text>
        </Box>

        <Box w="full" mb={4} gap={2} display="flex" flexDirection="row">
          <Text>Gender:</Text>
          <Text>{user.gender}</Text>
        </Box>

        <Box w="full" mb={4} gap={2} display="flex" flexDirection="row">
          <Text>Birthday:</Text>
          <Text>{user.birthday}</Text>
        </Box>
      </Box>
    </Center>
  );
}
