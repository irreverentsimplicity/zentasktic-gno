import React from 'react';
import { Button, Badge, HStack, Box } from '@chakra-ui/react';
import { AiOutlineFileText, AiOutlineProject } from 'react-icons/ai';

const ToggleSwitch = ({ tasksTotal, projectsTotal, onToggle, active, realm }) => {
  const getColorScheme = () => {
    switch (realm) {
      case 'decide':
        return 'orange';
      case 'do':
        return 'green';
      default:
        return 'orange';
    }
  };

  const colorScheme = getColorScheme();

  return (
    <Box mb={2}>
      <HStack spacing={0}>
        <Button
          onClick={() => onToggle('tasks')}
          borderRadius="50px 0 0 50px"
          bg={active === 'tasks' ? `${colorScheme}.400` : 'gray.100'}
          color={active === 'tasks' ? 'white' : 'black'}
          _hover={{ bg: active === 'tasks' ? `${colorScheme}.500` : 'gray.300' }}
          _active={{ bg: active === 'tasks' ? `${colorScheme}.600` : 'gray.300' }}
        >
          <AiOutlineFileText style={{ marginRight: '8px' }} />
          Tasks <Badge ml={2} colorScheme={active === 'tasks' ? 'gray' : colorScheme}>{tasksTotal}</Badge>
        </Button>
        <Button
          onClick={() => onToggle('projects')}
          borderRadius="0 50px 50px 0"
          bg={active === 'projects' ? `${colorScheme}.400` : 'gray.100'}
          color={active === 'projects' ? 'white' : 'black'}
          _hover={{ bg: active === 'projects' ? `${colorScheme}.500` : 'gray.300' }}
          _active={{ bg: active === 'projects' ? `${colorScheme}.600` : 'gray.300' }}
        >
          <AiOutlineProject style={{ marginRight: '8px' }} />
          Projects <Badge ml={2} colorScheme={active === 'projects' ? 'gray' : colorScheme}>{projectsTotal}</Badge>
        </Button>
      </HStack>
    </Box>
  );
};

export default ToggleSwitch;
