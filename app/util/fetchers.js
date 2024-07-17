import Actions from "./actions";  
import Config from "../util/config";
import { 
    setCoreAssessTasks, 
    setCoreDecideTasks, 
    setCoreDoTasks, 
    setCoreAssessProjects, 
    setCoreDecideProjects,
    setCoreDoProjects, 
    setCoreContexts } from "../slices/coreSlice";

export const fetchAllTasksByRealm = async (dispatch, realmId) => {

    const actions = await Actions.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
        actions.GetTasksByRealm(realmId).then((response) => {
        console.log("getTasksByRealm response in Core, for realm: " +  response + " " + realmId);
            if (response !== undefined){
            let parsedResponse = JSON.parse(response);
            
            if(parsedResponse.tasks !== undefined){  
            console.log("parseResponse", JSON.stringify(response, null, 2))
            if (realmId == "1"){
                dispatch(setCoreAssessTasks(parsedResponse.tasks))
            }
            else if (realmId == "2"){
                dispatch(setCoreDecideTasks(parsedResponse.tasks))
            }
            else if (realmId == "3"){
                dispatch(setCoreDoTasks(parsedResponse.tasks))
            }
            }
        }
    });
    } catch (err) {
        console.log("error in calling getAllTasks", err);
    }
};

export const fetchAllProjectsByRealm = async (dispatch, realmId) => {

    const actions = await Actions.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
        actions.GetProjectsByRealm(realmId).then((response) => {
        console.log("GetProjectsByRealm response in Core, for realm: " +  response + " " + realmId);
            if (response !== undefined){
            let parsedResponse = JSON.parse(response);
            
            if(parsedResponse.projects !== undefined){  
            console.log("parseResponse", JSON.stringify(response, null, 2))
            if (realmId == "1"){
                dispatch(setCoreAssessProjects(parsedResponse.projects))
            }
            else if (realmId == "2"){
                dispatch(setCoreDecideProjects(parsedResponse.projects))
            }
            else if (realmId == "3"){
                dispatch(setCoreDoProjects(parsedResponse.projects))
            }
            }
        }
    });
    } catch (err) {
        console.log("error in calling GetProjectsByRealm", err);
    }
};

export const fetchAllContexts = async (dispatch) => {
    const actions = await Actions.getInstance();
    //actions.setCoreRealm(Config.GNO_ZENTASKTIC_CORE_REALM);
    try {
      actions.GetAllContexts().then((response) => {
        console.log("GetAllContexts response in fetchers", response);
          if (response !== undefined){
          let parsedResponse = JSON.parse(response);
          
          if(parsedResponse.contexts !== undefined){  
            console.log("parseResponse", JSON.stringify(response, null, 2))
            parsedResponse.contexts.sort((a, b) => parseInt(b.contextId) - parseInt(a.contextId));
            dispatch(setCoreContexts(parsedResponse.contexts))
          }
        }
      });
    } catch (err) {
      console.log("error in calling getAllContexts", err);
    }
};