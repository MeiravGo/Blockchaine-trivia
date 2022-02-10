import React, { Component } from 'react'
import axios from 'axios'


class PostForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            quizID: undefined
        }
    }

    submitHandler = (event) => {
        event.preventDefault()

        let quiz = {
            pass: document.getElementById("password").value,
            amount: document.getElementById("amount").value,
            questions: [{ q: "", a1: "", a2: "", a3: "", a4: "", c:"" }, { q: "", a1: "", a2: "", a3: "", a4: "",c:"" }, { q: "", a1: "", a2: "", a3: "", a4: "",c:"" }, { q: "", a1: "", a2: "", a3: "", a4: "",c:"" }, { q: "", a1: "", a2: "", a3: "", a4: "",c:"" },
            { q: "", a1: "", a2: "", a3: "", a4: "",c:"" }, { q: "", a1: "", a2: "", a3: "", a4: "",c:"" }, { q: "", a1: "", a2: "", a3: "", a4: "",c:"" }, { q: "", a1: "", a2: "", a3: "", a4: "",c:"" }, { q: "", a1: "", a2: "", a3: "", a4: "",c:"" }]


        }
        
        for (let i = 0; i < 10; i++) {

            quiz.questions[i].q = document.getElementById("q"+ (i+1)).value
            quiz.questions[i].a1 = document.getElementById("a"+ (i+1)+"1").value
            quiz.questions[i].a2 = document.getElementById("a"+ (i+1)+"2").value
            quiz.questions[i].a3 = document.getElementById("a"+ (i+1)+"3").value
            quiz.questions[i].a4 = document.getElementById("a"+ (i+1)+"4").value
            for (let j=0 ; j<4 ; j++){
                if (document.getElementById("q"+(i+1)+"a"+(j+1)).checked){
                    quiz.questions[i].c = "a"+(j+1)
                    break
                }
            }
        }
        axios
            .post("http://localhost:3000/posts", quiz,
                {
                    header: {
                        'Content-Type': 'application/json'
                    }
                }

            )
            .then(response => {
                console.log("Response is: " + response.data)
                this.setState({ quizID: response.data });
            })
            .catch(error => {
                console.log(error)
            })
    }
    render() {

        return (
           
            <div>
                {this.state.quizID ? <h4>{this.state.quizID}</h4> :
                    <div >
                        <form onSubmit={this.submitHandler} >
                            <h2 style={{ fontFamily:"Century Gothic"}}>Yay! Lets build a new quiz</h2>
                            <p id="para" style={{fontFamily:"Century Gothic", fontWeight:"bold"}}>please enter the amount needed for entering this quiz</p>
                            <input type="number" class="box" id="amount" name="amount" placeholder="amount" ></input>
                            <p id="para" style={{fontFamily:"Century Gothic", fontWeight:"bold"}}>please enter the password to log as admin to this quiz</p>
                            <input type="text" class="box" id="password" name="password" placeholder="password" ></input>
                            <p id="para" style={{fontFamily:"Century Gothic", fontWeight:"bold"}}>Now lets start filling in the questions! </p>
                            <p id="para" style={{fontFamily:"Century Gothic", fontWeight:"bold"}}>For each question insert 4 possible answers and mark the right one</p>
                            <h3 style={{fontFamily:"Century Gothic"}}>Question 1:</h3>
                            <input type="text" class="box" id="q1" name="q1" placeholder="Question" ></input>
                            <br></br>
                            <input type="radio" id="q1a1" class="radioClasss" name="reason1" value="" checked /><input type="text" class="qbox" id="a11" name="a11" placeholder="possible answer 1" required /><br></br>
                            <input input type="radio" id="q1a2" class="radioClasss" name="reason1" value="" /><input type="text" class="qbox" id="a12" name="a12" placeholder="possible answer 2" required /><br></br>
                            <input input type="radio" id="q1a3" class="radioClasss" name="reason1" value="" /><input type="text" class="qbox" id="a13" name="a13" placeholder="possible answer 3" required /><br></br>
                            <input input type="radio" id="q1a4" class="radioClasss" name="reason1" value="" /><input type="text" class="qbox" id="a14" name="a14" placeholder="possible answer 4" required /><br></br>
                            <br></br>
                            <h3 style={{fontFamily:"Century Gothic"}}>Question 2:</h3>
                            <input type="text" class="box" id="q2" name="q2" placeholder="Question" />
                            <br></br>
                            <input input type="radio" id="q2a1" class="radioClasss" name="reason2" value="" checked/><input type="text" class="qbox" id="a21" name="a21" placeholder="possible answer 1" /><br></br>
                            <input input type="radio" id="q2a2" class="radioClasss" name="reason2" value="" /><input type="text" class="qbox" id="a22" name="a22" placeholder="possible answer 2" /><br></br>
                            <input input type="radio" id="q2a3" class="radioClasss" name="reason2" value="" /><input type="text" class="qbox" id="a23" name="a23" placeholder="possible answer 3" /><br></br>
                            <input input type="radio" id="q2a4" class="radioClasss" name="reason2" value="" /><input type="text" class="qbox" id="a24" name="a24" placeholder="possible answer 4" /><br></br>

                            <h3 style={{fontFamily:"Century Gothic"}}>Question 3:</h3>
                            <input type="text" class="box" id="q3" name="q3" placeholder="Question" />
                            <br></br>
                            <input input type="radio" id="q3a1" class="radioClasss" name="reason3" value="" checked/><input type="text" class="qbox" id="a31" name="a31" placeholder="possible answer 1" /><br></br>
                            <input input type="radio" id="q3a2" class="radioClasss" name="reason3" value="" /><input type="text" class="qbox" id="a32" name="a32" placeholder="possible answer 2" /><br></br>
                            <input input type="radio" id="q3a3" class="radioClasss" name="reason3" value="" /><input type="text" class="qbox" id="a33" name="a33" placeholder="possible answer 3" /><br></br>
                            <input input type="radio" id="q3a4" class="radioClasss" name="reason3" value="" /><input type="text" class="qbox" id="a34" name="a34" placeholder="possible answer 4" /><br></br>

                            <h3 style={{fontFamily:"Century Gothic"}}>Question 4:</h3>
                            <input type="text" class="box" id="q4" name="q4" placeholder="Question" />
                            <br></br>
                            <input input type="radio" id="q4a1" class="radioClasss" name="reason4" value="" checked/><input type="text" class="qbox" id="a41" name="a41" placeholder="possible answer 1" /><br></br>
                            <input input type="radio" id="q4a2" class="radioClasss" name="reason4" value="" /><input type="text" class="qbox" id="a42" name="a42" placeholder="possible answer 2" /><br></br>
                            <input input type="radio" id="q4a3" class="radioClasss" name="reason4" value="" /><input type="text" class="qbox" id="a43" name="a43" placeholder="possible answer 3" /><br></br>
                            <input input type="radio" id="q4a4" class="radioClasss" name="reason4" value="" /><input type="text" class="qbox" id="a44" name="a44" placeholder="possible answer 4" /><br></br>

                            <h3 style={{fontFamily:"Century Gothic"}}>Question 5:</h3>
                            <input type="text" class="box" id="q5" name="q5" placeholder="Question" />
                            <br></br>
                            <input input type="radio" id="q5a1" class="radioClasss" name="reason5" value="" checked/><input type="text" class="qbox" id="a51" name="a51" placeholder="possible answer 1" /><br></br>
                            <input input type="radio" id="q5a2" class="radioClasss" name="reason5" value="" /><input type="text" class="qbox" id="a52" name="a52" placeholder="possible answer 2" /><br></br>
                            <input input type="radio" id="q5a3" class="radioClasss" name="reason5" value="" /><input type="text" class="qbox" id="a53" name="a53" placeholder="possible answer 3" /><br></br>
                            <input input type="radio" id="q5a4" class="radioClasss" name="reason5" value="" /><input type="text" class="qbox" id="a54" name="a54" placeholder="possible answer 4" /><br></br>


                            <h3 style={{fontFamily:"Century Gothic"}}>Question 6:</h3>
                            <input type="text" class="box" id="q6" name="q6" placeholder="Question" />
                            <br></br>
                            <input input type="radio" id="q6a1" class="radioClasss" name="reason6" value="" checked/><input type="text" class="qbox" id="a61" name="a61" placeholder="possible answer 1" /><br></br>                
                            <input input type="radio" id="q6a2" class="radioClasss" name="reason6" value="" /><input type="text" class="qbox" id="a62" name="a62" placeholder="possible answer 2" /><br></br>
                            <input input type="radio" id="q6a3" class="radioClasss" name="reason6" value="" /><input type="text" class="qbox" id="a63" name="a63" placeholder="possible answer 3" /><br></br>
                            <input input type="radio" id="q6a4" class="radioClasss" name="reason6" value="" /><input type="text" class="qbox" id="a64" name="a64" placeholder="possible answer 4" /><br></br>

                            <h3 style={{fontFamily:"Century Gothic"}}>Question 7:</h3>
                            <input type="text" class="box" id="q7" name="q7" placeholder="Question" />
                            <br></br>
                            <input input type="radio" id="q7a1" class="radioClasss" name="reason7" value="" checked/><input type="text" class="qbox" id="a71" name="a71" placeholder="possible answer 1" /><br></br>
                            <input input type="radio" id="q7a2" class="radioClasss" name="reason7" value="" /><input type="text" class="qbox" id="a72" name="a72" placeholder="possible answer 2" /><br></br>
                            <input input type="radio" id="q7a3" class="radioClasss" name="reason7" value="" /><input type="text" class="qbox" id="a73" name="a73" placeholder="possible answer 3" /><br></br>
                            <input input type="radio" id="q7a4" class="radioClasss" name="reason7" value="" /><input type="text" class="qbox" id="a74" name="a74" placeholder="possible answer 4" /><br></br>

                            <h3 style={{fontFamily:"Century Gothic"}}>Question 8:</h3>
                            <input type="text" class="box" id="q8" name="q8" placeholder="Question" />
                            <br></br>
                            <input input type="radio" id="q8a1" class="radioClasss" name="reason8" value="" checked/><input type="text" class="qbox" id="a81" name="a81" placeholder="possible answer 1" /><br></br>
                            <input input type="radio" id="q8a2" class="radioClasss" name="reason8" value="" /><input type="text" class="qbox" id="a82" name="a82" placeholder="possible answer 2" /><br></br>
                            <input input type="radio" id="q8a3" class="radioClasss" name="reason8" value="" /><input type="text" class="qbox" id="a83" name="a83" placeholder="possible answer 3" /><br></br>
                            <input input type="radio" id="q8a4" class="radioClasss" name="reason8" value="" /><input type="text" class="qbox" id="a84" name="a84" placeholder="possible answer 4" /><br></br>

                            <h3 style={{fontFamily:"Century Gothic"}}>Question 9:</h3>
                            <input type="text" class="box" id="q9" name="q9" placeholder="Question" />
                            <br></br>
                            <input input type="radio" id="q9a1" class="radioClasss" name="reason9" value="" checked/><input type="text" class="qbox" id="a91" name="a91" placeholder="possible answer 1" /><br></br>
                            <input input type="radio" id="q9a2" class="radioClasss" name="reason9" value="" /><input type="text" class="qbox" id="a92" name="a92" placeholder="possible answer 2" /><br></br>
                            <input input type="radio" id="q9a3" class="radioClasss" name="reason9" value="" /><input type="text" class="qbox" id="a93" name="a93" placeholder="possible answer 3" /><br></br>
                            <input input type="radio" id="q9a4" class="radioClasss" name="reason9" value="" /><input type="text" class="qbox" id="a94" name="a94" placeholder="possible answer 4" /><br></br>

                            <h3 style={{fontFamily:"Century Gothic"}}>Question 10:</h3>
                            <input type="text" class="box" id="q10" name="q10" placeholder="Question" />
                            <br></br>
                            <input input type="radio" id="q10a1" class="radioClasss" name="reason10" value="" checked/><input type="text" class="qbox" id="a101" name="a101" placeholder="possible answer 1" /><br></br>
                            <input input type="radio" id="q10a2" class="radioClasss" name="reason10" value="" /><input type="text" class="qbox" id="a102" name="a102" placeholder="possible answer 2" /><br></br>
                            <input input type="radio" id="q10a3" class="radioClasss" name="reason10" value="" /><input type="text" class="qbox" id="a103" name="a103" placeholder="possible answer 3" /><br></br>
                            <input input type="radio" id="q10a4" class="radioClasss" name="reason10" value="" /><input type="text" class="qbox" id="a104" name="a104" placeholder="possible answer 4" /><br></br>

                            <br></br>
                            <button type="submit" value="Submit" id="submit" style={{fontFamily:"Century Gothic", fontWeight:"bold",fontSize:"14px",color:"black",backgroundColor:"linen", borderRadius:"14px",borderColor:"tan", padding:"13px", margin:"13px"}} > Submit </button>
                            <br></br>
                            <br></br>
                        </form>
                    </div>
                }
             </div>
             

        )
    }
}

export default PostForm