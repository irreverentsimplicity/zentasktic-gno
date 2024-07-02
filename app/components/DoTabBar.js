import React, { useState, useEffect } from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, HStack, Text, Box, Spinner } from '@chakra-ui/react';

const TodayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#6aa84f"/>
  </svg>
);

const TomorrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="half-circle">
        <rect x="0" y="0" width="12" height="24" />
      </clipPath>
    </defs>
    <circle cx="12" cy="12" r="10" fill="#6aa84f" clipPath="url(#half-circle)" />
    <circle cx="12" cy="12" r="10" stroke="#6aa84f" strokeWidth="2" fill="none"/>
  </svg>
);

const SoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="none" stroke="#6aa84f" strokeWidth="2"/>
    <circle cx="12" cy="12" r="5" fill="#6aa84f"/>
  </svg>
);

const ContextsTabBar = ({ contexts }) => (
  <Tabs variant="soft-rounded" colorScheme="green">
    <TabList>
      {contexts.map((context, index) => (
        <Tab key={index}>{context}</Tab>
      ))}
    </TabList>

    <TabPanels>
      {contexts.map((context, index) => (
        <TabPanel key={index}>
          <p>{context} content goes here.</p>
        </TabPanel>
      ))}
    </TabPanels>
  </Tabs>
);

const DoTabBar = () => {
  const [selectedTab, setSelectedTab] = useState(null);
  const [contexts, setContexts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedTab === '@Contexts') {
      fetchContexts();
    }
  }, [selectedTab]);

  const fetchContexts = async () => {
    setLoading(true);
    try {
      // Mocked API response
      const mockedResponse = [
        "@Home",
        "@Work",
        "@Shopping"
      ];
      setTimeout(() => {
        setContexts(mockedResponse);
        setLoading(false);
      }, 1000); // Simulating network delay
    } catch (error) {
      console.error('Error fetching contexts:', error);
      setLoading(false);
    }
  };

  return (
    <Tabs variant="enclosed-colored" onChange={(index) => setSelectedTab(index === 3 ? '@Contexts' : null)}>
      <TabList>
        <Tab
          _selected={{ bg: "#008000", color: "white" }}
          _hover={{ bg: "#008000", color: "white" }}
          _active={{ color: "#008000" }}
          color="#008000"
          fontWeight="bold"
        >
          <HStack>
            <Box as={TodayIcon} />
            <Text>Today</Text>
          </HStack>
        </Tab>
        <Tab
          _selected={{ bg: "#008000", color: "white" }}
          _hover={{ bg: "#008000", color: "white" }}
          _active={{ color: "#008000" }}
          color="#008000"
          fontWeight="bold"
        >
          <HStack>
            <Box as={TomorrowIcon} />
            <Text>Tomorrow</Text>
          </HStack>
        </Tab>
        <Tab
          _selected={{ bg: "#008000", color: "white" }}
          _hover={{ bg: "#008000", color: "white" }}
          _active={{ color: "#008000" }}
          color="#008000"
          fontWeight="bold"
        >
          <HStack>
            <Box as={SoonIcon} />
            <Text>Soon</Text>
          </HStack>
        </Tab>
        <Tab
          _selected={{ bg: "#008000", color: "white" }}
          _hover={{ bg: "#008000", color: "white" }}
          _active={{ color: "#008000" }}
          color="#008000"
          fontWeight="bold"
        >
          <Text>@ By Context</Text>
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <p>Today content goes here.</p>
        </TabPanel>
        <TabPanel>
          <p>Tomorrow content goes here.</p>
        </TabPanel>
        <TabPanel>
          <p>Soon content goes here.</p>
        </TabPanel>
        <TabPanel>
          {loading ? <Spinner /> : <ContextsTabBar contexts={contexts} />}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default DoTabBar;
