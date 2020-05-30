//BLOCKCHAIN CUSTOMER LOYALTY PROGRAM

import React, { Component } from 'react';
import './App.css';
import web3 from'./web3';
import loyalty from './loyalty';
import logo from './images/ethereum-mm.png'; 
import marriott from './images/marriott.png';
import aa from './images/aa.png';
import starbucks from './images/starbucks.png';
import fairfield from './images/fairfield.png';
import delta from './images/delta.png';
import bistro from './images/bistro.jpg';



class App extends Component {

          constructor(props) {
            super(props);
            this.state = {
              membersAccount: '',
              user: '', 
              firstName: '',
              lastName: '',
              memPoints: 0,
              phone: '',
              email: '',
              partnerName: '',
              numOfPartners: 0,
              partnerAddress: '',
              currentProvider: '',
              balance: '',
              transCount: '',
              partnerAccount: '',
              numOfMembers: 0,
              earnPoints: 0,
              redeemPoints: 0

            };
            this.state = { //state is by default an object
              transList: [
                 { ID: 0, MemberAddress: '', Partner_Address: '', 
                 Type: '', Points: '' },
              ],
              partnerList: [{Partner_Name: ''}],


              partnerList: [
                   { ID: 0, Partner_Address: '', Partner_Name: '', is_Registered: '' },
                ]

           }

 //          this.myEarnButton = this.myEarnButton.bind(this);
           

          }



          myChangeHandler = (event) => {
            let nam = event.target.name;
            let val = event.target.value;

            console.log("nam = " + nam);
            console.log("val = " + val);


            this.setState({[nam]: val});
          };

  async componentDidMount() {

    try {
      this.setState({ message: 'Waiting on get transaction success...' });

      var trans = ["Earned", "Redeemed", "Transferred"];
      var MemberLevel = ["Basic", "Silver", "Gold", "Elite"];
      var MemberStatus = ["Active", "InActive"];

    //RETRIEVE THE METAMASK ACCOUNT TO USE FOR 
    //EACH BLOCKCHAIN CONTRACT TRANSACTION
    const accounts = await web3.eth.getAccounts();
    
    console.log("Account length " + accounts.length);

    //GET THE CURRENT USER
    const user = await loyalty.methods.getManager().call({
      from: accounts[0]});
    this.setState({user});
    console.log("User " + accounts[0]);

    //GET NUMBER OF PARTNERS
    const numOfPartners = await loyalty.methods.getPartnersInfoLength().call({
      from: accounts[0]});
    this.setState({numOfPartners});





    //GET NUMBER OF PARTNERS
    const numberOfPartners = await loyalty.methods.getPartnersInfoLength().call({
      from: accounts[0]});

      for (var i = 0; i < numberOfPartners; i++) {

        const result = await loyalty.methods.getPartnerAt(i).call({
          from: accounts[0]});
        const {0: partnerName, 1: partnerAddress} = result;
    
        this.setState({partnerName, partnerAddress});
  
          // make a copy of the array since you can't mutate state
        let copyValues = this.state.partnerList.slice();
        // make the changes to the copied array
        copyValues[i] = { ID: i, Partner_Address: partnerAddress, 
                   Partner_Name: partnerName}
  
        // set state
        this.setState({partnerList: copyValues})

    }






    //LOGGING
    web3.eth.getAccounts().then(console.log);
    console.log(web3);
    console.log("Accounts: " + accounts.balance);
    console.log("Contract address: " + loyalty.options.address);
    console.log("Current provider: " + loyalty.currentProvider);

    const membersAccount = accounts[0];
    const currentProvider = loyalty.currentProvider;

    this.setState({membersAccount, currentProvider});

    //GET BALANCE
    const balance = web3.utils.fromWei(await 
      web3.eth.getBalance(membersAccount), 'ether');
    this.setState({balance});
    
     //READ CURRENT ACCOUNT DETAILS  
    const result = await loyalty.methods.members(accounts[0]).call({
      from: accounts[0]});
    const {0: memberAddress, 1: firstName, 2: lastName, 3: phone, 4:email, 
      5: memPoints, 6: level, 7: status, 8: isRegistered} = result;




    //THIS DOESN'T WORK
    const numOfMembers = loyalty.methods.members.Length;
    this.setState({numOfMembers})

    console.log("members = " + loyalty.methods.members.length);

    const tmpLevel = MemberLevel[level];
    //this.setState({tmpLevel});
    const tmpStatus = MemberStatus[status];
    //this.setState({tmpStatus});


    this.setState({memberAddress, firstName, lastName, phone, email, 
    memPoints, tmpLevel, tmpStatus, isRegistered});

    console.log("Points are: " + memPoints);

    //GET PARTNER ADDRESS AND NAMES
    const presult = await loyalty.methods.getPartnerAt(0).call({
      from: accounts[0]});
    const {0: partnerName, 1: partnerAddress} = presult;

    this.setState({partnerAddress, partnerName});
    console.log("Partner Address: " + this.state.partnerAddress);
    console.log("Partner #: " + this.state.numOfPartners);

    //GET TRANSACTIONS
    const transLength = await loyalty.methods.getTransactionsInfoLength().call({
      from: accounts[0]});
    this.setState({transLength});
    
  
    //GET TRANSACTIONS
    for (var i = 0; i < transLength; i++) {

      console.log("length = " + transLength);

      //GET TRANSACTIONS AT ADDRESS
      const result = await loyalty.methods.transactionsInfo(i).call({
      from: accounts[0]});
      const {0: points, 1: transactionType, 2: memberAddress, 3: partnerAddress} = result;
    
      const temp = trans[transactionType];

      this.setState({temp});
      this.setState({points, memberAddress, partnerAddress});

      if (memberAddress == this.state.user) {

        // make a copy of the array since you can't mutate state
        let copyValues = this.state.transList.slice();
        // make the changes to the copied array
        copyValues[i] = { Id: i, Member_Address: memberAddress, 
          Partner_Address: partnerAddress, Type: temp, Points: points}

        // set state
        this.setState({transList: copyValues})
      }

      this.setState({ message: "Loaded successful"});
    };
  } catch (err) {
    
    console.log("get name error");
    this.setState({ message: err.message });
    }
  }

  //ENROLL SUBMUT
  onEnrollSubmit = async event => {
    event.preventDefault();

    try {
    this.setState({ message: 'Waiting on transaction success...' });
    //alert("You are submitting " + this.state.firstName);

    const accounts = await web3.eth.getAccounts();
    const { firstName, lastName, phone, email } = this.state;
  
    console.log("Firstname: " + this.state.firstName);
  
    await loyalty.methods.enrollMember(firstName, lastName, phone,  email).send({
      from: accounts[0]
    });
  
    this.setState({ message: 'Congratulations, you have been enrolled!' });

    }
    catch (err) {
      this.setState({ message: 'There was an error: ' + err.message});
    }
  };

  //PARTNER SUBMIT  
  onPartnerSubmit = async event => {
    event.preventDefault();

    try {
    this.setState({ message: 'Waiting on transaction success...' });
    //alert("You are submitting " + this.state.firstName);
  
    const accounts = await web3.eth.getAccounts();
  
    const { partnerName } = this.state;
    
    console.log("Partner Name: " + this.state.partnerName);
    

      await loyalty.methods.registerPartner(partnerName).send({
          from: accounts[0]
        });
    
      this.setState({ message: 'Congratulations, you have been registered!' });
  
    }
    catch (err) {
        this.setState({ message: 'There was an error: ' + err.message});
    }
  };

 
  //EARN SUBMIT
  onEarnSubmit = async event => {
    event.preventDefault();

    console.log("On EARN SUBMIT CLICKED");

    try {
      this.setState({ message: 'Waiting on transaction success...' });

    const accounts = await web3.eth.getAccounts();
    
    const { earnPoints } = this.state;
     
    this.setState({ message: 'Waiting on transaction success...' });
        
    //GET PARTNER ADDRESS
    const result = await loyalty.methods.getPartnerAt(0).call({
          from: accounts[0]});
    const {0: partnerName, 1: partnerAddress} = result;
    
    this.setState({partnerAddress, partnerName});
    console.log(this.state.partnerAddress);
    
      //MUST USE A DIFFERENT ACCOUNT TO REGISTER A PARTNER
      console.log("Points to EARN: " + this.state.earnPoints);
      await loyalty.methods.earnPoints(earnPoints, partnerAddress).send({
          from: accounts[0]
    });
    
    this.setState({ message: 'You have been earned points!' });
  }
  catch (err) {
      this.setState({ message: 'There was an error: ' + err.message});
  }
    
  };


  //REDEEM SUBMIT
  onRedeemSubmit = async event => {

    try {

    this.setState({ message: 'Waiting on transaction success...' });
    event.preventDefault();
    
    const accounts = await web3.eth.getAccounts();
    
    const { redeemPoints } = this.state;
    // const { partnerAddress } = this.state;
    
    this.setState({ message: 'Waiting on transaction success...' });
        
    //GET PARTNER ADDRESS
    const result = await loyalty.methods.getPartnerAt(0).call({
          from: accounts[0]});
    const {0: partnerName, 1: partnerAddress} = result;
    
    this.setState({partnerAddress, partnerName});
    console.log(this.state.partnerAddress);
    
    //MUST USE A DIFFERENT ACCOUNT TO REGISTER A PARTNER
    
    
    await loyalty.methods.redeamPoints(redeemPoints, partnerAddress).send({
          from: accounts[0]
    });
    
    this.setState({ message: 'You have redeem points!' });
  }
  catch (err) {
      this.setState({ message: 'There was an error: ' + err.message});
  }
    
  };











      renderTableHeader() {
        let header = Object.keys(this.state.transList[0])
        return header.map((key, index) => {
           return <th key={index}>{key.toUpperCase()}</th>
        })
     }
    
      renderTableData() {
        return this.state.transList.map((transList, index) => {
           const { ID, Member_Address, Partner_Address, Type, Points } = transList //destructuring
           return (
              <tr key={ID}>
                 <td>{ID}</td>
                 <td>{Member_Address}</td>
                 <td>{Partner_Address}</td>
                 <td>{Type}</td>
                 <td>{Points}</td>
              </tr>
           )
        })
     }


     renderPartnerTableHeader() {
      let header = Object.keys(this.state.partnerList[0])
      return header.map((key, index) => {
         return <th key={index}>{key.toUpperCase()}</th>
      })
   }
  
    renderPartnerTableData() {
      return this.state.partnerList.map((partnerList, index) => {
         const { ID, Partner_Address, Partner_Name, is_Registered } = partnerList //destructuring
         return (
            <tr key={ID}>
               <td>{ID}</td>
               <td>{Partner_Address}</td>
               <td>{Partner_Name}</td>
               <td>{is_Registered}</td>
            </tr>
         )
      })
   }



 //   myEarnButton(value) {

 //     console.log(value + "ON eARN BUTTON CLICKED");

 // }



//DISPLAY THE PAGE


  render() {
    return (

        <div>




        <div class="headbox">
          <img src={logo} alt="Logo"  width="200" height="75"/>
          <h2>Ethereum Blockchain & MetaMask Wallet Customer Loyalty Program Demostration</h2>
          This web app demonstrates a custom loyalty program on 
          the peer-to-peer network using the Ethereum Blockchain.
          <br></br><b>If app not working check internet connection, and you are logged into MetaMask.</b>
        <hr></hr>
        </div>

        <div class="box"><h2>Members</h2> 
          <p>Customers can enroll as members of the program. Once enrolled they can 
            make transactions to earn and redeem points, and view all their transactions.
          </p>
          <br></br>
          Program Levels: <b>Basic </b> less than 100, <b>Silver </b>
           less than 1000, <b>Gold </b> less than 2000, <b>Elite </b> 
           more than 2001 
        </div>


        <div class="box"><h2>Partners</h2>
          <p>For companies part of the program, they can register as Partner on the network. 
            Once registered they can view all transactions made with them and dashboard to view 
            total points allocated and redeemed by members. </p>
        </div>




        <hr></hr>
        <div class="detailsbox"><h2>Loyalty Contract Details</h2>
        <p>The Loyalty Program is running on the public Ethereum Rinkeby peer-to-peer network. The 
  following is information about the smart contract that is the loyalty program. </p>
        <b>Loyalty Contract Address:</b> {loyalty.options.address}
        <br></br>
        <b>Current Customer Account Address:</b> {this.state.user}
        <br></br>
        <b>Current Customer Account Name:</b>
        <br></br>
        <b>Current Provider: </b>
        <br></br>
        <b>Number of Registered Partners:</b> {this.state.numOfPartners}
        <br></br>
        <b>Number of Members:</b> {this.state.numOfMembers}
        <br></br>
        <b>Account Balance:</b> {this.state.balance} ETH
        </div>
        <hr></hr>










        <div class="headbox">
        <h2>Loyalty Program - Enrollment</h2>
          <b>Transaction Message: </b> {this.state.message}
        <hr></hr>
        </div>

        <div class="box">
        <h2>Member Enrollment Form</h2>
        <p>Ensure that you have selected a new account to enroll. 
          Enrolling an existing member who has already been enrolled will fail.</p>
        
        <form onSubmit={this.onEnrollSubmit}>
        <p>First name:
      <input
        type='text'
        name='firstName'
        placeholder={"Enter your first name"}
        onChange={this.myChangeHandler}
      /></p> 
      <p>Last name:
      <input
        type='text'
        name='lastName'
        placeholder={"Enter your last name"}
        onChange={this.myChangeHandler}
      /></p>
      <p>Phone:
      <input
        type='text'
        name='phone'
        placeholder={"Enter your phone number"}
        onChange={this.myChangeHandler}
      /></p>
      <p>eMail:
      <input
        type='text'
        name='email'
        placeholder={"Enter your email address"}
        onChange={this.myChangeHandler}
      /></p>

      <input type='submit' />
      </form>

    
    </div>

    <div class="box"><h2>Member Account Details</h2>
        <p>This current member is {this.state.user}  </p>
        <p>First name is {this.state.firstName}  </p>
        <p>Last name is {this.state.lastName}  </p>
        <p>phone is {this.state.phone}  </p>
        <p>email is {this.state.email}  </p>
        <p>points is {this.state.memPoints}  </p>
        <p>level is {this.state.tmpLevel}  </p>
          <p>status is {this.state.tmpStatus}  </p>
      </div>


    <br></br>






    
    <hr />

      <div class="detailsbox">

       
        <h2>Loyalty Contract Details</h2>
        <p>The Loyalty Program is running on the public Ethereum Rinkeby peer-to-peer network. The 
  following is information about the smart contract that is the loyalty program. </p>

        <b>Loyalty Contract Address:</b> {loyalty.options.address}
        <br></br>
        <b>Current Account Address:</b> {this.state.membersAccount}
        <br></br>
      </div>


      
      
      
      <hr></hr>



        <div class="headbox">
          <h2>Loyalty Program - Partner Registration</h2>
          <b>Transaction Message: </b> {this.state.message}
        <hr></hr>
        </div>
        <div class="box">
        <h2>Partner Registration Form</h2>
        <form onSubmit={this.onPartnerSubmit}>
        <p>Partner name:
          <input
          type='text'
          name='partnerName'
          placeholder={"Enter the partner name"}
          onChange={this.myChangeHandler}
          /></p> 
         <input type='submit' />
      </form>
    </div>

    <div class="box"><h2>Partner Accounts</h2>
      <p>The the current member is {this.state.user}  </p>
      <p>Partner name {this.state.partnerName}  </p>
      <p>Number of Partners {this.state.numOfPartners}  </p>



      <h2 id='title'>All Partner Accounts</h2>
            <table id='transList'>
               <tbody>
               <tr>{this.renderPartnerTableHeader()}</tr>
                  {this.renderPartnerTableData()}
               </tbody>
            </table>



    </div>




    <br></br>
    <hr />

      <div class="detailsbox">
      
        <h2>Loyalty Contract Details</h2>
        <p>The Loyalty Program is running on the public Ethereum Rinkeby peer-to-peer network. The 
  following is information about the smart contract that is the loyalty program. </p>

        <b>Loyalty Contract Address:</b> {loyalty.options.address}
        <br></br>
        <b>Current Partner Account Address:</b> {this.state.partnerAccount}
        <br></br>
      </div>


<hr></hr>


          <div class="headbox">
          <h2>Loyalty Program - Earn Points</h2>
          <p>This web app demonstrates a custom loyalty program on 
          the  peer-to-peer network using the Ethereum Blockchain.</p>
          <b>Transaction Message: </b> {this.state.message}
        <hr></hr>
          </div>
        <div class="box">
        <h2>Member Earn Form</h2>
        <p>Earn from the first partner only at the current time.</p>
        <form onSubmit={this.onEarnSubmit}>
            <label>Enter Points to Earn
            <input
              type="text"
              name="earn points"
              value={this.state.earnPoint}
              onChange={event => this.setState({ earnPoints: event.target.value })}
            />
            </label>
            <br />
            
            <input type='submit' />
            <br></br>

            <button class = "myButton" onClick={this.onEarnSubmit}>
              <img src={marriott} alt="Logo"  width="100" height="40" 
              />Earn points from Marriott</button>
            <br></br><br></br>
            <button class = "myButton" onClick={this.onEarnSubmit}>
              <img src={aa} alt="Logo"  width="100" height="40" 
              />Earn points from American Airlines</button>
            <br></br><br></br>
            <button class = "myButton" onClick={this.onEarnSubmit}>
              <img src={starbucks} alt="Logo"  width="50" height="35" 
              />Earn points from Starbucks</button>

        </form>







        </div>
        
        <div class="box"><h2>Member Account</h2>
          <p>The current member is {this.state.user}  </p>
          <p>First name is {this.state.firstName}  </p>
          <p>Last name is {this.state.lastName}  </p>
          <p>phone is {this.state.phone}  </p>
          <p>email is {this.state.email}  </p>
          <p>points is {this.state.memPoints}  </p>
          <p>level is {this.state.tmpLevel}  </p>
          <p>status is {this.state.tmpStatus}  </p>
        </div>

          <div class="detailsbox">
          <div>
            <h3 id='title'>Member Account Transactions</h3>
            <table id='transList'>
               <tbody>
               <tr>{this.renderTableHeader()}</tr>
                  {this.renderTableData()}
               </tbody>
            </table>
         </div>
      </div>


      <div class="detailsbox">
     
        <h2>Loyalty Contract Details</h2>
        <p>The Loyalty Program is running on the public Ethereum Rinkeby peer-to-peer network. The 
  following is information about the smart contract that is the loyalty program. </p>

        <b>Loyalty Contract Address:</b> {loyalty.options.address}
        <br></br>
        <b>Current Account Address:</b> {this.state.membersAccount}
        <br></br>
      </div>




<hr></hr>


        <div class="headbox">

          <h2>Loyalty Program - Redeem Points</h2>
          <p>This web app demonstrates a custom loyalty program on 
          the  peer-to-peer network using the Ethereum Blockchain.</p>
          <b>Transaction Message: </b> {this.state.message}
        <hr></hr>
        </div>


        <div class="box">
        <h2>Member Redeem Form</h2>
        <p>Redeem from the first partner only at the current time.</p>
        <form onSubmit={this.onRedeemSubmit}>

            <label>Enter Points to Redeem 
            <input
              type="text"
              name="earn points"
              value={this.state.redeemPoint}
              onChange={event => this.setState({ redeemPoints: event.target.value })}
            />
            </label>
            <br />
            <input type='submit' />

            <br></br>
            <button class = "myButton" onClick={this.onRedeemSubmit}>
              <img src={fairfield} alt="Logo"  width="100" height="40" 
              />Redeem points at Marriott</button>
            <br></br><br></br>
            <button class = "myButton" onClick={this.onRedeemSubmit}>
              <img src={delta} alt="Logo"  width="100" height="40" 
              />Redeem points at Delta</button>
            <br></br><br></br>
            <button class = "myButton" onClick={this.onRedeemSubmit}>
              <img src={bistro} alt="Logo"  width="50" height="35" 
              />Redeem points at Courtyard Bistro</button>



      </form>

      </div>



      <div class="box"><h2>Member Account</h2>
        <p>The current member is {this.state.user}  </p>
        <p>First name is {this.state.firstName}  </p>
        <p>Last name is {this.state.lastName}  </p>
        <p>phone is {this.state.phone}  </p>
        <p>email is {this.state.email}  </p>
        <p>points is {this.state.memPoints}  </p>
        <p>level is {this.state.tmpLevel}  </p>
          <p>status is {this.state.tmpStatus}  </p>
      </div>

          <div class="detailsbox">
          <div>
            <h3 id='title'>Member Account Transactions</h3>
            <table id='transList'>
               <tbody>
               <tr>{this.renderTableHeader()}</tr>
                  {this.renderTableData()}
               </tbody>
            </table>
         </div>
      </div>




      <div class="detailsbox">
     
        <h2>Loyalty Contract Details</h2>
        <p>The Loyalty Program is running on the public Ethereum Rinkeby peer-to-peer network. The 
  following is information about the smart contract that is the loyalty program. </p>

        <b>Loyalty Contract Address:</b> {loyalty.options.address}
        <br></br>
        <b>Current Account Address:</b> {this.state.membersAccount}
        <br></br>
      </div>



<hr></hr>




</div> 

   )
  
  };
    
};


export default App;
