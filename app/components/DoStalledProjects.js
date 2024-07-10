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
  Wrap,
  HStack,
  Button,
  Collapse,
  SimpleGrid,
  Badge,
} from '@chakra-ui/react';
import { ArrowBackIcon, CheckIcon } from '@chakra-ui/icons';
import { fetchAllContexts, fetchAllProjectsByRealm } from '../util/fetchers';
import { FaTasks } from 'react-icons/fa';
import '../styles/Home.module.css'; // Import custom CSS for calendar

const DoStalledProjects = () => {
  const coreDoProjects = useSelector((state) => state.core.coreDoProjects);
  const contexts = useSelector((state) => state.core.coreContexts);
  const dispatch = useDispatch();
  const [sendingProjectId, setSendingProjectId] = useState(null);
  const [markAsDoneProjectId, setMarkAsDoneProjectId] = useState(null);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [expandedTaskProjectId, setExpandedTaskProjectId] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [markAsDoneProjectTaskID, setMarkAsDoneProjectTaskId] = useState(null)

  useEffect(() => {
    fetchAllProjectsByRealm(dispatch, '3');
    fetchAllContexts(dispatch);
  }, [dispatch]);

  const handleSendToDecide = async (projectId) => {
    setSendingProjectId(projectId);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
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
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
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
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
    try {
      await actions.MarkProjectTaskAsDone(projectId, projectTaskId);
      fetchAllProjectsByRealm(dispatch, '3');
    } catch (err) {
      console.log('error in calling handleProjectTaskMarkAsDone', err);
    }
    setMarkAsDoneProjectTaskId(null);
  };

  const isDateInPast = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    // Reset time portion of both dates to midnight
  date.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
    return date < now;
  };

  const isDateInFuture = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    // Reset time portion of both dates to midnight
    date.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    return date >= now;
  };
  
  const getStalledProjects = (projects) => {
    return projects.filter((project) => {
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

  const getTaskCounts = (tasks) => {
    const readyToDoTasks = tasks.filter(task => task.taskContextId && task.taskDue && isDateInFuture(task.taskDue));
    const stalledTasks = tasks.filter(task => task.taskContextId && task.taskDue && isDateInPast(task.taskDue));
    return { readyToDoTasks: readyToDoTasks.length, stalledTasks: stalledTasks.length };
  };

  return (
    <Box>
      <List spacing={3}>
        {getStalledProjects(coreDoProjects).length === 0 ? (
          <ListItem>No stalled projects available</ListItem>
        ) : (
          getStalledProjects(coreDoProjects).map((project) => {
            const taskCounts = getTaskCounts(project.projectTasks || []);
            return (
              <Box key={project.projectId}>
                <ListItem display="flex" alignItems="center">
                  <IconButton
                    icon={sendingProjectId === project.projectId ? <Spinner size="sm" /> : <ArrowBackIcon />}
                    onClick={() => handleSendToDecide(project.projectId)}
                    colorScheme="orange"
                    mr={2}
                    isLoading={sendingProjectId === project.projectId}
                  />
                  <Box
                    flex="1"
                    p={2}
                    cursor="pointer"
                    onClick={() => setExpandedProjectId(expandedProjectId === project.projectId ? null : project.projectId)}
                    _hover={{ backgroundColor: "gray.100", borderRadius: "md" }}
                  >
                    <Text>{project.projectBody}</Text>
                    <HStack spacing={2} justify="flex-end">
                      <Box
                        bg={project.projectContextId ? "green.200" : "gray.200"}
                        borderRadius="md"
                        p={1}
                      >  
                      <Text fontSize="sm" color="gray.700">
                        @{project.projectContextId ? contexts.find(context => context.contextId === project.projectContextId)?.contextName : 'no context'}
                      </Text>
                      </Box>
                      <Box
                        bg={isDateInPast(project.projectDue) ? "red.100" : "green.200"}
                        borderRadius="md"
                        p={1}
                      >
                      <Text fontSize="sm" color="gray.700">
                        {project.projectDue ? project.projectDue : 'no due date'}
                      </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <HStack spacing={2} ml={2}>
                    {taskCounts.readyToDoTasks > 0 && (
                      <Box position="relative">
                        <IconButton
                          icon={<FaTasks color="green" />}
                          aria-label="Ready To Do Tasks"
                          onClick={() => setExpandedTaskProjectId(expandedTaskProjectId === project.projectId ? null : project.projectId)}
                        />
                        <Badge position="absolute" top="-1" right="-1" colorScheme="green">{taskCounts.readyToDoTasks}</Badge>
                      </Box>
                    )}
                    {taskCounts.stalledTasks > 0 && (
                      <Box position="relative">
                        <IconButton
                          icon={<FaTasks color="red" />}
                          aria-label="Stalled Tasks"
                          onClick={() => setExpandedTaskProjectId(expandedTaskProjectId === project.projectId ? null : project.projectId)}
                        />
                        <Badge position="absolute" top="-1" right="-1" colorScheme="red">{taskCounts.stalledTasks}</Badge>
                      </Box>
                    )}
                    <IconButton
                      icon={markAsDoneProjectId === project.projectId ? <Spinner size="sm" /> : <CheckIcon />}
                      onClick={() => handleMarkAsDone(project.projectId)}
                      colorScheme="green"
                      ml={1}
                      isLoading={markAsDoneProjectId === project.projectId }
                    />
                  </HStack>
                </ListItem>
                <Collapse in={expandedTaskProjectId === project.projectId} animateOpacity>
                  <Box mt={4} mb={4} p={4} rounded="md" borderWidth="1px" borderColor="gray.300" bg="gray.50">
                    <List spacing={3}>
                      {project.projectTasks.map((task) => (
                        <Box key={task.taskId}>
                          <ListItem display="flex" alignItems="center" _hover={{ backgroundColor: "gray.100" }} cursor="pointer" onClick={() => setExpandedTaskId(expandedTaskId === task.taskId ? null : task.taskId)}>
                            <Box flex="1" display="flex" alignItems="center">
                              <Box as="span" mr={2}>&#8226;</Box>
                              <Text>{task.taskBody} - {task.taskRealmId}</Text>
                            </Box>
                            <HStack spacing={2} justify="flex-end">
                              <Box
                                bg={task.taskContextId ? "green.200" : "gray.200"}
                                borderRadius="md"
                                p={1}
                              >
                              <Text fontSize="sm" color="gray.700">
                                @{task.taskContextId ? contexts.find(context => context.contextId === task.taskContextId)?.contextName : 'no context'}
                              </Text>
                              </Box>
                              <Box
                                bg={isDateInPast(task.taskDue) ? "red.100" : "green.200"}
                                borderRadius="md"
                                p={1}
                              >
                                <Text fontSize="sm" color="gray.700">
                                  {task.taskDue ? task.taskDue : 'no due date'}
                                </Text>
                              </Box>
                            </HStack>
                            <IconButton
                            icon={markAsDoneProjectTaskID === task.taskId ? <Spinner size="sm" /> : <CheckIcon />}
                            onClick={() => handleProjectTaskMarkAsDone(project.projectId, task.taskId)}
                            colorScheme="green"
                            ml={1}
                            size="xs"
                            isLoading={markAsDoneProjectId === project.projectId }
                            />
                          </ListItem>
                        </Box>
                      ))}
                    </List>
                  </Box>
                </Collapse>
              </Box>
            );
          })
        )}
      </List>
    </Box>
  );
};

export default DoStalledProjects;
