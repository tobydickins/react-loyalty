//BLOCKCHAIN CUSTOMER LOYALTY PROGRAM

import React, { Component } from 'react';
import './App.css';
import web3 from'./web3';
import loyalty from './loyalty';
import logo from './ethereum-logo.png'; 


class App extends Component {

  state = {membersAccount: '',
  manager: '', 
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          partnerName: '',
          numOfPartners: 0,
          partnerAddress: '',
          currentProvider: ''};
    //      balance: '',
    //      transCount: 0};

         
  async componentDidMount() {


    //RETRIEVE THE METAMASK ACCOUNT TO USE FOR 
    //EACH BLOCKCHAIN CONTRACT TRANSACTION
    const accounts = await web3.eth.getAccounts();
    console.log("Account length " + accounts.length);

    web3.eth.getAccounts().then(console.log);
    console.log(web3);
    console.log("hi");
    console.log("Accounts: " + accounts.balance);
    console.log("Contract address: " + loyalty.options.address);
    console.log("Current provider: " + loyalty.currentProvider);



    console.log("Current provider: " + web3.eth.currentProvider);

    const membersAccount = accounts[0];
    const currentProvider = loyalty.currentProvider;
    this.setState({membersAccount, currentProvider});

    const balance = web3.utils.fromWei(await 
      web3.eth.getBalance(membersAccount), 'ether');
    this.setState({balance});

          
    

    console.log(web3.eth.accounts.wallet);
  

  };

  
 
  render() {
    return (

        <div class="detailsbox">
          <img src={logo} alt="Logo"  width="200" height="75"/>
          <h2>Ethereum Blockchain Customer Loyalty Program</h2>
          <p>This web app demonstrates a custom loyalty program on 
          the  peer-to-peer network using the Ethereum Blockchaineated.</p>
        <hr></hr>


        <div class="box"><h2>Members</h2> 
          <p>Customers can enroll as members of the program. Once enrolled they can 
            make transactions to earn and redeem points, and view all their transactions.
          </p>

          <button>Enroll</button>
          <button>Earn</button>
          <button>Redeem</button>
          <button>Transactions</button></div>
        
        <div class="box"><h2>Partners</h2>
          <p>For companies part of the program, they can register as Partner on the network. 
            Once registered they can view all transactions made with them and dashboard to view 
            total points allocated and redeemed by members. </p>

          <button>Register</button> 
          <button>Transactions</button>           
          </div>
        <hr></hr>
        
        <div class="detailsbox"><h1>Loyalty Contract Details</h1>
          <p>The Loyalty Program is running on the public Ethereum Rinkeby peer-to-peer network. The 
  following is information about the smart contract that is the loyalty program. </p>

<b>Loyalty Contract Address:</b> {loyalty.options.address}
<br></br>
<b>Current Customer Account Address:</b> {this.state.membersAccount}
<br></br>
<b>Current Customer Account Name:</b>
<br></br>
<b>Current Provider: </b>
<br></br>
Gas Price: {loyalty.options.gasPrice}
<br></br>
Gas: {loyalty.options.gas}
<br></br>
<b>Current Balance:</b> {this.state.balance} ETH
<br></br>
<b>Number of Transactions:</b> {this.state.transCount}
</div>
</div>


   )
  
  };
    
};


export default App;
