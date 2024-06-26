import React from "react";
import { Flex, Box, Text, Spacer, IconButton, Link } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import Wallet from "./Wallet";

const Header = ({ appTitle, userGnotBalances }) => {
  return (
    <Flex align="center" p="4" bg="transparent" boxShadow="sm" alignItems="flex-start">
      <Link href="/">
        <IconButton
          icon={<ArrowBackIcon />}
          aria-label="Go back"
          borderRadius="50%"
          bg="gray.300"
          marginRight="4"
        />
      </Link>
      <Box display="flex" alignItems="flex-start" flexDirection="column">
        <Text fontSize="3xl" fontWeight="bold">ZenTasktic / {appTitle}</Text>
      </Box>
      <Spacer />
      <Wallet userGnotBalances={userGnotBalances} />
    </Flex>
  );
};

export default Header;
