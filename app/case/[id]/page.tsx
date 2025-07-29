'use client';

import {
  Container,
  Heading,
  Text,
  Box,
  VStack,
  HStack,
  Button,
  Flex,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import UserDatailsCard from '@/components/UserDatailsCard';
import { Case } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import UserCard from '../../../components/UserCard';
import Badge from '../../../components/Badge';

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params.id as string;

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (caseId) {
      fetchCase();
    }
  }, [caseId]);

  const fetchCase = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/cases/${caseId}`);
      setCaseData(response.data.data);
    } catch (err: any) {
      console.error('Error fetching case:', err);
      setError(err.response?.data?.message || 'Failed to fetch case');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxW="container.xl">
        <Text>Loading case details...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl">
        <Box p={4} bg="red.100" color="red.700" borderRadius="md">
          {error}
        </Box>
      </Container>
    );
  }

  if (!caseData) {
    return (
      <Container maxW="container.xl">
        <Text>Case not found</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl">
      <VStack gap={6} align="start">
        {/* Case Information */}
        <Box w="full" p={6} bg="white">
          <Flex w="full" justify="space-between" align="start">
            <Box>
              <Heading size="xl" color="blue.600" mb={2}>
                Case Details
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Created: {formatDate(caseData.createdAt)}
              </Text>
            </Box>
          </Flex>

          <VStack gap={4} align="start">
            <HStack gap={2} mb={2}>
              <Text>Case Type:</Text>
              <Badge label={caseData.caseType} />
              <Text>Status:</Text>
              <Badge label={caseData.status} />
            </HStack>

            <Box w="full">
              <Text fontWeight="medium" mb={2}>
                Description
              </Text>
              <Text color="gray.700" p={3} bg="gray.50" borderRadius="md">
                {caseData.description}
              </Text>
            </Box>

            {caseData.legalStatus && (
              <Box w="full">
                <Text fontWeight="medium" mb={2}>
                  Legal Status
                </Text>
                <Badge
                  label={caseData.legalStatus.replace('_', ' ')}
                  colorScheme="orange"
                />
              </Box>
            )}

            {caseData.legalExtraInfo && (
              <Box w="full">
                <Text fontWeight="medium" mb={2}>
                  Legal Information
                </Text>
                <Text color="gray.700" p={3} bg="gray.50" borderRadius="md">
                  {caseData.legalExtraInfo}
                </Text>
              </Box>
            )}

            {caseData.proofFiles && caseData.proofFiles.length > 0 && (
              <Box w="full">
                <Text fontWeight="medium" mb={2}>
                  Proof Files ({caseData.proofFiles.length})
                </Text>
                <VStack gap={2} align="start">
                  {caseData.proofFiles.map((file, index) => (
                    <Link key={index} href={file} target="_blank">
                      <Box
                        p={3}
                        bg="blue.50"
                        borderRadius="md"
                        border="1px solid"
                        borderColor="blue.200"
                        _hover={{ bg: 'blue.100' }}
                        transition="all 0.2s"
                      >
                        <Text
                          fontSize="sm"
                          color="blue.700"
                          fontWeight="medium"
                        >
                          File {index + 1}
                        </Text>
                        <Text fontSize="xs" color="blue.600">
                          Click to view
                        </Text>
                      </Box>
                    </Link>
                  ))}
                </VStack>
              </Box>
            )}
          </VStack>
        </Box>

        {/* Parties Information */}
        <HStack w="full" flexDirection="row" gap={4} justify="space-between">
          <UserCard user={caseData.claimant} title="Claimant" />
          <UserCard user={caseData.oppositeParty} title="Opposite Party" />
        </HStack>

        {/* Actions */}
        <Box w="full" p={4} bg="gray.50" borderRadius="lg">
          <HStack gap={4} justify="center">
            <Button colorScheme="blue">Edit Case</Button>
            <Button colorScheme="green">Update Status</Button>
            <Button colorScheme="purple">Create Mediation Panel</Button>
          </HStack>
        </Box>
      </VStack>
    </Container>
  );
}
