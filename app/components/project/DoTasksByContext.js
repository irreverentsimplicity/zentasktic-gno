import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Actions from '../../util/actionsProject';
import Config from '../../util/config';
import {
  Box,
  Button,
  Badge,
  Collapse,
  List,
  ListItem,
  Spinner,
  Text,
  Wrap,
  HStack,
  IconButton,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon, ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { fetchAllTasksByRealm } from '../../util/fetchers';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { formatDate, isDateInPast } from '../../util/dates';
import TaskList from './DoTasksList';

const DoTasksByContext = () => {
  const doTasks = useSelector((state) => state.core.coreDoTasks);
  const contexts = useSelector((state) => state.core.coreContexts);
  const dispatch = useDispatch();
  const [expandedContextId, setExpandedContextId] = useState(null);
  const [sendingToDecideTaskId, setSendingToDecideTaskId] = useState(null);
  const [markAsDoneTaskId, setMarkAsDoneTaskId] = useState(null);

  useEffect(() => {
    fetchAllTasksByRealm(dispatch, "3");
  }, [dispatch]);

  const groupTasksByContext = (doTasks) => {
    return doTasks.reduce((acc, task) => {
      const contextId = task.taskContextId || 'noContext';
      if (!acc[contextId]) {
        acc[contextId] = [];
      }
      acc[contextId].push(task);
      return acc;
    }, {});
  };

  const groupedTasks = groupTasksByContext(doTasks);

  const handleSendToDecide = async (taskId) => {
    setSendingToDecideTaskId(taskId);
    const actions = await Actions.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      await actions.MoveTaskToRealm(taskId, "2");
      fetchAllTasksByRealm(dispatch, "3");
    } catch (err) {
      console.log("error in calling handleSendToDecide", err);
    }
    setSendingToDecideTaskId(null);
  };

  const handleMarkAsDone = async (taskId) => {
    setMarkAsDoneTaskId(taskId);
    const actions = await Actions.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      await actions.MoveTaskToRealm(taskId, "4");
      fetchAllTasksByRealm(dispatch, "3");
    } catch (err) {
      console.log("error in calling handleMarkAsDone", err);
    }
    setMarkAsDoneTaskId(null);
  };

  return (
    <Box>
      <Wrap spacing={4}>
        {Object.keys(groupedTasks).map((contextId) => {
          const context = contexts.find(ctx => ctx.contextId === contextId);
          const contextName = context ? '@' + context.contextName : 'No Context';
          const tasks = groupedTasks[contextId];

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
                <Button variant="ghost" flex="1" width={100} colorScheme="green">
                  {contextName} <Badge ml="2" colorScheme="gray">{tasks.length}</Badge>
                </Button>
              </Flex>
              <Collapse in={expandedContextId === contextId} animateOpacity>
                <Box p={4} borderTopWidth="1px">
                  <TaskList 
                    tasks={tasks} 
                    handleSendToDecide={handleSendToDecide} 
                    handleMarkAsDone={handleMarkAsDone} 
                    sendingTaskId={sendingToDecideTaskId}
                    markAsDoneTaskId={markAsDoneTaskId}
                    />
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </Wrap>
    </Box>
  );
};

export default DoTasksByContext;
