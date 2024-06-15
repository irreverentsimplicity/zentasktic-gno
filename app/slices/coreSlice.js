import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const setAddresses = createAsyncThunk(
  'core/setAddresses',
  async (args, thunkAPI) => {
    console.log('args ' + JSON.stringify(args, null, 2));
      try {
       return("12345");
  
      } catch (error) {
        console.error('Error importing file:', error);
      }
    
  },
);

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
    userBalances: {},
    userGnotBalances: undefined,
    
  },
  reducers: {
    setBlockchain(state, action) {
      state.blockchainName = action.payload;
    },
    setUserBalances(state, action) {
      console.log("slice userBalances ", JSON.stringify(action.payload))
      state.userBalances = action.payload;
    },
    setUserGnotBalances(state, action) {
      console.log("slice userGnotBalances ", JSON.stringify(action.payload))
      state.userGnotBalances = action.payload;
    },
    setRpcEndpoint(state, action) {
      console.log("slice setRpcEndpoint ", JSON.stringify(action.payload))
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
  extraReducers: {
    [setAddresses.pending]: (state, action) => {
      state.adr.zentaskticCoreAddress = undefined;
    },
    [setAddresses.fulfilled]: (state, action) => {
      console.log('action.payload ' + JSON.stringify(action.payload, null, 2));
      const { zentaskticCoreAddress } = action.payload;
      state.adr.zentaskticCoreAddress = zentaskticCoreAddress;
    },
    [setAddresses.rejected]: (state, action) => {
      state.adr.zentaskticCoreAddress = undefined;
    },
  },
});

export const { 
  setBlockchain, 
  setNetwork, 
  setUserBalances, 
  setUserGnotBalances, 
  setRpcEndpoint } = coreSlice.actions;

export default coreSlice;

