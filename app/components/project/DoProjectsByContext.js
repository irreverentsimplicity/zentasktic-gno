import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Actions from '../../util/actionsProject';
import Config from '../../util/config';
import {
  Box,
  Button,
  Badge,
  Collapse,
  Wrap,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { fetchAllProjectsByRealm } from '../../util/fetchers';
import ProjectsList from './DoProjectsList';

const DoProjectsByContext = () => {
  const coreDoProjects = useSelector((state) => state.core.coreDoProjects);
  const contexts = useSelector((state) => state.core.coreContexts);
  const dispatch = useDispatch();
  const [sendingProjectId, setSendingProjectId] = useState(null);
  const [markAsDoneProjectId, setMarkAsDoneProjectId] = useState(null);
  const [markAsDoneProjectTaskID, setMarkAsDoneProjectTaskId] = useState(null);
  const [expandedContextId, setExpandedContextId] = useState(null);

  useEffect(() => {
    fetchAllProjectsByRealm(dispatch, "3");
  }, [dispatch]);

  const groupProjectsByContext = (coreDoProjects) => {
    return coreDoProjects.reduce((acc, project) => {
      const contextId = project.projectContextId || 'noContext';
      if (!acc[contextId]) {
        acc[contextId] = [];
      }
      acc[contextId].push(project);
      return acc;
    }, {});
  };

  const groupedProjects = groupProjectsByContext(coreDoProjects);

  const handleSendToDecide = async (projectId) => {
    setSendingProjectId(projectId);
    const actions = await Actions.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      await actions.MoveProjectToRealm(projectId, '2');
      fetchAllProjectsByRealm(dispatch, '3');
      fetchAllProjectsByRealm(dispatch, '2');
    } catch (err) {
      console.log('error in calling handleSendToDecide', err);
    }
    setSendingProjectId(null);
  };

  const handleMarkAsDone = async (projectId) => {
    setMarkAsDoneProjectId(projectId);
    const actions = await Actions.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      await actions.MoveProjectToRealm(projectId, '4');
      fetchAllProjectsByRealm(dispatch, '3');
    } catch (err) {
      console.log('error in calling handleMarkAsDone', err);
    }
    setMarkAsDoneProjectId(null);
  };

  const handleProjectTaskMarkAsDone = async (projectId, projectTaskId) => {
    setMarkAsDoneProjectTaskId(projectTaskId);
    const actions = await Actions.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      await actions.MarkProjectTaskAsDone(projectId, projectTaskId);
      fetchAllProjectsByRealm(dispatch, '3');
    } catch (err) {
      console.log('error in calling handleProjectTaskMarkAsDone', err);
    }
    setMarkAsDoneProjectTaskId(null);
  };

  return (
    <Box>
      <Wrap spacing={4}>
        {Object.keys(groupedProjects).map((contextId) => {
          const context = contexts.find(ctx => ctx.contextId === contextId);
          const contextName = context ? '@' + context.contextName : 'No Context';
          const projects = groupedProjects[contextId];

          return (
            <Box
              key={contextId}
              borderWidth="1px"
              borderRadius="lg"
              mb={4}
              style={{width: "100%"}}
            >
              <Flex
                p={4}
                cursor="pointer"
                align="center"
                _hover={{ backgroundColor: "gray.100" }}
                bg={expandedContextId === contextId ? "gray.100" : "white"}
                onClick={() => setExpandedContextId(expandedContextId === contextId ? null : contextId)}
              >
                <IconButton
                  icon={expandedContextId === contextId ? <ChevronDownIcon /> : <ChevronRightIcon />}
                  colorScheme="gray"
                  aria-label="Expand"
                  size={"md"}
                  mr={2}
                />
                <Button variant="ghost" flex="1" width={100} colorScheme="green">
                  {contextName} <Badge ml="2" colorScheme="gray">{projects.length}</Badge>
                </Button>
              </Flex>
              <Collapse in={expandedContextId === contextId} animateOpacity>
                <Box p={4} borderTopWidth="1px">
                  <ProjectsList 
                  projects={projects} 
                  handleSendToDecide={handleSendToDecide} 
                  handleMarkAsDone={handleMarkAsDone}
                  handleProjectTaskMarkAsDone={handleProjectTaskMarkAsDone}
                  sendingProjectId={sendingProjectId}
                  markAsDoneProjectId={markAsDoneProjectId}
                  markAsDoneProjectTaskID={markAsDoneProjectTaskID}
                  />
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </Wrap>
    </Box>
  );
};

export default DoProjectsByContext;
