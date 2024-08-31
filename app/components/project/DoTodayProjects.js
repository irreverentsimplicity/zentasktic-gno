import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ActionsProject from '../../util/actionsProject';
import Config from '../../util/config';
import { fetchAllProjectsByRealm } from '../../util/fetchersProject';
import '../../styles/Home.module.css'; // Import custom CSS for calendar
import { isDateToday } from '../../util/dates';
import ProjectsList from './DoProjectsList';

const DoTodayProjects = () => {
  const doProjects = useSelector((state) => state.project.projectDoProjects);
  const dispatch = useDispatch();
  const [sendingProjectId, setSendingProjectId] = useState(null);
  const [markAsDoneProjectId, setMarkAsDoneProjectId] = useState(null);
  const [markAsDoneProjectTaskID, setMarkAsDoneProjectTaskId] = useState(null)

  useEffect(() => {
    fetchAllProjectsByRealm(dispatch, '3');
  }, [dispatch]);

  const handleSendToDecide = async (projectId) => {
    setSendingProjectId(projectId);
    const actions = await ActionsProject.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      await actions.MoveProjectToRealm(projectId, '2');
      fetchAllProjectsByRealm(dispatch, '3');
      fetchAllProjectsByRealm(dispatch, '2');
    } catch (err) {
      console.log('error in calling handleSendToDecide', err);
    }
    setSendingProjectId(null);
  };

  const handleMarkAsDone = async (projectId) => {
    setMarkAsDoneProjectId(projectId);
    const actions = await ActionsProject.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      await actions.MoveProjectToRealm(projectId, '4');
      fetchAllProjectsByRealm(dispatch, '3');
    } catch (err) {
      console.log('error in calling handleMarkAsDone', err);
    }
    setMarkAsDoneProjectId(null);
  };

  const handleProjectTaskMarkAsDone = async (projectId, projectTaskId) => {
    setMarkAsDoneProjectTaskId(projectTaskId);
    const actions = await ActionsProject.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      await actions.MarkProjectTaskAsDone(projectId, projectTaskId);
      fetchAllProjectsByRealm(dispatch, '3');
    } catch (err) {
      console.log('error in calling handleProjectTaskMarkAsDone', err);
    }
    setMarkAsDoneProjectTaskId(null);
  };

  const getTodayProjects = (projects) => {
    return projects.filter(project => isDateToday(project.projectDue));
  };

  return <ProjectsList 
      projects={getTodayProjects(doProjects)} 
      handleSendToDecide={handleSendToDecide} 
      handleMarkAsDone={handleMarkAsDone}
      handleProjectTaskMarkAsDone={handleProjectTaskMarkAsDone}
      sendingProjectId={sendingProjectId}
      markAsDoneProjectId={markAsDoneProjectId}
      markAsDoneProjectTaskID={markAsDoneProjectTaskID}
      />;  

};

export default DoTodayProjects;
