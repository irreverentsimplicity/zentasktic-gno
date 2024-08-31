import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ActionsProject from '../../util/actionsProject';
import { Box, Input, IconButton, Button, List, ListItem, Flex, Spinner, FormControl, FormErrorMessage } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { fetchAllUsers } from '../../util/fetchersProject';

const ProjectUsers = () => {
  const users = useSelector(state => state.project.projectUsers);
  const dispatch = useDispatch();
  const [newUser, setNewUser] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [editUserId, setEditUserId] = useState(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserAddress, setEditUserAddress] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [addAddressError, setAddAddressError] = useState(false);
  const [editAddressError, setEditAddressError] = useState(false);

  useEffect(() => {
    fetchAllUsers(dispatch);
  }, []);

  const isGnoAddress = (address) => {
    return /^g1[0-9a-z]{38}$/.test(address);
  };

  const handleAddUser = async () => {
    if (newUser && userAddress && isGnoAddress(userAddress)) {
      setIsAdding(true);
      const actions = await ActionsProject.getInstance();
      try {
        await actions.AddUser(newUser, userAddress);
        fetchAllUsers(dispatch);
      } catch (err) {
        console.log("error in calling AddUser", err);
      }
      setIsAdding(false);
      setNewUser('');
      setUserAddress('');
    }
  };

  const handleDeleteUser = async (userId) => {
    setDeletingUserId(userId);
    const actions = await ActionsProject.getInstance();
    try {
      await actions.RemoveUser(userId);
      fetchAllUsers(dispatch);
    } catch (err) {
      console.log("error in calling RemoveUser", err);
    }
    setDeletingUserId(null);
  };

  const handleEditUser = (user) => {
    setEditUserId(user.actorId);
    setEditUserName(user.actorName);
    setEditUserAddress(user.actorAddress);
    setEditAddressError(false); // Reset the error state for the edit form
  };

  const handleUpdateUser = async () => {
    if (editUserName.length >= 3 && editUserName.length <= 1000 && isGnoAddress(editUserAddress)) {
      setIsUpdating(true);
      const actions = await ActionsProject.getInstance();
      try {
        await actions.UpdateUser(editUserId, editUserName, editUserAddress);
        fetchAllUsers(dispatch);
      } catch (err) {
        console.log("error in calling UpdateUser", err);
      }
      setIsUpdating(false);
      setEditUserId(null);
      setEditUserName('');
      setEditUserAddress('');
    } else {
      setEditAddressError(!isGnoAddress(editUserAddress));
    }
  };

  const handleAddressChange = (e) => {
    const address = e.target.value;
    setUserAddress(address);
    setAddAddressError(!isGnoAddress(address));
  };

  const handleEditAddressChange = (e) => {
    const address = e.target.value;
    setEditUserAddress(address);
    setEditAddressError(!isGnoAddress(address));
  };

  return (
    <Box>
      {/* Form for adding users */}
      <FormControl isInvalid={addAddressError}>
        <Input
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
          placeholder="User Name"
          mb={2}
        />
        <Input
          value={userAddress}
          onChange={handleAddressChange}
          placeholder="User Gno Address"
          mb={2}
        />
        {addAddressError && <FormErrorMessage>Invalid Gno address</FormErrorMessage>}
        <Flex justifyContent="flex-end">
          <Button 
            onClick={handleAddUser} 
            colorScheme="blue" 
            isLoading={isAdding}
            isDisabled={!newUser || !userAddress || addAddressError}
          >
            {isAdding ? <Spinner size="sm" /> : 'Add User'}
          </Button>
        </Flex>
      </FormControl>

      {/* List of users with edit and delete options */}
      <List spacing={3} mt={4}>
        {users.length === 0 ? (
          <ListItem>No users in the system</ListItem>
        ) : (
          users.map((user) => (
            <ListItem key={user.actorId} display="flex" alignItems="center">
              {editUserId !== user.actorId &&
              <IconButton
                icon={deletingUserId === user.actorId ? <Spinner size="sm" /> : <DeleteIcon size="sm" />}
                onClick={() => handleDeleteUser(user.actorId)}
                colorScheme="red"
                mr={2}
                isLoading={deletingUserId === user.actorId}
              />
              }
              {editUserId === user.actorId ? (
                <Flex flex="1" alignItems="center" flexDirection="column">
                 <FormControl isInvalid={!editUserName}>
                  <Input
                    value={editUserName}
                    onChange={(e) => setEditUserName(e.target.value)}
                    mb={2}
                    placeholder="User Name"
                  />
                  {!editUserName && <FormErrorMessage>User Name cannot be empty</FormErrorMessage>}
                </FormControl>

                <FormControl isInvalid={editAddressError}>
                  <Input
                    value={editUserAddress}
                    onChange={handleEditAddressChange}
                    mb={2}
                    placeholder="User Gno Address"
                  />
                  {editAddressError && <FormErrorMessage>Invalid Gno address</FormErrorMessage>}
                </FormControl>

                <Button 
                  onClick={handleUpdateUser} 
                  colorScheme="blue" 
                  isLoading={isUpdating} 
                  isDisabled={!editUserName || !editUserAddress || editAddressError}
                >
                  {isUpdating ? <Spinner size="sm" /> : 'Update'}
                </Button>

                </Flex>
              ) : (
                <Flex flex="1" alignItems="center">
                  <Box
                    flex="1"
                    cursor="pointer"
                    onClick={() => handleEditUser(user)}
                    _hover={{ backgroundColor: "gray.100" }} 
                    borderWidth="1px" 
                    rounded="md" 
                    p="2"
                  >
                    {user.actorName} / {user.actorAddress}
                  </Box>
                </Flex>
              )}
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
};

export default ProjectUsers;
