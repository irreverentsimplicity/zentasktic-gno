import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@chakra-ui/react';
import ToggleSwitch from './ToggleSwitch';
import DecideTasksTabBar from './DecideTasksTabBar';
import DecideProjectsTabBar from './DecideProjectsTabBar';

const DecideSliderContent = () => {
  const decideTasks = useSelector((state) => state.core.coreDecideTasks) || [];
  const decideProjects = useSelector((state) => state.core.coreDecideProjects) || [];

  const [activeTab, setActiveTab] = useState('tasks');

  const handleToggle = (active) => {
    setActiveTab(active);
  };

  return (
    <Box>
       <Box display="flex" justifyContent="flex-end" mb={3}>
      <ToggleSwitch tasksTotal={decideTasks.length} projectsTotal={decideProjects.length} onToggle={handleToggle} active={activeTab}/>
      </Box>
      {activeTab === 'tasks' ? <DecideTasksTabBar /> : <DecideProjectsTabBar />}
    </Box>
  );
};

export default DecideSliderContent;
