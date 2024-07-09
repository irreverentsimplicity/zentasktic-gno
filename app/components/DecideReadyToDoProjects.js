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
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { fetchAllContexts, fetchAllProjectsByRealm } from '../util/fetchers';
import Calendar from 'react-calendar';
import { FaTasks } from 'react-icons/fa';
import 'react-calendar/dist/Calendar.css';
import '../styles/Home.module.css'; // Import custom CSS for calendar

const DecideReadyToDoProjects = () => {
  const coreProjects = useSelector((state) => state.core.coreDecideProjects);
  const contexts = useSelector((state) => state.core.coreContexts);
  const dispatch = useDispatch();
  const [sendingProjectId, setSendingProjectId] = useState(null);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loadingContextProjectId, setLoadingContextProjectId] = useState(null);
  const [loadingDueDateProjectId, setLoadingDueDateProjectId] = useState(null);
  const [expandedTaskProjectId, setExpandedTaskProjectId] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
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
    setSendingProjectId(projectId);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
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

  const assignDueDateToTask = async (taskId, date) => {
    setLoadingDueDateTaskId(taskId);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
    try {
      await actions.AssignDueDateToTask(taskId, formatDate(date));
      fetchAllTasksByRealm(dispatch, '2');
    } catch (err) {
      console.log('error in calling assignDueDateToTask', err);
    }
    setLoadingDueDateTaskId(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
    return formattedDate;
  };

  const isDateInFuture = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    // Reset time portion of both dates to midnight
    date.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    return date >= now;
  };

  const getReadyToDoProjects = (projects) => {
    return projects.filter((project) => {
      const isProjectReadyToDo = project.projectContextId && project.projectDue && isDateInFuture(project.projectDue);
  
      const areAllTasksReadyToDo = project.projectTasks && project.projectTasks.every((task) => {
        return task.taskContextId && task.taskDue && isDateInFuture(task.taskDue);
      });
  
      return isProjectReadyToDo && areAllTasksReadyToDo;
    });
  };

  const getTaskCounts = (tasks) => {
    const undecidedTasks = tasks.filter(task => !task.taskContextId || !task.taskDue);
    const decidedTasks = tasks.filter(task => task.taskContextId && task.taskDue);
    return { undecidedTasks: undecidedTasks.length, decidedTasks: decidedTasks.length };
  };

  return (
    <Box>
      <List spacing={3}>
        {getReadyToDoProjects(coreProjects).length === 0 ? (
          <ListItem>No ready to do projects available</ListItem>
        ) : (
          getReadyToDoProjects(coreProjects).map((project) => {
            const taskCounts = getTaskCounts(project.projectTasks || []);
            return (
              <Box key={project.projectId}>
                <ListItem display="flex" alignItems="center">
                  <IconButton
                    icon={sendingProjectId === project.projectId ? <Spinner size="sm" /> : <ArrowBackIcon />}
                    onClick={() => handleSendToAssess(project.projectId)}
                    colorScheme="red"
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
                        {loadingContextProjectId === project.projectId ? (
                          <Spinner size="sm" />
                        ) : (
                          <Text fontSize="sm" color="gray.700">
                            @{project.projectContextId ? contexts.find(context => context.contextId === project.projectContextId)?.contextName : 'no context'}
                          </Text>
                        )}
                      </Box>
                      <Box
                        bg={project.projectDue ? "green.200" : "gray.200"}
                        borderRadius="md"
                        p={1}
                      >
                        {loadingDueDateProjectId === project.projectId ? (
                          <Spinner size="sm" />
                        ) : (
                          <Text fontSize="sm" color="gray.700">
                            {project.projectDue ? project.projectDue : 'no due date'}
                          </Text>
                        )}
                      </Box>
                    </HStack>
                  </Box>
                  <HStack spacing={2} ml={2}>
                    {taskCounts.undecidedTasks > 0 && (
                      <Box position="relative">
                        <IconButton
                          icon={<FaTasks color="gray" />}
                          aria-label="Undecided Tasks"
                          onClick={() => setExpandedTaskProjectId(expandedTaskProjectId === project.projectId ? null : project.projectId)}
                        />
                        <Badge position="absolute" top="-1" right="-1" colorScheme="gray">{taskCounts.undecidedTasks}</Badge>
                      </Box>
                    )}
                    {taskCounts.decidedTasks > 0 && (
                      <Box position="relative">
                        <IconButton
                          icon={<FaTasks color="green" />}
                          aria-label="Decided Tasks"
                          onClick={() => setExpandedTaskProjectId(expandedTaskProjectId === project.projectId ? null : project.projectId)}
                        />
                        <Badge position="absolute" top="-1" right="-1" colorScheme="green">{taskCounts.decidedTasks}</Badge>
                      </Box>
                    )}
                    <IconButton
                      isDisabled
                      icon={<ArrowForwardIcon />}
                      onClick={() => handleSendToDo(project.projectId)}
                      colorScheme="gray"
                      ml={1}
                    />
                  </HStack>
                </ListItem>
                <Collapse in={expandedProjectId === project.projectId} animateOpacity>
                  <Box mt={4} mb={4} p={4} rounded="md" borderWidth="1px" bg="gray.50" zIndex={1}>
                    <SimpleGrid columns={2} spacing={4}>
                      <Box>
                        <Text mb={2} borderBottom="1px" borderColor="gray.300">Set project context</Text>
                        <Wrap spacing={2} align="center">
                          {contexts.map((context) => (
                            <Button
                              key={context.contextId}
                              onClick={async () => {
                                const success = await assignContextToProject(context.contextId, project.projectId);
                              }}
                            >
                              @{context.contextName}
                            </Button>
                          ))}
                        </Wrap>
                      </Box>
                      <Box>
                        <Text mb={2} borderBottom="1px" borderColor="gray.300">Set project due date</Text>
                        <Calendar
                          onChange={(date) => {
                            setSelectedDate(date);
                            assignDueDateToProject(project.projectId, date);
                          }}
                          value={project.projectDue ? new Date(project.projectDue) : selectedDate}
                          tileClassName={({ date, view }) => {
                            if (project.projectDue && new Date(project.projectDue).toDateString() === date.toDateString()) {
                              return 'highlight-date';
                            }
                            return null;
                          }}
                        />
                      </Box>
                    </SimpleGrid>
                  </Box>
                </Collapse>
                <Collapse in={expandedTaskProjectId === project.projectId} animateOpacity>
                  <Box mt={4} mb={4} p={4} rounded="md" borderWidth="1px" borderColor="gray.300" bg="gray.50">
                    <List spacing={3}>
                      {project.projectTasks.map((task) => (
                        <Box key={task.taskId}>
                          <ListItem display="flex" alignItems="center" _hover={{ backgroundColor: "gray.100" }} cursor="pointer" onClick={() => setExpandedTaskId(expandedTaskId === task.taskId ? null : task.taskId)}>
                            <Box flex="1" display="flex" alignItems="center">
                              <Box as="span" mr={2}>&#8226;</Box>
                              <Text>{task.taskBody}</Text>
                            </Box>
                            <HStack spacing={2} justify="flex-end">
                              <Box
                                bg={task.taskContextId ? "green.200" : "gray.200"}
                                borderRadius="md"
                                p={1}
                              >
                              {loadingContextProjectTaskId === task.taskId ? (
                                <Spinner size="sm" />
                              ) : (  
                                <Text fontSize="sm" color="gray.700">
                                  @{task.taskContextId ? contexts.find(context => context.contextId === task.taskContextId)?.contextName : 'no context'}
                                </Text>
                              )}
                              </Box>
                              <Box
                                bg={task.taskDue ? "green.200" : "gray.200"}
                                borderRadius="md"
                                p={1}
                              >
                              {loadingDueDateProjectTaskId === task.taskId ? (
                                <Spinner size="sm" />
                              ) : (
                                <Text fontSize="sm" color="gray.700">
                                  {task.taskDue ? task.taskDue : 'no due date'}
                                </Text>
                              )}
                              </Box>
                            </HStack>
                          </ListItem>
                          <Collapse in={expandedTaskId === task.taskId} animateOpacity>
                            <Box mt={4} mb={4} p={4} rounded="md" borderWidth="1px" bg="gray.50" zIndex={1}>
                              <SimpleGrid columns={2} spacing={4}>
                                <Box>
                                  <Text mb={2} borderBottom="1px" borderColor="gray.300">Set context</Text>
                                  <Wrap spacing={2} align="center">
                                    {contexts.map((context) => (
                                      <Button
                                        key={context.contextId}
                                        onClick={async () => {
                                          await assignContextToProjectTask(context.contextId, project.projectId, task.taskId);
                                        }}
                                      >
                                        @{context.contextName}
                                      </Button>
                                    ))}
                                  </Wrap>
                                </Box>
                                <Box>
                                  <Text mb={2} borderBottom="1px" borderColor="gray.300">Set due date</Text>
                                  <Calendar
                                    onChange={(date) => {
                                      setSelectedDate(date);
                                      assignDueDateToProjectTask(project.projectId, task.taskId, date);
                                    }}
                                    value={task.taskDue ? new Date(task.taskDue) : selectedDate}
                                    tileClassName={({ date, view }) => {
                                      if (task.taskDue && new Date(task.taskDue).toDateString() === date.toDateString()) {
                                        return 'highlight-date';
                                      }
                                      return null;
                                    }}
                                  />
                                </Box>
                              </SimpleGrid>
                            </Box>
                          </Collapse>
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

export default DecideReadyToDoProjects;
