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
import TaskList from './DoTasksList';

const DoSoonTasks = () => {
    const coreTasks = useSelector((state) => state.core.coreDoTasks);
    const coreContexts = useSelector((state) => state.core.coreContexts);
    const dispatch = useDispatch();
    const [sendingTaskId, setSendingTaskId] = useState(null);
  
    useEffect(() => {
      fetchAllTasksByRealm(dispatch, "3");
    }, [dispatch]);
  
    const handleSendToDecide = async (taskId) => {
      setSendingTaskId(taskId);
      const actions = await Actions.getInstance();
      actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
      try {
        await actions.MoveTaskToRealm(taskId, "2");
        fetchAllTasksByRealm(dispatch, "3");
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
        await actions.MoveTaskToRealm(taskId, "4");
        fetchAllTasksByRealm(dispatch, "3");
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
    return <TaskList 
      tasks={soonTasks} 
      handleSendToDecide={handleSendToDecide} 
      handleMarkAsDone={handleMarkAsDone} 
      sendingTaskId={sendingTaskId}
      />;  
  };

  export default DoSoonTasks;