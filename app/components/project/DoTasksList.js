import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  IconButton,
  List,
  ListItem,
  Spinner,
  Text,
  HStack,
} from '@chakra-ui/react';
import { ArrowBackIcon, CheckIcon } from '@chakra-ui/icons';
import { isDateInPast } from '../../util/dates';
import { isRewarded, taskAssignedTo} from '../../util/metadataChecks';

const TaskList = ({ tasks, handleSendToDecide, handleMarkAsDone, sendingTaskId, markAsDoneTaskId }) => {

  const contexts = useSelector(state => state.project.projectContexts)
  const teams = useSelector((state) => state.project.projectTeams);
  const teamsWithAssignedTasks = useSelector((state) => state.project.projectTeamsWithAssignedTasks);  
  const rewards = useSelector( (state) => state.project.projectRewards);
  const [rewardsByTaskId, setRewardsByTaskId] = useState(null);

  useEffect( () => {
    filterRewards(rewards);
  }, [rewards])

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
  
  return (
  <Box>
    <List spacing={3}>
      {tasks.length === 0 ? (
        <ListItem>No tasks available</ListItem>
      ) : (
        tasks.map((task) => (
          <Box key={task.taskId}>
            <ListItem display="flex" alignItems="center">
              <IconButton
                icon={sendingTaskId === task.taskId ? <Spinner size="sm" /> : <ArrowBackIcon />}
                onClick={() => handleSendToDecide(task.taskId)}
                colorScheme="orange"
                mr={2}
                isLoading={sendingTaskId === task.taskId}
              />
              <Box
                flex="1"
                cursor="pointer"
                _hover={{ backgroundColor: "gray.100" }} borderWidth="1px" rounded="md" p="2"
                >
                <Text>{task.taskBody}</Text>
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
                    bg={isDateInPast(task.taskDue) ? "red.200" : "green.200"}
                    borderRadius="md"
                    p={1}
                  >
                    <Text fontSize="sm" color="gray.700">
                      {task.taskDue ? task.taskDue : 'no due date'}
                    </Text>
                  </Box>
                  <Box
                      bg={"green.200"}
                      borderRadius="md"
                      p={1}
                      >
                      <Text fontSize="sm" color="gray.700">
                        {taskAssignedTo(task.taskId, teams, teamsWithAssignedTasks)}
                      </Text>
                    
                    </Box>
                    <Box
                    bg={"green.200"}
                    borderRadius="md"
                    p={1}
                    >
                    <Text fontSize="sm" color="gray.700">
                      {isRewarded(task, rewardsByTaskId)}
                    </Text>                    
                    </Box>
                </HStack>
              </Box>
              <IconButton
                icon={markAsDoneTaskId === task.taskId ? <Spinner size="sm" /> : <CheckIcon />}
                onClick={() => handleMarkAsDone(task.taskId)}
                colorScheme="green"
                ml={2}
                isLoading={markAsDoneTaskId === task.taskId}
              />
            </ListItem>
          </Box>
        ))
      )}
    </List>
  </Box>)
};

export default TaskList;