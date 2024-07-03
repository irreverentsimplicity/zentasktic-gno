import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Actions from '../util/actions';
import Config from '../util/config';
import { fetchAllTasksByRealm } from '../util/fetchers';
import TaskList from './DoTasksList';

const DoStalledTasks = () => {
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
        fetchAllTasksByRealm(dispatch, "2");
      } catch (err) {
        console.log("error in calling handleMarkAsDone", err);
      }
      setSendingTaskId(null);
    };
  
    const isDateInPast = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      // Reset time portion of both dates to midnight
        date.setHours(0, 0, 0, 0);
        now.setHours(0, 0, 0, 0);
      return date < now;
    };
  
    const stalledTasks = coreTasks.filter(task => isDateInPast(task.taskDue));
  
    return <TaskList 
      tasks={stalledTasks} 
      handleSendToDecide={handleSendToDecide} 
      handleMarkAsDone={handleMarkAsDone} 
      sendingTaskId={sendingTaskId}
      />;
  };

  export default DoStalledTasks;