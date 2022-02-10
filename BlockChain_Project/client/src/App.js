import React, { Component } from "react";
import "./App.css";
import { ethers } from "ethers";
import PostForm from "./components/PostForm";
import Quiz from "./components/Quiz";
import axios from "axios";
import simple_token_abi from './components/Contracts/simple_token_abi.json'

const {
  Bank_Address,
  Private_Key_Bank,
  Contract_Address
} = require("./components/Contracts/Contract_Data");
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      createQuiz: undefined,
      enterQuiz: undefined,
      account: '0x0',
      coins: "-"
    };
  }

  showNumOfCoins = async (event) => {

    let res = await axios.get("/getNumOfCoins", {
      params: {
        address: this.state.account,
      },
    });
    if (res.data == null) {
      this.setState({ coins: 0 })
      let newAccount = await axios.get("/initiateAccountInDB", {
        params: {
          address: this.state.account,
        },
      });
    } else {
      this.setState({ coins: res.data.coins })
    }

  }

  loadBlockchainData = (event) => {
    event.preventDefault()
    if (window.ethereum) {
      console.log(window.ethereum)
      window.ethereum.request({ method: 'eth_requestAccounts' }).then(addressResult => {
        this.setState({ account: addressResult[0] })
        this.showNumOfCoins(event)
      })

    }
  }

  send_token(
    contract_address,
    send_token_amount,
    to_address,
    send_account,
    private_key,
    gas_limit,
  ) {
    let wallet = new ethers.Wallet(private_key)
    let walletSigner = wallet.connect(window.ethersProvider)

    window.ethersProvider.getGasPrice().then((currentGasPrice) => {
      let gas_price = ethers.utils.hexlify(parseInt(currentGasPrice))

      if (contract_address) {
        // general token send
        let contract = new ethers.Contract(
          contract_address,
          simple_token_abi,
          walletSigner
        )

        // How many tokens?
        let numberOfTokens = ethers.utils.parseUnits(send_token_amount, 18)
        // Send tokens
        contract.transfer(to_address, numberOfTokens).then((transferResult) => {
          console.dir(transferResult)
          alert(send_token_amount + " KMC coins sent to address : " + this.state.account)
        })
      }
    })
  }

  withdrawRewards = async (event) => {
    event.preventDefault()
    if (this.state.account == '0x0') {
      alert("Please connect your MetaMask wallet.")
    }
    else if (this.state.coins == 0 || this.state.coins == "-") {
      alert("Sorry, you have nothing to withdraw. Maybe try to earn some by playing a quiz? :)")
    } else {
      this.setState({ coins: 0 })
      document.getElementById("withdraw").disabled = true
      let send_token_amount = this.state.coins.toString()
      let to_address = this.state.account
      let gas_limit = "0x100000"
      let wallet = new ethers.Wallet(Private_Key_Bank)
      let walletSigner = wallet.connect(window.ethersProvider)
      window.ethersProvider = new ethers.providers.InfuraProvider("ropsten")

      this.send_token(
        Contract_Address,
        send_token_amount,
        to_address,
        Bank_Address,
        Private_Key_Bank,
        gas_limit,
      )
      // Update in db
      let res = await axios.get("/withdraw", {
        params: {
          address: this.state.account,
          coins: this.state.coins
        },
      });


    }
  }

  render() {
    return (
      <div className="App">
        <nav className="topnav">
          <a>
            &nbsp; BlockChain Trivia
          </a>
            <b className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-muted"><span id="account">{this.state.account}</span></small>
            </b>
            <b>Rewards : {this.state.coins} KMC</b>
            <a>
            <form onSubmit={this.loadBlockchainData}>
              <input  type="submit" value="Connect Wallet" />
            </form>
            </a>
            <a>
            <form onSubmit={this.withdrawRewards}>
              <input type="submit" id="withdraw" value="Withdraw Rewards" />
            </form>
            </a>
        </nav>
        <div id="floattingBox">
         
        {this.state.createQuiz || this.state.enterQuiz ? (
          this.state.createQuiz ? (
            <div>
              <PostForm />
            </div>
          ) : (
            <Quiz />
          )
        ) : (
          <div>
            <br></br><br></br><br></br>
            <h1 style={{fontFamily:"Century Gothic"}}> Welcome to the Blockchaine Trivia game! </h1>
            <h2 style={{fontFamily:"Century Gothic"}}> Please select one of the options below </h2>
            <button onClick={() => this.enterExistingQuiz()} style={{fontFamily:"Century Gothic",fontSize:"16px",backgroundColor:"linen", borderRadius:"14px",borderColor:"tan", padding:"15px", margin:"13px"}}>Enter Quiz</button>
            <button onClick={() => this.createNewQuiz()} style={{fontFamily:"Century Gothic",fontSize:"16px" , backgroundColor:"linen",borderRadius:"14px", borderColor:"tan", padding:"15px", margin:"13px"}}>Create Quiz</button>
            <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
          </div>
        )}

        {/* <PostList /> */}
        <h3 style={{fontFamily:"Century Gothic"}}>By Karen Rachev & Meirav Goihman</h3>
      </div>
      </div>
    );
  }
  enterExistingQuiz() {
    console.log("Click happened enterExistingQuiz");
    //event.preventDefault();
    if(this.state.account == "0x0"){
      alert("Please connect your MetaMask wallet!")
    }
    else{
      this.setState({ enterQuiz: true });
    }
    
  }

  createNewQuiz() {
    console.log("Click happened createNewQuiz");
    //event.preventDefault();
    this.setState({ createQuiz: true });
  }
}
//<button onclick={this.setState({createQuiz : true})}>Create Quiz</button>
//<button onclick={this.setState({enterQuiz : true})}>Enter Quiz</button>
//<button onclick={(e) => this.enterExistingQuiz(e)}>Enter Quiz</button>
//<button onclick={(e) => this.createNewQuiz(e)}>Create Quiz</button>
export default App;
