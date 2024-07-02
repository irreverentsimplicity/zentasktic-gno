import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Actions from '../util/actions';
import Config from '../util/config';
import { Box, IconButton, Textarea, Button, List, ListItem, Flex, Spinner, Input, Badge } from '@chakra-ui/react';
import { DeleteIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { FaTasks } from 'react-icons/fa';
import { FaEject } from 'react-icons/fa';
import { fetchAssessProjects, fetchAllTasksByRealm } from '../util/fetchers';

const CoreProjects = () => {
  const coreProjects = useSelector(state => state.core.coreAssessProjects);
  const dispatch = useDispatch();
  const [newProject, setNewProject] = useState('');
  const [editProjectId, setEditProjectId] = useState(null);
  const [editProjectBody, setEditProjectBody] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [detachingTaskId, setDetachingTaskId] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [sendingProjectId, setSendingProjectId] = useState(null);
  const [addingTaskId, setAddingTaskId] = useState(null);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchAssessProjects(dispatch);
  }, []);

  const handleAddProject = async () => {
    if (newProject.length >= 3) {
        setIsAdding(true);
        const actions = await Actions.getInstance();
        actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
        try {
        await actions.AddProject(newProject);
        fetchAssessProjects(dispatch);
        } catch (err) {
        console.log("error in calling AddProject", err);
        }
        setIsAdding(false);
        setNewProject('');  
    }
  };

  const handleDeleteProject = async (projectId) => {
    setDeletingProjectId(projectId);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
    try {
      await actions.RemoveProject(projectId);
      fetchAssessProjects(dispatch);
    } catch (err) {
      console.log("error in calling RemoveProject", err);
    }
    setDeletingProjectId(null);
  };

  const handleSendProjectToDecide = async (projectId) => {
    setSendingProjectId(projectId);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
    try {
      await actions.MoveProjectToRealm(projectId, "2");
      fetchAssessProjects(dispatch);
    } catch (err) {
      console.log("error in calling handleSendProjectToDecide", err);
    }
    setSendingProjectId(null);
  };

  const handleEditProject = (project) => {
    setEditProjectId(project.projectId);
    setEditProjectBody(project.projectBody);
  };

  const handleUpdateProject = async () => {
    setIsUpdating(true);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
    try {
      await actions.UpdateProject(editProjectId, editProjectBody);
      fetchAssessProjects(dispatch);
    } catch (err) {
      console.log("error in calling UpdateProject", err);
    }
    setIsUpdating(false);
    setEditProjectId(null);
    setEditProjectBody('');
  };

  const handleAddTaskToProject = async (projectId) => {
    if (newTask.length >= 3){
        setIsAddingTask(true);
        const actions = await Actions.getInstance();
        actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
        try {
        await actions.AttachTaskToProject(newTask, projectId);
        fetchAssessProjects(dispatch);
        } catch (err) {
        console.log("error in calling AttachTaskToProject", err);
        }
        setIsAddingTask(false);
        setNewTask('');
    }
  };

  const handleEditTask = (taskId, taskBody, projectId) => {
    // Logic to edit task
  };

  const handleDeleteTask = async (taskId, projectId) => {
    setDeletingTaskId(taskId)
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
    try {
    await actions.RemoveTaskFromProject(taskId, projectId);
    fetchAssessProjects(dispatch);
    } catch (err) {
    console.log("error in calling DetachTaskFromProject", err);
    }
    setDeletingTaskId(null)
  };

  const handleDetachTaskFromProject = async (taskId, projectId) => {
    setDetachingTaskId(taskId)
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
    try {
    await actions.DetachTaskFromProject(taskId, projectId);
    fetchAssessProjects(dispatch);
    fetchAllTasksByRealm(dispatch, "1")
    } catch (err) {
    console.log("error in calling DetachTaskFromProject", err);
    }
    setNewTask('');
    setDetachingTaskId(null)
  };

  return (
    <Box>
      <Flex mb={4}>
        <Input
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
          placeholder="Add a new project"
          mr={2}
        />
        <Button onClick={handleAddProject} colorScheme="blue" isLoading={isAdding}>
          {isAdding ? <Spinner size="sm" /> : 'Add Project'}
        </Button>
      </Flex>
      <List spacing={3}>
        {coreProjects.length === 0 ? (
          <ListItem>No projects available</ListItem>
        ) : (
          coreProjects.map((project) => (
            <ListItem key={project.projectId} display="flex" flexDirection="column">
              <Flex alignItems="center">
                <IconButton
                  icon={deletingProjectId === project.projectId ? <Spinner size="sm" /> : <DeleteIcon />}
                  onClick={() => handleDeleteProject(project.projectId)}
                  colorScheme="red"
                  mr={2}
                  isLoading={deletingProjectId === project.projectId}
                />
                {editProjectId === project.projectId ? (
                  <Flex flex="1" alignItems="center">
                    <Input
                      value={editProjectBody}
                      onChange={(e) => setEditProjectBody(e.target.value)}
                      mr={2}
                    />
                    <Button onClick={() => handleUpdateProject(project)} colorScheme="blue" isLoading={isUpdating}>
                      {isUpdating ? <Spinner size="sm" /> : 'Update'}
                    </Button>
                  </Flex>
                ) : (
                  <Flex flex="1" alignItems="center" _hover={{ bg: "gray.100" }}>
                    <Box onClick={() => handleEditProject(project)} flex="1" cursor="pointer">
                      {project.projectBody}
                    </Box>
                    <Flex alignItems="center">
                        <Box position="relative" display="inline-block" ml={2}>
                            <IconButton
                            icon={<FaTasks />}
                            colorScheme={project.projectTasks && project.projectTasks.length > 0 ? "red" : "gray"}
                            onClick={() => setAddingTaskId(addingTaskId === project.projectId ? null : project.projectId)}
                            />
                            {project.projectTasks && project.projectTasks.length > 0 && (
                            <Badge position="absolute" top="-1" right="-1" colorScheme="red">
                                {project.projectTasks.length}
                            </Badge>
                            )}
                        </Box>
                        <IconButton
                            isLoading={sendingProjectId === project.projectId}
                            icon={sendingProjectId === project.projectId ? <Spinner size="sm" /> : <ArrowForwardIcon />}
                            onClick={() => handleSendProjectToDecide(project.projectId)}
                            colorScheme="orange"
                            ml={2}
                        />
                    </Flex>
                  </Flex>
                )}
              </Flex>
              {addingTaskId === project.projectId && (
                <Flex mt={2} ml={12}> 
                  <Input
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add task to project"
                  />
                  <Button onClick={() => handleAddTaskToProject(project.projectId)} colorScheme="blue" ml={2} isLoading={isAddingTask}>
                    {isAddingTask ? <Spinner size="sm" /> : 'Add Task'}
                  </Button>
                </Flex>
              )}
              {addingTaskId === project.projectId && project.projectTasks.length !== 0 && (
                <List mt={2} ml={12} spacing={2} borderWidth="1px" borderRadius="md" p={2}>
                {project.projectTasks.map((task, index) => (
                  <ListItem key={index} pl={2} display="flex" alignItems="center">
                    <IconButton
                      icon={deletingTaskId === task.tasktId ? <Spinner size="sm" /> : <DeleteIcon />}  
                      isLoading={deletingTaskId === task.taskId}
                      onClick={() => handleDeleteTask(task.taskId, project.projectId)}
                      colorScheme="linkedin"
                      mr={2}
                    />
                    <Box
                      flex="1"
                      cursor="pointer"
                      _hover={{ bg: "gray.100" }}
                      onClick={() => handleEditTask(task.taskId, task.taskBody)}
                    >
                      {task.taskBody}
                    </Box>
                    <IconButton
                      icon={detachingTaskId === task.tasktId ? <Spinner size="sm" /> : <FaEject />}  
                      isLoading={detachingTaskId === task.taskId}
                      onClick={() => handleDetachTaskFromProject(task.taskId, project.projectId)}
                      colorScheme="blackAlpha"
                      ml={2}
                    />
                  </ListItem>
                ))}
              </List>
              )}
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
};

export default CoreProjects;
