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
  Divider
} from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { fetchAllContexts, fetchAllTasksByRealm } from '../util/fetchers';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const UndecidedTasks = () => {
  const coreTasks = useSelector((state) => state.core.coreDecideTasks);
  const contexts = useSelector((state) => state.core.coreContexts);
  const dispatch = useDispatch();
  const [sendingTaskId, setSendingTaskId] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchAllTasksByRealm(dispatch, '2');
    fetchAllContexts(dispatch);
  }, [dispatch]);

  const handleSendToAssess = async (taskId) => {
    setSendingTaskId(taskId);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
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
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
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
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
    try {
      await actions.AddContextToTask(contextId, taskId);
      fetchAllTasksByRealm(dispatch, '2');
      return true;
    } catch (err) {
      console.log('error in calling assignContextToTask', err);
      return false;
    }
  };

  const assignDueDateToTask = async (taskId, date) => {
    const actions = await Actions.getInstance();
    console.log("date", date)
    //taskDate = formatDate(date)
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
    try {
      await actions.AssignDueDateToTask(taskId, formatDate(date));
      fetchAllTasksByRealm(dispatch, '2');
    } catch (err) {
      console.log('error in calling assignDueDateToTask', err);
    }
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

  const getUndecidedTasks = (tasks) => {
    return tasks.filter((task) => !task.taskContextId || !task.taskDue);
  };

  return (
    <Box>
      <List spacing={3}>
        {getUndecidedTasks(coreTasks).length === 0 ? (
          <ListItem>No undecided tasks available</ListItem>
        ) : (
          getUndecidedTasks(coreTasks).map((task) => (
            <Box key={task.taskId}>
              <ListItem display="flex" alignItems="center">
                <IconButton
                  icon={sendingTaskId === task.taskId ? <Spinner size="sm" /> : <ArrowBackIcon />}
                  onClick={() => handleSendToAssess(task.taskId)}
                  colorScheme="red"
                  mr={2}
                  isLoading={sendingTaskId === task.taskId}
                />
                <Box flex="1" cursor="pointer" onClick={() => setExpandedTaskId(expandedTaskId === task.taskId ? null : task.taskId)}>
                  <Text>{task.taskBody}</Text>
                  <HStack spacing={2} justify="flex-end">
                    <Text fontSize="sm" color="gray.500">
                        @{task.taskContextId ? contexts.find(context => context.contextId === task.taskContextId)?.contextName : 'no context'}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {task.taskDue ? task.taskDue : 'no due date'}
                    </Text>
                  </HStack>
                </Box>
                <IconButton
                  isLoading={sendingTaskId === task.taskId}
                  isDisabled = {true}
                  icon={sendingTaskId === task.taskId ? <Spinner size="sm" /> : <ArrowForwardIcon />}
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
                        value={selectedDate}
                      />
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

export default UndecidedTasks;
