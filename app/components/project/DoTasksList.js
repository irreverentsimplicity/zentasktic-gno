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
import { isDateInPast } from '../../util/dates';

const TaskList = ({ tasks, handleSendToDecide, handleMarkAsDone, sendingTaskId, markAsDoneTaskId }) => {

  const contexts = useSelector(state => state.project.projectContexts)
  
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