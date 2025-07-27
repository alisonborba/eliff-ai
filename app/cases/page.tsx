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
  SimpleGrid,
  Input,
} from '@chakra-ui/react';
import { useEffect, useState, useMemo } from 'react';
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

type CaseCategory =
  | 'ALL'
  | 'FAMILY'
  | 'BUSINESS'
  | 'CRIMINAL'
  | 'COMMUNITY'
  | 'OTHER';
type StatusFilter =
  | 'ALL'
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'UNRESOLVED';

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CaseCategory>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  const bgColor = 'white';
  const borderColor = 'gray.200';

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

  // Dashboard Statistics
  const dashboardStats = useMemo(() => {
    const totalCases = cases.length;
    const activeCases = cases.filter(c =>
      [
        'PENDING',
        'AWAITING_RESPONSE',
        'ACCEPTED',
        'PANEL_CREATED',
        'MEDIATION_IN_PROGRESS',
      ].includes(c.status)
    ).length;
    const resolvedCases = cases.filter(c => c.status === 'RESOLVED').length;
    const unresolvedCases = cases.filter(c => c.status === 'UNRESOLVED').length;

    // Case type distribution
    const caseTypeStats = {
      FAMILY: cases.filter(c => c.caseType === 'FAMILY').length,
      BUSINESS: cases.filter(c => c.caseType === 'BUSINESS').length,
      CRIMINAL: cases.filter(c => c.caseType === 'CRIMINAL').length,
      COMMUNITY: cases.filter(c => c.caseType === 'COMMUNITY').length,
      OTHER: cases.filter(c => c.caseType === 'OTHER').length,
    };

    return {
      totalCases,
      activeCases,
      resolvedCases,
      unresolvedCases,
      caseTypeStats,
    };
  }, [cases]);

  // Filtered cases
  const filteredCases = useMemo(() => {
    let filtered = cases;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        c =>
          c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.claimant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.oppositeParty.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          c.legalExtraInfo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter(c => c.caseType === categoryFilter);
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      switch (statusFilter) {
        case 'PENDING':
          filtered = filtered.filter(c => c.status === 'PENDING');
          break;
        case 'IN_PROGRESS':
          filtered = filtered.filter(c =>
            [
              'AWAITING_RESPONSE',
              'ACCEPTED',
              'PANEL_CREATED',
              'MEDIATION_IN_PROGRESS',
            ].includes(c.status)
          );
          break;
        case 'RESOLVED':
          filtered = filtered.filter(c => c.status === 'RESOLVED');
          break;
        case 'UNRESOLVED':
          filtered = filtered.filter(c => c.status === 'UNRESOLVED');
          break;
      }
    }

    return filtered;
  }, [cases, searchTerm, categoryFilter, statusFilter]);

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

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('ALL');
    setStatusFilter('ALL');
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
      <VStack gap={8} align="start">
        {/* Dashboard Statistics */}
        <Box
          w="full"
          p={6}
          bg={bgColor}
          borderRadius="lg"
          border="1px"
          borderColor={borderColor}
        >
          <Heading size="md" mb={4} color="gray.700">
            Overview Statistics
          </Heading>
          <SimpleGrid columns={{ base: 2, md: 4 }} gap={6}>
            <Box textAlign="center" p={4} bg="blue.50" borderRadius="md">
              <Text fontSize="sm" color="gray.600" mb={1}>
                Total Cases
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                {dashboardStats.totalCases}
              </Text>
              <Text fontSize="xs" color="gray.500">
                All cases in system
              </Text>
            </Box>
            <Box textAlign="center" p={4} bg="orange.50" borderRadius="md">
              <Text fontSize="sm" color="gray.600" mb={1}>
                Active Cases
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                {dashboardStats.activeCases}
              </Text>
              <Text fontSize="xs" color="gray.500">
                Currently in progress
              </Text>
            </Box>
            <Box textAlign="center" p={4} bg="green.50" borderRadius="md">
              <Text fontSize="sm" color="gray.600" mb={1}>
                Resolved
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="green.600">
                {dashboardStats.resolvedCases}
              </Text>
              <Text fontSize="xs" color="gray.500">
                Successfully closed
              </Text>
            </Box>
            <Box textAlign="center" p={4} bg="red.50" borderRadius="md">
              <Text fontSize="sm" color="gray.600" mb={1}>
                Unresolved
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="red.600">
                {dashboardStats.unresolvedCases}
              </Text>
              <Text fontSize="xs" color="gray.500">
                Failed to resolve
              </Text>
            </Box>
          </SimpleGrid>
        </Box>

        {/* Case Type Distribution */}
        <Box
          w="full"
          p={6}
          bg={bgColor}
          borderRadius="lg"
          border="1px"
          borderColor={borderColor}
        >
          <Heading size="md" mb={4} color="gray.700">
            Case Type Distribution
          </Heading>
          <SimpleGrid columns={{ base: 2, md: 5 }} gap={4}>
            {Object.entries(dashboardStats.caseTypeStats).map(
              ([type, count]) => (
                <Box
                  key={type}
                  textAlign="center"
                  p={3}
                  bg="gray.50"
                  borderRadius="md"
                >
                  <Badge colorScheme={getCaseTypeColor(type)} mb={2}>
                    {type}
                  </Badge>
                  <Text fontSize="xl" fontWeight="bold" color="gray.700">
                    {count}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {dashboardStats.totalCases > 0
                      ? Math.round((count / dashboardStats.totalCases) * 100)
                      : 0}
                    %
                  </Text>
                </Box>
              )
            )}
          </SimpleGrid>
        </Box>

        {/* Filters */}
        <Box
          w="full"
          p={6}
          bg={bgColor}
          borderRadius="lg"
          border="1px"
          borderColor={borderColor}
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md" color="gray.700">
              Filters & Search ({filteredCases.length} of {cases.length})
            </Heading>
            <Button size="sm" variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </Flex>

          <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
            <Input
              placeholder="Search cases, parties, or legal info..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />

            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value as CaseCategory)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                backgroundColor: 'white',
                minWidth: '150px',
              }}
            >
              <option value="ALL">All Categories</option>
              <option value="FAMILY">Family</option>
              <option value="BUSINESS">Business</option>
              <option value="CRIMINAL">Criminal</option>
              <option value="COMMUNITY">Community</option>
              <option value="OTHER">Other</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as StatusFilter)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                backgroundColor: 'white',
                minWidth: '150px',
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="UNRESOLVED">Unresolved</option>
            </select>
          </Flex>
        </Box>

        {/* Cases List */}
        {filteredCases.length === 0 ? (
          <Box w="full" p={8} textAlign="center" bg="gray.50" borderRadius="lg">
            <Text fontSize="lg" color="gray.500">
              {cases.length === 0
                ? 'No cases found. Create your first case to get started.'
                : 'No cases match your current filters. Try adjusting your search criteria.'}
            </Text>
            {cases.length === 0 && (
              <Link href="/case">
                <Button colorScheme="blue" mt={4}>
                  Create New Case
                </Button>
              </Link>
            )}
          </Box>
        ) : (
          <VStack gap={4} w="full">
            {filteredCases.map(caseItem => (
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
