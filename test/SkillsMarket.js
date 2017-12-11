const SkillsMarket = artifacts.require('../test/SkillsMarket.sol');

contract('SkillsMarket', function(accounts) {
   
    let skillsMarket;
-   beforeEach(`create subject instance before each test`, async () => {
        skillsMarket = await SkillsMarket.new();
    });

    it(`register member skills - get skills for member - returns one`, async() => {
		await skillsMarket.registerMemberSkills(
		accounts[0],
		1001,
		web3.fromAscii("Java"),
		100,
		100,
		{ from: accounts[0], gas: 300000 });

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

	it (`make transfer - send 1 ether - see the change in balance on 1 ether`, async() => {
		assert.equal(web3.fromWei(web3.eth.getBalance(web3.eth.accounts[2]), "ether").toString(), 100);
		
		const oneEther = 1000000000000000000;
		await skillsMarket.makeTransfer(accounts[2], {from: accounts[0], gas: 300000, value: 1000000000000000000});

		const balanceOnSecondAccount = web3.fromWei(web3.eth.getBalance(web3.eth.accounts[2]), "ether").toString();
		assert.equal(balanceOnSecondAccount, 101);
    });

    it (`get balance - balance is equal zero`, async() => {
		const balance = await skillsMarket.getBalance();
		assert.equal(balance, 0);
    });

    it (`put ether on the contract - ask for balance - balance is equal 2`, async() => {
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
			{from: accounts[0], gas: 3000000, value: web3.toWei(1, 'ether')});
		
		await skillsMarket.askForHelp(
			hashKey,
			accounts[1],
			web3.fromAscii("Java"),
			100,
			10,
			{from: accounts[1], gas: 3000000, value: web3.toWei(1, 'ether')});

		const balance = await skillsMarket.getBalance();

		assert.equal(web3.fromWei(balance.toString(), 'ether'), 2);
   });

   it (`put ether on the contract - ask for balance with guard - balance is equal 2`, async() => {
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
			{from: accounts[0], gas: 3000000, value: web3.toWei(1, 'ether')});
		
		await skillsMarket.askForHelp(
			hashKey,
			accounts[1],
			web3.fromAscii("Java"),
			100,
			10,
			{from: accounts[1], gas: 3000000, value: web3.toWei(1, 'ether')});

		const balance = await skillsMarket.getBalanceWithGuard(web3.toWei(1, "ether"));

		assert.equal(web3.fromWei(balance.toString(), 'ether'), 2);
	});

})
