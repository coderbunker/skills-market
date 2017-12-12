const SkillsMarket = artifacts.require('../test/SkillsMarket.sol');

contract('SkillsMarket', function(accounts) {
   
    let skillsMarket;
-   beforeEach(`create subject instance before each test`, async () => {
        skillsMarket = await SkillsMarket.new();
    });

//     it(`register member skills - get skills for member - returns one`, async() => {
// 		await skillsMarket.registerMemberSkills(
// 		accounts[0],
// 		1001,
// 		web3.fromAscii("Java"),
// 		100,
// 		100,
// 		{ from: accounts[0], gas: 300000 });

// 		const skill = await skillsMarket.getSkillForMember(accounts[0]);
// 		assert.equal(skill.toString(), 1);
// 	});
	
// 	it(`ask for help - ask for help from two people - returns two`, async() => {
// 		const hashKey = 1001; 
// 		await skillsMarket.registerMemberSkills(
// 			accounts[0],
// 			1001,
// 			web3.fromAscii("Java"),
// 			100,
// 			100,
// 			{from: accounts[0], gas: 300000});
 
// 		   await skillsMarket.askForHelp(
// 			hashKey,
// 			accounts[0],
// 			web3.fromAscii("Java"),
// 			100,
// 			10,
// 			{from: accounts[0], gas: 3000000, value: 100});
		
// 		await skillsMarket.askForHelp(
// 			hashKey,
// 			accounts[1],
// 			web3.fromAscii("Java"),
// 			100,
// 			10,
// 			{from: accounts[1], gas: 3000000, value: 10});
		
// 		const requests = await skillsMarket.getAmountOfPeopleWaitingForHelp(hashKey);
// 		assert.equal(requests.toString(), 2);
		
// 		const skillName = await skillsMarket.getSkillName(accounts[0], hashKey);
// 		assert(skillName.toString(), "Java");
// 	});

// 	it (`make transfer - send 1 ether - see the change in balance on 1 ether`, async() => {
// 		assert.equal(web3.fromWei(web3.eth.getBalance(web3.eth.accounts[2]), "ether").toString(), 100);
		
// 		const oneEther = 1000000000000000000;
// 		await skillsMarket.makeTransfer(accounts[2], {from: accounts[0], gas: 300000, value: 1000000000000000000});

// 		const balanceOnSecondAccount = web3.fromWei(web3.eth.getBalance(web3.eth.accounts[2]), "ether").toString();
// 		assert.equal(balanceOnSecondAccount, 101);
//     });

//     it (`get balance - balance is equal zero`, async() => {
// 		const balance = await skillsMarket.getBalance();
// 		assert.equal(balance, 0);
//     });

//     it (`put ether on the contract - ask for balance - balance is equal 2`, async() => {
// 		const hashKey = 1001; 
// 		await skillsMarket.registerMemberSkills(
// 			accounts[0],
// 			1001,
// 			web3.fromAscii("Java"),
// 			100,
// 			100,
// 			{from: accounts[0], gas: 300000});

// 		await skillsMarket.askForHelp(
// 			hashKey,
// 			accounts[0],
// 			web3.fromAscii("Java"),
// 			100,
// 			10,
// 			{from: accounts[0], gas: 3000000, value: web3.toWei(1, 'ether')});
		
// 		await skillsMarket.askForHelp(
// 			hashKey,
// 			accounts[1],
// 			web3.fromAscii("Java"),
// 			100,
// 			10,
// 			{from: accounts[1], gas: 3000000, value: web3.toWei(1, 'ether')});

// 		const balance = await skillsMarket.getBalance();

// 		assert.equal(web3.fromWei(balance.toString(), 'ether'), 2);
//    });

//    it (`put ether on the contract - ask for balance with guard - balance is equal 2`, async() => {
// 		const hashKey = 1001; 
// 		await skillsMarket.registerMemberSkills(
// 			accounts[0],
// 			1001,
// 			web3.fromAscii("Java"),
// 			100,
// 			100,
// 			{from: accounts[0], gas: 300000});

// 		await skillsMarket.askForHelp(
// 			hashKey,
// 			accounts[0],
// 			web3.fromAscii("Java"),
// 			100,
// 			10,
// 			{from: accounts[0], gas: 3000000, value: web3.toWei(1, 'ether')});
		
// 		await skillsMarket.askForHelp(
// 			hashKey,
// 			accounts[1],
// 			web3.fromAscii("Java"),
// 			100,
// 			10,
// 			{from: accounts[1], gas: 3000000, value: web3.toWei(1, 'ether')});

// 		const balance = await skillsMarket.getBalanceWithGuard(web3.toWei(1, "ether"));

// 		assert.equal(web3.fromWei(balance.toString(), 'ether'), 2);
// 	});

// 	it(`certify - Java skill for one person`, async() => {
// 		const hashKey = 1000;
		
// 		const certLengthBefore = await skillsMarket.findCertLengthForMentee(accounts[0]);

// 		await skillsMarket.registerMemberSkills(
// 			accounts[1],
// 			hashKey,
// 			web3.fromAscii("Java"),
// 			100,
// 			100,
// 			{from: accounts[0], gas: 300000});
 
// 		assert.equal(certLengthBefore.toString(), 0);

// 		await skillsMarket.askForHelp(
// 			hashKey,
// 			accounts[0],
// 			web3.fromAscii("Java"),
// 			100,
// 			web3.toWei(1, "ether"),
// 			{from: accounts[0], gas: 300000, value: web3.toWei(1, "ether")});

// 	    // certify(address mentor, address mentee, uint256 hashKey, uint8 time, uint8 cost)
// 		await skillsMarket.certify(
// 			accounts[1],
// 			accounts[0],
// 			hashKey,
// 			10, 
// 			web3.toWei(1, "ether"),
// 			{from: accounts[0], gas: 300000}
// 		);

// 		const certLengthAfter = await skillsMarket.findCertLengthForMentee(accounts[0]);
		
// 		let certAfter = await skillsMarket.findFullCertForSkillMentee(
// 			accounts[1],
// 			accounts[0],
// 			hashKey,
// 			10, 
// 			web3.toWei(1, "ether"),
// 		);

// 		// FIXME send but doesn;t receve ether
// 		// FIXME check if hours are updated 
// 		assert.equal(certLengthBefore, certLengthAfter - 1);
// 		assert.equal(certLengthAfter.toString(), 1);
		
// 		assert.equal(web3.toUtf8(certAfter[0]), "Java");
// 		assert.equal(certAfter[1].toString(), 10);
// 		assert.equal(certAfter[2].toString(), 100);
// 		// assert.equal(certAfter.skill, "Java");
// 	});

// 	it(`certify - user already has certification - see updated ceritificate`, async() => {
// 		const hashKey = 1000;
		
// 		await skillsMarket.registerMemberSkills(
// 			accounts[1],
// 			hashKey,
// 			web3.fromAscii("Java"),
// 			100,
// 			100,
// 			{from: accounts[0], gas: 300000});

// 		await skillsMarket.registerMemberSkills(
// 			accounts[0],
// 			hashKey,
// 			web3.fromAscii("Java"),
// 			10,
// 			100,
// 			{from: accounts[0], gas: 300000});

// 		let certBefore = await skillsMarket.findFullCertForSkillMentee(
// 			accounts[1],
// 			accounts[0],
// 			hashKey,
// 			10, 
// 			web3.toWei(1, "ether"),
// 		);

// 		const certLengthBefore = await skillsMarket.findCertLengthForMentee(accounts[0]);
// 		assert.equal(certLengthBefore.toString(), 1);

// 		await skillsMarket.askForHelp(
// 			hashKey,
// 			accounts[0],
// 			web3.fromAscii("Java"),
// 			10,
// 			web3.toWei(1, "ether"),
// 			{from: accounts[0], gas: 300000, value: web3.toWei(1, "ether")});

// 		const trainingTime = 10;
// 		await skillsMarket.certify(
// 			accounts[1],
// 			accounts[0],
// 			hashKey,
// 			trainingTime, 
// 			web3.toWei(1, "ether"),
// 			{from: accounts[0], gas: 300000}
// 		);

// 		const certLengthAfter = await skillsMarket.findCertLengthForMentee(accounts[0]);
		
// 		let certAfter = await skillsMarket.findFullCertForSkillMentee(
// 			accounts[1],
// 			accounts[0],
// 			hashKey,
// 			trainingTime, 
// 			web3.toWei(1, "ether"),
// 		);

// 		// FIXME send but doesn;t receve ether
// 		// FIXME check if hours are updated 
// 		assert.equal(certLengthBefore.toString(), certLengthAfter.toString());
// 		assert.equal(certLengthAfter.toString(), 1);

// 		assert.equal(web3.toUtf8(certAfter[0]), web3.toUtf8(certBefore[0]));
// 		assert.equal(certAfter[1].toNumber(), certBefore[1].toNumber() + trainingTime);
// 		assert.equal(certAfter[2].toNumber(), certBefore[2].toNumber());
// 	});

	it(`check balance - certify - contract balance is reduced, mentor account is increased`, async() => {
		const hashKey = 1000;
		
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
			10,
			web3.toWei(1, "ether"),
			{from: accounts[0], gas: 300000, value: web3.toWei(1, "ether")});
	

		const mentorBalanceBefore = web3.fromWei(web3.eth.getBalance(accounts[1]));
		console.log("Mentor balance before: " + mentorBalanceBefore);

		const trainingTime = 10;
		// trsnafer ether from this contract to mentor
		// valid caller is mentor
		// account[0] is mentee
		// account[1] mentor
		const status = await skillsMarket.certify(
			accounts[1],
			accounts[0],
			hashKey,
			trainingTime, 
			web3.toWei(1, "ether"),
			{from: accounts[1], gas: 300000}
		);

		// console.log(status);

		const payment = web3.toWei(1, "ether");
		const gasCost = 300000;
		const depositStatus = await skillsMarket.transferDeposit(
			accounts[0],
			accounts[1],
			{from: accounts[0], gas: gasCost, value: payment}
		);

		console.log(depositStatus);

		// certify(address mentor, address mentee, uint256 hashKey, uint8 time, uint8 cost)

		const mentorBalanceAfter = web3.fromWei(web3.eth.getBalance(accounts[1]));
		console.log("===");
		console.log("Mentor balance before: " + mentorBalanceBefore);
		console.log("Mentor balance after: " + mentorBalanceAfter);
		console.log("===");

		const delta = mentorBalanceAfter.toNumber() - mentorBalanceBefore.toNumber() + gasCost; 

		assert.equal(web3.fromWei(delta, "ether"), web3.fromWei(payment, "ether"));
	});

})
