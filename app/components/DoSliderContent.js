import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@chakra-ui/react';
import ToggleSwitch from './ToggleSwitch';
import DoTasksTabBar from './DoTasksTabBar';
import DoProjectsTabBar from './DoProjectsTabBarFromTasks';

const DoSliderContent = () => {
  const doTasks = useSelector((state) => state.core.coreDoTasks) || [];
  const doProjects = useSelector((state) => state.core.coreDoProjects) || [];

  const [activeTab, setActiveTab] = useState('tasks');

  const handleToggle = (active) => {
    setActiveTab(active);
  };

  return (
    <Box>
       <Box display="flex" justifyContent="flex-end" mb={3}>
      <ToggleSwitch tasksTotal={doTasks.length} projectsTotal={doProjects.length} onToggle={handleToggle} active={activeTab} realm={'do'}/>
      </Box>
      {activeTab === 'tasks' ? <DoTasksTabBar /> : <DoProjectsTabBar />}
    </Box>
  );
};

export default DoSliderContent;
