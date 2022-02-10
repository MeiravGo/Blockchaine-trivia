const username = document.getElementById("username").innerText;
const room = document.getElementById("room").innerText;
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const socket = io();

socket.emit("joinRoom", { username, room });

socket.on("message", (message) => {
  console.log(message);
  //outputMessage(message);
});

function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

socket.on("roomUsers", ({ room, users }) => {
  //outputRoomName(room);
  outputUsers(users);
});

function outputMessage(message) {
  //const title = document.createElement("h1");
  //title.innerText = message.username;
  //document.body.appendChild(title);
}
