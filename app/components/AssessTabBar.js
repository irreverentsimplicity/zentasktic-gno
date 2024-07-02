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
          _selected={{ bg: "red.400", color: "white" }}
          _hover={{ bg: "red.400", color: "white" }}
          _active={{ color: "red.400" }}
          color="red.400"
        >
            Tasks
        </Tab>
        <Tab
          _selected={{ bg: "red.400", color: "white" }}
          _hover={{ bg: "red.400", color: "white" }}
          _active={{ color: "red.400" }}
          color="red.400"
        >
            Projects
        </Tab>
        <Tab
          _selected={{ bg: "red.400", color: "white" }}
          _hover={{ bg: "red.400", color: "white" }}
          _active={{ color: "red.400" }}
          color="red.400"
        >
            Contexts
        </Tab>
        <Tab
          _selected={{ bg: "red.400", color: "white" }}
          _hover={{ bg: "red.400", color: "white" }}
          _active={{ color: "red.400" }}
          color="red.400"
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
