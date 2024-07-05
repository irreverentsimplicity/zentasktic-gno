import React from 'react';
import { Button, Badge, HStack, Box } from '@chakra-ui/react';
import { AiOutlineFileText, AiOutlineProject } from 'react-icons/ai';

const ToggleSwitch = ({ tasksTotal, projectsTotal, onToggle, active }) => {
  return (
    <Box mb={2}>
    <HStack spacing={0}>
      <Button
        onClick={() => onToggle('tasks')}
        borderRadius="50px 0 0 50px"
        bg={active === 'tasks' ? 'orange.400' : 'gray.100'}
        color={active === 'tasks' ? 'white' : 'black'}
        _hover={{ bg: active === 'tasks' ? 'orange.500' : 'gray.300' }}
        _active={{ bg: active === 'tasks' ? 'orange.600' : 'gray.400' }}
      >
        <AiOutlineFileText style={{ marginRight: '8px' }} />
        Tasks <Badge ml={2} colorScheme={active === 'tasks' ? 'red' : 'orange'}>{tasksTotal}</Badge>
      </Button>
      <Button
        onClick={() => onToggle('projects')}
        borderRadius="0 50px 50px 0"
        bg={active === 'projects' ? 'orange.400' : 'gray.100'}
        color={active === 'projects' ? 'white' : 'black'}
        _hover={{ bg: active === 'projects' ? 'orange.500' : 'gray.300' }}
        _active={{ bg: active === 'projects' ? 'orange.600' : 'gray.400' }}
      >
        <AiOutlineProject style={{ marginRight: '8px' }} />
        Projects <Badge ml={2} colorScheme={active === 'projects' ? 'red' : 'orange'}>{projectsTotal}</Badge>
      </Button>
    </HStack>
    </Box>
  );
};

export default ToggleSwitch;
