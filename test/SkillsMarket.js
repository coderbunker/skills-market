const SkillsMarket = artifacts.require('../test/SkillsMarket.sol');

contract('SkillsMarket', function(accounts) {
   
   let skillsMarket;
-  beforeEach(`create subject instance before each test`, async () => {
        skillsMarket = await SkillsMarket.new();
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
	   await skillsMarket.registerMemberSkills(
		   accounts[0],
		   1001,
		   web3.fromAscii("Java"),
		   100,
		   100,
		   {from: accounts[0], gas: 300000});

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
	   
	   const skillName = await skillsMarket.getSkillName(accounts[0], hashKey);
	   assert(skillName.toString(), "Java");
   });

   // certify(address mentor, address mentee, uint256 hashKey, uint8 time, uint8 cost)
   it(`certify - Java skill for one person`, async() => {
	   const hashKey = 1000;

	// DONE fix account ids for mentor and mentee

	   await skillsMarket.registerMemberSkills(
		   accounts[1],
		   hashKey,
		   web3.fromAscii("Java"),
		   100,
		   100,
		   {from: accounts[0], gas: 300000});

   	   await skillsMarket.askForHelp(
		   hashKey,
		   accounts[0],
		   web3.fromAscii("Java"),
		   100,
		   10,
		   {from: accounts[0], gas: 3000000, value: 10});

		   
	   const skillBefore = await skillsMarket.getSkillLevel(accounts[0], hashKey);
	   const skillName = await skillsMarket.getSkillName(accounts[0], hashKey);

	   assert.equal(skillBefore.toString(), -1);
	   assert.equal(web3.toUtf8(skillName.toString()), "");
	   
	   const time = 100; 
	   const mentorCertId = await skillsMarket.findCertForMentor(
		   accounts[1],
		   accounts[0],
		   hashKey, 
		   time,
		   10,
		   { from: accounts[1], gas: 3000000 }
	   );

	   assert.equal(mentorCertId.toString(), 0);

	   let menteeCertId = await skillsMarket.findCertForSkillMentee(
		   accounts[1],
		   accounts[0],
		   hashKey, 
		   time,
		   10,
		   { from: accounts[1], gas: 3000000 }
	   );

	   assert.equal(menteeCertId.toString(), -1);

	   // DONE when test update certificate and immedialty lookup for cert id it works (try to do it as two separate functions)
	   await skillsMarket.updateCerts(
			accounts[1],
			accounts[0],
			hashKey, 
			time,
			10,
			{ from: accounts[1], gas: 3000000 }
	   );

	   const skillLength = await skillsMarket.findCertLengthForMentee(accounts[0]);
	   assert.equal(skillLength.toString(), 1);

	   const menteeAfterCertId = await skillsMarket.findCertForSkillMentee(
			accounts[1],
			accounts[0],
			hashKey, 
			time,
			10,
			{ from: accounts[1], gas: 3000000, value: 10 }
		);

		assert.equal(menteeAfterCertId.toString(), 0);
		
	   // findCertForSkillMentee
	   // certify(address mentor, address mentee, uint256 hashKey, uint8 time, uint8 cost)
	//    const time = 100; 
	//    await skillsMarket.certify(
	// 	   accounts[1], 
	// 	   accounts[0],
	// 	   hashKey, 
	// 	   time,
	// 	   10,
	// 	   { from: accounts[1], gas: 3000000, value: 10 }); 

	// 	const skillAfter = await skillsMarket.getSkillLevel(accounts[0], hashKey);

	// 	assert.equal(skillBefore + skillAfter, skillBefore + time);
   }); 
})
