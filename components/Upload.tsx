'use client';

import { Button, Input } from '@chakra-ui/react';
import type { PutBlobResult } from '@vercel/blob';
import { useState, useRef } from 'react';
import { HiUpload } from 'react-icons/hi';

export default function UploadComponent({
  setUrl,
}: {
  setUrl: (url: string) => void;
}) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);

  const handleUpload = async () => {
    if (!inputFileRef.current?.files) {
      throw new Error('No file selected');
    }

    const file = inputFileRef.current.files[0];

    console.info('file', file);

    const fileName = `${Date.now()}-${file.name}`;

    const response = await fetch(`/api/upload?filename=${fileName}`, {
      method: 'POST',
      body: file,
    });

    const newBlob = (await response.json()) as PutBlobResult;

    console.info('uploaded file url', newBlob.url);

    setBlob(newBlob);
    setUrl(newBlob.url);
  };

  return (
    <>
      {!blob && (
        <>
          <Input
            onChange={() => handleUpload()}
            name="file"
            ref={inputFileRef}
            type="file"
            style={{ display: 'none' }}
            accept="image/jpeg, image/png, image/webp"
          />
          <Button
            variant="outline"
            size="sm"
            p={2}
            onClick={() => inputFileRef.current?.click()}
          >
            <HiUpload /> Upload file
          </Button>
        </>
      )}
      {blob && (
        <img
          src={blob.url}
          alt="Uploaded photo"
          style={{ width: 40, height: 40, borderRadius: '10px' }}
        />
      )}
    </>
  );
}
