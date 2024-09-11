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
  VStack,
  Input
} from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon, ArrowUpIcon } from '@chakra-ui/icons';
import { fetchAllContexts, fetchAllRewards, fetchAllTasksByRealm, fetchAllTeamsTasks } from '../../util/fetchersProject';
import { formatDate } from '../../util/dates';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../styles/Home.module.css'; // Import custom CSS for calendar

const DecideUndecidedTasks = () => {
  const tasks = useSelector((state) => state.project.projectDecideTasks);
  const teams = useSelector((state) => state.project.projectTeams);
  const teamsWithAssignedTasks = useSelector((state) => state.project.projectTeamsWithAssignedTasks);
  const contexts = useSelector((state) => state.project.projectContexts);
  const rewards = useSelector( (state) => state.project.projectRewards);
  const [amounts, setAmounts] = useState({});
  const dispatch = useDispatch();
  const [rewardsByTaskId, setRewardsByTaskId] = useState(null);
  const [sendingTaskId, setSendingTaskId] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const denominations = ['GNOT', 'FLIP', 'ZEN'];
  const [loadingContextTaskId, setLoadingContextTaskId] = useState(null);
  const [loadingDueDateTaskId, setLoadingDueDateTaskId] = useState(null);
  const [assignedTaskId, setAssignedTaskId] = useState(null);
  const [rewardedTaskId, setRewardedTaskId] = useState(null);
  const [loadingAssignTaskId, setLoadingAssignTaskId] = useState(null)
  const [loadingRewardTaskId, setLoadingRewardTaskId] = useState(null)
  const [assigningTeamId, setAssigningTeamId] = useState(null)

  useEffect(() => {
    fetchAllTasksByRealm(dispatch, '2');
    fetchAllContexts(dispatch);
    fetchAllRewards(dispatch);
  }, [dispatch]);

  useEffect(() => {
    fetchAllTeamsTasks(dispatch);
  },[dispatch]);

  useEffect( () => {
      filterRewards(rewards);
  }, [rewards])

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
    setAssigningTeamId(teamId);
    const actions = await ActionsProject.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      await actions.AssignTeamToTask(teamId, taskId);
      fetchAllTasksByRealm(dispatch, '2');
      fetchAllTeamsTasks(dispatch);
    } catch (err) {
      console.log('error in calling assignTeamToTasl', err);
    }
    setAssigningTeamId(null);
  };

  const unassignTeamFromTask = async (teamId, taskId) => {
    setAssigningTeamId(teamId);
    const actions = await ActionsProject.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      await actions.UnassignTeamFromTask(teamId, taskId);
      fetchAllTasksByRealm(dispatch, '2');
      fetchAllTeamsTasks(dispatch);
    } catch (err) {
      console.log('error in calling assignTeamToTasl', err);
    }
    setAssigningTeamId(null);
  };

  
  const handleAssignReward = async (taskId, denom, amount) => {
    // reward is an object: denom : amount, mimicking stdCoins
    console.log("rewards ", JSON.stringify(rewards))
    setLoadingRewardTaskId(taskId);
    const actions = await ActionsProject.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      await actions.AssignRewardToObject(taskId, "task", denom, amount);
      fetchAllRewards(dispatch);
    } catch (err) {
      console.log('error in calling AssignRewardToTask', err);
    }
    setLoadingRewardTaskId(null);
  };

  const handleUpdateReward = async (paymentId, taskId, denom, amount) => {
    setLoadingRewardTaskId(taskId);
    const actions = await ActionsProject.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      await actions.UpdateRewardForObject(paymentId, taskId, "task", denom, amount);
      fetchAllRewards(dispatch);
    } catch (err) {
      console.log('error in calling UpdateRewardForObject', err);
    }
    setLoadingRewardTaskId(null);
  };

  const taskAssignedTo = (taskId) => {
    // Initialize an empty array to store the team names or IDs
    const assignedTeams = [];

    console.log("teamsWithAssignedTasks in taskAssignedTo ", JSON.stringify(teamsWithAssignedTasks));

    // Iterate over each team's tasks
    teamsWithAssignedTasks.forEach(teamTaskObject => {
        console.log("teamTaskObject ", JSON.stringify(teamTaskObject));

        // Check if the task is assigned to the current team
        const isTaskAssigned = teamTaskObject.tasks.some(task => task.taskId === taskId);

        if (isTaskAssigned) {
          const teamId = teamTaskObject.teamId
          const teamName = (teams, teamId) => teams.find(team => team.teamId === teamId)?.teamName || '';
          assignedTeams.push(teamName(teams, teamTaskObject.teamId)); 
        }
    });

    console.log("assignedTeams in taskAssignedTo ", assignedTeams);

    // Return the joined team names or IDs as a string, or an empty string if none are found
    return assignedTeams.length > 0 ? assignedTeams.join(', ') : '';
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

  const handleAmountChange = (task, denom, value) => {
    setAmounts((prevAmounts) => ({
      ...prevAmounts,
      [`${task.taskId}-${denom}`]: value, // Using taskId and denom as a unique key
    }));
  };

  const getCurrentAmount = (task, denom) => {
    // Retrieve the current amount from the amounts object using the taskId and denom
    const currentAmount = amounts[`${task.taskId}-${denom}`];
    
    // Destructure the tuple returned by getExistingRewardAmount to get existingAmount and rewardPointId
    const [existingAmount] = getExistingRewardAmount(task.taskId, denom);

    // Return the current amount if it exists, otherwise return the existing amount or an empty string
    return currentAmount !== undefined ? currentAmount : (existingAmount || '');
};

const isRewarded = (task) => {
  // Find the rewards associated with the given task
  if(rewardsByTaskId !== null){
  const taskRewards = rewardsByTaskId.find(reward => reward.taskId === task.taskId);

  // If no rewards are found, return an empty string
  if (!taskRewards || !taskRewards.rewards || Object.keys(taskRewards.rewards).length === 0) {
      return '';
  }

  // Construct a string that summarizes the rewards
  const rewardSummary = Object.keys(taskRewards.rewards)
      .map(denom => {
          const { amount } = taskRewards.rewards[denom];
          return `${amount} ${denom}`;
      })
      .join(', ');

  return rewardSummary;
  }
};



  const filterRewards = (rewards) => {
    // Initialize an empty object to store rewards by taskId
    const rewardsByTask = {};

    // Iterate over the rewards points array
    rewards.forEach(reward => {
        const taskId = reward.objectId;
        const amountStr = reward.rewardsPointsAmount;
        const rewardPointId = reward.rewardsPointId;

        // Extract the denomination and amount
        const amount = parseInt(amountStr.match(/\d+/)[0], 10);
        const denom = amountStr.match(/[A-Z]+/i)[0];

        // Initialize the task rewards if it doesn't exist
        if (!rewardsByTask[taskId]) {
            rewardsByTask[taskId] = {
                taskId: taskId,
                rewards: {}
            };
        }

        // Add the reward with amount and rewardPointId for the given denomination
        rewardsByTask[taskId].rewards[denom] = {
            amount: amount,
            rewardPointId: rewardPointId
        };
    });
    setRewardsByTaskId(Object.values(rewardsByTask))
  }

  const getExistingRewardAmount = (taskId, denom) => {
    if (rewardsByTaskId !== null) {
        const taskRewards = rewardsByTaskId.find(task => task.taskId === taskId);
        if (taskRewards && taskRewards.rewards[denom]) {
            return [taskRewards.rewards[denom].amount, taskRewards.rewards[denom].rewardPointId];
        }
    }
    return [0, null]; // Return 0 for amount and null for rewardPointId if not found
};

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
                    bg={taskAssignedTo(task.taskId) !== '' ? "orange.200" : "gray.200"}
                    borderRadius="md"
                    p={1}
                    >
                     {loadingDueDateTaskId === task.taskId ? (
                      <Spinner size="sm" />
                    ) : (
                      <Text fontSize="sm" color="gray.700">
                        {taskAssignedTo(task.taskId) !== '' ? taskAssignedTo(task.taskId) : 'unassigned'}
                      </Text>
                    )}
                    </Box>
                    <Box
                    bg={isRewarded(task) !== '' ? "orange.200" : "gray.200"}
                    borderRadius="md"
                    p={1}
                    >
                     {loadingDueDateTaskId === task.taskId ? (
                      <Spinner size="sm" />
                    ) : (
                      <Text fontSize="sm" color="gray.700">
                        {isRewarded(task) !== '' ? isRewarded(task) : 'not rewarded'}
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
                      <Text mb={2} borderBottom="1px" borderColor="gray.300" fontWeight={"bold"}>Set context</Text>
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
                      <Text mb={2} borderBottom="1px" borderColor="gray.300" fontWeight={"bold"}>Set due date</Text>
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
                    <Text mb={2} borderBottom="1px" borderColor="gray.300" fontWeight={"bold"}>Assign to</Text>
                    <VStack spacing={2} align="left" mb={4}>
                      {teams.map((team) => {
                        const isTaskAssigned = isTaskAssignedToTeam(team.teamId, task.taskId);
                        console.log("isTaskAssigned ", isTaskAssigned)
                        return (
                          <HStack key={team.teamId} justify="space-between" width="100%">
                            <Text>{team.teamName}</Text>
                            <IconButton
                              icon={assigningTeamId === team.teamId ? <Spinner size="sm"/> : isTaskAssigned ? <FaFileCircleMinus size={24} /> : <FaFileCirclePlus size={24} />}
                              color={isTaskAssigned?  "#FF0000" : "#008000"}
                              aria-label={isTaskAssigned ? "Unassign Task" : "Assign Task"}
                              onClick={async () => {
                                if (isTaskAssigned) {
                                  await unassignTeamFromTask(team.teamId, task.taskId);
                                } else {
                                  await assignTeamToTask(team.teamId, task.taskId);
                                }
                              }}
                              isLoading={assigningTeamId === team.teamId}
                            />
                          </HStack>
                        );
                      })}
                    </VStack>
                    <Text mb={2} borderBottom="1px" borderColor="gray.300" fontWeight={"bold"}>Reward with</Text>
                    <VStack spacing={2} align="left" mb={4}>
                        {denominations.map((denom) => {
                          const [existingAmount, rewardPointId] = getExistingRewardAmount(task.taskId, denom);
                          const currentAmount = getCurrentAmount(task, denom);
                          console.log("existingAmount, " + existingAmount + ", currentAmount, " + currentAmount + ", rewardPointId, " + rewardPointId)
                          return (
                            <HStack key={`${task.taskId}-${denom}`} justify="space-between" width="100%">
                              <Text>{denom}</Text>
                              <Input
                                placeholder="Enter amount"
                                size="sm"
                                type="number"
                                min="0"
                                value={currentAmount}
                                onChange={(e) => handleAmountChange(task, denom, e.target.value)}
                              />
                              <Button
                                onClick={async () => {
                                  if (existingAmount > 0) {
                                    await handleUpdateReward(rewardPointId, task.taskId, denom, currentAmount);
                                  } else {
                                    await handleAssignReward(task.taskId, denom, currentAmount);
                                  }
                                }}
                              >
                                {existingAmount > 0 ? 'Update' : 'Assign'}
                              </Button>
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
