import React from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, HStack, Badge } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import ProjectTeams from './ProjectTeams';

const TeamsTabBar = () => {
  const teams = useSelector((state) => state.project.projectTeams) || [];

  return (
    <Tabs variant="enclosed-colored">
      <TabList justifyContent={"flex-end"}>
        <Tab
          _selected={{ bg: "#FFA500", color: "white" }}
          _hover={{ bg: "#FFA500", color: "white" }}
          _active={{ color: "#FFA500" }}
          color="#FFA500"
          fontWeight="bold"
        >
          <HStack spacing={4}>
            <span>Teams</span>
            <Badge colorScheme="gray">{teams.length}</Badge>
          </HStack>
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <ProjectTeams/>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default TeamsTabBar;
