import React from "react";
import { Flex, Box, Text, Spacer } from '@chakra-ui/react';
import Wallet from "./Wallet";


const Header = ({ appTitle, userGnotBalances }) => {



    return (
        <Flex align="center" p="3" bg="transparent" boxShadow="sm" alignItems="flex-start">
          <Box display="flex" alignItems="flex-start" flexDirection={"column"}>
            <Text fontSize="3xl" fontWeight="bold">ZenTasktic / {appTitle}</Text>
          </Box>
          <Spacer />
          <Wallet userGnotBalances={userGnotBalances} />
        </Flex>
      );
}

export default Header