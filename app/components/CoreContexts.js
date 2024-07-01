import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Actions from '../util/actions';
import Config from '../util/config';
import { Box, IconButton, Input, Button, List, ListItem, Flex, Spinner } from '@chakra-ui/react';
import { DeleteIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { setCoreContexts } from '../slices/coreSlice';

const CoreContexts = () => {
  const coreContexts = useSelector(state => state.core.coreContexts);
  const dispatch = useDispatch();
  const [newContext, setNewContext] = useState('');
  const [editContextId, setEditContextId] = useState(null);
  const [editContextName, setEditContextName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deletingContextId, setDeletingContextId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAddContext = async () => {
    setIsAdding(true);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM)
    try {
        await actions.AddContext(newContext);
        fetchAllContexts();
      } catch (err) {
        console.log("error in calling AddContext", err);
      }
    setIsAdding(false);
    setNewContext('');
  };

  const handleDeleteContext = async (contextId) => {
    setDeletingContextId(contextId);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM)
    try {
        await actions.RemoveContext(contextId);
        fetchAllContexts();
      } catch (err) {
        console.log("error in calling RemoveContext", err);
      }
    setDeletingContextId(null);
  };

  const handleEditContext = (context) => {
    setEditContextId(context.contextId);
    setEditContextName(context.contextName);
  };

  const handleUpdateContext = async () => {
    setIsUpdating(true);
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM)
    try {
        await actions.UpdateContext(editContextId, editContextName);
        fetchAllContexts();
      } catch (err) {
        console.log("error in calling UpdateContext", err);
      }
    setIsUpdating(false);
    setEditContextId(null);
    setEditContextName('');
  };

  const fetchAllContexts = async () => {
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM)
    try {
      actions.GetAllContexts().then((response) => {
        console.log("GetAllContexts response in CoreContexts", response);
          if (response !== undefined){
          let parsedResponse = JSON.parse(response);
          
          if(parsedResponse.contexts !== undefined){  
            console.log("parseResponse", JSON.stringify(response, null, 2))
            parsedResponse.contexts.sort((a, b) => parseInt(b.contextId) - parseInt(a.contextId));
            dispatch(setCoreContexts(parsedResponse.contexts))
          }
        }
      });
    } catch (err) {
      console.log("error in calling getAllContexts", err);
    }
  };

  return (
    <Box>
      <Flex mb={4}>
        <Input
          value={newContext}
          onChange={(e) => setNewContext(e.target.value)}
          placeholder="Add a new context"
          mr={2}
        />
        <Button onClick={handleAddContext} colorScheme="blue" isLoading={isAdding}>
          {isAdding ? <Spinner size="sm" /> : 'Add Context'}
        </Button>
      </Flex>
      <List spacing={3}>
        {coreContexts.length === 0 ? (
          <ListItem>No contexts available</ListItem>
        ) : (
          coreContexts.map((context) => (
            <ListItem key={context.contextId} display="flex" alignItems="center">
              <IconButton
                icon={deletingContextId === context.contextId ? <Spinner size="sm" /> : <DeleteIcon />}
                onClick={() => handleDeleteContext(context.contextId)}
                colorScheme="red"
                mr={2}
                isLoading={deletingContextId === context.contextId}
              />
              {editContextId === context.contextId ? (
                <Flex flex="1" alignItems="center">
                  <Textarea
                    value={editContextName}
                    onChange={(e) => setEditContextName(e.target.value)}
                    mr={2}
                  />
                  <Button onClick={() => handleUpdateContext(context)} colorScheme="green" isLoading={isUpdating}>
                    {isUpdating ? <Spinner size="sm" /> : 'Update'}
                  </Button>
                </Flex>
              ) : (
                <Flex flex="1" alignItems="center" _hover={{ bg: "gray.100" }}>
                  <Box onClick={() => handleEditContext(context)} flex="1" cursor="pointer">
                    @{context.contextName}
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

export default CoreContexts;
