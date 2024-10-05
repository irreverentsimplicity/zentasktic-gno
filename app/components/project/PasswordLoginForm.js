import { Input, Button, FormControl, FormLabel, Text } from "@chakra-ui/react";
import { getEncryptedMnemonicFromIndexedDB } from '../util/dblayer'; 
import { GnoWallet } from '@gnolang/gno-js-client';
import Actions from '../util/actions'; 
import Config from '../util/config';
import { decryptMnemonic, deriveKey } from "../util/crypto";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUserLoggedStatus } from "../slices/nextGnoSlice";
import { getGNOTBalances } from "../util/tokenActions";

const PasswordLoginForm = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const handleLogin = async () => { 
    //console.log("Attempting login with password: ", password);
    try {
        // Retrieve encrypted mnemonic from IndexedDB
        const encryptedMnemonic = await getEncryptedMnemonicFromIndexedDB();
        if (!encryptedMnemonic) {
          setError("No mnemonic found.");
          return;
        }
  
         // Derive the key using PBKDF2
        const derivedKey = await deriveKey(password, "never_try_coke_and_mentos_together"); // Use the same salt
        
        // Decrypt the mnemonic
        const decryptedMnemonic = await decryptMnemonic(derivedKey, encryptedMnemonic);
        
        if(decryptMnemonic.length !== 0){
            // Create the wallet
            createWallet(decryptedMnemonic);
        }
      } catch (error) {
        if(error.message !== undefined && error.message !== null && error.message.length !== 0){
            setError("Cannot login to ZenTasktic: " + JSON.stringify(error.message));
        }
        else {
            setError("Cannot log in to ZenTasktic, try again");
        }
      }
  };
  
  const createWallet = async (mnemonic) => {
    const wallet = await GnoWallet.fromMnemonic(mnemonic);
    console.log("wallet ", wallet)
    const actions = await Actions.getInstance();
    
    actions.setWallet(wallet);
    actions.connectWallet();
    actions.setNextGnoRealm(Config.GNO_NEXT_REALM)
    await getGNOTBalances(dispatch)
    
    dispatch(setUserLoggedStatus("1"))
  };

  return (
    <FormControl>
      <FormLabel>Enter password</FormLabel>
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <Text color="red.200" mt={2}>{error}</Text>}
      <Button 
      style={{ width: '100%' }} 
      bg={"purple.900"}
      border="0px"
      marginTop={10}
      borderColor="purple.600"
      borderRadius="lg"
      color="gray.100"
      fontWeight="bold"
      _hover={{bg: "purple.900"}}
      mt={4} onClick={handleLogin}>
        Start
      </Button>
    </FormControl>
  );
}

export default PasswordLoginForm;
