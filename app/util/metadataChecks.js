export const taskAssignedTo = (taskId, teams, teamsWithAssignedTasks) => {
    // Initialize an empty array to store the team names or IDs
    const assignedTeams = [];
    if(teamsWithAssignedTasks !== undefined){
        console.log("teamsWithAssignedTasks in taskAssignedTo ", JSON.stringify(teamsWithAssignedTasks));

        // Iterate over each team's tasks
        teamsWithAssignedTasks.forEach(teamTaskObject => {
            console.log("teamTaskObject ", JSON.stringify(teamTaskObject));

            // Check if the task is assigned to the current team
            const isTaskAssigned = teamTaskObject.tasks.some(task => task.taskId === taskId);

            if (isTaskAssigned) {
            const teamId = teamTaskObject.teamId
            const teamName = (teams, teamId) => teams.find(team => team.teamId === teamId)?.teamName || '';
            assignedTeams.push(teamName(teams, teamTaskObject.teamId)); 
            }
        });

        console.log("assignedTeams in taskAssignedTo ", assignedTeams);

        // Return the joined team names or IDs as a string, or an empty string if none are found
        return assignedTeams.length > 0 ? assignedTeams.join(', ') : '';
    }
}

export const isTaskAssignedToTeam = (teamId, taskId, teamsWithAssignedTasks) => {
    if(teamsWithAssignedTasks !== undefined){
        // Find the team with the matching teamId
        const team = teamsWithAssignedTasks.find(team => team.teamId === teamId);

        if (team) {
            // Check if the task with the matching taskId exists in the team's tasks array
            return team.tasks.some(task => task.taskId === taskId);
        }

        // If the team is not found or the task is not found in the team's tasks, return false
        return false;
        }
    }

export const isRewarded = (task, rewardsByTaskId) => {
// Find the rewards associated with the given task
if(rewardsByTaskId !== null && rewardsByTaskId !== undefined){
const taskRewards = rewardsByTaskId.find(reward => reward.taskId === task.taskId);

// If no rewards are found, return an empty string
if (!taskRewards || !taskRewards.rewards || Object.keys(taskRewards.rewards).length === 0) {
    return '';
}

// Construct a string that summarizes the rewards
const rewardSummary = Object.keys(taskRewards.rewards)
    .map(denom => {
        const { amount } = taskRewards.rewards[denom];
        return `${amount} ${denom}`;
    })
    .join(', ');

return rewardSummary;
}

};