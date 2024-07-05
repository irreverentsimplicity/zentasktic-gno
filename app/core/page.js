'use client'

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Grid, GridItem, Button, Text, VStack, Divider, HStack, IconButton } from '@chakra-ui/react';
import { PieChart, Pie, Cell } from 'recharts';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { FaQuestion } from 'react-icons/fa';
import Footer from '../components/Footer';
import SlidingDrawer from '../components/SlidingDrawer';
import Header from '../components/Header';
import { getGNOTBalances } from '../util/tokenActions';
import { fetchAllTasksByRealm, fetchAllProjectsByRealm, fetchAllContexts } from '../util/fetchers';

const COLORS = ['#FF0000', '#FFA500', '#008000'];

const Dashboard = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState({ title: '', content: '' });
  const assessTasks = useSelector(state => state.core.coreAssessTasks) || [];
  const assessProjects = useSelector(state => state.core.coreAssessProjects) || [];
  const decideTasks = useSelector(state => state.core.coreDecideTasks) || [];
  const decideProjects = useSelector(state => state.core.coreDecideProjects) || [];
  const doTasks = useSelector(state => state.core.coreDoTasks) || [];
  const doProjects = useSelector(state => state.core.coreDoProjects) || [];
  
  const rpcEndpoint = useSelector(state => state.core.rpcEndpoint);
  const userGnotBalances = useSelector(state => state.core.userGnotBalances);

  const assessData = assessTasks.length + assessProjects.length;
  const decideData = decideTasks.length + decideProjects.length;
  const doData = doTasks.length + doProjects.length;

  const pieData = [
    { name: 'Assess', value: assessData !== 0 ? assessData : 1 },
    { name: 'Decide', value: decideData !== 0 ? decideData : 1 },
    { name: 'Do', value: doData !== 0 ? doData : 1 }
  ];

  console.log("assessTasks.length ", assessTasks.length);
  console.log("decideTasks.length ", decideTasks.length);
  console.log("doTasks.length ", doTasks.length);
  console.log("assessProjects.length ", assessProjects.length);
  console.log("decideProjects.length ", decideProjects.length);
  console.log("do.doProjects ", doProjects.length);


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
  }, [assessTasks, assessProjects, decideTasks, decideProjects, doTasks, doProjects]);

  useEffect(() => {
    getGNOTBalances(dispatch, (result) => {
      if (result.success) {
        alert(result.message);
      } else {
        alert(`Error: ${result.message}`);
      }
    });
  }, [rpcEndpoint]);

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

  return (
    <div>
      <Header appTitle="Core" userGnotBalances={userGnotBalances}/>
      <Box height="85vh" padding="4" border="1px" borderRadius="md" borderColor="gray.300">
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
                <Grid templateRows="repeat(3, 1fr)" height="100%">
                  <GridItem height="100%">
                    <Box 
                      display="flex" 
                      justifyContent="space-between" 
                      alignItems="center" 
                      padding="2" 
                      border="1px" 
                      borderRadius="15px" 
                      borderColor="gray.300" 
                      height="85%"
                      cursor="pointer"
                      onClick={() => openDrawer('Assess', 'Assess Content')}
                      _hover={{backgroundColor: "gray.100"}}
                    >
                      <Box width="90%" display="flex" flexDirection="column" justifyContent="flex-start">
                        <Text fontSize="2xl" fontWeight="bold" color="red.500" alignSelf="flex-start">
                          Assess
                        </Text>
                        <Divider borderColor="gray.300" />
                        <Box marginTop="2">
                          {assessContent}
                        </Box>
                      </Box>
                      <Divider orientation="vertical" borderColor="gray.300" />
                      <Box width="10%" display="flex" justifyContent="center" alignItems="center">
                      <IconButton
                        icon={
                            <Box
                            as={AddIcon}
                            borderRadius="50%"
                            color="white"
                            backgroundColor="red.500"
                            boxSize="3rem"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            p="0.5rem"
                            />
                        }
                        onClick={() => openDrawer('Assess', 'Assess Content')}
                        aria-label="Assess"
                        />
                      </Box>
                    </Box>
                  </GridItem>
                  <GridItem height="100%">
                    <Box 
                      display="flex" 
                      justifyContent="space-between" 
                      alignItems="center" 
                      padding="2" 
                      border="1px" 
                      borderRadius="15px" 
                      borderColor="gray.300" 
                      height="85%"
                      cursor="pointer"
                      onClick={() => openDrawer('Decide', 'Decide Content')}
                      _hover={{backgroundColor: "gray.100"}}
                    >
                      <Box width="90%" display="flex" flexDirection="column" justifyContent="flex-start">
                        <Text fontSize="2xl" fontWeight="bold" color="orange.500" alignSelf="flex-start">
                          Decide
                        </Text>
                        <Divider borderColor="gray.300" />
                        <Box marginTop="2">
                          {decideContent}
                        </Box>
                      </Box>
                      <Divider orientation="vertical" borderColor="gray.300" />
                      <Box width="10%" display="flex" justifyContent="center" alignItems="center">
                      <IconButton
                        icon={
                            <Box
                            as={FaQuestion}
                            borderRadius="50%"
                            color="white"
                            backgroundColor="orange.500"
                            boxSize="3rem"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            p="0.5rem"
                            />
                        }
                        onClick={() => openDrawer('Decide', 'Decide Content')}
                        aria-label="Decide"
                        />

                      </Box>
                    </Box>
                  </GridItem>
                  <GridItem height="100%">
                    <Box 
                      display="flex" 
                      justifyContent="space-between" 
                      alignItems="center" 
                      padding="2" 
                      border="1px" 
                      borderRadius="15px" 
                      borderColor="gray.300" 
                      height="85%"
                      cursor="pointer"
                      onClick={() => openDrawer('Do', 'Do Content')}
                      _hover={{backgroundColor: "gray.100"}}
                    >
                      <Box width="90%" display="flex" flexDirection="column" justifyContent="flex-start">
                        <Text fontSize="2xl" fontWeight="bold" color="green.500" alignSelf="flex-start">
                          Do
                        </Text>
                        <Divider borderColor="gray.300" />
                        <Box marginTop="2">
                          {doContent}
                        </Box>
                      </Box>
                      <Divider orientation="vertical" borderColor="gray.300" />
                      <Box width="10%" display="flex" justifyContent="center" alignItems="center">
                      <IconButton
                        icon={
                            <Box
                            as={MinusIcon}
                            borderRadius="50%"
                            color="white"
                            backgroundColor="green.500"
                            boxSize="3rem"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            p="0.5rem"
                            />
                        }
                        onClick={() => openDrawer('Do', 'Do Content')}
                        aria-label="Do"
                        />
                      </Box>
                    </Box>
                  </GridItem>
                </Grid>
              </GridItem>
            </Grid>
          </GridItem>
          <GridItem>
            <HStack justifyContent="space-between" padding="2" border="1px" borderRadius="15px" borderColor="gray.300" height="85%">
              <Text>Dashboards</Text>
            </HStack>
          </GridItem>
        </Grid>
      </Box>
      <SlidingDrawer isOpen={isDrawerOpen} onClose={closeDrawer} title={drawerContent.title} content={drawerContent.content} />
      <Footer/>
    </div>
  );
};

export default Dashboard;
