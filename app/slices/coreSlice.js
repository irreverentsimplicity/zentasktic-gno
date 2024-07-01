import { createSlice } from '@reduxjs/toolkit';

const coreSlice = createSlice({
  name: 'core',
  initialState: {
    blockchainName: undefined,
    testnet: true,
    mainnet: false,
    rpcEndpoint: "http://localhost:26657",
    adr: {
      zentaskticCoreAddress: undefined,
    },
    userGnotBalances: undefined,
    coreAssessTasks: [],
    coreAssessProjects: [],
    coreCollections: [],
    coreContexts: [],
    coreDecideTasks: [],
    coreDecideProjects: [],
    coreDoTasks: [],
    coreDoProjects: [],
  },
  reducers: {
    setBlockchain(state, action) {
      state.blockchainName = action.payload;
    },
    setUserGnotBalances(state, action) {
      //console.log("slice userGnotBalances ", JSON.stringify(action.payload))
      state.userGnotBalances = action.payload;
    },
    setCoreAssessTasks(state, action) {
      state.coreAssessTasks = action.payload;
    },
    setCoreAssessProjects(state, action) {
      state.coreAssessProjects = action.payload;
    },
    setCoreCollections(state, action) {
      state.coreCollections = action.payload;
    },
    setCoreContexts(state, action) {
      state.coreContexts = action.payload;
    },
    setCoreDecideTasks(state, action) {
      state.coreDecideTasks = action.payload;
    },
    setCoreDecideProjects(state, action) {
      state.coreDecideProjects = action.payload;
    },
    setCoreDoTasks(state, action) {
      state.coreDoTasks = action.payload;
    },
    setCoreDoProjects(state, action) {
      state.coreDoProjects = action.payload;
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
  setCoreAssessTasks,
  setCoreAssessProjects,
  setCoreCollections,
  setCoreContexts,
  setCoreDecideTasks,
  setCoreDecideProjects,
  setCoreDoTasks,
  setCoreDoProjects,
  setRpcEndpoint } = coreSlice.actions;

export default coreSlice.reducer;

