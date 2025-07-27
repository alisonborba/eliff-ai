'use client';

import {
  Button,
  Flex,
  Input,
  Text,
  Spinner,
  VStack,
  HStack,
  Box,
} from '@chakra-ui/react';
import type { PutBlobResult } from '@vercel/blob';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { HiUpload } from 'react-icons/hi';

export default function MultiUploadComponent({
  setUrls,
}: {
  setUrls: (urls: string[]) => void;
}) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blobs, setBlobs] = useState<PutBlobResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
    currentFileName: string;
  }>({ current: 0, total: 0, currentFileName: '' });

  const handleUpload = async () => {
    if (!inputFileRef.current?.files) {
      throw new Error('No file selected');
    }

    const files = Array.from(inputFileRef.current.files);
    setIsLoading(true);
    setUploadProgress({ current: 0, total: files.length, currentFileName: '' });

    console.info('files', files);

    const uploadedBlobs: PutBlobResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      setUploadProgress({
        current: i + 1,
        total: files.length,
        currentFileName: file.name,
      });

      const fileName = `${Date.now()}-${file.name}`;

      try {
        const response = await fetch(`/api/upload?filename=${fileName}`, {
          method: 'POST',
          body: file,
        });

        const newBlob = (await response.json()) as PutBlobResult;

        console.info('uploaded file url', newBlob.url);

        uploadedBlobs.push(newBlob);
        setBlobs([...uploadedBlobs]);
      } catch (error) {
        console.error('Error uploading file:', file.name, error);
        // Continue with other files even if one fails
      }
    }

    setUrls(uploadedBlobs.map(blob => blob.url));
    setIsLoading(false);
    setUploadProgress({ current: 0, total: 0, currentFileName: '' });
  };

  return (
    <VStack gap={3} align="start" w="full">
      <HStack gap={2}>
        <Input
          onChange={() => handleUpload()}
          name="file"
          ref={inputFileRef}
          type="file"
          multiple
          style={{ display: 'none' }}
          accept="*"
        />
        <Button
          variant="outline"
          size="sm"
          p={2}
          onClick={() => inputFileRef.current?.click()}
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : <HiUpload />}
          {isLoading ? 'Uploading...' : 'Upload files'}
        </Button>
      </HStack>

      {isLoading && (
        <Box
          w="full"
          p={3}
          bg="blue.50"
          borderRadius="md"
          border="1px solid"
          borderColor="blue.200"
        >
          <VStack gap={2} align="start">
            <HStack gap={2}>
              <Spinner size="sm" color="blue.500" />
              <Text fontSize="sm" fontWeight="medium">
                Uploading {uploadProgress.current} of {uploadProgress.total}{' '}
                files
              </Text>
            </HStack>

            {uploadProgress.currentFileName && (
              <Text fontSize="xs" color="gray.600">
                Current: {uploadProgress.currentFileName}
              </Text>
            )}

            <Box w="full" bg="gray.200" borderRadius="full" h="8px">
              <Box
                bg="blue.500"
                h="8px"
                borderRadius="full"
                w={`${(uploadProgress.current / uploadProgress.total) * 100}%`}
                transition="width 0.3s ease"
              />
            </Box>
          </VStack>
        </Box>
      )}

      {blobs.length > 0 && !isLoading && (
        <Box w="full">
          <Text fontSize="sm" fontWeight="medium" mb={2}>
            Uploaded Files ({blobs.length}):
          </Text>
          <Flex gap={2} flexDirection="column">
            {blobs.map(blob => (
              <Link key={blob.url} href={blob.url} target="_blank">
                <Box
                  p={2}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  _hover={{ bg: 'gray.50' }}
                >
                  <Text fontSize="sm" color="blue.600">
                    {blob.url.slice(70, 100)}...
                  </Text>
                </Box>
              </Link>
            ))}
          </Flex>
        </Box>
      )}
    </VStack>
  );
}
