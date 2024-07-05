import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Actions from '../util/actions';
import Config from '../util/config';
import { fetchAllTasksByRealm } from '../util/fetchers';
import TaskList from './DoTasksList';

const DoTodayTasks = () => {
    const coreTasks = useSelector((state) => state.core.coreDoTasks);
    const coreContexts = useSelector((state) => state.core.coreContexts);
    const dispatch = useDispatch();
    const [sendingTaskId, setSendingTaskId] = useState(null);
    const [markAsDoneTaskId, setMarkAsDoneTaskId] = useState(null);
  
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
      setMarkAsDoneTaskId(taskId);
      const actions = await Actions.getInstance();
      actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
      try {
        await actions.MoveTaskToRealm(taskId, "4");
        fetchAllTasksByRealm(dispatch, "2");
      } catch (err) {
        console.log("error in calling handleMarkAsDone", err);
      }
      setMarkAsDoneTaskId(null);
    };
  
    const isDateToday = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      // Reset time portion of both dates to midnight
  date.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
      return date.toDateString() === now.toDateString();
    };
  
    const todayTasks = coreTasks.filter(task => isDateToday(task.taskDue));
    return <TaskList 
      tasks={todayTasks} 
      handleSendToDecide={handleSendToDecide} 
      handleMarkAsDone={handleMarkAsDone} 
      sendingTaskId={sendingTaskId}
      markAsDoneTaskId={markAsDoneTaskId}
      />;
  };

  export default DoTodayTasks;