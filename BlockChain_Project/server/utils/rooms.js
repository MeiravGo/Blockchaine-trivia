const roomsOpened = [];
const roomsInProgress = [];

function openQuizInRoom(roomNum, admin){
    let users = [];
    let room = { roomNum , admin}
    roomsOpened.push(room)
}

function addUsersToQuiz(room, users){
    let roomFound = roomsInProgress.find(({roomNum, admin, users}) => roomNum === room)
    if (roomFound != null ){
        roomFound.users = users
    } 

}

function getRoomInProgressById(room){
    return roomsInProgress.find(({roomNum, admin, users}) => roomNum === room)
}

function getRoomWinner(room){
    let roomFound = roomsInProgress.find(({roomNum, admin, users}) => roomNum === room)
    let max = -1;
    let winner = " ";
    for(var i = 0; i < roomFound.users.length ; i++){
        if (roomFound.users[i].score > max){
            winner = roomFound.users[i]
            max = roomFound.users[i].score
        }
    }
    console.log("winner is "+winner.username+"id: "+winner.id)
    return winner
}

function checkIfQuizOpenedInRoom(room){
    
    if(roomsOpened.find(({roomNum, admin}) => roomNum === room)!= null){
        console.log("trying to enter")
        return true
    }
    console.log("quiz is not open!")
    return false
}
function startProgressOfQuizInRoom(roomNum, admin, users){
    let room = { roomNum , admin, users}
    // Add room to "In progress" rooms array
    roomsInProgress.push(room)
    for(let i = 0; i < room.users.length; i++){
        console.log("room users: " + room.users[i].address)

    }
    // Delete room from "Opened" rooms array
    for( var i = 0 ; i < roomsOpened.length ; i++){
        if( roomsOpened[i].roomNum == roomNum){
            roomsOpened.splice(i,1)
        }
    }
}

function checkIfQuizInProgressInRoom(room){
    if(roomsInProgress.find(({roomNum, admin, users}) => roomNum === room)!= null){
        return true
    }
    return false
}
function getAdminId (roomNum){
    if(checkIfQuizOpenedInRoom(roomNum)){
        for( var i = 0 ; i < roomsOpened.length ; i++){
            if( roomsOpened[i].roomNum == roomNum){
                return roomsOpened[i].admin
            }
        }
    }
    else if(checkIfQuizInProgressInRoom(roomNum)){
        for( var i = 0 ; i < roomsInProgress.length ; i++){
            if(roomsInProgress[i].roomNum == roomNum){
                return roomsInProgress[i].admin
            }
        }
    }
}
function adminLeftStopQuiz(roomNum, admin){
    if(checkIfQuizOpenedInRoom(roomNum)){
        for( var i = 0 ; i < roomsOpened.length ; i++){
            if( roomsOpened[i].admin == admin){
                roomsOpened.splice(i,1)
                return true // Admin left - stop quiz!
            }
        }
    }
    if(checkIfQuizInProgressInRoom(roomNum)){
        for( var i = 0 ; i < roomsInProgress.length ; i++){
            if(roomsInProgress[i].admin == admin){
                roomsInProgress.splice(i,1)
                return true // Admin left - stop quiz!
            }
        }
    }
    return false
}

module.exports = {
    startProgressOfQuizInRoom,
    openQuizInRoom,
    checkIfQuizOpenedInRoom,
    checkIfQuizInProgressInRoom,
    adminLeftStopQuiz,
    getAdminId,
    getRoomWinner,
    getRoomInProgressById,
    
};