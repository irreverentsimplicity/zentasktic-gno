import React from 'react';
import { useSelector } from 'react-redux';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Badge, HStack } from '@chakra-ui/react';
import CoreTasks from './CoreTasks';
import CoreContexts from './CoreContexts';
import CoreProjects from './CoreProjects';

const AssessTabBar = () => {
  const tasks = useSelector((state) => state.project.projectAssessTasks) || [];
  const projects = useSelector((state) => state.project.projectAssessProjects) || [];
  const contexts = useSelector((state) => state.project.projectContexts) || [];
  const collections = useSelector((state) => state.project.projectCollections) || [];

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
            <Badge colorScheme="red">{tasks.length}</Badge>
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
            <Badge colorScheme="red">{projects.length}</Badge>
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
            <Badge colorScheme="red">{contexts.length}</Badge>
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
            <Badge colorScheme="red">{collections.length}</Badge>
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
