'use client'

import Actions from "./actions";
import {setUserGnotBalances} from '../slices/coreSlice';

export const getGNOTBalances = async (dispatch) => {
    console.log(typeof dispatch); 
    const actions = await Actions.getInstance();
    const playerAddress = await actions.getWalletAddress();
    try {
      actions.getBalance().then((response) => {
        console.log("getGNOTBalances response in tokenActions", response);
        let parsedResponse = JSON.parse(response);
        //console.log("parseResponse", JSON.stringify(parsedResponse, null, 2))
        //setUserGnotBalances(parsedResponse/1000000)
        if(parsedResponse <= 80000000){
          actions.fundAccount("flippando").then((result) => {
            return result;
          });
        }
        dispatch(setUserGnotBalances(parsedResponse/1000000))
        
      });
    } catch (err) {
      console.log("error in calling getGNOTBalances", err);
    }
  }

  export const fetchUserFLIPBalances = async (dispatch) => {
    console.log("fetchUserFLIPBalances");
    const actions = await Actions.getInstance();
    const playerAddress = await actions.getWalletAddress();
    try {
      actions.GetFLIPBalance(playerAddress).then((response) => {
        if (response !== undefined){
          console.log("fetchUserFLIPBalances response in Flip", response);
          let parsedResponse = JSON.parse(response);
          //console.log("parseResponse", JSON.stringify(response, null, 2))
          if(parsedResponse.lockedBalance !== undefined && parsedResponse.availableBalance !== undefined){  
            // get rid of FLIP and convert to FLIP from uflip
            parsedResponse.lockedBalance = (parseInt(parsedResponse.lockedBalance.slice(0, -4)) / 1000).toString();
            parsedResponse.availableBalance = (parseInt(parsedResponse.availableBalance) / 1000).toString();
            dispatch(setUserBalances(parsedResponse))
          }
        }
      });
    } catch (err) {
      console.log("error in calling fetchUserFLIPBalances", err);
    }
  };