import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Actions from '../util/actions';
import Config from '../util/config';
import { Box, IconButton, Textarea, Button, List, ListItem, Flex, Spinner } from '@chakra-ui/react';
import { DeleteIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { fetchAllTasksByRealm } from '../util/fetchers';

const CoreTasks = () => {
  const coreTasks = useSelector(state => state.core.coreAssessTasks);
  const dispatch = useDispatch();
  const [newTask, setNewTask] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskBody, setEditTaskBody] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [sendingTaskId, setSendingTaskId] = useState(null);

  useEffect(() => {
    fetchAllTasksByRealm(dispatch, "1");
  }, []);

  const handleAddTask = async () => {
    if (newTask.length >= 3 && newTask.length <= 1000) {
      setIsAdding(true);
      const actions = await Actions.getInstance();
      //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
      try {
          await actions.AddTask(newTask);
          fetchAllTasksByRealm(dispatch, "1");
        } catch (err) {
          console.log("error in calling AddTask", err);
        }
      setIsAdding(false);
      setNewTask('');
    }
  };

  const handleDeleteTask = async (taskId) => {
    setDeletingTaskId(taskId);
    const actions = await Actions.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
        await actions.RemoveTask(taskId);
        fetchAllTasksByRealm(dispatch, "1");
      } catch (err) {
        console.log("error in calling RemoveTask", err);
      }
    setDeletingTaskId(null);
  };

  const handleSendTaskToDecide = async (taskId) => {
    setSendingTaskId(taskId)
    const actions = await Actions.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
        await actions.MoveTaskToRealm(taskId, "2");
        fetchAllTasksByRealm(dispatch, "1");
      } catch (err) {
        console.log("error in calling handleSendTaskToDecide", err);
      }
     setSendingTaskId(null)
  };

  const handleEditTask = (task) => {
    setEditTaskId(task.taskId);
    setEditTaskBody(task.taskBody);
  };

  const handleUpdateTask = async () => {
    if (editTaskBody.length >= 3 && editTaskBody.length <= 1000) {
      setIsUpdating(true);
      const actions = await Actions.getInstance();
      //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
      try {
          await actions.UpdateTask(editTaskId, editTaskBody);
          fetchAllTasksByRealm(dispatch, "1");
        } catch (err) {
          console.log("error in calling UpdateTask", err);
        }
      setIsUpdating(false);
      setEditTaskId(null);
      setEditTaskBody('');
    }
  };

  return (
    <Box>
      <Flex mb={4}>
        <Textarea
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          mr={2}
        />
        <Button onClick={handleAddTask} colorScheme="blue" isLoading={isAdding}>
          {isAdding ? <Spinner size="sm" /> : 'Add Task'}
        </Button>
      </Flex>
      <List spacing={3}>
        {coreTasks.length === 0 ? (
          <ListItem>No tasks available</ListItem>
        ) : (
          coreTasks.map((task) => (
            <ListItem key={task.taskId} display="flex" alignItems="center">
              <IconButton
                      icon={deletingTaskId === task.taskId ? <Spinner size="sm" /> : <DeleteIcon size="sm" />}
                      onClick={() => handleDeleteTask(task.taskId)}
                      colorScheme="red"
                      mr={2}
                      isLoading={deletingTaskId === task.taskId}
                    />
              {editTaskId === task.taskId ? (
                <Flex flex="1" alignItems="center">
                  <Textarea
                    value={editTaskBody}
                    onChange={(e) => setEditTaskBody(e.target.value)}
                    mr={2}
                  />
                  <Button onClick={() => handleUpdateTask(task)} colorScheme="blue" isLoading={isUpdating}>
                    {isUpdating ? <Spinner size="sm" /> : 'Update'}
                  </Button>
                </Flex>
              ) : (
                <Flex flex="1" alignItems="center" >
                  <Box
                    flex="1"
                    cursor="pointer"
                    onClick={() => handleEditTask(task)}
                    _hover={{ backgroundColor: "gray.100" }} borderWidth="1px" rounded="md" p="2"
                    >
                      
                    {task.taskBody}
                  </Box>
                  <IconButton
                    isLoading={sendingTaskId === task.taskId}
                    icon={sendingTaskId === task.taskId ?  <Spinner size="sm" /> : <ArrowForwardIcon />}
                    onClick={() => handleSendTaskToDecide(task.taskId)}
                    colorScheme="orange"
                    ml={2}
                  />
                </Flex>
              )}
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
};

export default CoreTasks;
