import React from 'react';
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
import 'react-calendar/dist/Calendar.css';
import '../styles/Home.module.css'; // Import custom CSS for calendar

const TaskList = ({ tasks, handleSendToDecide, handleMarkAsDone, sendingTaskId }) => {

  const contexts = useSelector(state => state.core.coreContexts)
  
  const isDateInPast = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    return date < now;
  };

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
              >
                <Text>{task.taskBody}</Text>
                <HStack spacing={2} justify="flex-end">
                  <Box
                    bg={task.taskContextId ? "orange.200" : "gray.200"}
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
                </HStack>
              </Box>
              <IconButton
                icon={sendingTaskId === task.taskId ? <Spinner size="sm" /> : <CheckIcon />}
                onClick={() => handleMarkAsDone(task.taskId)}
                colorScheme="green"
                ml={2}
                isLoading={sendingTaskId === task.taskId}
              />
            </ListItem>
          </Box>
        ))
      )}
    </List>
  </Box>)
};

export default TaskList;