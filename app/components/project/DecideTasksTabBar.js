import React, {useState, useEffect} from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, HStack, Badge } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import DecideUndecidedTasks from './DecideUndecidedTasks';
import DecideStalledTasks from './DecideStalledTasks';
import DecideReadyToDoTasks from './DecideReadyToDoTasks';
import DecideTasksByContext from './DecideTasksByContext';
import { isDateInFuture, isDateInPast } from '../../util/dates';
import { isRewarded, taskAssignedTo, isTaskAssignedToTeam} from '../../util/metadataChecks';

const DecideTasksTabBar = () => {
  const decideTasks = useSelector((state) => state.project.projectDecideTasks) || [];
  const teams = useSelector((state) => state.project.projectTeams);
  const teamsWithAssignedTasks = useSelector((state) => state.project.projectTeamsWithAssignedTasks);
  const rewards = useSelector( (state) => state.project.projectRewards);

  const [rewardsByTaskId, setRewardsByTaskId] = useState(null);

  useEffect( () => {
      filterRewards(rewards);
  }, [rewards])

  const stalledTasks = decideTasks.filter(task => task.taskContextId && 
      task.taskDue && isDateInPast(task.taskDue) &&
        (taskAssignedTo(task.taskId, teams, teamsWithAssignedTasks) !== '' &&
        isRewarded(task, rewardsByTaskId) !== '')
      );
  const undecidedTasks = decideTasks.filter((task) => !task.taskContextId || 
      !task.taskDue || 
      isRewarded(task, rewardsByTaskId) === '' || 
      taskAssignedTo(task.taskId, teams, teamsWithAssignedTasks) === ''
    );
  const readyToDoTasks = decideTasks.filter(task => task.taskContextId && 
      task.taskDue && isDateInFuture(task.taskDue) &&
        (taskAssignedTo(task.taskId, teams, teamsWithAssignedTasks) !== '' &&
        isRewarded(task, rewardsByTaskId) !== '')
    );
  
  // TO DO try to avoid duplicate code between this and the panels
  // maybe do this earlier, when setting up the redux data
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
    <Tabs variant="enclosed-colored">
      <TabList justifyContent={"flex-start"}>
        <Tab
          _selected={{ bg: "#FFA500", color: "white" }}
          _hover={{ bg: "#FFA500", color: "white" }}
          _active={{ color: "#FFA500" }}
          color="#FFA500"
          fontWeight="bold"
        >
          <HStack spacing={4}>
            <span>Undecided</span>
            <Badge colorScheme="orange">{undecidedTasks.length}</Badge>
          </HStack>
        </Tab>
        <Tab
          _selected={{ bg: "#FF0000", color: "white" }}
          _hover={{ bg: "#FF0000", color: "white" }}
          _active={{ color: "#FF0000" }}
          color="#FF0000"
          fontWeight="bold"
        >
          <HStack spacing={4}>
            <span>Stalled</span>
            <Badge colorScheme="red">{stalledTasks.length}</Badge>
          </HStack>
        </Tab>
        <Tab
          _selected={{ bg: "green.400", color: "white" }}
          _hover={{ bg: "green.400", color: "white" }}
          _active={{ color: "green.400" }}
          color="green.400"
          fontWeight="bold"
        >
          <HStack spacing={4}>
            <span>Ready To Do</span>
            <Badge colorScheme="green">{readyToDoTasks.length}</Badge>
          </HStack>
        </Tab>
        <Tab
          _selected={{ bg: "#FFA500", color: "white" }}
          _hover={{ bg: "#FFA500", color: "white" }}
          _active={{ color: "#FFA500" }}
          color="#FFA500"
          fontWeight="bold"
        >
          @ By Context
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <DecideUndecidedTasks/>
        </TabPanel>
        <TabPanel>
          <DecideStalledTasks/>
        </TabPanel>
        <TabPanel>
          <DecideReadyToDoTasks/>
        </TabPanel>
        <TabPanel>
          <DecideTasksByContext/>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default DecideTasksTabBar;
