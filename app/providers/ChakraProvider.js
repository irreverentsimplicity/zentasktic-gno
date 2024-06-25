'use client';

import { ChakraProvider as ChakraUIProvider } from '@chakra-ui/react';
//import { theme } from '../theme'; // Adjust the path as needed

export function Providers({ children }) {
  return (
    <ChakraUIProvider>
      {children}
    </ChakraUIProvider>
  );
}