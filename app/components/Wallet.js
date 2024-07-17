
import React from "react";
import { FaWallet} from 'react-icons/fa';
import { Icon, Select } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { setRpcEndpoint } from "../slices/coreSlice";
import Actions from "../util/actions";
import Config from '../util/config';


const Wallet = ({ userGnotBalances }) => {

    const dispatch = useDispatch();
    const rpcEndpoint = useSelector(state => state.core.rpcEndpoint);
    
    const handleNetworkChange = async (event) => {
      const newNetwork = event.target.value;
      console.log("newNetwork, ", newNetwork)
      dispatch(setRpcEndpoint(newNetwork))
      const actionsInstance = await Actions.getInstance();
      let faucetUrl = "";
      let coreRealm = "";
      if (newNetwork === "http://localhost:26657"){
        faucetUrl = "http://127.0.0.1:5050";
        coreRealm = "gno.land/p/demo/zentasktic"
      } else if (newNetwork === "https://rpc.flippando.xyz") {
        faucetUrl = "https://faucet.flippando.xyz";
        coreRealm = "gno.land/p/demo/zentasktic"
      } else if (newNetwork === "https://rpc.irreverentsimplicity.xyz/"){
        faucetUrl = "http://faucet.irreverentsimplicity.xyz";
        coreRealm = "gno.land/r/g17ernafy6ctpcz6uepfsq2js8x2vz0wladh5yc3/zentasktic_core"
      }
      actionsInstance.setFaucetUrl(faucetUrl);
      actionsInstance.setCoreRealm(coreRealm);
      actionsInstance.setRpcUrl(newNetwork);
      if(newNetwork == "https://rpc.irreverentsimplicity.xyz/"){
        actionsInstance.setChainId("test4")
        actionsInstance.setSigningKey("zentaskticfaucet")
      }
    };


    const showLocalOption = process.env.NEXT_PUBLIC_SHOW_LOCAL_OPTION === 'true';
    console.log('NEXT_PUBLIC_SHOW_LOCAL_OPTION:', process.env.NEXT_PUBLIC_SHOW_LOCAL_OPTION);
    console.log("Config.GNO_JSONRPC_URL: ", Config.GNO_JSONRPC_URL);

    return (
      <div>
      <div className="grid grid-cols-5 pb-10 justify-end">
        <div className="col-span-5 flex justify-end pr-10">
          <div className="rounded-md flex flex-row justify-center items-center mt-3 p-2 bg-black-400 border border-purple-700" style={{ borderWidth: '0.5px' }}>
          <Icon as={FaWallet} w={6} h={6} alignSelf="left" color={'purple.400'} pr={1}/>
            <button className="text-sm font-small gap-6 text-purple border-transparent focus:outline-none">
              {userGnotBalances} GNOT
            </button>
          </div>
        </div>
        <div className="col-span-5 flex justify-end pr-10 pt-2">
          <Select onChange={handleNetworkChange} value={rpcEndpoint}
          size="sm"
          fontSize="sm"
          backgroundColor="purple.700"
          color="white"
          borderColor="purple.500"
          _hover={{ bg: 'purple.600' }}
          _focus={{ boxShadow: 'outline' }}>
          {showLocalOption && <option value="http://localhost:26657">Local node</option>}
          <option value="https://rpc.flippando.xyz" >ZenTasktic RPC</option>
          <option value="https://rpc.irreverentsimplicity.xyz/">Test4 IrreverentSimplicity RPC</option>
        </Select>
        </div>
      </div>
      </div>
      )
}

export default Wallet
