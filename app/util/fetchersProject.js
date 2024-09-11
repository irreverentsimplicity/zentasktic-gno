import ActionsProject from "./actionsProject";  
import { 
    setProjectAssessTasks, 
    setProjectDecideTasks, 
    setProjectDoTasks, 
    setProjectAssessProjects, 
    setProjectDecideProjects,
    setProjectDoProjects, 
    setProjectContexts,
    setProjectUsers,
    setProjectTeams,
    setProjectTeamsWithAssignedTasks,
    setProjectRewards
 } from "../slices/projectSlice";

export const fetchAllTasksByRealm = async (dispatch, realmId) => {

    const actions = await ActionsProject.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
        actions.GetTasksByRealm(realmId).then((response) => {
        console.log("getTasksByRealm response in Project, for realm: " +  response + " " + realmId);
            if (response !== undefined){
            let parsedResponse = JSON.parse(response);
            
            if(parsedResponse.tasks !== undefined){  
            console.log("parseResponse", JSON.stringify(response, null, 2))
            if (realmId == "1"){
                dispatch(setProjectAssessTasks(parsedResponse.tasks))
            }
            else if (realmId == "2"){
                dispatch(setProjectDecideTasks(parsedResponse.tasks))
            }
            else if (realmId == "3"){
                dispatch(setProjectDoTasks(parsedResponse.tasks))
            }
            }
        }
    });
    } catch (err) {
        console.log("error in calling getAllTasks", err);
    }
};

export const fetchAllProjectsByRealm = async (dispatch, realmId) => {

    const actions = await ActionsProject.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
        actions.GetProjectsByRealm(realmId).then((response) => {
        console.log("GetProjectsByRealm response in Project, for realm: " +  response + " " + realmId);
            if (response !== undefined){
            let parsedResponse = JSON.parse(response);
            
            if(parsedResponse.projects !== undefined){  
            console.log("parseResponse", JSON.stringify(response, null, 2))
            if (realmId == "1"){
                dispatch(setProjectAssessProjects(parsedResponse.projects))
            }
            else if (realmId == "2"){
                dispatch(setProjectDecideProjects(parsedResponse.projects))
            }
            else if (realmId == "3"){
                dispatch(setProjectDoProjects(parsedResponse.projects))
            }
            }
        }
    });
    } catch (err) {
        console.log("error in calling GetProjectsByRealm", err);
    }
};

export const fetchAllUsers = async (dispatch) => {
    const actions = await ActionsProject.getInstance();
    try {
      actions.GetAllUsers().then((response) => {
        console.log("GetAllUsers response in fetchers", response);
          if (response !== undefined){
          let parsedResponse = JSON.parse(response);
          
          if(parsedResponse.actors !== undefined){  
            console.log("parseResponse in fetchAllUsers ", JSON.stringify(response, null, 2))
            dispatch(setProjectUsers(parsedResponse.actors))
          }
        }
      });
    } catch (err) {
      console.log("error in calling getAllTeams", err);
    }
};

export const fetchAllTeams = async (dispatch) => {
    const actions = await ActionsProject.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      actions.GetAllTeams().then((response) => {
        console.log("GetAllTeams response in fetchers", response);
          if (response !== undefined){
          let parsedResponse = JSON.parse(response);
          
          if(parsedResponse.teams !== undefined){  
            console.log("parseResponse", JSON.stringify(response, null, 2))
            dispatch(setProjectTeams(parsedResponse.teams))
          }
        }
      });
    } catch (err) {
      console.log("error in calling getAllTeams", err);
    }
};

export const fetchAllTeamsTasks = async (dispatch) => {
    const actions = await ActionsProject.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      actions.GetTeamsWithAssignedTasks().then((response) => {
        console.log("GetTeamsWithAssignedTasks response in fetchers", response);
          if (response !== undefined){
          let parsedResponse = JSON.parse(response);
          
          if(parsedResponse.teamsTasks != undefined){  
            console.log("parseResponse.teamsTasks", JSON.stringify(parsedResponse.teamsTasks, null, 2))
            dispatch(setProjectTeamsWithAssignedTasks(parsedResponse.teamsTasks))
          }
        }
      });
    } catch (err) {
      console.log("error in calling GetTeamsWithAssignedTasks", err);
    }
};

export const fetchAllRewards = async (dispatch) => {
    const actions = await ActionsProject.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      actions.GetAllRewards().then((response) => {
        console.log("GetAllRewards response in fetchers", response);
          if (response !== undefined){
          let parsedResponse = JSON.parse(response);
          
          if(parsedResponse.rewardsPoints !== undefined){  
            console.log("parseResponse", JSON.stringify(response, null, 2))
            dispatch(setProjectRewards(parsedResponse.rewardsPoints))
          }
        }
      });
    } catch (err) {
      console.log("error in calling getAllRewards", err);
    }
};

export const fetchAllContexts = async (dispatch) => {
    const actions = await ActionsProject.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      actions.GetAllContexts().then((response) => {
        console.log("GetAllContexts response in fetchers", response);
          if (response !== undefined){
          let parsedResponse = JSON.parse(response);
          
          if(parsedResponse.contexts !== undefined){  
            console.log("parseResponse", JSON.stringify(response, null, 2))
            parsedResponse.contexts.sort((a, b) => parseInt(b.contextId) - parseInt(a.contextId));
            dispatch(setProjectContexts(parsedResponse.contexts))
          }
        }
      });
    } catch (err) {
      console.log("error in calling getAllContexts", err);
    }
};