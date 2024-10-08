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
 * ActionsProject is a singleton logic bundler
 * that is shared throughout the game.
 *
 * Always use as ActionsProject.getInstance()
 */
class ActionsProject {
  private static instance: ActionsProject;

  private static initPromise: ActionsProject | PromiseLike<ActionsProject>;
  private wallet: GnoWallet | null = null;
  private provider: GnoWSProvider | null = null;
  private providerJSON: GnoJSONRPCProvider | null = null;
  private faucetToken: string | null = null;
  private rpcURL: string = Config.GNO_JSONRPC_URL;  
  private coreRealm: string = Config.GNO_ZENTASKTIC_CORE_REALM;
  private projectRealm: string = Config.GNO_ZENTASKTIC_PROJECT_REALM;
  private userRealm: string = Config.GNO_ZENTASKTIC_USER_REALM;
  private faucetURL: string = Config.FAUCET_URL;
  private chainId: string = "dev"
  private signingKey: string = "test"
  
  private constructor() {}

  public setRpcUrl(newRpcUrl: string): void {
    this.rpcURL = newRpcUrl;
    this.reinitializeProvider();
  }

  public setFaucetUrl(newFaucetUrl: string): void {
    this.faucetURL = newFaucetUrl;
  }

  public setProjectRealm(newProjectRealm: string): void {
    this.projectRealm = newProjectRealm;
  }

  public setChainId(newChainId: string): void {
    this.chainId = newChainId;
  }

  public setSigningKey(newSigningKey: string): void {
    this.signingKey = newSigningKey;
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
   * Fetches the ActionsProject instance. If no instance is
   * initialized, it initializes it
   */
  public static async getInstance(): Promise<ActionsProject> {
    if (!ActionsProject.instance) {
      ActionsProject.instance = new ActionsProject();
      ActionsProject.initPromise = new Promise(async (resolve) => {
        await ActionsProject.instance.initialize();
        resolve(ActionsProject.instance);
      });
      return ActionsProject.initPromise;
    } else {
      return ActionsProject.initPromise;
    }
  }

  /**
   * Prepares the ActionsProject instance
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
   * Destroys the ActionsProject instance, and closes any running services
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


  public setWallet(wallet: GnoWallet) {
    this.wallet = wallet;
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
    args?: string[] | null,
    gasWanted: Long = defaultGasWanted,
    chainId?: string | null,
    signingKey?: string | null,
  ): Promise<BroadcastTxCommitResult> {
    if (args === null) {
      args = [];
  }
  if (gasWanted === null) {
      gasWanted = defaultGasWanted;
  }
    if (chainId === null) {
      //chainId = "test4"
      chainId = "dev"
    }
    if (signingKey === null) {
      //signingKey = "zentaskticfaucet"
      signingKey = "test"
    }
    const gkLog = this.gkLog();
    try {
      if (gkLog) {
        const gkArgs = args?.map((arg) => '-args ' + arg).join(' ') ?? '';
        console.log(
          `$ gnokey maketx call -broadcast ` +
            `-pkgpath ${this.projectRealm} -gas-wanted ${gasWanted} -gas-fee ${defaultTxFee} ` +
            `-func ${method} ${gkArgs} -chainid ${this.chainId} ${this.signingKey}`
        );
      }
            
      const resp = (await this.wallet?.callMethod(
        this.projectRealm,
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
        `$ gnokey query vm/qeval --data '${this.projectRealm}.${quotesEscaped}'`
      );
    }

    const resp = (await this.providerJSON?.evaluateExpression(
      this.projectRealm,
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
   * Edits a project task
   *
   * @param taskProjectId string - the id of the task in the project
   * @param taskBody string - new task body
   * @param projectId string - project id
   */

  async EditProjectTask(
    taskProjectId: string,
    taskBody: string,
    projectId: string,
  ): Promise<any> {
    const response = await this.callMethod('EditProjectTask', [
      taskProjectId,
      taskBody,
      projectId
    ]);
    console.log("actions EditProjectTask response ", JSON.stringify(response))
    return response;
  }

  /**
   * Detaches a task from a project
   *
   * @param projectTaskId string - project task id
   * @param projectId string - project id
   */
  
  async DetachTaskFromProject(
    projectTaskId: string,
    projectId: string,
  ): Promise<any> {
    const response = await this.callMethod('DetachTaskFromProject', [
      projectTaskId,
      projectId
    ]);
    console.log("actions DetachTaskFromProject response ", JSON.stringify(response))
    return response;
  }

  /**
   * Removes a task from a project
   *
   * @param projectTaskId string - project task id
   * @param projectId string - project id
   */
  
  async RemoveTaskFromProject(
    projectTaskId: string,
    projectId: string,
  ): Promise<any> {
    const response = await this.callMethod('RemoveTaskFromProject', [
      projectTaskId,
      projectId
    ]);
    console.log("actions RemoveTaskFromProject response ", JSON.stringify(response))
    return response;
  }

  /**
   * Adds a context to a task
   *
   * @param contextId string - context id
   * @param taskId string - task id
   */

  async AddContextToTask(
    contextId: string,
    taskId: string,
  ): Promise<any> {
    const response = await this.callMethod('AddContextToTask', [
      contextId,
      taskId
    ]);
    console.log("actions AddContextToTask response ", JSON.stringify(response))
    return response;
  }

  /**
   * Adds a due date to a task
   *
   * @param taskId string - task id
   * @param date string - date, formatted "YYYY-MM-DD"
   */

  async AssignDueDateToTask(
    taskId: string,
    date: string,
  ): Promise<any> {
    const response = await this.callMethod('SetTaskDueDate', [
      taskId,
      date
    ]);
    console.log("actions AddDateToTask response ", JSON.stringify(response))
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


  // users

  /**
   * Adds a new user
   *
   * @param userName string - user name
   * @param userAddress string - user address
   */

  async AddUser(
    userName: string,
    userAddress: string,
  ): Promise<any> {
    const response = await this.callMethod('AddActorWrap', [
      userName,
      userAddress,
    ]);
    console.log("actions AddActorWrap response ", JSON.stringify(response))
    return response;
  }

   /**
   * Removes a user
   *
   * @param userId string - user id
   */
  
   async RemoveUser(
    userId: string,
  ): Promise<any> {
    const response = await this.callMethod('RemoveActorWrap', [
      userId
    ]);
    console.log("actions RemoveUser response ", JSON.stringify(response))
    return response;
  }

  /**
   * Updates a user
   *
   * @param userId string - user id
   * @param userName string - user name
   * @param userAddress string - user address
   */
  
  async UpdateUser(
    userId: string,
    userName: string,
    userAddress: string,
  ): Promise<any> {
    const response = await this.callMethod('EditActorWrap', [
      userId,
      userName,
      userAddress,
    ]);
    console.log("actions EditActorWrap response ", JSON.stringify(response))
    return response;
  }

  /**
   * Get all users
   */
  
  async GetAllUsers(): Promise<any> {
    const response = await this.evaluateExpression("GetAllActors()")
    console.log("actions GetAllActors response ", JSON.stringify(response))
    return response;
  }

  // teams

  /**
   * Adds a new team
   *
   * @param teamName string - tem name
   */

  async AddTeam(
    teamName: string,
    teamAddress: string,
    teamOwner: string,
  ): Promise<any> {
    const response = await this.callMethod('AddTeamWrap', [
      teamName, teamAddress, teamOwner
    ]);
    console.log("actions AddTeamWrap response ", JSON.stringify(response))
    return response;
  }

   /**
   * Removes a team
   *
   * @param teamAddress string - team id
   */
  
   async RemoveTeam(
    teamAddress: string,
  ): Promise<any> {
    const response = await this.callMethod('RemoveTeamWrap', [
      teamAddress
    ]);
    console.log("actions RemoveTeam response ", JSON.stringify(response))
    return response;
  }

  /**
   * Updates a team
   *
   * @param teamAddress string - team id
   * @param teamName string - team name
   */
  
  async UpdateTeam(
    teamAddress: string,
    teamName: string,
  ): Promise<any> {
    const response = await this.callMethod('EditTeamWrap', [
      teamAddress,
      teamName,
    ]);
    console.log("actions EditTeamWrap response ", JSON.stringify(response))
    return response;
  }

  /**
   * Get all teams
   */
  
  async GetAllTeams(): Promise<any> {
    const response = await this.evaluateExpression("GetAllTeams()")
    console.log("actions GetAllTeams response ", JSON.stringify(response))
    return response;
  }

  /**
   * Add user to a team
   *
   * @param userId string - user id
   * @param teamAddress string - team id
   */
  
  async AddActorToTeamWrap(
    userId: string,
    teamAddress: string,
  ): Promise<any> {
    const response = await this.callMethod('AddActorToTeamWrap', [
      userId,
      teamAddress,
    ]);
    console.log("actions AddActorToTeamaWrap response ", JSON.stringify(response))
    return response;
  }

  /**
   * Add user to a team
   *
   * @param userId string - user id
   * @param teamAddress string - team id
   */
  
  async RemoveActorFromTeamWrap(
    userId: string,
    teamAddress: string,
  ): Promise<any> {
    const response = await this.callMethod('RemoveActorFromTeamWrap', [
      userId,
      teamAddress,
    ]);
    console.log("actions RemoveActorFromTeamWrap response ", JSON.stringify(response))
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
   * Adds a context to a project
   *
   * @param contextId string - context id
   * @param projectId string - project id
   */

  async AddContextToProject(
    contextId: string,
    projectId: string,
  ): Promise<any> {
    const response = await this.callMethod('AddContextToProject', [
      contextId,
      projectId
    ]);
    console.log("actions AddContextToProject response ", JSON.stringify(response))
    return response;
  }

  /**
   * Adds a due date to a project
   *
   * @param projectId string - project id
   * @param date string - date, formatted "YYYY-MM-DD"
   */

  async AssignDueDateToProject(
    projectId: string,
    date: string,
  ): Promise<any> {
    const response = await this.callMethod('SetProjectDueDate', [
      projectId,
      date
    ]);
    console.log("actions SetProjectDueDate response ", JSON.stringify(response))
    return response;
  }

  /**
   * Adds a context to a project task
   *
   * @param contextId string - context id
   * @param projectId string - project id
   * @param projectTaskId string - project task id
   */

  async AddContextToProjectTask(
    contextId: string,
    projectId: string,
    projectTaskId: string,
  ): Promise<any> {
    const response = await this.callMethod('AddContextToProjectTask', [
      contextId,
      projectId,
      projectTaskId
    ]);
    console.log("actions AddContextToProjectTask response ", JSON.stringify(response))
    return response;
  }

  /**
   * Adds a due date to a project task
   *
   * @param projectId string - project id
   * @param projectTaskId string - project task id
   * @param date string - date, formatted "YYYY-MM-DD"
   */

  async AssignDueDateToProjectTask(
    projectId: string,
    projectTaskId: string,
    date: string,
  ): Promise<any> {
    const response = await this.callMethod('SetProjectTaskDueDate', [
      projectId,
      projectTaskId,
      date
    ]);
    console.log("actions SetProjectTaskDueDate response ", JSON.stringify(response))
    return response;
  }

  /**
   * Assigns a task to a team
   *
   * @param teamAddress string - team id
   * @param taskId string - task id
   */

  async AssignTeamToTask(
    teamAddress: string,
    taskId: string,
  ): Promise<any> {
    const response = await this.callMethod('AssignTeamToTaskWrap', [
      teamAddress,
      taskId,
    ]);
    console.log("actions AssignTeamToTaskWrap response ", JSON.stringify(response))
    return response;
  }

  /**
   * Unassigns a team from a task
   *
   * @param teamAddress string - team id
   * @param taskId string - task id
   */

  async UnassignTeamFromTask(
    teamAddress: string,
    taskId: string,
  ): Promise<any> {
    const response = await this.callMethod('UnassignTeamFromTaskWrap', [
      teamAddress,
      taskId,
    ]);
    console.log("actions UnassignTeamFromTaskWrap response ", JSON.stringify(response))
    return response;
  }

  async GetTeamsWithAssignedTasks(): Promise<any> {
    const response = await this.evaluateExpression("GetTeamsWithAssignedTasks()")
    console.log("actions GetTeamsWithAssignedTasks response ", JSON.stringify(response))
    return response;
  }

  /**
   * AssignRewardToTask assign a reward to a specific task id
   * 
   * @param taksId id of the task
   * @param denom the denom of the token: 'GNOT', 'FLIP', 'ZEN'
   * @param amount the amount of the above token, in the backed we're using std.Coins
   */

  async AssignRewardToObject(
    objectId: string,
    objectType: string,
    denom: string,
    amount: string
  ): Promise<any> {
    const response = await this.callMethod('AddRewardsPointsWrap', [
      objectId,
      objectType,
      denom,
      amount
    ]);
    console.log("actions AddRewardsPointsWrap response ", JSON.stringify(response))
    return response;
  }

  /**
   * AssignRewardToTask assign a reward to a specific task id
   * 
   * @param rewardId payment id to be updated
   * @param objectId id of the object
   * @param objectType object type: task / project
   * @param denom the denom of the token: 'GNOT', 'FLIP', 'ZEN'
   * @param amount the amount of the above token, in the backed we're using std.Coins
   */

  async UpdateRewardForObject(
    rewardId: string,
    objectId: string,
    objectType: string,
    denom: string,
    amount: string
  ): Promise<any> {
    console.log("UpdateRewardForObject")
    const response = await this.callMethod('UpdateRewardsPointsWrap', [
      rewardId,
      objectId,
      objectType,
      denom,
      amount
    ]);
    console.log("actions UpdateRewardsPointsWrap response ", JSON.stringify(response))
    return response;
  }

  async GetAllRewards(): Promise<any> {
    const response = await this.evaluateExpression("GetAllRewardsPoints()")
    console.log("actions GetAllRewards response ", JSON.stringify(response))
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
   * Marks a task in a project as done (changes its realm id to 4)
   *
   * @param projectId string - project id
   * @param projectTaskId string - the project task's id
   */
  
  async MarkProjectTaskAsDone(
    projectId: string,
    projectTaskId: string,
  ): Promise<any> {
    const response = await this.callMethod('MarkProjectTaskAsDone', [
      projectId,
      projectTaskId
    ]);
    console.log("actions MarkProjectTaskAsDone response ", JSON.stringify(response))
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

export default ActionsProject;