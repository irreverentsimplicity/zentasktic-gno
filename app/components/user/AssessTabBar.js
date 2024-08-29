import React from 'react';
import { useSelector } from 'react-redux';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Badge, HStack } from '@chakra-ui/react';
import CoreTasks from './CoreTasks';
import CoreContexts from './CoreContexts';
import CoreProjects from './CoreProjects';

const AssessTabBar = () => {
  const coreTasks = useSelector((state) => state.core.coreAssessTasks) || [];
  const coreProjects = useSelector((state) => state.core.coreAssessProjects) || [];
  const coreContexts = useSelector((state) => state.core.coreContexts) || [];
  const coreCollections = useSelector((state) => state.core.coreCollections) || [];

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
          <HStack spacing={4}>
            <span>Tasks</span>
            <Badge colorScheme="red">{coreTasks.length}</Badge>
          </HStack>
        </Tab>
        <Tab
          _selected={{ bg: "#FF0000", color: "white" }}
          _hover={{ bg: "#FF0000", color: "white" }}
          _active={{ color: "#FF0000" }}
          color="#FF0000"
          fontWeight="bold"
        >
          <HStack spacing={4}>
            <span>Projects</span>
            <Badge colorScheme="red">{coreProjects.length}</Badge>
          </HStack>
        </Tab>
        <Tab
          _selected={{ bg: "#FF0000", color: "white" }}
          _hover={{ bg: "#FF0000", color: "white" }}
          _active={{ color: "#FF0000" }}
          color="#FF0000"
          fontWeight="bold"
        >
          <HStack spacing={4}>
            <span>Contexts</span>
            <Badge colorScheme="red">{coreContexts.length}</Badge>
          </HStack>
        </Tab>
        <Tab
          _selected={{ bg: "#FF0000", color: "white" }}
          _hover={{ bg: "#FF0000", color: "white" }}
          _active={{ color: "#FF0000" }}
          color="#FF0000"
          fontWeight="bold"
        >
          <HStack spacing={4}>
            <span>Collections</span>
            <Badge colorScheme="red">{coreCollections.length}</Badge>
          </HStack>
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <CoreTasks />
        </TabPanel>
        <TabPanel>
          <CoreProjects />
        </TabPanel>
        <TabPanel>
          <CoreContexts />
        </TabPanel>
        <TabPanel>
          <p>Not implemented</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default AssessTabBar;
