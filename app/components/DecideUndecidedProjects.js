import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Actions from '../util/actions';
import Config from '../util/config';
import {
  Box,
} from '@chakra-ui/react';
import { fetchAllContexts, fetchAllProjectsByRealm } from '../util/fetchers';
import {formatDate, isDateInPast} from '../util/dates';
import '../styles/Home.module.css'; // Import custom CSS for calendar
import DecideProjectList from './DecideProjectList'

const DecideUndecidedProjects = () => {
  const coreProjects = useSelector((state) => state.core.coreDecideProjects);
  const contexts = useSelector((state) => state.core.coreContexts);
  const dispatch = useDispatch();
  const [sendingProjectId, setSendingProjectId] = useState(null);
  const [loadingContextProjectId, setLoadingContextProjectId] = useState(null);
  const [loadingDueDateProjectId, setLoadingDueDateProjectId] = useState(null);
  const [loadingContextProjectTaskId, setLoadingContextProjectTaskId] = useState(null)
  const [loadingDueDateProjectTaskId, setLoadingDueDateProjectTaskId] = useState(null)

  useEffect(() => {
    fetchAllProjectsByRealm(dispatch, '2');
    fetchAllContexts(dispatch);
  }, [dispatch]);

  const handleSendToAssess = async (projectId) => {
    setSendingProjectId(projectId);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      await actions.MoveProjectToRealm(projectId, '1');
      fetchAllProjectsByRealm(dispatch, '2');
      fetchAllProjectsByRealm(dispatch, '1');
    } catch (err) {
      console.log('error in calling handleSendToAssess', err);
    }
    setSendingProjectId(null);
  };

  const handleSendToDo = async (projectId) => {
    setSendingProjectId(projectId);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      await actions.MoveProjectToRealm(projectId, '3');
      fetchAllProjectsByRealm(dispatch, '2');
      fetchAllProjectsByRealm(dispatch, '3');
    } catch (err) {
      console.log('error in calling handleSendToDo', err);
    }
    setSendingProjectId(null);
  };

  const assignContextToProject = async (contextId, projectId) => {
    setLoadingContextProjectId(projectId);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      await actions.AddContextToProject(contextId, projectId);
      fetchAllProjectsByRealm(dispatch, '2');
    } catch (err) {
      console.log('error in calling assignContextToProject', err);
    }
    setLoadingContextProjectId(null);
  };

  const assignDueDateToProject = async (projectId, date) => {
    setLoadingDueDateProjectId(projectId);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      await actions.AssignDueDateToProject(projectId, formatDate(date));
      fetchAllProjectsByRealm(dispatch, '2');
    } catch (err) {
      console.log('error in calling assignDueDateToProject', err);
    }
    setLoadingDueDateProjectId(null);
  };

  const assignContextToProjectTask = async (contextId, projectId, projectTaskId) => {
    setLoadingContextProjectTaskId(projectTaskId)
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      await actions.AddContextToProjectTask(contextId, projectId, projectTaskId);
      fetchAllProjectsByRealm(dispatch, '2');
    } catch (err) {
      console.log('error in calling assignContextToProjectTask', err);
    }
    setLoadingContextProjectTaskId(null)
  };

  const assignDueDateToProjectTask = async (projectId, projectTaskId, date) => {
    setLoadingDueDateProjectTaskId(projectTaskId)
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      await actions.AssignDueDateToProjectTask(projectId, projectTaskId, formatDate(date));
      fetchAllProjectsByRealm(dispatch, '2');
    } catch (err) {
      console.log('error in calling assignDueDateToProjectTask', err);
    }
    setLoadingDueDateProjectTaskId(null)
  };


  const getUndecidedProjects = (projects) => {
    return projects.filter((project) => {
      const isProjectUndecided = !project.projectContextId || !project.projectDue;
  
      const isAnyTaskUndecided = project.projectTasks && project.projectTasks.some((task) => {
        return !task.taskContextId || !task.taskDue;
      });
  
      return isProjectUndecided || isAnyTaskUndecided;
    });
  };
  
  return (
    <Box>
      <DecideProjectList
        projects={getUndecidedProjects(coreProjects)}
        contexts={contexts}
        handleSendToAssess={handleSendToAssess}
        handleSendToDo={handleSendToDo}
        assignContextToProject={assignContextToProject}
        assignDueDateToProject={assignDueDateToProject}
        assignContextToProjectTask={assignContextToProjectTask}
        assignDueDateToProjectTask={assignDueDateToProjectTask}
        loadingContextProjectId={loadingContextProjectId}
        loadingDueDateProjectId={loadingDueDateProjectId}
        loadingContextProjectTaskId={loadingContextProjectTaskId}
        loadingDueDateProjectTaskId={loadingDueDateProjectTaskId}
        sendingProjectId={sendingProjectId}
        sendingToDoProjectId={"unavailable"}
      />
    </Box>
  )
};

export default DecideUndecidedProjects;
