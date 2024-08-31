import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ActionsProject from '../../util/actionsProject';
import { fetchAllTasksByRealm } from '../../util/fetchersProject';
import 'react-calendar/dist/Calendar.css';
import '../../styles/Home.module.css'; // Import custom CSS for calendar
import TaskList from './DoTasksList';
import { isDateSoon } from '../../util/dates';

const DoSoonTasks = () => {
    const doTasks = useSelector((state) => state.project.projectDoTasks);
    const dispatch = useDispatch();
    const [sendingTaskId, setSendingTaskId] = useState(null);
    const [markAsDoneTaskId, setMarkAsDoneTaskId] = useState(null);
  
    useEffect(() => {
      fetchAllTasksByRealm(dispatch, "3");
    }, [dispatch]);
  
    const handleSendToDecide = async (taskId) => {
      setSendingTaskId(taskId);
      const actions = await ActionsProject.getInstance();
      //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
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
      const actions = await ActionsProject.getInstance();
      //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
      try {
        await actions.MoveTaskToRealm(taskId, "4");
        fetchAllTasksByRealm(dispatch, "3");
      } catch (err) {
        console.log("error in calling handleMarkAsDone", err);
      }
      setMarkAsDoneTaskId(null);
    };
  
    const soonTasks = doTasks.filter(task => isDateSoon(task.taskDue));
    return <TaskList 
      tasks={soonTasks} 
      handleSendToDecide={handleSendToDecide} 
      handleMarkAsDone={handleMarkAsDone} 
      sendingTaskId={sendingTaskId}
      markAsDoneTaskId={markAsDoneTaskId}
      />;  
  };

  export default DoSoonTasks;