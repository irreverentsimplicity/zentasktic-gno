import React from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, HStack, Badge } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import ProjectUsers from './ProjectUsers';

const TeamsTabBar = () => {
  const users = useSelector((state) => state.project.projectUsers) || [];

  return (
    <Tabs variant="enclosed-colored">
      <TabList justifyContent={"flex-start"}>
        <Tab
          _selected={{ bg: "#FFA500", color: "white" }}
          _hover={{ bg: "#FFA500", color: "white" }}
          _active={{ color: "#FFA500" }}
          color="#FFA500"
          fontWeight="bold"
        >
          <HStack spacing={4}>
            <span>Users</span>
            <Badge colorScheme="gray">{users.length}</Badge>
          </HStack>
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <ProjectUsers/>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default TeamsTabBar;
