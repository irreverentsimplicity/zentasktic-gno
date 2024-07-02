import Actions from "./actions";  
import Config from "../util/config";
import { setCoreAssessTasks, setCoreDecideTasks, setCoreDoTasks, setCoreAssessProjects, setCoreContexts } from "../slices/coreSlice";

export const fetchAllTasksByRealm = async (dispatch, realmId) => {

    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM)
    try {
        actions.GetTasksByRealm(realmId).then((response) => {
        console.log("getTasksByRealm response in Core, for realm: " +  response + " " + realmId);
            if (response !== undefined){
            let parsedResponse = JSON.parse(response);
            
            if(parsedResponse.tasks !== undefined && parsedResponse.tasks.length !== 0){  
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

export const fetchAssessProjects = async (dispatch) => {
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM);
    try {
        actions.GetProjectsByRealm("1").then((response) => {
        console.log("GetProjectsByRealm response in CoreProjects", response);
        if (response !== undefined) {
            let parsedResponse = JSON.parse(response);
            if (parsedResponse.projects !== undefined) {
            console.log("parseResponse", JSON.stringify(response, null, 2));
            parsedResponse.projects.sort((a, b) => parseInt(b.projectId) - parseInt(a.projectId));
            dispatch(setCoreAssessProjects(parsedResponse.projects));
            }
        }
        });
    } catch (err) {
        console.log("error in calling getAllProjects", err);
    }
};

export const fetchAllContexts = async () => {
    const actions = await Actions.getInstance();
    actions.setCoreRealm(Config.GNO_ZENTASKTIC_PROJECT_REALM)
    try {
      actions.GetAllContexts().then((response) => {
        console.log("GetAllContexts response in CoreContexts", response);
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