import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@chakra-ui/react';
import UsersTabBar from './UsersTabBar';

const UsersSliderContent = () => {

  return (
    <Box>
      <UsersTabBar/>
    </Box>
  );
};

export default UsersSliderContent;
