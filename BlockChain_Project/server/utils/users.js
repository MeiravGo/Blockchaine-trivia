const users = [];
const lobby = [];

function userJoin(id, username, room, address) {
  const score = 0;
  const user = { id, username, room, score, address };
  const index = lobby.findIndex((user) => user.id === id);

  if (index !== -1) {
    lobby.splice(index, 1)[0];
  }
  console.log("adrress inside users: " + address);
  users.push(user);
  return user;
}

function joinLobby(id, username, room) {
  const user = { id, username, room };
  lobby.push(user);

  return lobby;
}

// Get current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const indexUsers = users.findIndex((user) => user.id === id);

  if (indexUsers !== -1) {
    return users.splice(indexUsers, 1)[0];
  }
  const indexLobby = lobby.findIndex((user) => user.id === id);

  if (indexLobby !== -1) {
    return lobby.splice(indexLobby, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

function compare(userA, userB) {
  if (userA.score > userB.score) {
    return -1;
  }
  if (userA.score < userB.score) {
    return 1;
  }
  return 0;
}

function getBestScoresForRoom(room, adminId) {
  let bestUsers = [];
  let allUsers = getRoomUsers(room);
  allUsers.sort(compare);
  let numUsersToDisplay = 3;
  if (allUsers.length - 1 < numUsersToDisplay) {
    numUsersToDisplay = allUsers.length - 1;
  }
  for (var i = 0; i < numUsersToDisplay; i++) {
    if (allUsers[i].id == adminId) {
      numUsersToDisplay++;
    } else {
      bestUsers.push(allUsers[i]);
    }
  }
  console.log("best users"+bestUsers)
  return bestUsers;

  // let max = [-1,-1,-1]
  // for (let i=0 ; i<allUsers.length - 1 ; i++){
  //   if (allUsers[i].score > max[0] && allUsers[i].id != adminId ){
  //     max[2]=max[1]
  //     max[1]=max[0]
  //     bestUsers[2]=bestUsers[1]
  //     bestUsers[1]=bestUsers[0]
  //     max[0] = allUsers[i].score
  //     bestUsers[0] = allUsers[i]
  //     //console.log("max: "+max[0])
  //     //console.log("best user: "+bestUsers[0])
  //   }
  //   else if (allUsers[i].score > max[1] && allUsers[i].id != adminId){
  //     max[2]=max[1]
  //     bestUsers[2]=bestUsers[1]
  //     max[1] = allUsers[i].score
  //     bestUsers[1] = allUsers[i]
  //     //console.log("max: "+max[1])
  //     //console.log("best user: "+bestUsers[1])
  //   }
  //   else if (allUsers[i].score > max[2] && allUsers[i].id != adminId){
  //     max[2] = allUsers[i].score
  //     bestUsers[2] = allUsers[i]
  //     //console.log("max: "+max[2])
  //     //console.log("best user: "+bestUsers[2])
  //   }
  // }
  // console.log("best users"+bestUsers)
  // let bestUsersTemp=[]
  // for(var i=0; i<bestUsers.length; i++){
  //   if (bestUsers[i] != null){
  //     bestUsersTemp.push(bestUsers[i])
  //   }
  // }
  // console.log("best users after"+bestUsers)
  // return bestUsersTemp
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getBestScoresForRoom,
  joinLobby,
  compare,
};
