import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Actions from '../../util/actions';
import Config from '../../util/config';
import { Box, IconButton, Textarea, Button, List, ListItem, Flex, Spinner, Input, Badge } from '@chakra-ui/react';
import { DeleteIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { FaTasks } from 'react-icons/fa';
import { FaEject } from 'react-icons/fa';
import { fetchAllTasksByRealm, fetchAllProjectsByRealm } from '../../util/fetchers';

const CoreProjects = () => {
  const coreProjects = useSelector(state => state.core.coreAssessProjects);
  const dispatch = useDispatch();
  const [newProject, setNewProject] = useState('');
  const [editProjectId, setEditProjectId] = useState(null);
  const [editProjectBody, setEditProjectBody] = useState('');
  const [editTaskCurrentProjectId, setEditTaskCurrentProjectId] = useState(null);
  const [editTaskProjectId, setEditTaskProjectId] = useState(null);
  const [editTaskProjectBody, setEditTaskProjectBody] = useState('');
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
    fetchAllProjectsByRealm(dispatch, "1");
  }, []);

  const handleAddProject = async () => {
    if (newProject.length >= 3 && newProject.length <= 1000) {
        setIsAdding(true);
        const actions = await Actions.getInstance();
        //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
        try {
        await actions.AddProject(newProject);
        fetchAllProjectsByRealm(dispatch, "1");
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
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      await actions.RemoveProject(projectId);
      fetchAllProjectsByRealm(dispatch, "1");
    } catch (err) {
      console.log("error in calling RemoveProject", err);
    }
    setDeletingProjectId(null);
  };

  const handleSendProjectToDecide = async (projectId) => {
    setSendingProjectId(projectId);
    const actions = await Actions.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      await actions.MoveProjectToRealm(projectId, "2");
      fetchAllProjectsByRealm(dispatch, "1");
      fetchAllProjectsByRealm(dispatch, "2");
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
    if (editProjectBody.length >= 3 && editProjectBody.length <= 1000) {
      setIsUpdating(true);
      const actions = await Actions.getInstance();
      //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
      try {
        await actions.UpdateProject(editProjectId, editProjectBody);
        fetchAllProjectsByRealm(dispatch, "1");
      } catch (err) {
        console.log("error in calling UpdateProject", err);
      }
      setIsUpdating(false);
      setEditProjectId(null);
      setEditProjectBody('');
    }
  };

  const handleAddTaskToProject = async (projectId) => {
    if (newTask.length >= 3){
        setIsAddingTask(true);
        const actions = await Actions.getInstance();
        //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
        try {
        await actions.AttachTaskToProject(newTask, projectId);
        fetchAllProjectsByRealm(dispatch, "1");
        } catch (err) {
        console.log("error in calling AttachTaskToProject", err);
        }
        setIsAddingTask(false);
        setNewTask('');
    }
  };

  const handleEditProjectTask = (projectTaskId, projectTaskBody, projectId) => {
    setEditTaskCurrentProjectId(projectId)
    setEditTaskProjectId(projectTaskId);
    setEditTaskProjectBody(projectTaskBody);
  };

  const handleUpdateProjectTask = async () => {
    setIsUpdating(true);
    const actions = await Actions.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
        await actions.EditProjectTask(editTaskProjectId, editTaskProjectBody, editTaskCurrentProjectId);
        fetchAllTasksByRealm(dispatch, "1");
      } catch (err) {
        console.log("error in calling EditProjectTask", err);
      }
    setIsUpdating(false);
    setEditTaskCurrentProjectId(null);
    setEditTaskProjectId(null);
    setEditTaskProjectBody('');
    fetchAllProjectsByRealm(dispatch, "1")
  };

  const handleDeleteTask = async (taskId, projectId) => {
    setDeletingTaskId(taskId)
    const actions = await Actions.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
    await actions.RemoveTaskFromProject(taskId, projectId);
    fetchAllProjectsByRealm(dispatch, "1");
    } catch (err) {
    console.log("error in calling DetachTaskFromProject", err);
    }
    setDeletingTaskId(null)
  };

  const handleDetachTaskFromProject = async (taskId, projectId) => {
    setDetachingTaskId(taskId)
    const actions = await Actions.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
    await actions.DetachTaskFromProject(taskId, projectId);
    fetchAllProjectsByRealm(dispatch, "1");
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
                  <Flex flex="1" alignItems="center">
                    <Flex onClick={() => handleEditProject(project)} flex="1" cursor="pointer" 
                    _hover={{ bg: "gray.100" }}
                    borderWidth="1px" rounded="md" p="2">
                      {project.projectBody}
                    </Flex>
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
                <Box mt={2} ml={12} mb={4} p={4} rounded="md" borderWidth="1px" borderColor="gray.300" bg="gray.50">
                <List ml={0} spacing={2}>
                {project.projectTasks.map((task, index) => (
                  <ListItem key={index} pl={2} display="flex" alignItems="center">
                    <IconButton
                      icon={deletingTaskId === task.tasktId ? <Spinner size="sm" /> : <DeleteIcon />}  
                      isLoading={deletingTaskId === task.taskId}
                      onClick={() => handleDeleteTask(task.taskId, project.projectId)}
                      colorScheme="red"
                      mr={2}
                    />
                    {editTaskProjectId === task.taskId ? (
                      <Flex flex="1" alignItems="center">
                        <Textarea
                          value={editTaskProjectBody}
                          onChange={(e) => setEditTaskProjectBody(e.target.value)}
                          mr={2}
                        />
                        <Button onClick={() => handleUpdateProjectTask(task)} colorScheme="blue" isLoading={isUpdating}>
                          {isUpdating ? <Spinner size="sm" /> : 'Update'}
                        </Button>
                      </Flex>
                    ) : (
                      <Flex flex="1" alignItems="center" _hover={{ bg: "gray.100" }}>
                        <Box onClick={() => handleEditProjectTask(task.taskId, task.taskBody, project.projectId)} flex="1" cursor="pointer">
                          {task.taskBody}
                        </Box>
                        <IconButton
                            icon={detachingTaskId === task.tasktId ? <Spinner size="sm" /> : <FaEject />}  
                            isLoading={detachingTaskId === task.taskId}
                            onClick={() => handleDetachTaskFromProject(task.taskId, project.projectId)}
                            colorScheme="linkedin"
                            ml={2}
                          />
                      </Flex>
                    )}
                    
                  </ListItem>
                ))}
              </List>
              </Box>
              )}
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
};

export default CoreProjects;
