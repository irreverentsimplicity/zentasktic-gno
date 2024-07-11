import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Actions from '../util/actions';
import Config from '../util/config';
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
} from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { fetchAllTasksByRealm } from '../util/fetchers';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { formatDate, isDateInPast } from '../util/dates';

const DecideTasksByContext = () => {
  const decideTasks = useSelector((state) => state.core.coreDecideTasks);
  const contexts = useSelector((state) => state.core.coreContexts);
  const dispatch = useDispatch();
  const [expandedContextId, setExpandedContextId] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loadingContextTaskId, setLoadingContextTaskId] = useState(null);
  const [loadingDueDateTaskId, setLoadingDueDateTaskId] = useState(null);
  const [sendingToAssessTaskId, setSendingToAssessTaskId] = useState(null);
  const [sendingToDoTaskId, setSendingToDoTaskId] = useState(null);

  useEffect(() => {
    fetchAllTasksByRealm(dispatch, "2");
  }, [dispatch]);

  const groupTasksByContext = (decideTasks) => {
    return decideTasks.reduce((acc, task) => {
      const contextId = task.taskContextId || 'noContext';
      if (!acc[contextId]) {
        acc[contextId] = [];
      }
      acc[contextId].push(task);
      return acc;
    }, {});
  };

  const groupedTasks = groupTasksByContext(decideTasks);

  const handleSendToAssess = async (taskId) => {
    setSendingToAssessTaskId(taskId);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM)
    try {
      await actions.MoveTaskToRealm(taskId, "1");
      fetchAllTasksByRealm(dispatch, "2");
      fetchAllTasksByRealm(dispatch, "1");
    } catch (err) {
      console.log("error in calling handleSendToAssess", err);
    }
    setSendingToAssessTaskId(null);
  };

  const handleSendToDo = async (taskId) => {
    setSendingToDoTaskId(taskId);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM)
    try {
      await actions.MoveTaskToRealm(taskId, "3");
      fetchAllTasksByRealm(dispatch, "2");
      fetchAllTasksByRealm(dispatch, "3");
    } catch (err) {
      console.log("error in calling handleSendToDo", err);
    }
    setSendingToDoTaskId(null);
  };

  const assignContextToTask = async (contextId, taskId) => {
    setLoadingContextTaskId(taskId);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
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

  return (
    <Box>
      <Wrap spacing={4}>
        {Object.keys(groupedTasks).map((contextId) => {
          const context = contexts.find(ctx => ctx.contextId === contextId);
          const contextName = context ? '@' + context.contextName : 'No Context';
          const tasks = groupedTasks[contextId];

          return (
            <Box key={contextId} borderWidth="1px" borderRadius="lg" p={4} style={{width: "100%"}}>
              <Button onClick={() => setExpandedContextId(expandedContextId === contextId ? null : contextId)} colorScheme="orange">
                {contextName} <Badge ml="2" colorScheme="gray">{tasks.length}</Badge>
              </Button>
              <Collapse in={expandedContextId === contextId} animateOpacity style={{width: "100%"}}>
                <Box mt={4}>
                  <List spacing={3}>
                    {tasks.map((task) => (
                      <Box key={task.taskId}>
                        <ListItem display="flex" alignItems="center">
                          <IconButton
                            icon={sendingToAssessTaskId === task.taskId ? <Spinner size="sm" /> : <ArrowBackIcon />}
                            onClick={() => handleSendToAssess(task.taskId)}
                            colorScheme="red"
                            mr={2}
                            isLoading={sendingToAssessTaskId === task.taskId}
                          />
                          <Box
                            flex="1"
                            cursor="pointer"
                            onClick={() => setExpandedTaskId(expandedTaskId === task.taskId ? null : task.taskId)}
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
                                bg={task.taskDue ? (isDateInPast(task.taskDue) ? "red.100" : "green.200") : "gray.200"}
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
                            </HStack>
                          </Box>
                          <IconButton
                            isLoading={sendingToDoTaskId === task.taskId}
                            icon={sendingToDoTaskId === task.taskId ? <Spinner size="sm" /> : <ArrowForwardIcon />}
                            onClick={() => handleSendToDo(task.taskId)}
                            colorScheme="green"
                            ml={2}
                          />
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
                                        const success = await assignContextToTask(context.contextId, task.taskId);
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
        })}
      </Wrap>
    </Box>
  );
};

export default DecideTasksByContext;