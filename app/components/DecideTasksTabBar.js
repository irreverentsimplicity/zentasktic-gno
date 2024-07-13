import React from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, HStack, Badge } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import DecideUndecidedTasks from './DecideUndecidedTasks';
import DecideStalledTasks from './DecideStalledTasks';
import DecideReadyToDoTasks from './DecideReadyToDoTasks';
import DecideTasksByContext from './DecideTasksByContext';
import { isDateInFuture, isDateInPast } from '../util/dates';

const DecideTasksTabBar = () => {
  const decideTasks = useSelector((state) => state.core.coreDecideTasks) || [];

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
          <DecideTasksByContext/>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default DecideTasksTabBar;
