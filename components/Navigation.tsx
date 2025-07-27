'use client';

import Link from 'next/link';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  ClientOnly,
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiCrosshair,
  FiChevronDown,
  FiList,
} from 'react-icons/fi';
import { IconType } from 'react-icons';

interface LinkItemProps {
  name: string;
  icon: IconType;
  href?: string;
}

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome, href: '/' },
  { name: 'Create Case', icon: FiCrosshair, href: '/case' },
  { name: 'Cases', icon: FiList, href: '/cases' },
  { name: 'Explore', icon: FiCompass },
  { name: 'Favourites', icon: FiStar },
  { name: 'Settings', icon: FiSettings },
];

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg="white"
      borderRight="1px"
      borderRightColor="gray.200"
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold"
          color="gray.800"
        >
          Mediatiff
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map(link => (
        <Link key={link.name} href={link.href || ''}>
          <NavItem icon={link.icon}>{link.name}</NavItem>
        </Link>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Box style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        color="gray.700"
        _hover={{
          bg: 'blue.500',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            color="gray.600"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg="white"
      borderBottomWidth="1px"
      borderBottomColor="gray.200"
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
      >
        <FiMenu />
      </IconButton>

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
        color="gray.800"
      >
        ElliF
      </Text>

      <Flex alignItems={'center'}>
        <HStack>
          <Box
            w="8"
            h="8"
            borderRadius="full"
            bg="blue.500"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="xs" fontWeight="bold" color="white">
              AB
            </Text>
          </Box>
          <VStack
            display={{ base: 'none', md: 'flex' }}
            alignItems="flex-start"
            gap="1px"
            ml="2"
          >
            <Text fontSize="sm" color="gray.800">
              Alison Borba
            </Text>
            <Text fontSize="xs" color="gray.600">
              Admin
            </Text>
          </VStack>
          {/* <Box display={{ base: 'none', md: 'flex' }}>
            <Icon as={FiChevronDown} color="gray.600" />
          </Box> */}
        </HStack>
      </Flex>
    </Flex>
  );
};

const SidebarWithHeader = ({ children }: { children: React.ReactNode }) => {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <ClientOnly fallback={<Box minH="100vh" bg="gray.100" />}>
      <Box minH="100vh" bg="gray.100">
        <SidebarContent
          onClose={onClose}
          display={{ base: 'none', md: 'block' }}
        />

        {/* Mobile Sidebar */}
        {open && (
          <Box
            position="fixed"
            top="0"
            left="0"
            w="full"
            h="full"
            bg="rgba(0,0,0,0.5)"
            zIndex={1000}
            onClick={onClose}
          >
            <Box
              position="fixed"
              top="0"
              left="0"
              w="60"
              h="full"
              bg="white"
              borderRight="1px"
              borderRightColor="gray.200"
            >
              <SidebarContent onClose={onClose} />
            </Box>
          </Box>
        )}

        <MobileNav onOpen={onOpen} />
        <Box ml={{ base: 0, md: 60 }} p="4">
          {children}
        </Box>
      </Box>
    </ClientOnly>
  );
};

export default SidebarWithHeader;
