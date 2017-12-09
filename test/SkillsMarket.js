const SkillsMarket3 = artifacts.require('../test/SkillsMarket.sol');

contract('SkillsMarket', function(accounts) {
   
   let skillsMarket;
-  beforeEach(`create subject instance before each test`, async () => {
        skillsMarket = await SkillsMarket3.new();
   });

   it(`market starts - get authorities - returns two`, async() => {
   	    const amount = await skillsMarket.getAuthorities({from: accounts[0], gas: 300000});
        assert.equal(amount.toString(), 1);
   });

   it(`register Skill Ownership For Authority - get skill for authority - returns two`, async() => {
   	    await skillsMarket.registerSkillOwnershipForAuthority(
			web3.fromAscii("Data"), 
			10,
			{from: accounts[0], gas: 300000}
		);
	    const amount = await skillsMarket.getSkillForAuthority({from: accounts[0], gas: 300000});
        assert.equal(amount.toString(), 2);
   });
	
   it(`register organisation - get organisation - returns the same organisation`, async() => {
	   const data = web3.fromAscii("Coderbunker");
   	   await skillsMarket.registerOrganisation(accounts[0], data, {from: accounts[0], gas: 300000});
       const org = await skillsMarket.getOrganisation(accounts[0], {from: accounts[0], gas: 300000}); 
	   assert.equal(web3.toUtf8(org), "Coderbunker");
   });

   it(`register member for organisation - getMembersForOrganisation - returns one`, async() => {
   	   await skillsMarket.registerMemberForOrganisation(accounts[0], accounts[1], {from: accounts[0], gas: 300000});
       const member = await skillsMarket.getMembersForOrganisation();
	   assert.equal(member.toString(), 1);
   });
	
   it(`register member skills - get skills for member - returns one`, async() => {
   	   await skillsMarket.registerMemberSkills(
			accounts[0],
			1001,
			web3.fromAscii("Java"),
			100,
			100,
			{from: accounts[0], gas: 300000});
       const skill = await skillsMarket.getSkillForMember(accounts[0]);
	   assert.equal(skill.toString(), 1);
   });

   it(`ask for help - ask for help from two people - returns two`, async() => {
	   const hashKey = 1001; 
   	   await skillsMarket.askForHelp(
		   hashKey,
		   accounts[0],
		   web3.fromAscii("Java"),
		   100,
		   10,
		   {from: accounts[0], gas: 3000000, value: 100});
	   
	   await skillsMarket.askForHelp(
		   hashKey,
		   accounts[1],
		   web3.fromAscii("Java"),
		   100,
		   10,
		   {from: accounts[1], gas: 3000000, value: 10});
	   
	   const requests = await skillsMarket.getAmountOfPeopleWaitingForHelp(hashKey);
       assert.equal(requests.toString(), 2);
   });

   // certify(address mentor, address mentee, uint256 hashKey, uint8 time, uint8 cost)
   it(`certify - Java skill for one person`, async() => {
   	   await skillsMarket.askForHelp(
		   hashKey,
		   accounts[0],
		   web3.fromAscii("Java"),
		   100,
		   10,
		   {from: accounts[0], gas: 3000000, value: 100});
	   
	   await skillsMarket.certify(
		   accounts[1], 
		   accounts[0],
		   hashKey, 
		   100,
		   10
		   {from: accounts[1], gas: 3000000, value: 10}); 
   }); 
})
