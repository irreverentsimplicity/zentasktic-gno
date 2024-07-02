import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Actions from '../util/actions';
import Config from '../util/config';
import { Box, IconButton, Textarea, Button, List, ListItem, Flex, Spinner, Input } from '@chakra-ui/react';
import { DeleteIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { setCoreAssessProjects } from '../slices/coreSlice';

const CoreProjects = () => {
  const coreProjects = useSelector(state => state.core.coreAssessProjects);
  const dispatch = useDispatch();
  const [newProject, setNewProject] = useState('');
  const [editProjectId, setEditProjectId] = useState(null);
  const [editProjectBody, setEditProjectBody] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [sendingProjectId, setSendingProjectId] = useState(null);

  useEffect( () => {
    fetchAllProjects()
  }, [])


  const handleAddProject = async () => {
    setIsAdding(true);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM)
    try {
        await actions.AddProject(newProject);
        fetchAllProjects();
      } catch (err) {
        console.log("error in calling AddProject", err);
      }
    setIsAdding(false);
    setNewProject('');
  };

  const handleDeleteProject = async (projectId) => {
    setDeletingProjectId(projectId);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM)
    try {
        await actions.RemoveProject(projectId);
        fetchAllProjects();
      } catch (err) {
        console.log("error in calling RemoveProject", err);
      }
    setDeletingProjectId(null);
  };

  const handleSendProjectToDecide = async (projectId) => {
    setSendingProjectId(projectId)
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM)
    try {
        await actions.MoveProjectToRealm(projectId, "2");
        fetchAllProjects();
      } catch (err) {
        console.log("error in calling handleSendProjectToDecide", err);
      }
     setSendingProjectId(null)
  };

  const handleEditProject = (project) => {
    setEditProjectId(project.projectId);
    setEditProjectBody(project.projectBody);
  };

  const handleUpdateProject = async () => {
    setIsUpdating(true);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM)
    try {
        await actions.UpdateProject(editProjectId, editProjectBody);
        fetchAllProjects();
      } catch (err) {
        console.log("error in calling UpdateProject", err);
      }
    setIsUpdating(false);
    setEditProjectId(null);
    setEditProjectBody('');
  };

  const fetchAllProjects = async () => {
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM)
    try {
      actions.GetProjectsByRealm("1").then((response) => {
        console.log("GetProjectsByRealm response in CoreProjects", response);
          if (response !== undefined){
          let parsedResponse = JSON.parse(response);
          
          if(parsedResponse.projects !== undefined){  
            console.log("parseResponse", JSON.stringify(response, null, 2))
            parsedResponse.projects.sort((a, b) => parseInt(b.projectId) - parseInt(a.projectId));
            dispatch(setCoreAssessProjects(parsedResponse.projects))
          }
        }
      });
    } catch (err) {
      console.log("error in calling getAllProjects", err);
    }
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
            <ListItem key={project.projectId} display="flex" alignItems="center">
              <IconButton
                icon={deletingProjectId === project.projectId ? <Spinner size="sm" /> : <DeleteIcon />}
                onClick={() => handleDeleteProject(project.projectId)}
                colorScheme="red"
                mr={2}
                isLoading={deletingProjectId === project.projectId}
              />
              {editProjectId === project.projectId ? (
                <Flex flex="1" alignItems="center">
                  <Textarea
                    value={editProjectBody}
                    onChange={(e) => setEditProjectBody(e.target.value)}
                    mr={2}
                  />
                  <Button onClick={() => handleUpdateProject(project)} colorScheme="green" isLoading={isUpdating}>
                    {isUpdating ? <Spinner size="sm" /> : 'Update'}
                  </Button>
                </Flex>
              ) : (
                <Flex flex="1" alignItems="center" _hover={{ bg: "gray.100" }}>
                  <Box onClick={() => handleEditProject(project)} flex="1" cursor="pointer">
                    {project.projectBody}
                  </Box>
                  <IconButton
                    isLoading={sendingProjectId === project.projectId}
                    icon={sendingProjectId === project.projectId ?  <Spinner size="sm" /> : <ArrowForwardIcon />}
                    onClick={() => handleSendProjectToDecide(project.projectId)}
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

export default CoreProjects;
