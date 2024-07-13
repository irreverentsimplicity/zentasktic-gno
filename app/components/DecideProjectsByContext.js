import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Actions from '../util/actions';
import Config from '../util/config';
import {
  Box,
  Wrap,
  Flex,
  Collapse,
  Badge,
  IconButton,
  Button,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { fetchAllContexts, fetchAllProjectsByRealm } from '../util/fetchers';
import { formatDate, isDateInFuture, isDateInPast } from '../util/dates';
import '../styles/Home.module.css'; // Import custom CSS for calendar
import DecideProjectList from './DecideProjectList';

const DecideProjectsByContext = () => {
  const decideProjects = useSelector((state) => state.core.coreDecideProjects);
  const contexts = useSelector((state) => state.core.coreContexts);
  const dispatch = useDispatch();
  const [sendingProjectId, setSendingProjectId] = useState(null);
  const [sendingToDoProjectId, setSendingToDoProjectId] = useState(null)
  const [expandedContextId, setExpandedContextId] = useState(null);
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
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
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
    setSendingToDoProjectId(projectId);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
    try {
      await actions.MoveProjectToRealm(projectId, '3');
      fetchAllProjectsByRealm(dispatch, '2');
      fetchAllProjectsByRealm(dispatch, '3');
    } catch (err) {
      console.log('error in calling handleSendToDo', err);
    }
    setSendingToDoProjectId(null);
  };

  const assignContextToProject = async (contextId, projectId) => {
    setLoadingContextProjectId(projectId);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
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
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
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
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
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
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
    try {
      await actions.AssignDueDateToProjectTask(projectId, projectTaskId, formatDate(date));
      fetchAllProjectsByRealm(dispatch, '2');
    } catch (err) {
      console.log('error in calling assignDueDateToProjectTask', err);
    }
    setLoadingDueDateProjectTaskId(null)
  };

  const groupProjectsByContext = (decideProjects) => {
    return decideProjects.reduce((acc, project) => {
      const contextId = project.projectContextId || 'noContext';
      if (!acc[contextId]) {
        acc[contextId] = [];
      }
      acc[contextId].push(project);
      return acc;
    }, {});
  };


  const groupedProjects = groupProjectsByContext(decideProjects);

  return (
    <Box>
      <Wrap spacing={4}>
        {Object.keys(groupedProjects).map((contextId) => {
          const context = contexts.find(ctx => ctx.contextId === contextId);
          const contextName = context ? '@' + context.contextName : 'No Context';
          const projects = groupedProjects[contextId];
          return (
            <Box
              key={contextId}
              borderWidth="1px"
              borderRadius="lg"
              mb={4}
              style={{width: "100%"}}
            >
              <Flex
                p={4}
                cursor="pointer"
                align="center"
                _hover={{ backgroundColor: "gray.100" }}
                bg={expandedContextId === contextId ? "gray.100" : "white"}
                onClick={() => setExpandedContextId(expandedContextId === contextId ? null : contextId)}
              >
                <IconButton
                  icon={expandedContextId === contextId ? <ChevronDownIcon /> : <ChevronRightIcon />}
                  colorScheme="gray"
                  aria-label="Expand"
                  size={"md"}
                  mr={2}
                />
                <Button variant="ghost" flex="1" width={100} colorScheme="orange">
                  {contextName} <Badge ml="2" colorScheme="gray">{projects.length}</Badge>
                </Button>
              </Flex>
              <Collapse in={expandedContextId === contextId} animateOpacity>
                <Box p={4} borderTopWidth="1px">
                <DecideProjectList
                  projects={projects}
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
                  sendingToDoProjectId={sendingToDoProjectId}
                />
                </Box>
              </Collapse>
            </Box>
          );
      
        })}
      </Wrap>
    </Box>
  )
};

export default DecideProjectsByContext;
