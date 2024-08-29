import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  IconButton,
  List,
  ListItem,
  Spinner,
  Text,
  HStack,
  Badge,
  Collapse,
} from '@chakra-ui/react';
import { ArrowBackIcon, CheckIcon } from '@chakra-ui/icons';
import { FaTasks } from 'react-icons/fa';
import { isDateInPast, isDateInFuture } from '../../util/dates';

const ProjectsList = ({ 
  projects, 
  handleSendToDecide, 
  handleMarkAsDone, 
  handleProjectTaskMarkAsDone,
  sendingProjectId, 
  markAsDoneProjectId,
  markAsDoneProjectTaskID 
}) => {

  const contexts = useSelector(state => state.core.coreContexts)
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [expandedTaskProjectId, setExpandedTaskProjectId] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const getTaskCounts = (tasks) => {
    const readyToDoTasks = tasks.filter(task => task.taskContextId && task.taskDue && isDateInFuture(task.taskDue) && task.taskRealmId === "3");
    const stalledTasks = tasks.filter(task => task.taskContextId && task.taskDue && isDateInPast(task.taskDue) && task.taskRealmId === "3");
    const doneTasks = tasks.filter(task => task.taskContextId && task.taskDue && task.taskRealmId === "4");
    return { readyToDoTasks: readyToDoTasks.length, stalledTasks: stalledTasks.length, doneTasks: doneTasks.length };
  };
  
  return (
    <Box>
      <List spacing={3}>
        {projects.length === 0 ? (
          <ListItem>No projects available</ListItem>
        ) : (
          projects.map((project) => {
            const taskCounts = getTaskCounts(project.projectTasks || []);
            return (
              <Box key={project.projectId}>
                <ListItem display="flex" alignItems="center">
                  <IconButton
                    icon={sendingProjectId === project.projectId ? <Spinner size="sm" /> : <ArrowBackIcon />}
                    onClick={() => handleSendToDecide(project.projectId)}
                    colorScheme="orange"
                    mr={2}
                    isLoading={sendingProjectId === project.projectId}
                  />
                  <Box
                    flex="1"
                    p={2}
                    cursor="pointer"
                    onClick={() => setExpandedProjectId(expandedProjectId === project.projectId ? null : project.projectId)}
                    _hover={{ backgroundColor: "gray.100", borderRadius: "md" }}
                    borderWidth="1px" rounded="md"
                  >
                    <Text>{project.projectBody}</Text>
                    <HStack spacing={2} justify="flex-end">
                      <Box
                        bg={project.projectContextId ? "green.200" : "gray.200"}
                        borderRadius="md"
                        p={1}
                      >  
                      <Text fontSize="sm" color="gray.700">
                        @{project.projectContextId ? contexts.find(context => context.contextId === project.projectContextId)?.contextName : 'no context'}
                      </Text>
                      </Box>
                      <Box
                        bg={isDateInPast(project.projectDue) ? "red.100" : "green.200"}
                        borderRadius="md"
                        p={1}
                      >
                      <Text fontSize="sm" color="gray.700">
                        {project.projectDue ? project.projectDue : 'no due date'}
                      </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <HStack spacing={2} ml={2}>
                    {taskCounts.doneTasks > 0 && (
                      <Box position="relative">
                        <IconButton
                          icon={<FaTasks color="gray" />}
                          aria-label="Done Tasks"
                          onClick={() => setExpandedTaskProjectId(expandedTaskProjectId === project.projectId ? null : project.projectId)}
                          backgroundColor={expandedTaskProjectId === project.projectId ? "blue.100" : "gray.100"}
                          _hover="transparent"
                        />
                        <Badge position="absolute" top="-1" right="-1" colorScheme="gray">{taskCounts.doneTasks}</Badge>
                      </Box>
                    )}
                    {taskCounts.stalledTasks > 0 && (
                      <Box position="relative">
                        <IconButton
                          icon={<FaTasks color="red" />}
                          aria-label="Stalled Tasks"
                          onClick={() => setExpandedTaskProjectId(expandedTaskProjectId === project.projectId ? null : project.projectId)}
                          backgroundColor={expandedTaskProjectId === project.projectId ? "blue.100" : "gray.100"}
                          _hover="transparent"
                        />
                        <Badge position="absolute" top="-1" right="-1" colorScheme="red">{taskCounts.stalledTasks}</Badge>
                      </Box>
                    )}
                    {taskCounts.readyToDoTasks > 0 && (
                      <Box position="relative">
                        <IconButton
                          icon={<FaTasks color="green" />}
                          aria-label="Ready To Do Tasks"
                          onClick={() => setExpandedTaskProjectId(expandedTaskProjectId === project.projectId ? null : project.projectId)}
                          backgroundColor={expandedTaskProjectId === project.projectId ? "blue.100" : "gray.100"}
                          _hover="transparent"
                        />
                        <Badge position="absolute" top="-1" right="-1" colorScheme="green">{taskCounts.readyToDoTasks}</Badge>
                      </Box>
                    )}
                    <IconButton
                      icon={markAsDoneProjectId === project.projectId ? <Spinner size="sm" /> : <CheckIcon />}
                      onClick={() => handleMarkAsDone(project.projectId)}
                      colorScheme="green"
                      ml={1}
                      isLoading={markAsDoneProjectId === project.projectId }
                    />
                  </HStack>
                </ListItem>
                <Collapse in={expandedTaskProjectId === project.projectId} animateOpacity>
                  <Box mt={4} mb={4} p={4} rounded="md" borderWidth="1px" borderColor="gray.300" bg="gray.50">
                    <List spacing={3}>
                      {project.projectTasks.map((task) => (
                        <Box key={task.taskId}>
                          <ListItem display="flex" alignItems="center" _hover={{ backgroundColor: "gray.100" }} cursor="pointer" onClick={() => setExpandedTaskId(expandedTaskId === task.taskId ? null : task.taskId)} textDecoration={task.taskRealmId === "4" ? "line-through" : "none"}>
                            <Box flex="1" display="flex" alignItems="center">
                              <Box as="span" mr={2}>&#8226;</Box>
                              <Text>{task.taskBody}</Text>
                            </Box>
                            <HStack spacing={2} justify="flex-end">
                              <Box
                                bg={task.taskRealmId === "4" ? "gray.200" : (task.taskContextId ? "green.200" : "gray.200")}
                                borderRadius="md"
                                p={1}
                              >
                              <Text fontSize="sm" color="gray.700" textDecoration={task.taskRealmId === "4" ? "line-through" : "none"}>
                                @{task.taskContextId ? contexts.find(context => context.contextId === task.taskContextId)?.contextName : 'no context'}
                              </Text>
                              </Box>
                              <Box
                                bg={task.taskRealmId === "4" ? "gray.200" : (isDateInPast(task.taskDue) ? "red.100" : "green.200")}
                                borderRadius="md"
                                p={1}
                              >
                                <Text fontSize="sm" color="gray.700" textDecoration={task.taskRealmId === "4" ? "line-through" : "none"}>
                                  {task.taskDue ? task.taskDue : 'no due date'}
                                </Text>
                              </Box>
                            </HStack>
                            <IconButton
                            icon={markAsDoneProjectTaskID === task.taskId ? <Spinner size="sm" /> : <CheckIcon />}
                            onClick={() => handleProjectTaskMarkAsDone(project.projectId, task.taskId)}
                            colorScheme={task.taskRealmId === "4" ? "gray" : "green"}
                            ml={1}
                            size="xs"
                            isLoading={markAsDoneProjectTaskID === task.taskId}
                            isDisabled={task.taskRealmId === "4"} // Use isDisabled instead of disabled
                          />

                          </ListItem>
                        </Box>
                      ))}
                    </List>
                  </Box>
                </Collapse>
              </Box>
            );
          })
        )}
      </List>
    </Box>
  );
};

export default ProjectsList;