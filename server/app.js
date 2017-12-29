// region constant

const API_V1_PREFIX = '/api/v1';

const ORGANISATION = "Organisation";
const COST = 10;
const BLOCK_COUNT_FULL_LOAD = 12;
const BLOCK_COUNT_HACKATHON = 0;

const ABI_PATH = 'abi.json';

const isHackathon = true;

// endregion

// region imports

var express = require('express');
var app = express();

const debug = require('debug')('utseus-api')
const cors = require('cors');
const parser = require('./parser/parser.js')
const config = require('./config.js');
const http = require('./http.js');
const dataset = require('./dataset.js');
const ethereum = require('./ethereum.js');
const Promise = require('promise');
const utils = require('./controllers/utils.js');
const InputDataDecoder = require('ethereum-input-data-decoder');
const decoder = new InputDataDecoder(ABI_PATH);

// endregion

// region initiate Web3

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545')); 
console.info('w3', web3.eth.accounts);

// endregion

// region runtime storage

var profiles = {}

createProfiles();

function createProfiles() {
	var users = utils.getUsers();
	var accounts = web3.eth.accounts;
	for (var idx = 0; idx < users.length; idx++) {
		console.log("w3", "Create user");
		console.log("w3", users[idx]);
		profiles[users[idx]] = accounts[idx];
	}
	
	console.log("w3", profiles);
}
	
// endregion

app.use(cors());

String.prototype.hashCode = function() {
    var hash = 0;
    if (this.length == 0) {
        return hash;
    }
    for (var i = 0; i < this.length; i++) {
        char = this.charCodeAt(i);
        hash = ((hash<<5)-hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

app.get(API_V1_PREFIX + '/parser', function (req, res) {

	console.log("w3", "start parser");

	// data length
	// var input = '0xa5643bf20000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000464617665000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003';
	// var params = ['bytes', 'bool', 'uint256[]'];
	// var mapping = parser.createMapping(input, params);
	// console.log(mapping.length);

	// test parser
	var input = '0xa5643bf20000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000464617665000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003';
	var params = ['bytes', 'bool', 'uint256[]'];
	var data = parser.parse(web3, input, params);

	var output = parser.convertFromHexToData(web3, data);
	for (var id = 0; id < output.length; id++) {
		console.log("Type: " + output[id].type);
		console.log("Data: " + output[id].data);
	}
	console.log("=== === ===");
	// console.log("Data length: " + data.length);
	// console.log(data);
	// for (var id = 0; id < data.length; id++) {
	// 	console.log(data[id]);
	// }
	// console.log("=== === ===");

	// // test create mapping
	// var input = '0xa5643bf20000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000464617665000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003';
	// var params = ['bytes', 'bool', 'uint256[]'];
	// var mapping = parser.createMapping(input, params);

	// console.log("w3", "Mapping size: " + mapping.length);

	// for (var id = 0; id < mapping.length; id++) {
	// 	parser.debug(mapping[id]);
	// }
	// // test findEndOfParam 

	// TODO trip the string fron function signature
	// var data = '0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000004';
	// var end = parser.findEndOfParam(data, 196);
	// parser.debug(end);

	// test isDynamicType

	// var bytes = parser.isDynamicType('bytes');
	// parser.debug(bytes);
	// var string = parser.isDynamicType('string');
	// parser.debug(string);
	// var array = parser.isDynamicType('uint256[]');
	// parser.debug(array);

	var json = getUsers();
	res.status(http.SUCCESS).json(json);
});

app.get(API_V1_PREFIX + '/test', function (req, res) {
	// console.log("w3", "test");
	// var txHash = '0x8c5386aee0df24450b6aa5c3b2ecd4c3d65c9dedc7f3317b9377a9d0a113d131';
	// processInputForTransaction(txHash);
	// var json = getUsers();

	// var input = '0xce413932ffffffffffffffffffffffffffffffffffffffffffffffffffffffff915b27d9000000000000000000000000e6ee8b1b6a8aef7b53c1941b232131442e51a26a5265616374000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000a';
	// var params = ['offset', 'uint256'];
	// ethereum.parseInput(web3, input, params);

	// // 69 and true
	// var input1 = '0xcdcd77c000000000000000000000000000000000000000000000000000000000000000450000000000000000000000000000000000000000000000000000000000000001';
	// var params1 = ['offset', 'uint32', 'bool'];
	// ethereum.parseInput(web3, input1, params1);

	// // ["abc", "def"]
	// var input2 = '0xfce353f661626300000000000000000000000000000000000000000000000000000000006465660000000000000000000000000000000000000000000000000000000000';
	// var params2 = ['offset', 'bytes3', 'bytes3'];
	// ethereum.parseInput(web3, input2, params2);

	// console.log("w3", "=== === ===");
	// console.log("w3", "Test 3");
	// console.log("w3", "=== === ===");

	// // hash of skill, mentee address, React, 10
	// var input3 = '0xce413932ffffffffffffffffffffffffffffffffffffffffffffffffffffffff915b27d9000000000000000000000000868adea4b89c5d9e52ced68d856af9371031be795265616374000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000a';
	// var params3 = ['offset', 'uint256', 'address', 'bytes32', 'uint', 'uint'];
	// ethereum.parseInput(web3, input3, params3);

	// console.log("w3", "=== === ===");
	// console.log("w3", "END");
	// console.log("w3", "=== === ===");

	// address mentor, address mentee, uint256 hashKey, uint8 time, uint8 cost
	var input4 = '0x6660339c000000000000000000000000c53e280bf59a25b60af2afd55435e08f2aba6814000000000000000000000000868adea4b89c5d9e52ced68d856af9371031be79ffffffffffffffffffffffffffffffffffffffffffffffffffffffff915b27d9000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000064';
	var params4 = ['offset', 'address', 'address', 'uint256', 'uint8', 'uint8'];
	ethereum.parseInput(web3, input4, params4);

	var input5 = '0xa5643bf20000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000464617665000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003';
	var params5 = ['offset', 'address', 'address', 'uint256', 'uint8', 'uint8'];
	ethereum.parseInput(web3, input5, params5);

	var input6 = '0xa5643bf20000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000464617665000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003';
	addRow('dave', 'bytes', 'dynamic');
	addRow(true, 'bool', 'static');
	addRow('[1,2,3]', 'uint256[]', 'dynamic');
	var params6 = getParameters();
	ethereum.parseDynamic(web3, input6, params6);

	var json = getUsers();
	res.status(http.SUCCESS).json(json);
	// web3.eth.getTransaction(txHash, function(err,result) {
	// 	console.log
	// 	return result;
	// });
});

var params = [];

function getParameters() {
	return params;
}

function addRow(data, type) {
	var object = new Object();
	object.data = data;
	object.type = type;
	params.push(object);
}

app.get(API_V1_PREFIX + '/users', function (req, res) {
	console.log("w3", "request users");
	console.log("w3", getUsers());
	var json = getUsers();
	res.status(http.SUCCESS).json(json);
});

app.get(API_V1_PREFIX + '/queue', function (req, res) {
	res.send(getWaitingQueue());
})

app.get(API_V1_PREFIX + '/skills', function (req, res) {
	res.send(dataset.skills);
})

app.post(API_V1_PREFIX + '/help/:mentee/:skill/:time', function (req, res) {
	// TODO validate there is such profile
	const profileName = req.params.mentee;
	const skill = req.params.skill;
	const time = req.params.time;
    if (!(profileName in profiles)) {
        res.status(http.BAD_REQUEST).send('User is not valid');
    } else {
		console.log("w3", "Process help request");
		askForHelp(profileName, ORGANISATION, skill, time, COST)
            .then(function(txHash) {
				console.log("w3", "Initiate consensus");
                console.log("w3", "Hash: " + txHash);
                var blockCount = isHackathon ? BLOCK_COUNT_HACKATHON : BLOCK_COUNT_FULL_LOAD; // considered as an optimal for start 
				var timeout = 15 * 60;
				res.status(http.SUCCESS).send(prepareResponse(true, txHash));
                return startConsensus(web3, txHash, blockCount, timeout);
            })
            .catch(function(err) {
				console.log("w3", err);
				// process error here 
				res.status(http.BAD_REQUEST).send(prepareResponse(false, err));
			});
		console.log("w3", "Process help request [end]");
    }
})

app.post(API_V1_PREFIX + '/mentoring/:mentor/:mentee/:skill/:time', function (req, res) {
	const mentor = req.params.mentor;
	const mentee = req.params.mentee;
	const skill = req.params.skill;
	const time = req.params.time;
	if (!(mentor in profiles) || !(mentee in profiles)) {
		res.status(http.BAD_REQUEST).send("User is not registered");
	} else {
		certify(getAccountByName(mentor), getAccountByName(mentee), skill, time)
			.then(function(txHash) {
				console.log("w3", "Initiate consensus");
				console.log("w3", "Hash: " + txHash);
				var blockCount = isHackathon ? BLOCK_COUNT_HACKATHON : BLOCK_COUNT_FULL_LOAD; // considered as an optimal for start 
				var timeout = 15 * 60;
				res.status(http.SUCCESS).send(prepareResponse(true, txHash));
				
				markedRequestAsProcessedInWaitingQueue(mentee, ORGANISATION, skill, time);

				return startConsensus(web3, txHash, blockCount, timeout);
			})
			.catch(function(err) {
				res.status(http.BAD_REQUEST).send(prepareResponse(false, err));
			})
	}
})

app.get(API_V1_PREFIX + '/dashboard', function (req, res) {
	console.log("w3", "request dashboard");
	console.log("w3", "History: " + getHistory());
	transactionHistory().then(() => {
		var json = JSON.parse(getHistory());
		res.status(http.SUCCESS).json(json);
	});
});

app.post(API_V1_PREFIX + '/register/:member/:skill', function (req, res) {
	const member = req.params.member;
	const skill = req.params.skill;
	registerMemberWithSkill(member, skill).then(function({status, message}){
		res.status(status).send(message);
	});
})

app.get(API_V1_PREFIX + '/validate/:txhash', function (req, res) {
	const txHash = req.params.txhash;
	checkReceipt(txHash)
		.then(function(message) {
			res.status(http.SUCCESS).send(message);
		})
		.catch(function(message) {
			res.status(http.BAD_REQUEST).send(message);
		});
})

function checkReceipt(txHash) {
	return new Promise(function(validate, reject) {
		const receipt = web3.eth.getTransactionReceipt(txHash);
		if (receipt === null) {
			return reject(prepareResponse(false, "No receipt for this txHash"));
		} else {
			const json = JSON.parse(JSON.stringify(receipt));
			const status = json.status == 1;
			return validate(prepareResponse(status, JSON.stringify(receipt)));
		}
	})
}

function registerMemberWithSkill(member, skill) {
	return new Promise(function(fulfill) {
		createCertificate(member, skill, ORGANISATION);
		fulfill({
			status: http.SUCCESS,
			message: 'user was successfully registered'
		}); 
	});
}

app.listen(config.port, () => {
	debug('App started at port %d', config.port);
})

function certifyFunc(mentor, mentee, skill, time) {
	return new Promise(function(fulfill) {
		if (!(mentor in profiles) || !(mentee in profiles)) {
			fulfill({
				status: http.BAD_REQUEST,
				message: 'Either mentor or mentee params is not valid'
			});
		} else {
			var mentorAccount = getAccountByName(mentor);
			var menteeAccount = getAccountByName(mentee);
			console.log("w3", "certifyFunc");
			console.log("w3", skill);
			certify(mentorAccount, menteeAccount, skill, time, COST);
			fulfill({
				status: http.SUCCESS,
				message: 'User was certified'
			});
			markedRequestAsProcessedInWaitingQueue(mentee, ORGANISATION, skill, time);
			// TODO process negative scenario - no certification on blockchain
		}
	});
}

// endregion

process.stdout.write("starting web3..");

// region deploy the contract

let fs = require("fs");
let source = fs.readFileSync("SkillsMarket.js");
console.info('w3', source);
let contracts = JSON.parse(source)["contracts"];
console.info('w3', contracts);

var skillsMarketAbi = web3.eth.contract(JSON.parse(contracts['SkillsMarket.sol:SkillsMarket'].abi));
var skillsMarketBin = "0x" + contracts['SkillsMarket.sol:SkillsMarket'].bin;

console.info('w3', skillsMarketAbi);
console.info('w3', "=== ==== ===");
console.info('w3', skillsMarketBin);

// endregion

// region init the contract

var deployTransitionObject = {from: web3.eth.accounts[0], data: skillsMarketBin, gas: 2000000};
let skillsMarketContract = skillsMarketAbi.new(deployTransitionObject);

const receipt = web3.eth.getTransactionReceipt(skillsMarketContract.transactionHash);

console.info('w3', receipt);
console.info('w3', receipt.contractAddress);

const SkillsMarket = skillsMarketAbi.at(receipt.contractAddress);

// endregion

// region create an certificate

function createCertificate(profileName, skill, organization) {
	// TODO obtain data 
	// registerMemberSkills(address member, uint hashKey, bytes32 skill, uint spendHours, uint demandHours)
	var account = getAccountByName(profileName);
	var hashKey = (String(skill) + String(organization)).hashCode(); // TODO generate hashKey based on org and skill name
	var skillInBytes = web3.fromAscii(skill); // TODO convert skill string into bytes32
	var spendHours = 100; // optional
	var demandHours = 100; // optional

	console.log("w3", "Account: " + account);

	SkillsMarket.registerMemberSkills.sendTransaction(
		account,
		hashKey,
		skillInBytes, 
		spendHours, 
		demandHours,
		{from: account, gas: 300000}
	);
	
	// console.log("w3", "RegisterMemberSkills: ");
	
	// TODO wait till it would be executed on blockchain
	// TODO get a status and return back to the client
	const skillsLength = SkillsMarket.getSkillForMember(account);
	console.log("w3", "Amount of skills: " + skillsLength);
}

// endregion

// region ask for help

function prepareResponse(success, payload) {
	var item = { "success" : success, "payload" : String(payload)};
	return JSON.stringify(item);
}
 
function askForHelp(profileName, organisation, skill, time, cost) {
	return new Promise(function(resolve, reject) {
		console.log("w3", "start request");
		var callback = function(err, txHash) {
			console.log("w3", "receive tx callback");
			if (err) {
				console.log("w3", "reject");
				return reject(err);
			} else {
				console.log("w3", "resolve");
				return resolve(txHash);
			}
		}

        var account = getAccountByName(profileName); 
        var hashKey = (String(skill) + String(organisation)).hashCode();
		SkillsMarket.askForHelp.sendTransaction(
			hashKey,
			account,
			web3.fromAscii(skill),
			time,
			cost,
			{from: account, gas: 300000, value: cost},
			callback
		);

		console.log("w3", "end request");
	});
}

function startConsensus(currentNode, txHash, blockCount, timeout) {
    return new Promise(function(resolve, reject) {
        console.log("w3", "start consensus");
		addTransaction(txHash, false);
		var callback = function(err, recipe) {
            if (err) {
                console.log("w3", "Error due achieving consensus");
                return reject(err);
            } else {
                console.log("w3", recipe);
                updateTransaction(txHash, true);
                return resolve(txHash, true);
            }
		}

        ethereum.awaitBlockConsensus(currentNode, txHash, blockCount, timeout, callback);
    });
}

var skillRequestEvent = SkillsMarket.SkillRequest();
skillRequestEvent.watch(function(error, result) {
	if (error) {
		console.log("error: " + error);
	} else {
		console.log("result: " + result);
	}
});

// endregion

// region certify

function certify(mentorAccount, menteeAccount, skill, time) {
	return new Promise(function(resolve, reject) {
		console.log("w3", "[start] certify");
		var callback = function(err, txHash) {
			
			processInputForTransaction(txHash);
			
			if (err) {
				reject(prepareResponse(false, err));
			} else {
				resolve(prepareResponse(true, txHash));
			}

		};
		var hashKey = (String(skill) + String(ORGANISATION)).hashCode();
		SkillsMarket.certify.sendTransaction(
			mentorAccount, 
			menteeAccount, 
			hashKey, 
			time, 
			time * COST,
			{from: mentorAccount, gas: 3000000}, 
			callback);

		console.log("w3", "[end] certify");
	})
}

var mentorCertificationEvent = SkillsMarket.MentorCertification();
mentorCertificationEvent.watch(function(error, result) {
	if (error) {
		console.log("w3", "Mentor certify error: " + error);
	} else {
		console.log("w3", "Mentor certify result: " + result);
		console.log("w3", "Mentor certify result: " 
			+ result.mentor 
			+ " " 
			+ result.mentee);
	}
});

// endregion

// region Debug

var debugEventListener = SkillsMarket.Debug();
debugEventListener.watch(function(error, result) {
	if (error) {
		console.log("w3", "Debug error: " + error);
	} else {
		console.log("w3", "Debug: " + result.code);
	}
})

// endregion

// region transactions history

var history = [];

function trackHistory(from, to, skill, time) {
	console.log("w3", from);
	console.log("w3", to);
	console.log("w3", skill);
	console.log("w3", time);
	console.log("w3", "getNameByAccount(from): " + getNameByAccount(from));
	console.log("w3", "getNameByAccount(to): " + getNameByAccount(to));

	var item = { 
		"from" : getNameByAccount(from), 
		"to" : getNameByAccount(to), 
		"skill" : skill, 
		"time" : time
	};
	console.log("w3", item);
	history.push(JSON.stringify(item));
	console.log("w3", "history size: " + history.length);
} 

function getHistory() {
	console.log(history);
	return "[" + history + "]";
}

function getNameByAccount(account) {
	return getKeyByValue(profiles, account);
}

// endregion

// region transaction history

function transactionHistory() {
	return new Promise(function(resolve, reject) {
		console.log("w3", "start transactionHistory");
		var latestBlockId = web3.eth.getBlock("latest").number;
		while (latestBlockId > 0) {
			var block = web3.eth.getBlock(latestBlockId, true);
			for (var txId = 0; txId < block.transactions.length; txId++) {
				block.transactions.forEach(function(tx) {
					console.log("w3", tx);
					console.log("w3", web3.toAscii(tx.input));
					if (utils.isAccountInProfiles(profiles, tx.from)
						|| utils.isAccountInProfiles(profiles, tx.to)) {
						console.log("w3", "Hit result set");
						trackHistory(tx.from, tx.to, web3.toAscii(tx.input), "undefined");
					}
				});
			}
			latestBlockId--;
		}
		console.log("w3", "end transactionHistory");
		return resolve();
	});
}

// endregion

// region waiting queue 

var waitingQueue = [];

function getWaitingQueue() {
	console.log(transformQueueIntoJson());
	return transformQueueIntoJson();
}

function addToWaitingQueue(person, organisation, skill, time) {
	console.log("w3", "=====================");
	console.log("w3", "=====================");
	var item = { "person" : person, "skill" : skill, "time" : time, "mentored" : false};
	console.log("w3", "addToWaitingQueue");
	console.log("w3", item);
	waitingQueue.push(item);
	console.log("w3", "queue size: " + waitingQueue.length);
}

/**
 * conditions:
 * - one person -> one skill
 * - one person -> two skills
 * - one person -> skill (which is just completed) and the same person who ask for help again
 * 
 * solution:
 * - hold all data
 * - add boolean parameter as indicator of processed
 * - iterate over array to find righ tuple<person, skill>
 * - provide decorator whoch convert array of data into json format
 * */ 

function markedRequestAsProcessedInWaitingQueue(person, organisation, skill, time) {
	var size = waitingQueue.length;
	console.log("w3", "=====================");
	console.log("w3", "markedRequestAsProcessedInWaitingQueue");
	for (var idx = 0; idx < size; idx++) {
		console.log("w3", 
			"person: " + waitingQueue[idx].person + " " +
			"skill: " + waitingQueue[idx].skill + " " + 
			"mentored: " + waitingQueue[idx].mentored + " "
		);
		console.log("w3", 
			"person: " + person + " " +
			"skill: " + skill + " " 
		);
		if (waitingQueue[idx].person === person 
			&& waitingQueue[idx].skill === skill
			&& waitingQueue[idx].mentored === false) {
			
			console.log("w3", "waitingQueue[idx].mentored");
			waitingQueue[idx].mentored = true;
		}
	}
}

function transformQueueIntoJson() {
	var result = [];
	var size = waitingQueue.length;
	for (var idx = 0; idx < size; idx++) {
		result.push(JSON.stringify(waitingQueue[idx]));
	}
	return "[" + result + "]";
}

// endregion

// region transactions

var transactions = [];

function addTransaction(txHash, isMined) {
	console.log("w3", "addTransaction");
	var item = {};
	item[txHash] = isMined;
	transactions.push(item);
}

function updateTransaction(txHash, isMined) {
	var isProcessed = false;
	for (var idx = 0; idx < transactions.length; idx++) {
		for (var key in transactions[idx]) {
			if (txHash == key) {
				var item = {};
				item[txHash] = isMined;
				transactions[idx] = item;
				isProcessed = true;
				break;
			} 
		}
	}

	if (!isProcessed) {
		addTransaction(txHash, isMined);
	}
}

// endregion

// region decoder

// processInputForTransaction

function processInputForTransaction(txHash) {
	console.log("w3", "start - processInputForTransaction");
	const abi = JSON.parse(fs.readFileSync(ABI_PATH));
	const decoder = new InputDataDecoder(abi);

	web3.eth.getTransaction(txHash, (error, txResult) => {
		console.log("w3", "getTransaction callback - start");
		console.log("w3", txResult);
		const result = decoder.decodeData(txResult.input);
		console.log(result);
		console.log("w3", "getTransaction callback - end");
	});
	console.log("w3", "end - processInputForTransaction");
}

// endregion

// region users

function getUsers() {
	return dataset.users;
}

// endregion

// region helpers

function getAccountByName(searchKey) {
	var account;
	Object.keys(profiles).find(function(key) {
		if (key === searchKey) {
			account = profiles[key];
		}
	});
	return account;
}

function getItemByKey(data, searchKey) {
	return Object.keys(data).find(key => data[key] === searchKey);
}

function getKeyByValue(object, value) {
	return Object.keys(object).find(key => object[key] === value);
}

// endregion