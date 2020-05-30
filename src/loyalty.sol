//need to turn enums into actual values
// removed payable - 05/19/2020

// define solidity compiler
pragma solidity 0.4.24;

contract Loyalty {
   
    // model a member
    enum MemberLevel { Basic, Silver, Gold, Elite }
    enum MemberStatus { Active, InActive }
    struct Member {
        address memberAddress; //hash address
        string firstName;
        string lastName;
        string phone;
        string email;
        uint points;
        MemberLevel level;
        MemberStatus status;
        bool isRegistered;
    }

    // model a partner
    struct Partner {
        address partnerAddress;   //hash address
        string partnerName;
        bool isRegistered;
    }

    // model points transaction
    enum TransactionType { Earned, Redeemed, Transferred }
    struct PointsTransaction {
        uint points;
//        bool isRegistered;
        TransactionType transactionType;
        address memberAddress;
        address partnerAddress;
    }

    //members and partners on the network mapped with their address
    mapping(address => Member) public members;
    mapping(address => Partner) public partners;
    
    //public transactions and partners information
    Partner[] public partnersInfo;
    PointsTransaction[] public transactionsInfo;
    
    
    //get first name of members
    function getManager() public view returns(address) {
        return msg.sender;
    }
    
    
    //register sender as member
    function enrollMember (string _firstName,
                             string _lastName, string _phone, string _email) public {
      //check msg.sender in existing members
      require(!members[msg.sender].isRegistered, "Account already registered as Member");

      //check msg.sender in existing partners
      require(!partners[msg.sender].isRegistered, "Account already registered as Partner");

      //add member account
      members[msg.sender] = Member(msg.sender, _firstName, _lastName, _phone, _email, 0, MemberLevel.Basic, MemberStatus.Active, true);
     
    }

    //register sender as partner
    function registerPartner (string _partnerName) public {
      //check msg.sender in existing members
      require(!members[msg.sender].isRegistered, "Account already registered as Member");

      //check msg.sender in existing partners
      require(!partners[msg.sender].isRegistered, "Account already registered as Partner");

      //add partner account
      partners[msg.sender] = Partner(msg.sender, _partnerName, true);

      //add partners info to be shared with members
      partnersInfo.push(Partner(msg.sender, _partnerName, true));

    }

    function updowngrade (address _Address) private {

        // update level based on Points
      uint level;
      uint points = members[_Address].points;

      if (points <= 100) level = 0;
      else if (points <= 1000) level = 1;
      else if (points <= 2000) level = 2;
      else if (points >= 2001) level = 3;

      members[_Address].level = MemberLevel(level);
    
    }
 
 
     //update member with points earned
    function earnPoints (uint _points, address _partnerAddress ) public {
      // only member can call
      require(members[msg.sender].isRegistered, "Sender not registered as Member");

      // verify partner address
      require(partners[_partnerAddress].isRegistered, "Partner address not found");

      // update member account
      members[msg.sender].points = members[msg.sender].points + _points;
     
      // update level based on Points
      updowngrade(msg.sender);

      // add transction
      transactionsInfo.push(PointsTransaction({
        points: _points,
//        isRegistered: members[msg.sender].isRegistered,
        transactionType: TransactionType.Earned,
        memberAddress: members[msg.sender].memberAddress,
        partnerAddress: _partnerAddress
      }));

    }
   
   
    //transfer points from the current account holder to another member
    function transferPoints (uint _points, address _transferAddress ) public {
      // only member can call
      require(members[msg.sender].isRegistered, "Sender not registered as Member");

      // verify enough points for member
      require(members[msg.sender].points >= _points, "Insufficient points in member's Account");
     
      // subtract the member account
      members[msg.sender].points = members[msg.sender].points - _points;
     
      // update level based on Points
      updowngrade(msg.sender);
     
      // transfer to the from member account
      members[_transferAddress].points =  members[_transferAddress].points + _points;

     
      // update level based on Points
      updowngrade(_transferAddress);
     

      // add transction
      transactionsInfo.push(PointsTransaction({
        points: _points,
//        isRegistered: members[msg.sender].isRegistered,
        transactionType: TransactionType.Transferred,
        memberAddress: members[msg.sender].memberAddress,
        partnerAddress: _transferAddress
      }));

    }
   
   
   

    //update member with points used
    function redeamPoints (uint _points, address _partnerAddress) public {
      // only member can call
      require(members[msg.sender].isRegistered, "Sender not registered as Member");

      // verify partner address
      require(partners[_partnerAddress].isRegistered, "Partner address not found");

      // verify enough points for member
      require(members[msg.sender].points >= _points, "Insufficient points");

      // update member account
      members[msg.sender].points = members[msg.sender].points - _points;
     
     
      // update level based on Points
      updowngrade(msg.sender);
     
      // add transction
      transactionsInfo.push(PointsTransaction({
        points: _points,
//        isRegistered: members[msg.sender].isRegistered,
        transactionType: TransactionType.Redeemed,
        memberAddress: members[msg.sender].memberAddress,
        partnerAddress: _partnerAddress
      }));
    }

    //get length of transactionsInfo array
    function getTransactionsInfoLength() public view returns(uint256) {
        return transactionsInfo.length;
    }

    //get length of partnersInfo array
    function getPartnersInfoLength() public view returns(uint256) {
        return partnersInfo.length;
    }
   
   
    //get first name of members
    function getMembersFirstName() public view returns(string) {
        return members[msg.sender].firstName;
    }
   
   
    // get partner index of partnersInfo array
    function getPartnerAt(uint _index) public view returns(string memory, address) {
        return (partnersInfo[_index].partnerName, partnersInfo[_index].partnerAddress);
    }

    // get member at msg.sender of members
    function getCurrentMember() public view returns (string memory, string memory, uint256) {
        string memory firstName = members[msg.sender].firstName;
        string memory lastName = members[msg.sender].lastName;
        uint256 points = members[msg.sender].points;

        return (firstName, lastName, points);
    }
    
    
    // get partner index of partnersInfo array
//    function getRestrictedByContractHolder() public view restricted returns (string) {
//        return ("Called by Contract holder");
//    }
    
    

    modifier restricted() {
        require(msg.sender == address(this));
        _;
    }

}