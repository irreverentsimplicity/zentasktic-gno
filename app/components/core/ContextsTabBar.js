import React, { useState, useEffect } from 'react';
import {useSelector} from 'react-redux'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

const ContextsTabBar = () => {
    const contexts = useSelector(state => state.core.coreContexts)
    return (
    <Tabs variant="soft-rounded" colorScheme="green">
      <TabList>
        {contexts.map((context, index) => (
          <Tab key={index}>{context}</Tab>
        ))}
      </TabList>
  
      <TabPanels>
        {contexts.map((context, index) => (
          <TabPanel key={index}>
            <p>{context} content goes here.</p>
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
    )
};

  export default ContextsTabBar;