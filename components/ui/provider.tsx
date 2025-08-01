'use client';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ColorModeProvider, type ColorModeProviderProps } from './color-mode';

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider
        {...props}
        enableSystem={false}
        defaultTheme="light"
        storageKey="eliff-theme"
      />
    </ChakraProvider>
  );
}
