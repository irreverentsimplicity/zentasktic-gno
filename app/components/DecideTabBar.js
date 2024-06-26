import React from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

const DecideTabBar = () => {
  return (
    <Tabs variant="enclosed-colored">
      <TabList>
        <Tab
          _selected={{ bg: "orange.400", color: "white" }}
          _hover={{ bg: "orange.400", color: "white" }}
          _active={{ color: "orange.400" }}
          color="orange.400"
        >
          Undecided
        </Tab>
        <Tab
          _selected={{ bg: "red.400", color: "white" }}
          _hover={{ bg: "red.400", color: "white" }}
          _active={{ color: "red.400" }}
          color="red.400"
        >
          Stalled
        </Tab>
        <Tab
          _selected={{ bg: "green.400", color: "white" }}
          _hover={{ bg: "green.400", color: "white" }}
          _active={{ color: "green.400" }}
          color="green.400"
        >
          Ready to Do
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <p>Undecided content goes here.</p>
        </TabPanel>
        <TabPanel>
          <p>Stalled content goes here.</p>
        </TabPanel>
        <TabPanel>
          <p>Ready to Do content goes here.</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default DecideTabBar;
