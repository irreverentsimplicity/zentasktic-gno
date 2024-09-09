import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ActionsProject from '../../util/actionsProject';
import { Box, Text, Input, IconButton, Button, List, ListItem, Flex, Spinner, FormControl, FormErrorMessage, Badge, Collapse } from '@chakra-ui/react';
import { DeleteIcon, ArrowForwardIcon, AddIcon } from '@chakra-ui/icons';
import { FaUsers } from 'react-icons/fa';
import { fetchAllUsers, fetchAllTeams } from '../../util/fetchersProject';

const ProjectTeams = () => {
  const users = useSelector(state => state.project.projectUsers);
  const teams = useSelector(state => state.project.projectTeams);
  const dispatch = useDispatch();
  const [newTeam, setNewTeam] = useState('');
  const [editTeamId, setEditTeamId] = useState(null);
  const [editTeamName, setEditTeamName] = useState('');
  const [expandedTeamId, setExpandedTeamId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingTeamId, setDeletingTeamId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState('');
  const [addError, setAddError] = useState('');

  useEffect(() => {
    fetchAllTeams(dispatch);
    fetchAllUsers(dispatch);
  }, [dispatch]);

  const handleAddTeam = async () => {
    if (newTeam) {
      setIsAdding(true);
      const actions = await ActionsProject.getInstance();
      try {
        await actions.AddTeam(newTeam);
        fetchAllTeams(dispatch);
      } catch (err) {
        console.log("error in calling AddTeam", err);
      }
      setIsAdding(false);
      setNewTeam('');
    }
  };

  const handleDeleteTeam = async (teamId) => {
    setDeletingTeamId(teamId);
    const actions = await ActionsProject.getInstance();
    try {
      await actions.RemoveTeam(teamId);
      fetchAllTeams(dispatch);
    } catch (err) {
      console.log("error in calling RemoveTeam", err);
    }
    setDeletingTeamId(null);
  };

  const handleEditTeam = (team) => {
    setEditTeamId(team.teamId);
    setEditTeamName(team.teamName);
    setExpandedTeamId(null); // Collapse the expanded panel when editing
  };

  const handleUpdateTeam = async () => {
    if (editTeamName.length >= 3 && editTeamName.length <= 1000) {
      setIsUpdating(true);
      const actions = await ActionsProject.getInstance();
      try {
        await actions.UpdateTeam(editTeamId, editTeamName);
        fetchAllTeams(dispatch);
      } catch (err) {
        console.log("error in calling UpdateTeam", err);
      }
      setIsUpdating(false);
      setEditTeamId(null);
      setEditTeamName('');
    } else {
      setEditError('Team name too long or too short');
    }
  };

  const handleToggleTeamExpansion = (teamId) => {
    setExpandedTeamId(expandedTeamId === teamId ? null : teamId);
  };

  const handleAddUserToTeam = async (userId, teamId) => {
    const actions = await ActionsProject.getInstance();
    try {
      await actions.AddActorToTeamWrap(userId, teamId);
      fetchAllTeams(dispatch); // Refresh the team list after adding
    } catch (err) {
      console.log("error in adding user to team", err);
    }
  };

  const handleRemoveUserFromTeam = async (userId, teamId) => {
    const actions = await ActionsProject.getInstance();
    try {
      await actions.RemoveActorFromTeamWrap(userId, teamId);
      fetchAllTeams(dispatch); // Refresh the team list after removing
    } catch (err) {
      console.log("error in removing user from team", err);
    }
  };

  return (
    <Box>
      {/* Form for adding teams */}
      <FormControl isInvalid={addError}>
        <Input
          value={newTeam}
          onChange={(e) => setNewTeam(e.target.value)}
          placeholder="Team Name"
          mb={2}
        />
        {addError && <FormErrorMessage>Invalid team name</FormErrorMessage>}
        <Flex justifyContent="flex-end">
          <Button 
            onClick={handleAddTeam} 
            colorScheme="blue" 
            isLoading={isAdding}
            isDisabled={!newTeam || addError}
          >
            {isAdding ? <Spinner size="sm" /> : 'Add Team'}
          </Button>
        </Flex>
      </FormControl>

      {/* List of teams with edit, delete, and user management options */}
      <List spacing={3} mt={4}>
        {teams.length === 0 ? (
          <ListItem>No teams in the system</ListItem>
        ) : (
          teams.map((team) => (
            <Box key={team.teamId}>
              <ListItem display="flex" alignItems="center">
                {editTeamId !== team.teamId && (
                  <IconButton
                    icon={deletingTeamId === team.teamId ? <Spinner size="sm" /> : <DeleteIcon size="sm" />}
                    onClick={() => handleDeleteTeam(team.teamId)}
                    colorScheme="red"
                    mr={2}
                    isLoading={deletingTeamId === team.teamId}
                  />
                )}
                {editTeamId === team.teamId ? (
                  <Flex flex="1" alignItems="center" flexDirection="column">
                    <FormControl isInvalid={!editTeamName}>
                      <Input
                        value={editTeamName}
                        onChange={(e) => setEditTeamName(e.target.value)}
                        mb={2}
                        placeholder="Team Name"
                      />
                      {!editTeamName && <FormErrorMessage>Team Name cannot be empty</FormErrorMessage>}
                    </FormControl>
                    <Button 
                      onClick={handleUpdateTeam} 
                      colorScheme="blue" 
                      isLoading={isUpdating} 
                      isDisabled={!editTeamName || editError}
                    >
                      {isUpdating ? <Spinner size="sm" /> : 'Update'}
                    </Button>
                  </Flex>
                ) : (
                  <Flex flex="1" alignItems="center">
                    <Box
                      flex="1"
                      cursor="pointer"
                      onClick={() => handleEditTeam(team)}
                      _hover={{ backgroundColor: "gray.100" }} 
                      borderWidth="1px" 
                      rounded="md" 
                      p="2"
                    >
                      {team.teamName}
                    </Box>
                    <Flex alignItems="center" ml={2} position="relative">
                      <IconButton
                        icon={<FaUsers />}
                        onClick={() => handleToggleTeamExpansion(team.teamId)}
                        aria-label="Manage Team"
                      />
                      <Badge 
                        colorScheme="blue" 
                        position="absolute" 
                        top="-1" 
                        right="-1"
                      >
                        {team.teamMembers.length}
                      </Badge>
                    </Flex>
                  </Flex>


                )}
              </ListItem>

              {/* Expandable panel for managing users in the team */}
              {expandedTeamId === team.teamId && (
                <Collapse in={expandedTeamId === team.teamId} animateOpacity>
                  <Box mt={4} mb={2} pl={6} pr={6}>
                    {/* List of users in the team */}
                    <List spacing={2} mb={4}>
                      <Text fontWeight="bold">Team Members:</Text>
                      {team.teamMembers.length === 0 ? (
                        <ListItem>No members in this team</ListItem>
                      ) : (
                        team.teamMembers.map((user) => (
                          <ListItem key={user.actorId} display="flex" alignItems="center">
                            <Box flex="1">{user.actorName}</Box>
                            <IconButton
                              icon={<ArrowForwardIcon />}
                              onClick={() => handleRemoveUserFromTeam(user.actorId, team.teamId)}
                              colorScheme="red"
                              aria-label="Remove from Team"
                            />
                          </ListItem>
                        ))
                      )}
                    </List>
                    
                    {/* List of users not in the team */}
                    <List spacing={2}>
                      <Text fontWeight="bold">Available Users:</Text>
                      {users.filter(user => !team.teamMembers.some(member => member.actorId === user.actorId)).map((user) => (
                        <ListItem key={user.actorId} display="flex" alignItems="center">
                          <Box flex="1">{user.actorName}</Box>
                          <IconButton
                            icon={<AddIcon />}
                            onClick={() => handleAddUserToTeam(user.actorId, team.teamId)}
                            colorScheme="green"
                            aria-label="Add to Team"
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Collapse>
              )}
            </Box>
          ))
        )}
      </List>
    </Box>
  );
};

export default ProjectTeams;