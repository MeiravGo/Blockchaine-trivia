//import { ethers } from "ethers";
//const ethers = require("ethers");
const express = require("express");
const bodyParser = require("body-parser");
var mongoose = require("mongoose");
var multer = require("multer");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getBestScoresForRoom,
  joinLobby,
} = require("./utils/users");
const {
  startProgressOfQuizInRoom,
    openQuizInRoom,
    checkIfQuizOpenedInRoom,
    checkIfQuizInProgressInRoom,
    adminLeftStopQuiz,
    getAdminId,
    getRoomInProgressById,
    getRoomWinner,
} = require("./utils/rooms");

const formatMessage = require("./utils/messages");
const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.static(`${__dirname}/../client/public`));
// Using body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room, address }) => {
    console.log("address inside index: "+address);
    socket.join(room);
    socket.join(address);
      io.to(room).emit("updateUserId", {
        id: socket.id
      });
    
    const user = userJoin(socket.id, username, room, address);
    console.log("Someone logged to room ! "+user.room);
    
    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(user.username, `${user.username} has joined the chat`)
      );
      
    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  socket.on("joinLobby", ({ username, room }) => {
    const user = joinLobby(socket.id, username, room);
    socket.join("lobby"+room);

  });
  
  socket.on("ansIsCorrect", ({ username, room, score }) => {
    console.log("triggered server -answer is correct")
    let user = getCurrentUser(socket.id)
    user.score = user.score + score
    console.log("user"+ username+ "score updated to-"+user.score);
    });


  socket.on("nextQuestion", ({ currQ, room }) => {
      io.to(room).emit("renderNextQuestionForRoom", {
        room,
        currQ,
      });
    });

    socket.on("startQuizInRoom", ({ username, room }) => {
      console.log("startQuizInRoom() Triggered")
      openQuizInRoom(room,socket.id);
      io.to("lobby"+room).emit('QuizStarted', {
        room: room,
        users: getRoomUsers(room)
      });
    });
    socket.on("CheckIfRoomOpened", ({ username, room }) => {
      console.log("CheckIfRoomOpened() triggered")
      let roomOpened =  checkIfQuizOpenedInRoom(room);
      if(roomOpened){
        console.log("Emiting Quiz started to client")
        io.to("lobby"+room).emit('QuizStarted', {
          room: room,
          users: getRoomUsers(room)
        });
      }
    });
    socket.on("quizInProgress", ({username,  room }) => {
      startProgressOfQuizInRoom(room, socket.id,getRoomUsers(room))
      console.log("Quiz in Progress() triggered +" + getRoomUsers(room)[0].address)
    });
    socket.on('disconnect', function(){
      console.log("Diconnected from user")
      let currUser = getCurrentUser(socket.id)
      if(currUser){
        const adminLeft = adminLeftStopQuiz(currUser.room, socket.id)
        if(adminLeft){
          console.log("Admin left!")
        }
      }
      const user = userLeave(socket.id);
      if (user) {
        // Send users and room info
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
      }
    });
    socket.on("quizEnded", ({room, prize}) => {
      console.log("quiz ended() triggered")
      let winnerObject = getRoomWinner(room)
      io.to(winnerObject.address[0]).emit("roomWinner", {
        winner: winnerObject
      });
      let reward = prize* (getRoomInProgressById(room).users.length - 1) 
      var myquery = { address : winnerObject.address[0] };
      var newvalues = { $inc: {coins: reward} };
      db.collection("AccountBalance").updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
      });
    });

    
    socket.on("bestThreeScores", ({ username, room }) => {
      console.log("Inside server room : ", room)
      let adminId = getAdminId(room)
      console.log("Inside server ADMIN: ", adminId)
      let bestUsers = getBestScoresForRoom(room,adminId)
      io.to(room).emit('BestUsersList', {
        room: room,
        bestUsers: bestUsers
      });
    });
});
const uri =
  "mongodb+srv://testblockchain:123123Kk@cluster0.2asxt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;

db.on("error", () => console.log("Error in Connecting to Database"));
db.once("open", () => console.log("Connected to Database"));

app.get("/quiz", async (req, res) => {
  console.log("quiz id is " + req.query.ID);
  database = db.collection("quizes");
  //q = await database.findOne({ name: "keren" });
  q = await database.findOne({ quizId: req.query.ID });
  res.status(200).json(q);
});

app.post("/posts", (req, res) => {
  let uniqId = Date.now().toString();
  let data = {
    quizId: uniqId,
    pass: req.body.pass,
    amount:req.body.amount,
    questions: [
      { q: "", a1: "", a2: "", a3: "", a4: "" ,c:""},
      { q: "", a1: "", a2: "", a3: "", a4: "" ,c:""},
      { q: "", a1: "", a2: "", a3: "", a4: "" ,c:""},
      { q: "", a1: "", a2: "", a3: "", a4: "" ,c:""},
      { q: "", a1: "", a2: "", a3: "", a4: "" ,c:""},
      { q: "", a1: "", a2: "", a3: "", a4: "" ,c:""},
      { q: "", a1: "", a2: "", a3: "", a4: "" ,c:""},
      { q: "", a1: "", a2: "", a3: "", a4: "" ,c:""},
      { q: "", a1: "", a2: "", a3: "", a4: "" ,c:""},
      { q: "", a1: "", a2: "", a3: "", a4: "" ,c:""},
    ],
  };
//data.body.req.pas = pas
  for (let i = 0; i < 10; i++) {
    data.questions[i].q = req.body.questions[i].q;
    data.questions[i].a1 = req.body.questions[i].a1;
    data.questions[i].a2 = req.body.questions[i].a2;
    data.questions[i].a3 = req.body.questions[i].a3;
    data.questions[i].a4 = req.body.questions[i].a4;
    data.questions[i].c =  req.body.questions[i].c;
  }

  db.collection("quizes").insertOne(data, function (err, collection) {
    if (err) {
      throw err;
    }
    console.log("Record Inserted Successfully");
  });
  res.send(data.quizId);
});
app.get("/getNumOfCoins", async (req, res) => {
  database = db.collection("AccountBalance");
  account = await database.findOne({ address: req.query.address });
  res.status(200).json(account);
});

app.get("/initiateAccountInDB", async (req, res) => {

  let newAccount = {
    address: req.query.address,
    coins: 0
  }
  db.collection("AccountBalance").insertOne(newAccount, function (err, collection) {
    if (err) {
      throw err;
    }
  });

});

app.get("/withdraw", async (req, res) => {
  var myquery = { address : req.query.address };
  var newvalues = { $set: {coins: 0}};
  db.collection("AccountBalance").updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
  });

});
//  const getQuiz = async (quizId)=>
// {
//   return await db.collection("testQUIZ").findOne({_id :quizId});
// }
server.on("error", (err) => {
  console.error("Server error:", err);
});



server.listen(PORT, () => {
  console.log("server started on " + PORT);
});


