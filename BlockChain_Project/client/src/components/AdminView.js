import React, { Component } from "react";
const io = require("socket.io-client");

class AdminView extends Component {
  constructor(props) {
    super(props);
    this.socket = io();
    this.quiz = this.props.dataFromParent.quiz.data;
    //console.log("the quizzzz:"+this.quiz)
    this.state = {
      viewTimerEnded: false,
      waitingLobby: false,
      admin: false,
      currQuestion: -1,
      quizEnded: false,
    };
  }
  render() {
    console.log("quiz" + this.quiz);
    return (
      <>
     
        <div>
          <h3 style={{fontFamily:"Century Gothic"}}>Username:</h3>
          <h4 id="username">{this.props.dataFromParent.userName}</h4>
          <h3 style={{fontFamily:"Century Gothic"}}>Quiz ID:</h3>
          <h4 id="room">{this.props.dataFromParent.room}</h4>
          <ul id="users"></ul>
          <h1 id="timer"></h1>
          {this.state.waitingLobby ? (
            <div>
              <form onSubmit={this.launchQuiz}>
                <button style={{fontFamily:"Century Gothic",fontSize:"14px" , backgroundColor:"linen",borderRadius:"14px", borderColor:"tan",color:"black", padding:"8px"}} type="submit" value="launch quiz" id="submit">Launch quiz</button> 
              </form>
            </div>
          ) : (
            <div>
              <div>
                {Number(this.state.currQuestion) > -1 ? (
                  <div>
                    {this.state.viewTimerEnded
                      ? (
                        this.state.quizEnded ? <div> <h1 style={{fontFamily:"Century Gothic"}}> Quiz Ended </h1></div>
                       :
                      this.renderNewQuestion())
                      : null}
                  </div>
                ) : (
                  <div>{this.startQuiz()}</div>
                )}
              </div>

              {this.state.viewTimerEnded ? <div>
                <h1 style={{fontFamily:"Century Gothic"}}>BEST SCORES:</h1>
                <h2 id="p1"></h2>
                <br></br>
                <h2 id="p2"></h2>
                <br></br>
                <h2 id="p3"></h2>
                </div> : null}
              {/* //<h5> seconds left: </h5> */}
            </div>
          )}
          <div>
            <h3 id="titlaDiv"></h3>
            <br></br>
            <h2 id="q"></h2>
            <br></br>
            <h2 id="a1"></h2>
            <br></br>
            <h2 id="a2"></h2>
            <br></br>
            <h2 id="a3"></h2>
            <br></br>
            <h2 id="a4"></h2>
            <br></br>
          </div>
        </div>
        
      </>
    );
  }

  askToPayAndStartSockets = (event) => {
    // If you are not an admin - First here need to pay coins to participate
    event.preventDefault();
    this.username = document.getElementById("username").innerText;
    this.room = document.getElementById("room").innerText;
    this.roomName = document.getElementById("room-name");
    this.userList = document.getElementById("users");

    let username = this.username;
    let room = this.room;
    let address = "garbageAddress";
    this.socket.emit("joinRoom", { username, room, address });
    this.socket.emit("startQuizInRoom", { username, room });

    this.socket.on("roomUsers", ({ room, users }) => {
      console.log("admin - inside socket on room users")
      //this.outputRoomName(room);
      this.outputUsers(users);
    });
    this.socket.on("BestUsersList", ({ room, bestUsers }) => {
      for (var i=0 ; i<bestUsers.length ; i++) {
        document.getElementById("p"+(i+1)).innerHTML = (i+1) +")"+ bestUsers[i].username + " Score: " + bestUsers[i].score;
      }
    });
    this.socket.on("renderNextQuestionForRoom", ({ room, currQ }) => {
      this.setState({ 
        viewTimerEnded: false,
      })
      let timeForQue = 4;
      let seconds = timeForQue;
      document.getElementById("timer").innerHTML = seconds;
      this.timerIntervalFunc = setInterval(this.timeInterval, 1000);
     

      let q = this.quiz.questions[currQ].q;
      let a1 = this.quiz.questions[currQ].a1;
      let a2 = this.quiz.questions[currQ].a2;
      let a3 = this.quiz.questions[currQ].a3;
      let a4 = this.quiz.questions[currQ].a4;
      document.getElementById("titlaDiv").innerHTML = "Question " + (currQ + 1);
      document.getElementById("q").innerHTML = q;
      document.getElementById("a1").innerHTML = a1;
      document.getElementById("a2").innerHTML = a2;
      document.getElementById("a3").innerHTML = a3;
      document.getElementById("a4").innerHTML = a4;
    });

    this.setState({ waitingLobby: true });
  };

  timeInterval = () => {
    let seconds = parseInt(document.getElementById("timer").innerHTML);
    this.username = document.getElementById("username").innerText;
    this.room = document.getElementById("room").innerText;

    let username = this.username;
    let room = this.room;
    console.log(seconds);
    seconds = seconds - 1;
    document.getElementById("timer").innerHTML = seconds;
    if (seconds < 1) {
      clearInterval(this.timerIntervalFunc);
      this.setState({
        viewTimerEnded: true,
      });
      if(this.state.currQuestion==9){
        this.setState({
          quizEnded: true,
        });
        let prize = this.quiz.amount
        this.socket.emit("quizEnded", {room, prize})

      }
      this.socket.emit("bestThreeScores", { username, room });

    }
    
  };

  launchQuiz = (event) => {
    event.preventDefault();
    this.setState({ waitingLobby: false });
    this.nextQuestion(event);
  };

  renderNewQuestion() {
    return (
      
      <div>
        <form onSubmit={this.nextQuestion}>
          <button style={{fontFamily:"Century Gothic",fontSize:"16px",backgroundColor:"linen", borderRadius:"14px",borderColor:"tan", padding:"15px",color:"black", margin:"13px"}} type="submit" value="nextQuestion" id="nextQuestion" >Next question</button>
        </form>
      </div>
      
    );
  }

  outputRoomName(room) {
    this.roomName.innerText = room;
  }

  outputUsers(users) {
    this.userList.innerHTML = "";
    users.forEach((user) => {
      const li = document.createElement("li");
      li.innerText = user.username;
      this.userList.appendChild(li);
    });
  }

  startQuiz() {
    console.log("start quiz func");
    return (
      <div>
        <h2 id="room-name"></h2>
        <ul id="users"></ul>
        <div>
          <form onSubmit={this.askToPayAndStartSockets}>
            <button style={{fontFamily:"Century Gothic",fontSize:"14px" , backgroundColor:"linen",borderRadius:"14px", borderColor:"tan",color:"black", padding:"8px"}} type="submit" value="Start Quiz" id="startQuiz" >Start Quiz</button>
          </form>
        </div>
      </div>
    );
  }

  nextQuestion = (event) => {
    console.log("nextQuestion func");
    event.preventDefault();
    this.username = document.getElementById("username").innerText;
    this.room = document.getElementById("room").innerText;
    let username = this.username;
    let room = this.room;
    this.socket.emit("quizInProgress", { username, room });
    let currQ = this.state.currQuestion + 1;
    this.socket.emit("nextQuestion", { currQ, room });

    let next = parseInt(this.state.currQuestion) + 1;
    this.setState({ currQuestion: next });
  };
}

export default AdminView;
