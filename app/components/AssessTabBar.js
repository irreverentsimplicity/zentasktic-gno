import React from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import CoreTasks from './CoreTasks';
import CoreContexts from './CoreContexts';
import CoreProjects from './CoreProjects';

const AssessTabBar = () => {
  return (
    <Tabs variant="enclosed-colored" colorScheme="red">
      <TabList>
        <Tab
          _selected={{ bg: "#FF0000", color: "white" }}
          _hover={{ bg: "#FF0000", color: "white" }}
          _active={{ color: "#FF0000" }}
          color="#FF0000"
          fontWeight="bold"
        >
            Tasks
        </Tab>
        <Tab
          _selected={{ bg: "#FF0000", color: "white" }}
          _hover={{ bg: "#FF0000", color: "white" }}
          _active={{ color: "#FF0000" }}
          color="#FF0000"
          fontWeight="bold"
        >
            Projects
        </Tab>
        <Tab
          _selected={{ bg: "#FF0000", color: "white" }}
          _hover={{ bg: "#FF0000", color: "white" }}
          _active={{ color: "#FF0000" }}
          color="#FF0000"
          fontWeight="bold"
        >
            Contexts
        </Tab>
        <Tab
          _selected={{ bg: "#FF0000", color: "white" }}
          _hover={{ bg: "#FF0000", color: "white" }}
          _active={{ color: "#FF0000" }}
          color="#FF0000"
          fontWeight="bold"
        >
            Collections
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <CoreTasks/>
        </TabPanel>
        <TabPanel>
          <CoreProjects />
        </TabPanel>
        <TabPanel>
          <CoreContexts />
        </TabPanel>
        <TabPanel>
          <p>Collections content goes here.</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default AssessTabBar;
