'use client';

import {
  Container,
  Heading,
  Text,
  Box,
  VStack,
  HStack,
  Badge,
  Button,
  Flex,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  birthday: string;
  address?: {
    street: string;
    city: string;
    zipCode: string;
  };
}

interface Case {
  id: string;
  caseType: 'FAMILY' | 'BUSINESS' | 'CRIMINAL' | 'COMMUNITY' | 'OTHER';
  description: string;
  status:
    | 'PENDING'
    | 'AWAITING_RESPONSE'
    | 'ACCEPTED'
    | 'PANEL_CREATED'
    | 'MEDIATION_IN_PROGRESS'
    | 'RESOLVED'
    | 'UNRESOLVED';
  legalStatus?: 'PENDING_IN_COURT' | 'PENDING_IN_POLICE' | 'NOT_REGISTERED';
  legalExtraInfo?: string;
  proofFiles: string[];
  createdAt: string;
  updatedAt: string;
  claimant: User;
  oppositeParty: User;
}

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cases');
      setCases(response.data.data);
    } catch (err: any) {
      console.error('Error fetching cases:', err);
      setError(err.response?.data?.message || 'Failed to fetch cases');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'yellow';
      case 'AWAITING_RESPONSE':
        return 'orange';
      case 'ACCEPTED':
        return 'blue';
      case 'PANEL_CREATED':
        return 'purple';
      case 'MEDIATION_IN_PROGRESS':
        return 'cyan';
      case 'RESOLVED':
        return 'green';
      case 'UNRESOLVED':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getCaseTypeColor = (caseType: string) => {
    switch (caseType) {
      case 'FAMILY':
        return 'pink';
      case 'BUSINESS':
        return 'blue';
      case 'CRIMINAL':
        return 'red';
      case 'COMMUNITY':
        return 'green';
      case 'OTHER':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Loading cases...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box p={4} bg="red.100" color="red.700" borderRadius="md">
          {error}
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={6} align="start">
        <Box w="full">
          <Heading size="xl" color="blue.600" mb={2}>
            Cases List
          </Heading>
          <Text fontSize="lg" color="gray.600">
            View and manage all cases in the system
          </Text>
        </Box>

        {cases.length === 0 ? (
          <Box w="full" p={8} textAlign="center" bg="gray.50" borderRadius="lg">
            <Text fontSize="lg" color="gray.500">
              No cases found. Create your first case to get started.
            </Text>
            <Link href="/case">
              <Button colorScheme="blue" mt={4}>
                Create New Case
              </Button>
            </Link>
          </Box>
        ) : (
          <VStack gap={4} w="full">
            {cases.map(caseItem => (
              <Box
                key={caseItem.id}
                w="full"
                p={6}
                bg="white"
                borderRadius="lg"
                border="1px"
                borderColor="gray.200"
                _hover={{ borderColor: 'blue.300', boxShadow: 'md' }}
                transition="all 0.2s"
              >
                <Flex justify="space-between" align="start" mb={4}>
                  <VStack align="start" gap={2}>
                    <HStack gap={2}>
                      <Badge colorScheme={getCaseTypeColor(caseItem.caseType)}>
                        {caseItem.caseType}
                      </Badge>
                      <Badge colorScheme={getStatusColor(caseItem.status)}>
                        {caseItem.status.replace('_', ' ')}
                      </Badge>
                    </HStack>
                    <Text fontSize="sm" color="gray.500">
                      Created: {formatDate(caseItem.createdAt)}
                    </Text>
                  </VStack>
                  <Link href={`/case/${caseItem.id}`}>
                    <Button size="sm" p={2}>
                      View Details
                    </Button>
                  </Link>
                </Flex>

                <Box mb={4}>
                  <Text fontWeight="medium" mb={2}>
                    Description
                  </Text>
                  <Text color="gray.700">
                    {caseItem.description.length > 150
                      ? `${caseItem.description.substring(0, 150)}...`
                      : caseItem.description}
                  </Text>
                </Box>

                <Flex gap={6} wrap="wrap">
                  <Box flex={1} minW="200px">
                    <Text fontWeight="medium" mb={2} color="blue.600">
                      Claimant
                    </Text>
                    <VStack align="start" gap={1}>
                      <Text fontSize="sm" fontWeight="medium">
                        {caseItem.claimant.name}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {caseItem.claimant.email}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {caseItem.claimant.phone}
                      </Text>
                    </VStack>
                  </Box>

                  <Box flex={1} minW="200px">
                    <Text fontWeight="medium" mb={2} color="red.600">
                      Opposite Party
                    </Text>
                    <VStack align="start" gap={1}>
                      <Text fontSize="sm" fontWeight="medium">
                        {caseItem.oppositeParty.name}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {caseItem.oppositeParty.email}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {caseItem.oppositeParty.phone}
                      </Text>
                    </VStack>
                  </Box>
                </Flex>

                {caseItem.legalExtraInfo && (
                  <Box mt={4} p={3} bg="gray.50" borderRadius="md">
                    <Text fontSize="sm" fontWeight="medium" mb={1}>
                      Legal Information
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {caseItem.legalExtraInfo}
                    </Text>
                  </Box>
                )}

                {caseItem.proofFiles && caseItem.proofFiles.length > 0 && (
                  <Box mt={4} p={3} bg="blue.50" borderRadius="md">
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      mb={2}
                      color="blue.700"
                    >
                      Proof Files ({caseItem.proofFiles.length})
                    </Text>
                    <VStack align="start" gap={1}>
                      {caseItem.proofFiles.map((file, index) => (
                        <Link key={index} href={file} target="_blank">
                          <Text
                            fontSize="sm"
                            color="blue.600"
                            _hover={{ textDecoration: 'underline' }}
                          >
                            File {index + 1}
                          </Text>
                        </Link>
                      ))}
                    </VStack>
                  </Box>
                )}
              </Box>
            ))}
          </VStack>
        )}
      </VStack>
    </Container>
  );
}
