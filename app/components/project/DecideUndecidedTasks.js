import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ActionsProject from '../../util/actionsProject';
import { FaFileCirclePlus, FaFileCircleMinus} from 'react-icons/fa6';
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
  VStack
} from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon, ArrowUpIcon } from '@chakra-ui/icons';
import { fetchAllContexts, fetchAllTasksByRealm, fetchAllTeamsTasks } from '../../util/fetchersProject';
import { formatDate } from '../../util/dates';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../styles/Home.module.css'; // Import custom CSS for calendar

const DecideUndecidedTasks = () => {
  const tasks = useSelector((state) => state.project.projectDecideTasks);
  const teams = useSelector((state) => state.project.projectTeams);
  const teamsWithAssignedTasks = useSelector((state) => state.project.projectTeamsWithAssignedTasks);
  const contexts = useSelector((state) => state.project.projectContexts);
  const dispatch = useDispatch();
  const [sendingTaskId, setSendingTaskId] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loadingContextTaskId, setLoadingContextTaskId] = useState(null);
  const [loadingDueDateTaskId, setLoadingDueDateTaskId] = useState(null);
  const [assignedTaskId, setAssignedTaskId] = useState(null);
  const [rewardedTaskId, setRewardedTaskId] = useState(null);
  const [loadingAssignTaskId, setLoadingAssignTaskId] = useState(null)
  const [loadingRewardTaskId, setLoadingRewardTaskId] = useState(null)

  useEffect(() => {
    fetchAllTasksByRealm(dispatch, '2');
    fetchAllContexts(dispatch);
  }, [dispatch]);

  useEffect(() => {
    fetchAllTeamsTasks(dispatch);
  },[dispatch]);

  const handleSendToAssess = async (taskId) => {
    setSendingTaskId(taskId);
    const actions = await ActionsProject.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      await actions.MoveTaskToRealm(taskId, '1');
      fetchAllTasksByRealm(dispatch, '2');
      fetchAllTasksByRealm(dispatch, '1');
    } catch (err) {
      console.log('error in calling handleSendToAssess', err);
    }
    setSendingTaskId(null);
  };

  const handleSendToDo = async (taskId) => {
    setSendingTaskId(taskId);
    const actions = await ActionsProject.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      await actions.MoveTaskToRealm(taskId, '3');
      fetchAllTasksByRealm(dispatch, '2');
      fetchAllTasksByRealm(dispatch, '3');
    } catch (err) {
      console.log('error in calling handleSendToDo', err);
    }
    setSendingTaskId(null);
  };

  const assignContextToTask = async (contextId, taskId) => {
    setLoadingContextTaskId(taskId);
    const actions = await ActionsProject.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      await actions.AddContextToTask(contextId, taskId);
      fetchAllTasksByRealm(dispatch, '2');
    } catch (err) {
      console.log('error in calling assignContextToTask', err);
    }
    setLoadingContextTaskId(null);
  };

  const assignDueDateToTask = async (taskId, date) => {
    setLoadingDueDateTaskId(taskId);
    const actions = await ActionsProject.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      await actions.AssignDueDateToTask(taskId, formatDate(date));
      fetchAllTasksByRealm(dispatch, '2');
    } catch (err) {
      console.log('error in calling assignDueDateToTask', err);
    }
    setLoadingDueDateTaskId(null);
  };

  const assignTeamToTask = async (teamId, taskId) => {
    setLoadingAssignTaskId(taskId);
    const actions = await ActionsProject.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      await actions.AssignTeamToTask(teamId, taskId);
      fetchAllTasksByRealm(dispatch, '2');
      fetchAllTeamsTasks(dispatch);
    } catch (err) {
      console.log('error in calling assignTeamToTasl', err);
    }
    setLoadingAssignTaskId(null);
  };

  const unassignTeamFromTask = async (teamId, taskId) => {
    setLoadingAssignTaskId(taskId);
    const actions = await ActionsProject.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      await actions.UnassignTeamFromTask(teamId, taskId);
      fetchAllTasksByRealm(dispatch, '2');
      fetchAllTeamsTasks(dispatch);
    } catch (err) {
      console.log('error in calling assignTeamToTasl', err);
    }
    setLoadingAssignTaskId(null);
  };

  const assignRewardToTask = async (reward, taskId) => {
    // reward is an object: denom : amount, mimicking stdCoins
    setLoadingRewardTaskId(taskId);
    const actions = await ActionsProject.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      await actions.AssignRewardToTask(reward, taskId);
      fetchAllTasksByRealm(dispatch, '2');
    } catch (err) {
      console.log('error in calling assignRewardToTasl', err);
    }
    setLoadingRewardTaskId(null);
  };

  const taskAssignedTo = (taskId) => {
    let count = 0;
    console.log("teamsWithAssignedTasks in taskAssignedTo ", JSON.stringify(teamsWithAssignedTasks))
    // Iterate over each team's tasks
    teamsWithAssignedTasks.forEach(teamTaskObject => {
      console.log("teamTaskObject ", JSON.stringify(teamTaskObject))
        const isTaskAssigned = teamTaskObject.tasks.some(task => task.taskId === taskId);
        if (isTaskAssigned) {
            count++;
        }
    });
    console.log("count in taskAssignedTo ", count)
    return count;
  }

  const isTaskAssignedToTeam = (teamId, taskId) => {
    // Find the team with the matching teamId
    const team = teamsWithAssignedTasks.find(team => team.teamId === teamId);
  
    if (team) {
      // Check if the task with the matching taskId exists in the team's tasks array
      return team.tasks.some(task => task.taskId === taskId);
    }
  
    // If the team is not found or the task is not found in the team's tasks, return false
    return false;
  }


  const getUndecidedTasks = (tasks) => {
    return tasks.filter((task) => !task.taskContextId || !task.taskDue);
  };

  return (
    <Box>
      <List spacing={3}>
        {getUndecidedTasks(tasks).length === 0 ? (
          <ListItem>No undecided tasks available</ListItem>
        ) : (
          getUndecidedTasks(tasks).map((task) => (
            <Box key={task.taskId}>
              <ListItem display="flex" alignItems="center">
                <IconButton
                  icon={sendingTaskId === task.taskId ? <Spinner size="sm" /> : <ArrowBackIcon />}
                  onClick={() => handleSendToAssess(task.taskId)}
                  colorScheme="red"
                  mr={2}
                  isLoading={sendingTaskId === task.taskId}
                />
                <Box
                flex="1"
                cursor="pointer"
                onClick={() => setExpandedTaskId(expandedTaskId === task.taskId ? null : task.taskId)}
                _hover={{ backgroundColor: "gray.100" }} borderWidth="1px" rounded="md" p="2"
                >
                <Text>{task.taskBody}</Text>
                <HStack spacing={2} justify="flex-end">
                    <Box
                    bg={task.taskContextId ? "orange.200" : "gray.200"}
                    borderRadius="md"
                    p={1}
                    >
                    {loadingContextTaskId === task.taskId ? (
                      <Spinner size="sm" />
                    ) : (
                      <Text fontSize="sm" color="gray.700">
                        @{task.taskContextId ? contexts.find(context => context.contextId === task.taskContextId)?.contextName : 'no context'}
                      </Text>
                    )}
                    </Box>
                    <Box
                    bg={task.taskDue ? "orange.200" : "gray.200"}
                    borderRadius="md"
                    p={1}
                    >
                    {loadingDueDateTaskId === task.taskId ? (
                      <Spinner size="sm" />
                    ) : (
                      <Text fontSize="sm" color="gray.700">
                        {task.taskDue ? task.taskDue : 'no due date'}
                      </Text>
                    )}
                    </Box>
                    <Box
                    bg={task.taskDue ? "red.200" : "gray.200"}
                    borderRadius="md"
                    p={1}
                    >
                     {loadingDueDateTaskId === task.taskId ? (
                      <Spinner size="sm" />
                    ) : (
                      <Text fontSize="sm" color="gray.700">
                        {taskAssignedTo(task.taskId) !== 0 ? 'assigned to ' + taskAssignedTo(task.taskId) + ' teams' : 'unassigned'}
                      </Text>
                    )}
                    </Box>
                    <Box
                    bg={task.taskDue ? "red.200" : "gray.200"}
                    borderRadius="md"
                    p={1}
                    >
                     {loadingDueDateTaskId === task.taskId ? (
                      <Spinner size="sm" />
                    ) : (
                      <Text fontSize="sm" color="gray.700">
                        {task.taskDue ? task.taskDue : 'not rewarded'}
                      </Text>
                    )}
                    </Box>
                </HStack>
                </Box>
                <IconButton
                  isDisabled
                  icon={<ArrowForwardIcon />}
                  onClick={() => handleSendToDo(task.taskId)}
                  colorScheme="gray"
                  ml={2}
                />
              </ListItem>
              <Collapse in={expandedTaskId === task.taskId} animateOpacity>
                <Box mt={4} mb={4} p={4} rounded="md" borderWidth="1px" bg="gray.50" zIndex={1}>
                  <SimpleGrid columns={2} spacing={4}>
                    <Box>
                      <Text mb={2} borderBottom="1px" borderColor="gray.300">Set context</Text>
                      <Wrap spacing={2} align="center" mb={4}>
                        {contexts.map((context) => (
                          <Button
                            key={context.contextId}
                            onClick={async () => {
                              const success = await assignContextToTask(context.contextId, task.taskId);
                            }}
                          >
                            @{context.contextName}
                          </Button>
                        ))}
                      </Wrap>
                      <Text mb={2} borderBottom="1px" borderColor="gray.300">Set due date</Text>
                      <Calendar
                        onChange={(date) => {
                          setSelectedDate(date);
                          assignDueDateToTask(task.taskId, date);
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
                    <Box>
                    <Text mb={2} borderBottom="1px" borderColor="gray.300">Assign to</Text>
                    <VStack spacing={2} align="left" mb={4}>
                      {teams.map((team) => {
                        const isTaskAssigned = isTaskAssignedToTeam(team.teamId, task.taskId);
                        console.log("isTaskAssigned ", isTaskAssigned)
                        return (
                          <HStack key={team.teamId} justify="space-between" width="100%">
                            <Text>{team.teamName}</Text>
                            <IconButton
                              icon={isTaskAssigned ? <FaFileCircleMinus /> : <FaFileCirclePlus />}
                              color={isTaskAssigned? "#FF0000" : "#008000"}
                              aria-label={isTaskAssigned ? "Unassign Task" : "Assign Task"}
                              onClick={async () => {
                                if (isTaskAssigned) {
                                  await unassignTeamFromTask(team.teamId, task.taskId);
                                } else {
                                  await assignTeamToTask(team.teamId, task.taskId);
                                }
                              }}
                            />
                          </HStack>
                        );
                      })}
                    </VStack>
                    </Box>
                  </SimpleGrid>
                </Box>
              </Collapse>
            </Box>
          ))
        )}
      </List>
    </Box>
  );
};

export default DecideUndecidedTasks;
