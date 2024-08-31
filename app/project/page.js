'use client'

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Grid, GridItem, Button, Text, VStack, Divider, HStack, IconButton } from '@chakra-ui/react';
import { PieChart, Pie, Cell } from 'recharts';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { FaQuestion } from 'react-icons/fa';
import Footer from '../components/project/Footer';
import SlidingDrawer from '../components/project/SlidingDrawer';
import Header from '../components/project/Header';
import { getGNOTBalances } from '../util/tokenActionsProject';
import { fetchAllTasksByRealm, fetchAllProjectsByRealm, fetchAllContexts } from '../util/fetchersProject';

const COLORS = ['#FF0000', '#FFA500', '#008000'];

const Dashboard = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState({ title: '', content: '' });
  const assessTasks = useSelector(state => state.project.projectAssessTasks) || [];
  const assessProjects = useSelector(state => state.project.projectAssessProjects) || [];
  const decideTasks = useSelector(state => state.project.projectDecideTasks) || [];
  const decideProjects = useSelector(state => state.project.projectDecideProjects) || [];
  const doTasks = useSelector(state => state.project.projectDoTasks) || [];
  const doProjects = useSelector(state => state.project.projectDoProjects) || [];
  
  const rpcEndpoint = useSelector(state => state.project.rpcEndpoint);
  const userGnotBalances = useSelector(state => state.project.userGnotBalances);

  const assessData = assessTasks.length + assessProjects.length;
  const decideData = decideTasks.length + decideProjects.length;
  const doData = doTasks.length + doProjects.length;

  const pieData = [
    { name: 'Assess', value: assessData !== 0 ? assessData : 1 },
    { name: 'Decide', value: decideData !== 0 ? decideData : 1 },
    { name: 'Do', value: doData !== 0 ? doData : 1 }
  ];

  const [zenStatus, setZenStatus] = useState(``);
  const [assessContent, setAssessContent] = useState(``);
  const [decideContent, setDecideContent] = useState(``);
  const [doContent, setDoContent] = useState(``);

  const dispatch = useDispatch();
  
  useEffect(() => {
    const assessData = assessTasks.length + assessProjects.length;
    const decideData = decideTasks.length + decideProjects.length;
    const doData = doTasks.length + doProjects.length;
    const totalItems = assessData + decideData + doData;

    const pieData = [
      { name: 'Assess', value: assessData !== 0 ? assessData : 1 },
      { name: 'Decide', value: decideData !== 0 ? decideData : 1 },
      { name: 'Do', value: doData !== 0 ? doData : 1 }
    ];

    const maxData = Math.max(assessData, decideData, doData);
    const mostActiveArea = pieData.find(data => data.value === maxData)?.name || 'None';

    setZenStatus(`There are ${totalItems} items in your system. The most active area is ${mostActiveArea}.`);
    setAssessContent(`There are ${assessTasks.length} tasks, and ${assessProjects.length} projects ready to be assessed. `);
    setDecideContent(`There are ${decideTasks.length} tasks, and ${decideProjects.length} projects you can decide upon right now. `);
    setDoContent(`There are ${doTasks.length} tasks, and ${doProjects.length} projects you are executing right now.`)
  }, [assessTasks, assessProjects, decideTasks, decideProjects, doTasks, doProjects, rpcEndpoint]);

  
  useEffect(() => {
    getGNOTBalances(dispatch, (result) => {
      console.log("page.js get Gnot result,", result)
      if (!result.error) {
        alert(result.result);
      } else {
        alert(`Error: ${result.error}`);
      }
    });
  }, [dispatch, rpcEndpoint]);

  useEffect(() => {
    fetchAllTasksByRealm(dispatch, "1");
    fetchAllProjectsByRealm(dispatch, "1");
    fetchAllContexts(dispatch);
  }, [dispatch]);

  useEffect(() => {
    fetchAllTasksByRealm(dispatch, "2");
    fetchAllProjectsByRealm(dispatch, "2");
  }, []);

  useEffect(() => {
    fetchAllTasksByRealm(dispatch, "3");
    fetchAllProjectsByRealm(dispatch, "3");
    // uncomment when adding Collections
    // fetchAllTasksByRealm(dispatch,"4");
  }, []);

  const openDrawer = (title, content) => {
    setDrawerContent({ title, content });
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const renderContentBox = (title, content, color, icon, onClickHandler, displayIcon) => {
    console.log("displayIcon ", displayIcon)
    return(
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="space-between"
        padding="2" 
        border="1px" 
        borderRadius="15px" 
        borderColor="gray.300" 
        height="95%"
        width="95%"
        cursor="pointer"
        onClick={onClickHandler}
        _hover={{backgroundColor: "gray.100"}}
      >
        <Box 
          display="flex" 
          flexDirection="column" 
          justifyContent="flex-start"
          flexGrow={1} // Ensures the content area grows to fill available space
        >
          <Text fontSize="2xl" fontWeight="bold" color={color} alignSelf="flex-start">
            {title}
          </Text>
          <Divider borderColor="gray.300" />
          <Box marginTop="2">
            {content}
          </Box>
        </Box>
        {displayIcon == true &&
          <Box 
            width="100%" 
            display="flex" 
            justifyContent="center" 
            alignItems="center"
            marginTop="auto" // Pushes the icon to the bottom
          >
            <IconButton
              icon={
                <Box
                  as={icon}
                  borderRadius="50%"
                  color="white"
                  backgroundColor={color}
                  boxSize="3rem"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  p="0.5rem"
                />
              }
              onClick={onClickHandler}
              aria-label={title}
            />
          </Box>
        }
      </Box>
    );
  }
  

  return (
    <div>
      <Header appTitle="Project" userGnotBalances={userGnotBalances}/>
      <Box height="95vh" padding="4" border="1px" borderRadius="md" borderColor="gray.300">
        <Grid templateRows="80% 20%" height="100%" padding={2}>
          <GridItem>
            <Grid templateColumns="25% 75%" height="100%">
              <GridItem marginBottom={5}>
                <Box height="100%" background="white" alignContent="center" justifyContent="center" marginBottom={4} border="1px" borderRadius="20px" borderColor="gray.300" marginRight={3}>
                  <Box height="70%">
                    <PieChart width={300} height={300} background="gray.300">
                      <Pie
                        data={pieData}
                        cx={150}
                        cy={150}
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </Box>
                  <Box
                    height="30%"
                    borderTop="1px"
                    borderColor="gray.300"
                    background="gray.300"
                    color="black"
                    borderBottomLeftRadius="20px"
                    borderBottomRightRadius="20px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    >
                    <Text textAlign="center">{zenStatus}</Text>
                  </Box>
                </Box>
              </GridItem>
              <GridItem>
                <Grid templateRows="2fr 1fr" height="100%">
                  <GridItem marginBottom={0} paddingBottom={0}>
                    <Grid templateColumns="repeat(3, 1fr)" height="100%">
                      <GridItem height="100%">
                        {renderContentBox('Assess', assessContent, 'red.500', AddIcon, () => openDrawer('Assess', assessContent), true)}
                      </GridItem>
                      <GridItem height="100%">
                        {renderContentBox('Decide', decideContent, 'orange.500', FaQuestion, () => openDrawer('Decide', decideContent), true)}
                      </GridItem>
                      <GridItem height="100%">
                        {renderContentBox('Do', doContent, 'green.500', MinusIcon, () => openDrawer('Do', doContent), true)}
                      </GridItem>
                    </Grid>
                  </GridItem>
                  <GridItem borderTop="1px" borderTopColor={'black'} paddingTop="2">
                    <Grid templateColumns="repeat(3, 1fr)" height="100%">
                      <GridItem height="100%">
                        {renderContentBox('Users', 'Users Content', 'blue.500', AddIcon, () => openDrawer('Users', 'Users Content'), false)}
                      </GridItem>
                      <GridItem height="100%">
                        {renderContentBox('Teams', 'Teams Content', 'purple.500', FaQuestion, () => openDrawer('Teams', 'Teams Content'), false)}
                      </GridItem>
                      <GridItem height="100%">
                        {renderContentBox('Rewards', 'Rewards Content', 'yellow.500', MinusIcon, () => openDrawer('Rewards', 'Rewards Content'), false)}
                      </GridItem>
                    </Grid>
                  </GridItem>
                </Grid>
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>
      </Box>
      <SlidingDrawer isOpen={isDrawerOpen} onClose={closeDrawer} title={drawerContent.title} content={drawerContent.content} />
      <Footer/>
    </div>
  );
};

export default Dashboard;
