'use client';

import {
  Container,
  Heading,
  Text,
  Box,
  Button,
  VStack,
  Flex,
  Input,
  Textarea,
  NativeSelect,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { toaster } from '@/components/ui/toaster';
import { useRouter } from 'next/navigation';
import UploadComponent from '@/components/Upload';
import MultiUploadComponent from '../../components/MultiUpload';

// Validation schemas
const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  birthday: z.string().min(1, 'Birthday is required'),
  gender: z.string().min(1, 'Gender is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  address: z
    .object({
      street: z.string().min(1, 'Street is required'),
      city: z.string().min(1, 'City is required'),
      zipCode: z.string().min(1, 'Zip code is required'),
    })
    .optional(),
  photoUrl: z.string().optional(),
});

const caseSchema = z.object({
  caseType: z.enum(['FAMILY', 'BUSINESS', 'CRIMINAL', 'COMMUNITY', 'OTHER']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  legalStatus: z
    .enum(['PENDING_IN_COURT', 'PENDING_IN_POLICE', 'NOT_REGISTERED'])
    .optional(),
  legalExtraInfo: z.string().optional(),
  oppositeParty: userSchema,
  proofFiles: z.array(z.string()).optional(),
});

type CaseFormData = z.infer<typeof caseSchema>;

export default function CasePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLegalStatus, setSelectedLegalStatus] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CaseFormData>({
    resolver: zodResolver(caseSchema),
  });

  const onSubmit = async (data: CaseFormData) => {
    setIsLoading(true);
    setError('');

    try {
      // First, create the opposite party user
      const { data: userResponse } = await axios.post('/api/users', {
        name: data.oppositeParty.name,
        birthday: data.oppositeParty.birthday,
        gender: data.oppositeParty.gender,
        email: data.oppositeParty.email,
        phone: data.oppositeParty.phone,
        address: data.oppositeParty.address,
        photoUrl: data.oppositeParty.photoUrl,
      });

      const oppositePartyId = userResponse.data.id;

      // Then, create the case
      const caseResponse = await axios.post('/api/cases', {
        caseType: data.caseType,
        description: data.description,
        legalStatus: data.legalStatus,
        legalExtraInfo: data.legalExtraInfo,
        claimantId: 'ae48ba92-733f-4a96-ac30-7e0d6edef7f0', // @TODO: get claimant id from user
        oppositePartyId: oppositePartyId,
        oppositePartyEmail: data.oppositeParty.email,
        proofFiles: data.proofFiles,
      });
      console.info('caseResponse', caseResponse.data.data);

      toaster.create({ title: 'Case created successfully!' });
      reset();

      router.push(`/case/${caseResponse.data.data.id}`);
    } catch (err: any) {
      console.error('Error creating case:', err);
      toaster.create({ title: 'Error creating case!' });
      setError(err.response?.data?.message || 'Failed to create case');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.xl" mt={5}>
      <Box w="full" p={6} bg="white">
        <Heading size="xl" mb={4}>
          Create New Case
        </Heading>

        {error && (
          <Box p={3} mb={4} bg="red.100" color="red.700" borderRadius="md">
            {error}
          </Box>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack gap={6} align="start">
            {/* Case Information */}
            <Box w="full">
              <Text mb={2}>Case Type</Text>
              <NativeSelect.Root size="sm" width="full">
                <NativeSelect.Field
                  placeholder="Select case type"
                  p={2}
                  {...register('caseType')}
                >
                  <option value="FAMILY">Family</option>
                  <option value="BUSINESS">Business</option>
                  <option value="CRIMINAL">Criminal</option>
                  <option value="COMMUNITY">Community</option>
                  <option value="OTHER">Other</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
              {errors.caseType && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.caseType.message}
                </Text>
              )}
            </Box>

            <Box w="full">
              <Text mb={2}>Description</Text>
              <Textarea
                {...register('description')}
                placeholder="Describe the case details"
                p={2}
                rows={4}
              />
              {errors.description && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.description.message}
                </Text>
              )}
            </Box>

            <Box w="full">
              <Text>Photo Upload</Text>
              <MultiUploadComponent
                setUrls={urls => setValue('proofFiles', urls)}
              />
            </Box>

            <Box w="full">
              <Text>Legal Authority Status</Text>
              <NativeSelect.Root size="sm" width="full">
                <NativeSelect.Field
                  placeholder="Select legal status"
                  p={2}
                  {...register('legalStatus')}
                  onChange={e => setSelectedLegalStatus(e.target.value)}
                >
                  <option value="PENDING_IN_COURT">Pending in Court</option>
                  <option value="PENDING_IN_POLICE">Pending in Police</option>
                  <option value="NOT_REGISTERED">Not Registered</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
              {errors.legalStatus && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.legalStatus.message}
                </Text>
              )}
            </Box>

            {(selectedLegalStatus === 'PENDING_IN_COURT' ||
              selectedLegalStatus === 'PENDING_IN_POLICE') && (
              <Box w="full">
                <Text>Legal Authority Information</Text>
                <Input
                  {...register('legalExtraInfo')}
                  placeholder={getLegalExtraInfoPlaceholder(
                    selectedLegalStatus
                  )}
                  p={2}
                />
                {errors.legalExtraInfo && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.legalExtraInfo.message}
                  </Text>
                )}
              </Box>
            )}

            {/* Divider */}
            <Box w="full" h="1px" bg="gray.400" my={2} />

            {/* Opposite Party Information */}
            <Box w="full">
              <Heading size="md" mb={4}>
                Opposite Party Information
              </Heading>

              <Flex w="full" gap={4} mb={4}>
                <Box flex={1}>
                  <Text fontWeight="medium" mb={2}>
                    Name
                  </Text>
                  <Input
                    {...register('oppositeParty.name')}
                    placeholder="Enter full name"
                    p={2}
                  />
                  {errors.oppositeParty?.name && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.oppositeParty.name.message}
                    </Text>
                  )}
                </Box>

                <Box flex={1}>
                  <Text fontWeight="medium" mb={2}>
                    Birthday
                  </Text>
                  <Input
                    {...register('oppositeParty.birthday')}
                    type="date"
                    p={2}
                  />
                  {errors.oppositeParty?.birthday && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.oppositeParty.birthday.message}
                    </Text>
                  )}
                </Box>
              </Flex>

              <Flex w="full" gap={4} mb={4}>
                <Box flex={1}>
                  <Text>Phone</Text>
                  <Input
                    {...register('oppositeParty.phone')}
                    placeholder="Enter phone number"
                    p={2}
                  />
                  {errors.oppositeParty?.phone && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.oppositeParty.phone.message}
                    </Text>
                  )}
                </Box>
                <Box flex={1}>
                  <Text>Email</Text>
                  <Input
                    {...register('oppositeParty.email')}
                    placeholder="Enter email"
                    p={2}
                  />
                  {errors.oppositeParty?.email && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.oppositeParty.email.message}
                    </Text>
                  )}
                </Box>
              </Flex>

              <Flex w="full" gap={4} mb={4}>
                <Box flex={1}>
                  <Text>Gender</Text>
                  <select
                    {...register('oppositeParty.gender')}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '16px',
                      backgroundColor: 'white',
                    }}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.oppositeParty?.gender && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.oppositeParty.gender.message}
                    </Text>
                  )}
                </Box>
                <Box flex={1}>
                  <Text>Photo Upload</Text>
                  <UploadComponent
                    setUrl={url => setValue('oppositeParty.photoUrl', url)}
                  />
                </Box>
              </Flex>

              <Box w="full" mb={4} bg="gray.100" p={3} borderRadius="md">
                <Text>Address (Optional)</Text>
                <Flex w="full" gap={4} mb={3}>
                  <Box flex={1}>
                    <Text>Street</Text>
                    <Input
                      {...register('oppositeParty.address.street')}
                      placeholder="Enter street"
                      p={2}
                    />
                  </Box>
                  <Box flex={1}>
                    <Text>City</Text>
                    <Input
                      {...register('oppositeParty.address.city')}
                      placeholder="Enter city"
                      p={2}
                    />
                  </Box>
                </Flex>
                <Box w="full">
                  <Text>Zip Code</Text>
                  <Input
                    {...register('oppositeParty.address.zipCode')}
                    placeholder="Enter zip code"
                    p={2}
                  />
                </Box>
              </Box>
            </Box>

            <Button
              type="submit"
              w="full"
              colorScheme="blue"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Case...' : 'Create Case'}
            </Button>
          </VStack>
        </form>
      </Box>
    </Container>
  );
}

const getLegalExtraInfoPlaceholder = (legalStatus: string) => {
  switch (legalStatus) {
    case 'PENDING_IN_COURT':
      return 'Case Number or FIR Number';
    case 'PENDING_IN_POLICE':
      return 'Court/Police Station name';
    default:
      return 'Enter additional legal information';
  }
};
