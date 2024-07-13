// DecideProjectList.js

import React, { useState } from 'react';
import {
  Box,
  IconButton,
  List,
  ListItem,
  Spinner,
  Text,
  HStack,
  Button,
  Collapse,
  SimpleGrid,
  Badge,
  Wrap,
} from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon, ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FaTasks } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { formatDate, isDateInFuture, isDateInPast } from '../util/dates';

const DecideProjectList = ({
  projects,
  contexts,
  handleSendToAssess,
  handleSendToDo,
  assignContextToProject,
  assignDueDateToProject,
  assignContextToProjectTask,
  assignDueDateToProjectTask,
  loadingContextProjectId,
  loadingDueDateProjectId,
  loadingContextProjectTaskId,
  loadingDueDateProjectTaskId,
  sendingProjectId,
  sendingToDoProjectId
}) => {
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expandedTaskProjectId, setExpandedTaskProjectId] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const getTaskCounts = (tasks) => {
    const undecidedTasks = tasks.filter((task) => !task.taskContextId || !task.taskDue);
    const decidedTasks = tasks.filter((task) => task.taskContextId && task.taskDue);
    const readyToDoTasks = tasks.filter(task => task.taskContextId && task.taskDue && isDateInFuture(task.taskDue));
    const stalledTasks = tasks.filter(task => task.taskContextId && task.taskDue && isDateInPast(task.taskDue));
    return { 
        undecidedTasks: undecidedTasks.length, 
        decidedTasks: decidedTasks.length,
        readyToDoTasks: readyToDoTasks.length,
        stalledTasks: stalledTasks.length,
     };
  };

  return (
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
                  onClick={() => handleSendToAssess(project.projectId)}
                  colorScheme="red"
                  mr={2}
                  isLoading={sendingProjectId === project.projectId}
                />
                <IconButton
                    icon={expandedProjectId === project.projectId ? <ChevronDownIcon /> : <ChevronRightIcon />}
                    onClick={() => setExpandedProjectId(expandedProjectId === project.projectId ? null : project.projectId)}
                    colorScheme="gray"
                    aria-label="Expand"
                    size={"md"}
                    mr={2}
                    />
                <Box
                  flex="1"
                  p={2}
                  cursor="pointer"
                  onClick={() => setExpandedProjectId(expandedProjectId === project.projectId ? null : project.projectId)}
                  _hover={{ backgroundColor: "gray.100", borderRadius: "md" }}
                >
                  <Text>{project.projectBody}</Text>
                  <HStack spacing={2} justify="flex-end">
                    <Box
                      bg={project.projectContextId ? "green.200" : "gray.200"}
                      borderRadius="md"
                      p={1}
                    >
                      {loadingContextProjectId === project.projectId ? (
                        <Spinner size="sm" />
                      ) : (
                        <Text fontSize="sm" color="gray.700">
                          @{project.projectContextId ? contexts.find(context => context.contextId === project.projectContextId)?.contextName : 'no context'}
                        </Text>
                      )}
                    </Box>
                    <Box
                      bg={project.projectDue ? "green.200" : "gray.200"}
                      borderRadius="md"
                      p={1}
                    >
                      {loadingDueDateProjectId === project.projectId ? (
                        <Spinner size="sm" />
                      ) : (
                        <Text fontSize="sm" color="gray.700">
                          {project.projectDue ? project.projectDue : 'no due date'}
                        </Text>
                      )}
                    </Box>
                  </HStack>
                </Box>
                <HStack spacing={2} ml={2}>
                  {taskCounts.undecidedTasks > 0 && (
                    <Box position="relative">
                      <IconButton
                        icon={<FaTasks color="gray" />}
                        aria-label="Undecided Tasks"
                        onClick={() => setExpandedTaskProjectId(expandedTaskProjectId === project.projectId ? null : project.projectId)}
                      />
                      <Badge position="absolute" top="-1" right="-1" colorScheme="gray">{taskCounts.undecidedTasks}</Badge>
                    </Box>
                  )}
                  {taskCounts.stalledTasks > 0 && (
                    <Box position="relative">
                      <IconButton
                        icon={<FaTasks color="red" />}
                        aria-label="Stalled Tasks"
                        onClick={() => setExpandedTaskProjectId(expandedTaskProjectId === project.projectId ? null : project.projectId)}
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
                      />
                      <Badge position="absolute" top="-1" right="-1" colorScheme="green">{taskCounts.readyToDoTasks}</Badge>
                    </Box>
                  )}
                  <IconButton
                    icon={sendingToDoProjectId === project.projectId ? <Spinner size="sm" /> : <ArrowForwardIcon />}
                    onClick={() => handleSendToDo(project.projectId)}
                    colorScheme="green"
                    mr={2}
                    isDisabled={sendingToDoProjectId === "unavailable"}
                    isLoading={sendingToDoProjectId === project.projectId}
                  />
                </HStack>
              </ListItem>
              <Collapse in={expandedProjectId === project.projectId} animateOpacity>
                <Box mt={4} mb={4} p={4} rounded="md" borderWidth="1px" bg="gray.50" zIndex={1}>
                  <SimpleGrid columns={2} spacing={4}>
                    <Box>
                      <Text mb={2} borderBottom="1px" borderColor="gray.300">Set project context</Text>
                      <Wrap spacing={2} align="center">
                        {contexts.map((context) => (
                          <Button
                            key={context.contextId}
                            onClick={async () => {
                              const success = await assignContextToProject(context.contextId, project.projectId);
                            }}
                          >
                            @{context.contextName}
                          </Button>
                        ))}
                      </Wrap>
                    </Box>
                    <Box>
                      <Text mb={2} borderBottom="1px" borderColor="gray.300">Set project due date</Text>
                      <Calendar
                        onChange={(date) => {
                          setSelectedDate(date);
                          assignDueDateToProject(project.projectId, date);
                        }}
                        value={project.projectDue ? new Date(project.projectDue) : selectedDate}
                        tileClassName={({ date, view }) => {
                          if (project.projectDue && new Date(project.projectDue).toDateString() === date.toDateString()) {
                            return 'highlight-date';
                          }
                          return null;
                        }}
                      />
                    </Box>
                  </SimpleGrid>
                </Box>
              </Collapse>
              <Collapse in={expandedTaskProjectId === project.projectId} animateOpacity>
                <Box mt={4} mb={4} p={4} rounded="md" borderWidth="1px" borderColor="gray.300" bg="gray.50">
                  <List spacing={3}>
                    {project.projectTasks.map((task) => (
                      <Box key={task.taskId}>
                        <ListItem display="flex" alignItems="center" _hover={{ backgroundColor: "gray.100" }} cursor="pointer" onClick={() => setExpandedTaskId(expandedTaskId === task.taskId ? null : task.taskId)}>
                          <Box flex="1" display="flex" alignItems="center">
                          <IconButton
                            icon={expandedTaskId === task.taskId ? <ChevronDownIcon /> : <ChevronRightIcon />}
                            colorScheme="gray"
                            aria-label="Expand"
                            size={"sm"}
                            mr={2}
                            />
                            <Text>{task.taskBody}</Text>
                          </Box>
                          <HStack spacing={2} justify="flex-end">
                            <Box
                              bg={task.taskContextId ? "green.200" : "gray.200"}
                              borderRadius="md"
                              p={1}
                            >
                              {loadingContextProjectTaskId === task.taskId ? (
                                <Spinner size="sm" />
                              ) : (
                                <Text fontSize="sm" color="gray.700">
                                  @{task.taskContextId ? contexts.find(context => context.contextId === task.taskContextId)?.contextName : 'no context'}
                                </Text>
                              )}
                            </Box>
                            <Box
                              bg={task.taskDue ? (isDateInPast(task.taskDue) ? "red.200" : "green.200") : "gray.200"}
                              borderRadius="md"
                              p={1}
                            >
                              {loadingDueDateProjectTaskId === task.taskId ? (
                                <Spinner size="sm" />
                              ) : (
                                <Text fontSize="sm" color="gray.700">
                                  {task.taskDue ? task.taskDue : 'no due date'}
                                </Text>
                              )}
                            </Box>
                          </HStack>
                        </ListItem>
                        <Collapse in={expandedTaskId === task.taskId} animateOpacity>
                          <Box mt={4} mb={4} p={4} rounded="md" borderWidth="1px" bg="gray.50" zIndex={1}>
                            <SimpleGrid columns={2} spacing={4}>
                              <Box>
                                <Text mb={2} borderBottom="1px" borderColor="gray.300">Set task context</Text>
                                <Wrap spacing={2} align="center">
                                  {contexts.map((context) => (
                                    <Button
                                      key={context.contextId}
                                      onClick={async () => {
                                        await assignContextToProjectTask(context.contextId, project.projectId, task.taskId);
                                      }}
                                    >
                                      @{context.contextName}
                                    </Button>
                                  ))}
                                </Wrap>
                              </Box>
                              <Box>
                                <Text mb={2} borderBottom="1px" borderColor="gray.300">Set task due date</Text>
                                <Calendar
                                  onChange={(date) => {
                                    setSelectedDate(date);
                                    assignDueDateToProjectTask(project.projectId, task.taskId, date);
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
        })
      )}
    </List>
  );
};

export default DecideProjectList;
