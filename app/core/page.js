
'use client'

import { useState } from 'react';
import { Box, Grid, GridItem, Button, Text, VStack, HStack } from '@chakra-ui/react';
import { PieChart, Pie, Cell } from 'recharts';
import Footer from '../components/Footer';
import SlidingDrawer from '../components/SlidingDrawer';
import Header from '../components/Header';

const pieData = [
  { name: 'Red', value: 1 },
  { name: 'Orange', value: 1 },
  { name: 'Green', value: 1 }
];

const COLORS = ['#FF0000', '#FFA500', '#008000'];

const Dashboard = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState({ title: '', content: '' });

  const openDrawer = (title, content) => {
    setDrawerContent({ title, content });
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };
  return (
    <div>
    <Box height="80vh" padding="4">
        <Header appTitle="Core"/>
      <Grid templateRows="80% 20%" height="100%">
        <GridItem>
          <Grid templateColumns="30% 70%" height="100%">
            <GridItem>
              <Box height="90%">
                <PieChart width={300} height={300}>
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
                <Box height="10%">
                  <Text textAlign="center">ZenStatus</Text>
                  <Text textAlign="center">There are more items in Assess, than in Decide and Do, combined.</Text>
                </Box>
              </Box>
            </GridItem>
            <GridItem>
              <Grid templateRows="repeat(3, 1fr)" height="100%">
                <GridItem>
                  <HStack justifyContent="space-between" padding="4">
                    <Text>Assess</Text>
                    <Button colorScheme="red" onClick={() => openDrawer('Assess', 'Assess Content')}>+</Button>
                  </HStack>
                </GridItem>
                <GridItem>
                  <HStack justifyContent="space-between" padding="4">
                    <Text>Decide</Text>
                    <Button colorScheme="orange" onClick={() => openDrawer('Decide', 'Decide Content')}>?</Button>
                  </HStack>
                </GridItem>
                <GridItem>
                  <HStack justifyContent="space-between" padding="4">
                    <Text>Do</Text>
                    <Button colorScheme="green" onClick={() => openDrawer('Do', 'Do Content')}>-</Button>
                  </HStack>
                </GridItem>
              </Grid>
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem>
          {/* Second row content goes here */}
        </GridItem>
      </Grid>
      <SlidingDrawer isOpen={isDrawerOpen} onClose={closeDrawer} title={drawerContent.title} content={drawerContent.content} />
    </Box>
    <Footer/>
    </div>
  );
};

export default Dashboard;