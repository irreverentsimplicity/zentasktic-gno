import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@chakra-ui/react';
import TeamsTabBar from './TeamsTabBar';

const TeamsSliderContent = () => {

  return (
    <Box>
      <TeamsTabBar/>
    </Box>
  );
};

export default TeamsSliderContent;
