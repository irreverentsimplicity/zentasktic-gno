import React from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import UndecidedTasks from './UndecidedTasks';
import StalledTasks from './StalledTasks';
import ReadyToDoTasks from './ReadyToDoTasks';

const DecideTabBar = () => {
  return (
    <Tabs variant="enclosed-colored">
      <TabList>
        <Tab
          _selected={{ bg: "#FFA500", color: "white" }}
          _hover={{ bg: "#FFA500", color: "white" }}
          _active={{ color: "#FFA500" }}
          color="#FFA500"
          fontWeight="bold"
        >
          Undecided
        </Tab>
        <Tab
          _selected={{ bg: "#FF0000", color: "white" }}
          _hover={{ bg: "#FF0000", color: "white" }}
          _active={{ color: "#FF0000" }}
          color="#FF0000"
          fontWeight="bold"
        >
          Stalled
        </Tab>
        <Tab
          _selected={{ bg: "green.400", color: "white" }}
          _hover={{ bg: "green.400", color: "white" }}
          _active={{ color: "green.400" }}
          color="green.400"
          fontWeight="bold"
        >
          Ready to Do
        </Tab>
        <Tab
          _selected={{ bg: "#FFA500", color: "white" }}
          _hover={{ bg: "#FFA500", color: "white" }}
          _active={{ color: "#FFA500" }}
          color="#FFA500"
          fontWeight="bold"
        >
          @ By Context
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <UndecidedTasks/>
        </TabPanel>
        <TabPanel>
          <StalledTasks/>
        </TabPanel>
        <TabPanel>
          <ReadyToDoTasks/>
        </TabPanel>
        <TabPanel>
          <p>By Context content goes here.</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default DecideTabBar;
