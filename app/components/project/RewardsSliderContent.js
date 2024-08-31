import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@chakra-ui/react';
import RewardsTabBar from './RewardsTabBar';

const RewardsSliderContent = () => {

  return (
    <Box>
      <RewardsTabBar/>
    </Box>
  );
};

export default RewardsSliderContent;
