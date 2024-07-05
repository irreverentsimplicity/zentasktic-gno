import React from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, HStack, Badge } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import DecideUndecidedTasks from './DecideUndecidedTasks';
import DecideStalledTasks from './DecideStalledProjects';
import DecideReadyToDoTasks from './DecideReadyToDoTasks';

const DecideTasksTabBar = () => {
  const decideTasks = useSelector((state) => state.core.coreDecideTasks) || [];

  const isDateInPast = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    // Reset time portion of both dates to midnight
  date.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
    return date < now;
  };

  const isDateInFuture = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    // Reset time portion of both dates to midnight
  date.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
    return date >= now;
  };


  const stalledTasks = decideTasks.filter(task => task.taskContextId && task.taskDue && isDateInPast(task.taskDue));  
  const undecidedTasks = decideTasks.filter((task) => !task.taskContextId || !task.taskDue);
  const readyToDoTasks = decideTasks.filter(task => task.taskContextId && task.taskDue && isDateInFuture(task.taskDue));
  
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
            <span>Undecided</span>
            <Badge colorScheme="orange">{undecidedTasks.length}</Badge>
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
            <span>Stalled</span>
            <Badge colorScheme="red">{stalledTasks.length}</Badge>
          </HStack>
        </Tab>
        <Tab
          _selected={{ bg: "green.400", color: "white" }}
          _hover={{ bg: "green.400", color: "white" }}
          _active={{ color: "green.400" }}
          color="green.400"
          fontWeight="bold"
        >
          <HStack spacing={4}>
            <span>Ready To Do</span>
            <Badge colorScheme="green">{readyToDoTasks.length}</Badge>
          </HStack>
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
          <DecideUndecidedTasks/>
        </TabPanel>
        <TabPanel>
          <DecideStalledTasks/>
        </TabPanel>
        <TabPanel>
          <DecideReadyToDoTasks/>
        </TabPanel>
        <TabPanel>
          <p>By Context content goes here.</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default DecideTasksTabBar;
