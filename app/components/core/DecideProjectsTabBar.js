import React from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, HStack, Badge } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import DecideUndecidedProjects from './DecideUndecidedProjects';
import DecideStalledProjects from './DecideStalledProjects';
import DecideReadyToDoProjects from './DecideReadyToDoProjects';
import DecideProjectsByContext from './DecideProjectsByContext';
import { isDateInFuture, isDateInPast } from '../../util/dates';

const DecideProjectsTabBar = () => {
  const decideProjects = useSelector((state) => state.core.coreDecideProjects) || [];

  const stalledProjects = (decideProjects) => {
    return decideProjects.filter((project) => {
      const isProjectStalled = project.projectContextId && project.projectDue && isDateInPast(project.projectDue);
  
      const areAllTasksReadyToDo = project.projectTasks && project.projectTasks.every((task) => {
        return task.taskContextId && task.taskDue;
      });
  
      const isAnyTaskStalled = project.projectTasks && project.projectTasks.some((task) => {
        return task.taskContextId && task.taskDue && isDateInPast(task.taskDue);
      });
  
      return project.projectContextId && project.projectDue && areAllTasksReadyToDo && (isProjectStalled || isAnyTaskStalled);
    });
  };

  const undecidedProjects = (decideProjects) => {
    return decideProjects.filter((project) => {
      const isProjectUndecided = !project.projectContextId || !project.projectDue;
  
      const isAnyTaskUndecided = project.projectTasks && project.projectTasks.some((task) => {
        return !task.taskContextId || !task.taskDue;
      });
  
      return isProjectUndecided || isAnyTaskUndecided;
    });
  };

  const readyToDoProjects = (decideProjects) => {
    return decideProjects.filter((project) => {
      const isProjectReadyToDo = project.projectContextId && project.projectDue && isDateInFuture(project.projectDue);
  
      const areAllTasksReadyToDo = project.projectTasks && project.projectTasks.every((task) => {
        return task.taskContextId && task.taskDue && isDateInFuture(task.taskDue);
      });
  
      return isProjectReadyToDo && areAllTasksReadyToDo;
    });
  };
  
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
            <Badge colorScheme="orange">{undecidedProjects(decideProjects).length}</Badge>
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
            <Badge colorScheme="red">{stalledProjects(decideProjects).length}</Badge>
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
            <Badge colorScheme="green">{readyToDoProjects(decideProjects).length}</Badge>
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
          <DecideUndecidedProjects/>
        </TabPanel>
        <TabPanel>
          <DecideStalledProjects/>
        </TabPanel>
        <TabPanel>
          <DecideReadyToDoProjects/>
        </TabPanel>
        <TabPanel>
          <DecideProjectsByContext/>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default DecideProjectsTabBar;
