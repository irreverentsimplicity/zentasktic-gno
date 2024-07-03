import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Text,
  HStack,
  Badge,
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel, 
} from '@chakra-ui/react';
import DoStalledTasks from './DoStalledTasks';
import DoTodayTasks from './DoTodayTasks';
import DoTomorrowTasks from './DoTomorrowTasks';
import DoSoonTasks from './DoSoonTasks';

const TodayIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#6aa84f"/>
    </svg>
  );
  
  const TomorrowIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="half-circle">
          <rect x="0" y="0" width="12" height="24" />
        </clipPath>
      </defs>
      <circle cx="12" cy="12" r="10" fill="#6aa84f" clipPath="url(#half-circle)" />
      <circle cx="12" cy="12" r="10" stroke="#6aa84f" strokeWidth="2" fill="none"/>
    </svg>
  );
  
  const SoonIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="none" stroke="#6aa84f" strokeWidth="2"/>
      <circle cx="12" cy="12" r="5" fill="#6aa84f"/>
    </svg>
  );

const DoTabBar = () => {
  const [selectedTab, setSelectedTab] = useState(null);
  const [loading, setLoading] = useState(false);
  const doTasks = useSelector((state) => state.core.coreDoTasks) || [];

  const isDateInPast = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    // Reset time portion of both dates to midnight
  date.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
    return date < now;
  };

  const isDateToday = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    return date.toDateString() === now.toDateString();
  };

  const isDateTomorrow = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  };

  const isDateSoon = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    return date > tomorrow;
  };

  const stalledTasks = doTasks.filter(task => isDateInPast(task.taskDue));
  const todayTasks = doTasks.filter(task => isDateToday(task.taskDue));
  const tomorrowTasks = doTasks.filter(task => isDateTomorrow(task.taskDue));
  const soonTasks = doTasks.filter(task => isDateSoon(task.taskDue));

  

  return (
    <Tabs variant="enclosed-colored" onChange={(index) => setSelectedTab(index === 3 ? '@Contexts' : null)}>
      <TabList>
        <Tab
          _selected={{ bg: "#FF0000", color: "white" }}
          _hover={{ bg: "#FF0000", color: "white" }}
          _active={{ color: "#FF00000" }}
          color="#FF0000"
          fontWeight="bold"
        >
          <HStack>
            <span>Stalled</span>
            <Badge colorScheme="red">{stalledTasks.length}</Badge>
          </HStack>
        </Tab>
        <Tab
          _selected={{ bg: "#008000", color: "white" }}
          _hover={{ bg: "#008000", color: "white" }}
          _active={{ color: "#008000" }}
          color="#008000"
          fontWeight="bold"
        >
          <HStack>
            <Box as={TodayIcon} />
            <span>Today</span>
            <Badge colorScheme="green">{todayTasks.length}</Badge>
          </HStack>
        </Tab>
        <Tab
          _selected={{ bg: "#008000", color: "white" }}
          _hover={{ bg: "#008000", color: "white" }}
          _active={{ color: "#008000" }}
          color="#008000"
          fontWeight="bold"
        >
          <HStack>
            <Box as={TomorrowIcon} />
            <span>Tomorrow</span>
            <Badge colorScheme="green">{tomorrowTasks.length}</Badge>
          </HStack>
        </Tab>
        <Tab
          _selected={{ bg: "#008000", color: "white" }}
          _hover={{ bg: "#008000", color: "white" }}
          _active={{ color: "#008000" }}
          color="#008000"
          fontWeight="bold"
        >
          <HStack>
            <Box as={SoonIcon} />
            <span>Soon</span>
            <Badge colorScheme="green">{soonTasks.length}</Badge>
          </HStack>
        </Tab>
        <Tab
          _selected={{ bg: "#008000", color: "white" }}
          _hover={{ bg: "#008000", color: "white" }}
          _active={{ color: "#008000" }}
          color="#008000"
          fontWeight="bold"
        >
          <Text>@ By Context</Text>
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <DoStalledTasks />
        </TabPanel>
        <TabPanel>
          <DoTodayTasks />
        </TabPanel>
        <TabPanel>
          <DoTomorrowTasks />
        </TabPanel>
        <TabPanel>
          <DoSoonTasks />
        </TabPanel>
        <TabPanel>
          Contexts
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default DoTabBar;
