import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Actions from '../util/actions';
import Config from '../util/config';
import {
  Box,
  IconButton,
  List,
  ListItem,
  Spinner,
  Text,
  HStack,
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel, 
} from '@chakra-ui/react';
import { ArrowForwardIcon, CheckIcon } from '@chakra-ui/icons';
import { fetchAllTasksByRealm } from '../util/fetchers';
import 'react-calendar/dist/Calendar.css';
import '../styles/Home.module.css'; // Import custom CSS for calendar
import ContextsTabBar from './ContextsTabBar';

const TaskList = ({ tasks, handleSendToDecide, handleMarkAsDone, sendingTaskId }) => (
  <Box>
    <List spacing={3}>
      {tasks.length === 0 ? (
        <ListItem>No tasks available</ListItem>
      ) : (
        tasks.map((task) => (
          <Box key={task.taskId}>
            <ListItem display="flex" alignItems="center">
              <IconButton
                icon={sendingTaskId === task.taskId ? <Spinner size="sm" /> : <ArrowForwardIcon />}
                onClick={() => handleSendToDecide(task.taskId)}
                colorScheme="orange"
                mr={2}
                isLoading={sendingTaskId === task.taskId}
              />
              <Box
                flex="1"
                cursor="pointer"
              >
                <Text>{task.taskBody}</Text>
                <HStack spacing={2} justify="flex-end">
                  <Box
                    bg={task.taskContextId ? "orange.200" : "gray.200"}
                    borderRadius="md"
                    p={1}
                  >
                    <Text fontSize="sm" color="gray.700">
                      @{task.taskContextId ? contexts.find(context => context.contextId === task.taskContextId)?.contextName : 'no context'}
                    </Text>
                  </Box>
                  <Box
                    bg={isDateInPast(task.taskDue) ? "red.200" : "green.200"}
                    borderRadius="md"
                    p={1}
                  >
                    <Text fontSize="sm" color="gray.700">
                      {task.taskDue ? task.taskDue : 'no due date'}
                    </Text>
                  </Box>
                </HStack>
              </Box>
              <IconButton
                icon={sendingTaskId === task.taskId ? <Spinner size="sm" /> : <CheckIcon />}
                onClick={() => handleMarkAsDone(task.taskId)}
                colorScheme="green"
                ml={2}
                isLoading={sendingTaskId === task.taskId}
              />
            </ListItem>
          </Box>
        ))
      )}
    </List>
  </Box>
);

const StalledTasks = () => {
  const coreTasks = useSelector((state) => state.core.coreDoTasks);
  const dispatch = useDispatch();
  const [sendingTaskId, setSendingTaskId] = useState(null);

  useEffect(() => {
    fetchAllTasksByRealm(dispatch, "2");
  }, [dispatch]);

  const handleSendToDecide = async (taskId) => {
    setSendingTaskId(taskId);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
    try {
      await actions.MoveTaskToRealm(taskId, "1");
      fetchAllTasksByRealm(dispatch, "2");
    } catch (err) {
      console.log("error in calling handleSendToDecide", err);
    }
    setSendingTaskId(null);
  };

  const handleMarkAsDone = async (taskId) => {
    setSendingTaskId(taskId);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
    try {
      await actions.MarkTaskAsDone(taskId);
      fetchAllTasksByRealm(dispatch, "2");
    } catch (err) {
      console.log("error in calling handleMarkAsDone", err);
    }
    setSendingTaskId(null);
  };

  const isDateInPast = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    return date < now;
  };

  const stalledTasks = coreTasks.filter(task => isDateInPast(task.taskDue));

  return <TaskList tasks={stalledTasks} handleSendToDecide={handleSendToDecide} handleMarkAsDone={handleMarkAsDone} sendingTaskId={sendingTaskId} />;
};

const TodayTasks = () => {
  const coreTasks = useSelector((state) => state.core.coreDoTasks);
  const dispatch = useDispatch();
  const [sendingTaskId, setSendingTaskId] = useState(null);

  useEffect(() => {
    fetchAllTasksByRealm(dispatch, "2");
  }, [dispatch]);

  const handleSendToDecide = async (taskId) => {
    setSendingTaskId(taskId);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
    try {
      await actions.MoveTaskToRealm(taskId, "1");
      fetchAllTasksByRealm(dispatch, "2");
    } catch (err) {
      console.log("error in calling handleSendToDecide", err);
    }
    setSendingTaskId(null);
  };

  const handleMarkAsDone = async (taskId) => {
    setSendingTaskId(taskId);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
    try {
      await actions.MarkTaskAsDone(taskId);
      fetchAllTasksByRealm(dispatch, "2");
    } catch (err) {
      console.log("error in calling handleMarkAsDone", err);
    }
    setSendingTaskId(null);
  };

  const isDateToday = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    return date.toDateString() === now.toDateString();
  };

  const todayTasks = coreTasks.filter(task => isDateToday(task.taskDue));

  return <TaskList tasks={todayTasks} handleSendToDecide={handleSendToDecide} handleMarkAsDone={handleMarkAsDone} sendingTaskId={sendingTaskId} />;
};

const TomorrowTasks = () => {
  const coreTasks = useSelector((state) => state.core.coreDoTasks);
  const dispatch = useDispatch();
  const [sendingTaskId, setSendingTaskId] = useState(null);

  useEffect(() => {
    fetchAllTasksByRealm(dispatch, "2");
  }, [dispatch]);

  const handleSendToDecide = async (taskId) => {
    setSendingTaskId(taskId);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
    try {
      await actions.MoveTaskToRealm(taskId, "1");
      fetchAllTasksByRealm(dispatch, "2");
    } catch (err) {
      console.log("error in calling handleSendToDecide", err);
    }
    setSendingTaskId(null);
  };

  const handleMarkAsDone = async (taskId) => {
    setSendingTaskId(taskId);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
    try {
      await actions.MarkTaskAsDone(taskId);
      fetchAllTasksByRealm(dispatch, "2");
    } catch (err) {
      console.log("error in calling handleMarkAsDone", err);
    }
    setSendingTaskId(null);
  };

  const isDateTomorrow = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  };

  const tomorrowTasks = coreTasks.filter(task => isDateTomorrow(task.taskDue));

  return <TaskList tasks={tomorrowTasks} handleSendToDecide={handleSendToDecide} handleMarkAsDone={handleMarkAsDone} sendingTaskId={sendingTaskId} />;
};

const SoonTasks = () => {
  const coreTasks = useSelector((state) => state.core.coreDoTasks);
  const dispatch = useDispatch();
  const [sendingTaskId, setSendingTaskId] = useState(null);

  useEffect(() => {
    fetchAllTasksByRealm(dispatch, "2");
  }, [dispatch]);

  const handleSendToDecide = async (taskId) => {
    setSendingTaskId(taskId);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
    try {
      await actions.MoveTaskToRealm(taskId, "1");
      fetchAllTasksByRealm(dispatch, "2");
    } catch (err) {
      console.log("error in calling handleSendToDecide", err);
    }
    setSendingTaskId(null);
  };

  const handleMarkAsDone = async (taskId) => {
    setSendingTaskId(taskId);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
    try {
      await actions.MarkTaskAsDone(taskId);
      fetchAllTasksByRealm(dispatch, "2");
    } catch (err) {
      console.log("error in calling handleMarkAsDone", err);
    }
    setSendingTaskId(null);
  };

  const isDateSoon = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    return date > tomorrow;
  };

  const soonTasks = coreTasks.filter(task => isDateSoon(task.taskDue));

  return <TaskList tasks={soonTasks} handleSendToDecide={handleSendToDecide} handleMarkAsDone={handleMarkAsDone} sendingTaskId={sendingTaskId} />;
};

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
  const [contexts, setContexts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedTab === '@Contexts') {
      fetchContexts();
    }
  }, [selectedTab]);

  const fetchContexts = async () => {
    setLoading(true);
    try {
      // Mocked API response
      const mockedResponse = [
        "@Home",
        "@Work",
        "@Shopping"
      ];
      setTimeout(() => {
        setContexts(mockedResponse);
        setLoading(false);
      }, 1000); // Simulating network delay
    } catch (error) {
      console.error('Error fetching contexts:', error);
      setLoading(false);
    }
  };

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
            <Box as={TodayIcon} />
            <Text>Stalled</Text>
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
            <Text>Today</Text>
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
            <Text>Tomorrow</Text>
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
            <Text>Soon</Text>
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
          <StalledTasks />
        </TabPanel>
        <TabPanel>
          <TodayTasks />
        </TabPanel>
        <TabPanel>
          <TomorrowTasks />
        </TabPanel>
        <TabPanel>
          <SoonTasks />
        </TabPanel>
        <TabPanel>
          {loading ? <Spinner /> : <ContextsTabBar contexts={contexts} />}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default DoTabBar;
