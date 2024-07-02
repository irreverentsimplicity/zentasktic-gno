'use client'

import { useEffect, useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { Box, Grid, GridItem, Button, Text, VStack, Divider, HStack } from '@chakra-ui/react';
import { PieChart, Pie, Cell } from 'recharts';
import Footer from '../components/Footer';
import SlidingDrawer from '../components/SlidingDrawer';
import Header from '../components/Header';
import Actions from '../util/actions';
import Config from '../util/config'
import { getGNOTBalances } from '../util/tokenActions';
import { setCoreAssessTasks, setCoreDecideTasks, setCoreDoTasks } from '../slices/coreSlice';
import { fetchAllTasksByRealm } from '../util/fetchers';



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

  const pieData = [
    { name: 'Assess', value: assessTasks.length != 0 ? assessTasks.length : 1 },
    { name: 'Decide', value: decideTasks.length != 0 ? decideTasks.length : 1 },
    { name: 'Do', value: doTasks.length != 0 ? doTasks.length : 1 }
  ];

  console.log("assessTasks.length ", assessTasks.length)
  const dispatch = useDispatch()
  
  useEffect( () => {
      getGNOTBalances(dispatch, (result) => {
        if (result.success) {
            alert(result.message);
        } else {
            alert(`Error: ${result.message}`);
        }
    });
  }, [rpcEndpoint]);

  useEffect( () => {
    fetchAllTasksByRealm(dispatch, "1")
  }, [])

  useEffect( () => {
    fetchAllTasksByRealm(dispatch, "2")
  }, [])

  useEffect( () => {
    fetchAllTasksByRealm(dispatch, "3")
    // uncomment when adding Collections
    //fetchAllTasksByRealm(dispatch,"4")
  }, [])

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
                  <Box height="30%" borderTop="1px" borderColor="gray.300" background="gray.300" color="black" borderBottomLeftRadius="20px" borderBottomRightRadius="20px">
                    <Text textAlign="center">ZenStatus</Text>
                    <Text textAlign="center">There are more items in Assess, than in Decide and Do, combined.</Text>
                  </Box>
                  </Box>
              </GridItem>
<GridItem>
  <Grid templateRows="repeat(3, 1fr)" height="100%">
  <GridItem height="100%">
    <Box display="flex" justifyContent="space-between" alignItems="center" padding="2" border="1px" borderRadius="15px" borderColor="gray.300" height="85%">
        <Box width="90%" display="flex" flexDirection="column" justifyContent="flex-start">
        <Text fontSize="2xl" fontWeight="bold" color="red.500" alignSelf="flex-start">
            Assess
        </Text>
        <Divider borderColor="gray.300" />
        <Box marginTop="2">
            <Text>Assess Content</Text><Text>Assess Content</Text><Text>Assess Content</Text>
        </Box>
        </Box>
        <Divider orientation="vertical" borderColor="gray.300" />
        <Box width="10%" display="flex" justifyContent="center" alignItems="center">
        <Button borderRadius="50%" fontSize="2xl" colorScheme="red" onClick={() => openDrawer('Assess', 'Assess Content')}>
            +
        </Button>
        </Box>
    </Box>
    </GridItem>
    <GridItem height="100%">
    <Box display="flex" justifyContent="space-between" alignItems="center" padding="2" border="1px" borderRadius="15px" borderColor="gray.300" height="85%">
        <Box width="90%" display="flex" flexDirection="column" justifyContent="flex-start">
        <Text fontSize="2xl" fontWeight="bold" color="orange.500" alignSelf="flex-start">
            Decide
        </Text>
        <Divider borderColor="gray.300" />
        <Box marginTop="2">
            <Text>Decide Content</Text><Text>Decide Content</Text><Text>Decide Content</Text>
        </Box>
        </Box>
        <Divider orientation="vertical" borderColor="gray.300" />
        <Box width="10%" display="flex" justifyContent="center" alignItems="center">
        <Button borderRadius="50%" fontSize="2xl" colorScheme="orange" onClick={() => openDrawer('Decide', 'Decide Content')}>
            ?
        </Button>
        </Box>
    </Box>
    </GridItem>
    <GridItem height="100%">
    <Box display="flex" justifyContent="space-between" alignItems="center" padding="2" border="1px" borderRadius="15px" borderColor="gray.300" height="85%">
        <Box width="90%" display="flex" flexDirection="column" justifyContent="flex-start">
        <Text fontSize="2xl" fontWeight="bold" color="green.500" alignSelf="flex-start">
            Do
        </Text>
        <Divider borderColor="gray.300" />
        <Box marginTop="2">
            <Text>Do Content</Text><Text>Do Content</Text><Text>Do Content</Text>
        </Box>
        </Box>
        <Divider orientation="vertical" borderColor="gray.300" />
        <Box width="10%" display="flex" justifyContent="center" alignItems="center">
        <Button borderRadius="50%" fontSize="2xl" colorScheme="green" onClick={() => openDrawer('Do', 'Do Content')}>
            -
        </Button>
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
