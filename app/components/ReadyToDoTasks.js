import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Actions from '../util/actions';
import Config from '../util/config';
import { Box, IconButton, List, ListItem, Spinner } from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { fetchAllTasksByRealm } from '../util/fetchers';

const ReadyToDoTasks = () => {
  const coreTasks = useSelector(state => state.core.coreDecideTasks);
  const dispatch = useDispatch();
  const [sendingTaskId, setSendingTaskId] = React.useState(null);

  useEffect(() => {
    fetchAllTasksByRealm(dispatch, "2");
  }, []);


  const handleSendToAssess = async (taskId) => {
    setSendingTaskId(taskId);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM)
    try {
      await actions.MoveTaskToRealm(taskId, "1");
      fetchAllTasksByRealm(dispatch, "2");
      fetchAllTasksByRealm(dispatch, "1");
    } catch (err) {
      console.log("error in calling handleSendToAssess", err);
    }
    setSendingTaskId(null);
  };

  const handleSendToDo = async (taskId) => {
    setSendingTaskId(taskId);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM)
    try {
      await actions.MoveTaskToRealm(taskId, "3");
      fetchAllTasksByRealm(dispatch, "2");
      fetchAllTasksByRealm(dispatch, "3");
    } catch (err) {
      console.log("error in calling handleSendToDo", err);
    }
    setSendingTaskId(null);
  };

  const isDateInFuture = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    return date > now;
  };

  const getReadyToDoTasks = (tasks) => {
    return tasks.filter(task => task.taskContextId && task.taskDue && isDateInFuture(task.taskDue));
  };

  return (
    <Box>
      <List spacing={3}>
        {getReadyToDoTasks(coreTasks).length === 0 ? (
          <ListItem>No ready to do tasks available</ListItem>
        ) : (
          getReadyToDoTasks(coreTasks).map((task) => (
            <ListItem key={task.taskId} display="flex" alignItems="center">
              <IconButton
                icon={sendingTaskId === task.taskId ? <Spinner size="sm" /> : <ArrowBackIcon />}
                onClick={() => handleSendToAssess(task.taskId)}
                colorScheme="red"
                mr={2}
                isLoading={sendingTaskId === task.taskId}
              />
              <Box flex="1">{task.taskBody}</Box>
              <IconButton
                isLoading={sendingTaskId === task.taskId}
                icon={sendingTaskId === task.taskId ? <Spinner size="sm" /> : <ArrowForwardIcon />}
                onClick={() => handleSendToDo(task.taskId)}
                colorScheme="green"
                ml={2}
              />
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
};

export default ReadyToDoTasks;
