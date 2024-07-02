'use client';


import { saveToLocalStorage } from './localstorage';
import {
  defaultFaucetTokenKey,
  defaultMnemonicKey,
} from '../types/types';
import { defaultTxFee, GnoJSONRPCProvider, GnoWallet, GnoWSProvider } from '@gnolang/gno-js-client';
import {
  BroadcastTxCommitResult,
  TM2Error,
  TransactionEndpoint
} from '@gnolang/tm2-js-client';
import { generateMnemonic } from './crypto';
import Long from 'long';
import Config from './config';

import {
  ErrorTransform
} from './errors';
import { UserFundedError } from '../types/errors';

// ENV values //
const defaultGasWanted: Long = new Long(800_000_0);
const customTXFee = '100000ugnot'

const cleanUpRealmReturn = (ret: string, callType: string) => {
  // maketx adds and extra quote at the end of the string
  // so we need to have 2 slice values, one from 9 chars, for eval transaction
  // and one from 11 chars, for maketx
  console.log("ret in cleanupRealmReturn", ret)
  if (ret.trim() == "(undefined)"){
    return ""
  }
  if (callType == "maketx"){
    return ret.slice(2, -9).replace(/\\"/g, '"');
  }
  else if (callType == "eval"){
    return ret.slice(2, -9).replace(/\\"/g, '"');
  }
};

const decodeRealmResponse = (resp: string, callType: string) => {
  console.log("resp in decodeResponse ", resp)
  return cleanUpRealmReturn(atob(resp), callType);
};
const parsedJSONOrRaw = (data: string, nob64 = false, callType: string) => {
  const decoded = nob64 ? cleanUpRealmReturn(data, callType) : decodeRealmResponse(data, callType);
  try {
    return JSON.parse(decoded);
  } finally {
    return decoded;
  }
};

/**
 * Actions is a singleton logic bundler
 * that is shared throughout the game.
 *
 * Always use as Actions.getInstance()
 */
class Actions {
  private static instance: Actions;

  private static initPromise: Actions | PromiseLike<Actions>;
  private wallet: GnoWallet | null = null;
  private provider: GnoWSProvider | null = null;
  private providerJSON: GnoJSONRPCProvider | null = null;
  private faucetToken: string | null = null;
  private rpcURL: string = Config.GNO_JSONRPC_URL;  
  private coreRealm: string = Config.GNO_ZENTASKTIC_CORE_REALM;
  private projectRealm: string = Config.GNO_ZENTASKTIC_PROJECT_REALM;
  private userRealm: string = Config.GNO_ZENTASKTIC_USER_REALM;
  private faucetURL: string = Config.FAUCET_URL;
  
  private constructor() {}

  public setRpcUrl(newRpcUrl: string): void {
    this.rpcURL = newRpcUrl;
    this.reinitializeProvider();
  }

  public setFaucetUrl(newFaucetUrl: string): void {
    this.faucetURL = newFaucetUrl;
  }

  public setCoreRealm(newCoreRealm: string): void {
    this.coreRealm = newCoreRealm;
  }

  private async reinitializeProvider(): Promise<void> {
    try {
        // Reinitialize the JSON RPC provider with the new URL
        this.providerJSON = new GnoJSONRPCProvider(this.rpcURL);
        if (this.wallet) {
            this.wallet.connect(this.providerJSON);
        }
        console.log("Provider reinitialized with new URL:", this.rpcURL);
    } catch (e) {
        console.error("Failed to reinitialize provider:", e);
    }
  }


  /**
   * Fetches the Actions instance. If no instance is
   * initialized, it initializes it
   */
  public static async getInstance(): Promise<Actions> {
    if (!Actions.instance) {
      Actions.instance = new Actions();
      Actions.initPromise = new Promise(async (resolve) => {
        await Actions.instance.initialize();
        resolve(Actions.instance);
      });
      return Actions.initPromise;
    } else {
      return Actions.initPromise;
    }
  }

  /**
   * Prepares the Actions instance
   * @private
   */
  private async initialize() {
    // Wallet initialization //

    // Try to load the mnemonic from local storage
    let mnemonic: string | null = localStorage.getItem(defaultMnemonicKey);
    if (!mnemonic || mnemonic === '') {
      // Generate a fresh mnemonic
      mnemonic = generateMnemonic();

      // Save the mnemonic to local storage
      saveToLocalStorage(defaultMnemonicKey, mnemonic);
    }
    try {
      // Initialize the wallet using the saved mnemonic
      this.wallet = await GnoWallet.fromMnemonic(mnemonic);
      //console.log('saved mnemonic ', JSON.stringify(mnemonic))
      console.log(this.wallet);
      // Initialize the provider
      //this.provider = new GnoWSProvider(wsURL);
      this.providerJSON = new GnoJSONRPCProvider(this.rpcURL)
      console.log(this.providerJSON);
      // Connect the wallet to the provider
      this.wallet.connect(this.providerJSON);
    } catch (e) {
      //Should not happen
      console.error('Could not create wallet from mnemonic');
    }

    
    // Faucet token initialization //
    let faucetToken: string | null = localStorage.getItem(
      defaultFaucetTokenKey
    );
    if (faucetToken && faucetToken !== '') {
      // Faucet token initialized
      this.faucetToken = faucetToken;
      try {
        // Attempt to fund the account
        await this.fundAccount(this.faucetToken);
      } catch (e) {
        if (e instanceof UserFundedError) {
          console.log('User already funded.');
        } else {
          console.log('Could not fund user.');
        }
      }
    }
  }

  /**
   * Destroys the Actions instance, and closes any running services
   */
  public destroy() {
    if (!this.provider) {
      // Nothing to close
      return;
    }

    // Close out the WS connection
    //this.provider.closeConnection();
  }

  /**
   * Saves the faucet token to local storage
   * @param token the faucet token
   */
  public async setFaucetToken(token: string) {
    // Attempt to fund the account

    await this.fundAccount(token);
    this.faucetToken = token;
    localStorage.setItem(defaultFaucetTokenKey, token);
  }

  /**
   * Fetches the saved faucet token, if any
   */
  public getFaucetToken(): string | null {
    return this.faucetToken || localStorage.getItem(defaultFaucetTokenKey);
  }

  private gkLog(): Boolean {
    //const wnd = window as { gnokeyLog?: Boolean };
    //return typeof wnd.gnokeyLog !== 'undefined' && wnd.gnokeyLog;
    return true;
  }

  /**
   * Return user Addres
   */
  public getWalletAddress() {
    return this.wallet?.getAddress();
  }

  public hasWallet() {
    return !!this.wallet;
  }

  /**
   * Return user Balance
   */
  public async getBalance() {
    return await this.wallet?.getBalance('ugnot');
  }

  /**
   * Pings the faucet to fund the account before playing
   * @private
   */
  private async fundAccount(token: string): Promise<void> {
    console.log("Token:", token);
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Uncomment or add other headers as needed
            //'faucet-token': token, // Assuming 'token' should be sent in the request headers
        },
        body: JSON.stringify({
            to: await this.wallet?.getAddress()
        })
    };

    // Ensure faucetURL is defined and correct
    if (!this.faucetURL) {
        console.error("Faucet URL is undefined.");
        return;
    }

    try {
        const response = await fetch(this.faucetURL, requestOptions);
        const data = await response.json(); // Assuming the server responds with JSON
        console.log("Faucet URL:", this.faucetURL);
        //console.log("Fund Response:", JSON.stringify(data, null, 2));
        
        if (!response.ok) {
            // Log more detailed error information
            console.error("Fund error:", data.message || "Unknown error");
        }
    } catch (error) {
        // Catch network errors, parsing errors, etc.
        console.error("Error during fetch:", error);
    }
}

  /**
   * Performs a transaction, handling common error cases and transforming them
   * into known error types.
   */
  public async callMethod(
    method: string,
    args: string[] | null,
    gasWanted: Long = defaultGasWanted
  ): Promise<BroadcastTxCommitResult> {
    const gkLog = this.gkLog();
    try {
      if (gkLog) {
        const gkArgs = args?.map((arg) => '-args ' + arg).join(' ') ?? '';
        console.log(
          `$ gnokey maketx call -broadcast ` +
            `-pkgpath ${this.coreRealm} -gas-wanted ${gasWanted} -gas-fee ${defaultTxFee} ` +
            `-func ${method} ${gkArgs} test`
        );
      }
            
      const resp = (await this.wallet?.callMethod(
        this.coreRealm,
        method,
        args,
        TransactionEndpoint.BROADCAST_TX_COMMIT,
        undefined,
        {
          gasFee: defaultTxFee,
          gasWanted: gasWanted
        }
      )) as BroadcastTxCommitResult;
      if (gkLog) {
        //console.info('response in call:', JSON.stringify(resp));
        const respData = resp.deliver_tx.ResponseBase.Data;
        if (respData !== null) {
          console.info('response (parsed):', parsedJSONOrRaw(respData, false, "maketx"));
          return parsedJSONOrRaw(respData, false, "maketx");
        }
      }
      return resp;
    } 
    catch (err) {
      if(err !== undefined){
        if (gkLog) {
          console.log('err:', err);
        }
        let error: TM2Error;
      const ex = err as { log?: string; message?: string } | undefined;
      if (
        typeof ex?.log !== 'undefined' &&
        typeof ex?.message !== 'undefined' &&
        ex.message.includes('abci.StringError')
      ) {
        error = ErrorTransform(err as TM2Error);
      }
      if (gkLog) {
        console.log('error in maketx:', error);
      }
      throw error;
    }
    }
  }

  public async evaluateExpression(expr: string): Promise<string> {
    const gkLog = this.gkLog();
    if (gkLog) {
      const quotesEscaped = expr.replace(/'/g, `'\\''`);
      console.info(
        `$ gnokey query vm/qeval --data '${this.coreRealm}'$'\\n''${quotesEscaped}'`
      );
    }

    const resp = (await this.providerJSON?.evaluateExpression(
      this.coreRealm,
      expr
    )) as string;

    if (gkLog) {
      console.info('evaluateExpression response:', parsedJSONOrRaw(resp, true, "eval"));
    }

    // Parse the response
    return parsedJSONOrRaw(resp, true, "eval");
  }

  /**
   * Fetches the current user's wallet address
   */
  public async getUserAddress(): Promise<string> {
    return (await this.wallet?.getAddress()) as string;
  }

  

  /****************
   * ZenTasktic engine
   ****************/

  /**
   * Adds a new task
   *
   * @param taskName string - task name
   */
  
  async AddTask(
    taskName: string,
  ): Promise<any> {
    const response = await this.callMethod('AddTask', [
      taskName
    ]);
    console.log("actions AddTask response ", JSON.stringify(response))
    return response;
  }

   /**
   * Removes a task
   *
   * @param taskId string - task id
   */
  
   async RemoveTask(
    taskId: string,
  ): Promise<any> {
    const response = await this.callMethod('RemoveTask', [
      taskId
    ]);
    console.log("actions RemoveTask response ", JSON.stringify(response))
    return response;
  }

  /**
   * Updates a task
   *
   * @param taskId string - task id
   * @param taskBody string - task body
   */
  
  async UpdateTask(
    taskId: string,
    taskBody: string,
  ): Promise<any> {
    const response = await this.callMethod('EditTask', [
      taskId,
      taskBody
    ]);
    console.log("actions EditTask response ", JSON.stringify(response))
    return response;
  }

  /**
   * Moves a task to a realm
   *
   * @param taskId string - task id
   * @param realmId string - realm id: 1 - Assess, 2 - Decide, 3 - Do, 4 - Collections
   */
  
  async MoveTaskToRealm(
    taskId: string,
    realmId: string,
  ): Promise<any> {
    const response = await this.callMethod('MoveTaskToRealm', [
      taskId,
      realmId
    ]);
    console.log("actions MoveTaskToRealm response ", JSON.stringify(response))
    return response;
  }

  /**
   * Attaches a task to a project
   *
   * @param taskBody string - new task body
   * @param projectId string - project id
   */
  
  async AttachTaskToProject(
    taskBody: string,
    projectId: string,
  ): Promise<any> {
    const response = await this.callMethod('AttachTaskToProject', [
      taskBody,
      projectId
    ]);
    console.log("actions AttachTaskToProject response ", JSON.stringify(response))
    return response;
  }


  
  /**
   * Get tasks by realm
   */
  
  async GetTasksByRealm(realmId : string): Promise<any> {
    const response = await this.evaluateExpression("GetTasksByRealm(\"" + realmId + "\")")
    console.log("actions GetTasksByRealm response ", JSON.stringify(response))
    return response;
  }


  // projects

  /**
   * Adds a new project
   *
   * @param projectName string - project name
   */
  
  async AddProject(
    projectName: string,
  ): Promise<any> {
    const response = await this.callMethod('AddProject', [
      projectName
    ]);
    console.log("actions AddProject response ", JSON.stringify(response))
    return response;
  }

  /**
   * Removes a project
   *
   * @param projectId string - project id
   */
  
  async RemoveProject(
    projectId: string,
  ): Promise<any> {
    const response = await this.callMethod('RemoveProject', [
      projectId
    ]);
    console.log("actions RemoveProject response ", JSON.stringify(response))
    return response;
  }

  /**
   * Updates a project
   *
   * @param projectId string - project id
   * @param projectBody string - project body
   */
  
  async UpdateProject(
    projectId: string,
    projectBody: string,
  ): Promise<any> {
    const response = await this.callMethod('EditProject', [
      projectId,
      projectBody
    ]);
    console.log("actions EditProject response ", JSON.stringify(response))
    return response;
  }

  /**
   * Moves a project to a realm
   *
   * @param projectId string - project id
   * @param realmId string - realm id: 1 - Assess, 2 - Decide, 3 - Do, 4 - Collections
   */
  
  async MoveProjectToRealm(
    projectId: string,
    realmId: string,
  ): Promise<any> {
    const response = await this.callMethod('MoveProjectToRealm', [
      projectId,
      realmId
    ]);
    console.log("actions MoveProjectToRealm response ", JSON.stringify(response))
    return response;
  }

  /**
   * Get projects by realm
   */
  
  async GetProjectsByRealm(realmId : string): Promise<any> {
    const response = await this.evaluateExpression("GetProjectsByRealm(\"" + realmId + "\")")
    console.log("actions GetProjectsByRealm response ", JSON.stringify(response))
    return response;
  }


  // contexts

  /**
   * Adds a new context
   *
   * @param contextName string - context name
   */
  
  async AddContext(
    contextName: string,
  ): Promise<any> {
    const response = await this.callMethod('AddContext', [
      contextName
    ]);
    console.log("actions AddContext response ", JSON.stringify(response))
    return response;
  }


   /**
   * Removes a context
   *
   * @param contextName string - task name
   */
  
   async RemoveContext(
    contextId: string,
  ): Promise<any> {
    const response = await this.callMethod('RemoveContext', [
      contextId
    ]);
    console.log("actions RemoveContext response ", JSON.stringify(response))
    return response;
  }

  /**
   * Updates a context
   *
   * @param contextId string - context id
   * @param contextName string - context name
   */
  
  async UpdateContext(
    contextId: string,
    contextName: string,
  ): Promise<any> {
    const response = await this.callMethod('EditContext', [
      contextId,
      contextName
    ]);
    console.log("actions EditContext response ", JSON.stringify(response))
    return response;
  }

  /**
   * Get all contexts
   */
  
  async GetAllContexts(): Promise<any> {
    const response = await this.evaluateExpression("GetAllContexts()")
    console.log("actions GetAllContexts response ", JSON.stringify(response))
    return response;
  }


}

export default Actions;