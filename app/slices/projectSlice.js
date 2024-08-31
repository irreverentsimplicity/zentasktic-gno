import { createSlice } from '@reduxjs/toolkit';

const projectSlice = createSlice({
  name: 'project',
  initialState: {
    blockchainName: undefined,
    testnet: true,
    mainnet: false,
    rpcEndpoint: "http://localhost:26657",
    adr: {
      zentaskticProjectAddress: undefined,
    },
    userGnotBalances: undefined,
    projectAssessTasks: [],
    projectAssessProjects: [],
    projectCollections: [],
    projectContexts: [],
    projectDecideTasks: [],
    projectDecideProjects: [],
    projectDoTasks: [],
    projectDoProjects: [],
  },
  reducers: {
    setBlockchain(state, action) {
      state.blockchainName = action.payload;
    },
    setUserGnotBalances(state, action) {
      //console.log("slice userGnotBalances ", JSON.stringify(action.payload))
      state.userGnotBalances = action.payload;
    },
    setProjectAssessTasks(state, action) {
      state.projectAssessTasks = action.payload;
    },
    setProjectAssessProjects(state, action) {
      state.projectAssessProjects = action.payload;
    },
    setProjectCollections(state, action) {
      state.projectCollections = action.payload;
    },
    setProjectContexts(state, action) {
      state.projectContexts = action.payload;
    },
    setProjectDecideTasks(state, action) {
      state.projectDecideTasks = action.payload;
    },
    setProjectDecideProjects(state, action) {
      state.projectDecideProjects = action.payload;
    },
    setProjectDoTasks(state, action) {
      state.projectDoTasks = action.payload;
    },
    setProjectDoProjects(state, action) {
      state.projectDoProjects = action.payload;
    },
    setRpcEndpoint(state, action) {
      //console.log("slice setRpcEndpoint ", JSON.stringify(action.payload))
      state.rpcEndpoint = action.payload;
    },
    setNetwork(state, action) {
      if (action.payload === 'testnet'){
        state.testnet = true;
        state.mainnet = false;
      }
      else if (action.payload === 'mainnet'){
        state.testnet = false;
        state.mainnet = true;
      }
    },
  },
  
});

export const { 
  setBlockchain, 
  setNetwork, 
  setUserGnotBalances, 
  setProjectAssessTasks,
  setProjectAssessProjects,
  setProjectCollections,
  setProjectContexts,
  setProjectDecideTasks,
  setProjectDecideProjects,
  setProjectDoTasks,
  setProjectDoProjects,
  setRpcEndpoint } = projectSlice.actions;

export default projectSlice.reducer;

