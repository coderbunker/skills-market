import { error } from 'util';

// region constant

const API_V1_PREFIX = '/api/v1';

const ORGANISATION = 'Organisation';
const COST = 10;
const BLOCK_COUNT_FULL_LOAD = 12;
const BLOCK_COUNT_HACKATHON = 0;

const ABI_PATH = 'abi.json';

const isHackathon = true;

// endregion

// region imports

const InputDataDecoder = require('ethereum-input-data-decoder');
const fs = require('fs');
const Web3 = require('web3');
const express = require('express');
const app = express();

const debug = require('debug')('utseus-api');
const cors = require('cors');
const parser = require('./parser/parser.js');
const config = require('./config.js');
const http = require('./http.js');
const dataset = require('./dataset.js');
const ethereum = require('./ethereum.js');
const Promise = require('promise');
const utils = require('./controllers/utils.js');


// endregion

// region initiate Web3


const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
console.info('w3', web3.eth.accounts);

parser.addSignature(
  web3.sha3('certify(address,address,bytes32,uint256,uint8,uint8)'),
  ['address', 'address', 'uint256', 'uint8', 'uint8']);

parser.addSignature(
  web3.sha3('askForHelp(uint256,address,bytes32,uint,uint)'),
  ['uint256', 'address', 'bytes32', 'uint', 'uint']);

const abi = JSON.parse(fs.readFileSync(ABI_PATH));
const decoder = new InputDataDecoder(abi);

// endregion

// region runtime storage

let profiles = {}; // eslint-disable-line

createProfiles(); // eslint-disable-line

function createProfiles() {
  const users = utils.getUsers();
  const { accounts } = web3.eth;
  let idx = 0;
  for (; idx < users.length; idx += 1) {
    profiles[users[idx]] = accounts[idx];
  }
}

// endregion

app.use(cors());

String.prototype.hashCode = function() { // eslint-disable-line
  let hash = 0;
  if (this.length === 0) {
    return hash;
  }
  let i = 0;
  for (; i < this.length; i += 1) {
    const char = this.charCodeAt(i);
    hash = ((hash<<5)-hash) + char;  // eslint-disable-line
    // Convert to 32bit integer
    hash = hash & hash; // eslint-disable-line  
  }
  return hash;
};

let Contract;

function processDemoRequest() {
  return new Promise((resolve, reject) => {
    const callback = function (err, txHash) {
      if (err) {
        return reject(err);
        // eslint-disable-next-line no-else-return
      } else {
        return resolve(txHash);
      }
    };
    // eslint-disable-next-line no-use-before-define
    const account = getAccountByName();
    Contract.funcCall.sendTransaction(
      { from: account, gas: 300000, value: 1 },
      callback);
  });
}

app.post(`${API_V1_PREFIX}/demo`, (req, res) => {
  processDemoRequest()
    .then((txHash) => {
      // eslint-disable-next-line no-use-before-define
      res.status(http.BAD_REQUEST).send(prepareResponse(false, txHash));
    })
    .catch(() => {
      // eslint-disable-next-line no-use-before-define
      res.status(http.BAD_REQUEST).send(prepareResponse(false, error));
    });
});

app.get(`${API_V1_PREFIX}/users`, (req, res) => {
  console.log('w3', 'request users');
  const json = utils.getUsers();
  res.status(http.SUCCESS).json(json);
});

app.get(`${API_V1_PREFIX}/queue`, (req, res) => {
  // eslint-disable-next-line no-use-before-define
  res.send(getWaitingQueue());
});

app.get(`${API_V1_PREFIX}/skills`, (req, res) => {
  res.send(dataset.skills);
});

app.post(`${API_V1_PREFIX}/help/:mentee/:skill/:time`, (req, res) => {
  // TODO validate there is such profile
  const profileName = req.params.mentee;
  const { skill } = req.params;
  const { time } = req.params;
  if (!(profileName in profiles)) {
    res.status(http.BAD_REQUEST)
      .send(utils.prepareResponse('User is not valid'));
  } else {
    console.log('Process help request');
    // eslint-disable-next-line no-use-before-define
    askForHelp(profileName, ORGANISATION, skill, time, COST)
      .then((txHash) => {
        console.log('Initiate consensus');
        console.log('Hash: " + txHash');
        // eslint-disable-next-line no-use-before-define
        addToWaitingQueue(profileName, ORGANISATION, skill, time);
        const blockCount = isHackathon ?
          BLOCK_COUNT_HACKATHON : BLOCK_COUNT_FULL_LOAD; // considered as an optimal for start 
        const timeout = 15 * 60;
        // eslint-disable-next-line no-use-before-define
        res.status(http.SUCCESS).send(prepareResponse(true, txHash));
        // eslint-disable-next-line no-use-before-define
        return startConsensus(web3, txHash, blockCount, timeout);
      })
      .catch((err) => {
        console.log(err);
        // eslint-disable-next-line no-use-before-define
        res.status(http.BAD_REQUEST).send(prepareResponse(false, err));
      });
    console.log('Process help request [end]');
  }
});

app.post(`${API_V1_PREFIX}/mentoring/:mentor/:mentee/:skill/:time`, (req, res) => {
  const { mentor } = req.params;
  const { mentee } = req.params;
  const { skill } = req.params;
  const { time } = req.params;
  if (!(mentor in profiles) || !(mentee in profiles)) {
    res.status(http.BAD_REQUEST).send(utils.prepareResponse('User is not registered'));
  } else {
    // eslint-disable-next-line no-use-before-define
    certify(getAccountByName(mentor), getAccountByName(mentee), skill, time)
      .then((txHash) => {
        console.log('Initiate consensus');
        const blockCount = isHackathon ?
          BLOCK_COUNT_HACKATHON : BLOCK_COUNT_FULL_LOAD; // considered as an optimal for start 
        const timeout = 15 * 60;
        // eslint-disable-next-line no-use-before-define
        res.status(http.SUCCESS).send(prepareResponse(true, txHash));
        // eslint-disable-next-line no-use-before-define
        markedRequestAsProcessedInWaitingQueue(mentee, ORGANISATION, skill);
        // eslint-disable-next-line no-use-before-define
        return startConsensus(web3, txHash, blockCount, timeout);
      })
      .catch((err) => {
        // eslint-disable-next-line no-use-before-define
        res.status(http.BAD_REQUEST).send(prepareResponse(false, err));
      });
  }
});

app.get(`${API_V1_PREFIX}/dashboard`, (req, res) => {
  console.log('request dashboard');
  // eslint-disable-next-line no-use-before-define
  history = [];
  // eslint-disable-next-line no-use-before-define
  transactionHistory().then(() => {
    // eslint-disable-next-line no-use-before-define
    const json = JSON.parse(getHistory());
    res.status(http.SUCCESS).json(json);
  });
});

app.post(`${API_V1_PREFIX}/register/:member/:skill`, (req, res) => {
  const { member } = req.params;
  const { skill } = req.params;
  // eslint-disable-next-line no-use-before-define
  registerMemberWithSkill(member, skill).then(({ status, message }) => {
    res.status(status).send(message);
  });
});

app.get(`${API_V1_PREFIX}/validate/:txhash`, (req, res) => {
  const txHash = req.params.txhash;
  // eslint-disable-next-line no-use-before-define
  checkReceipt(txHash)
    .then((message) => {
      res.status(http.SUCCESS).send(message);
    })
    .catch((message) => {
      res.status(http.BAD_REQUEST).send(message);
    });
});

function checkReceipt(txHash) {
  return new Promise((validate, reject) => {
    const receipt = web3.eth.getTransactionReceipt(txHash);
    if (receipt === null) {
      // eslint-disable-next-line no-use-before-define
      return reject(prepareResponse(false, 'No receipt for this txHash'));
      // eslint-disable-next-line no-else-return
    } else {
      const json = JSON.parse(JSON.stringify(receipt));
      const status = json.status === 1;
      // eslint-disable-next-line no-use-before-define
      return validate(prepareResponse(status, JSON.stringify(receipt)));
    }
  });
}

function registerMemberWithSkill(member, skill) {
  return new Promise((fulfill) => {
    // eslint-disable-next-line no-use-before-define
    createCertificate(member, skill, ORGANISATION);
    fulfill({
      status: http.SUCCESS,
      message: utils.prepareResponse('user was successfully registered'),
    });
  });
}

app.listen(config.port, () => {
  debug('App started at port %d', config.port);
});

// endregion

process.stdout.write('starting web3..');

// region deploy the contract

const source = fs.readFileSync('SkillsMarket.js');
console.info(source);
// eslint-disable-next-line prefer-destructuring
const { contracts } = JSON.parse(source);
console.info(contracts);

const skillsMarketAbi = web3.eth.contract(JSON.parse(contracts['SkillsMarket.sol:SkillsMarket'].abi));
const skillsMarketBin = `0x${contracts['SkillsMarket.sol:SkillsMarket'].bin}`;

console.info(skillsMarketAbi);
console.info('=== ==== ===');
console.info(skillsMarketBin);

// endregion

// region init the contract

const deployTransitionObject = { from: web3.eth.accounts[0], data: skillsMarketBin, gas: 2000000 };
const skillsMarketContract = skillsMarketAbi.new(deployTransitionObject);

const receipt = web3.eth.getTransactionReceipt(skillsMarketContract.transactionHash);

console.info(receipt);
console.info(receipt.contractAddress);

const SkillsMarket = skillsMarketAbi.at(receipt.contractAddress);

// endregion

// region create an certificate

function createCertificate(profileName, skill, organization) {
  // eslint-disable-next-line no-use-before-define
  const account = getAccountByName(profileName);
  const hashKey = (String(skill) + String(organization)).hashCode();
  const skillInBytes = web3.fromAscii(skill);
  const spendHours = 100; // optional
  const demandHours = 100; // optional

  SkillsMarket.registerMemberSkills.sendTransaction(
    account,
    hashKey,
    skillInBytes,
    spendHours,
    demandHours,
    { from: account, gas: 300000 });
}

// endregion

// region ask for help

function prepareResponse(success, payload) {
  // eslint-disable-next-line quote-props
  const item = { 'success': success, 'payload': String(payload) };
  return JSON.stringify(item);
}

function askForHelp(profileName, organisation, skill, time, cost) {
  return new Promise((resolve, reject) => {
    const callback = (err, txHash) => {
      if (err) {
        return reject(err);
        // eslint-disable-next-line no-else-return
      } else {
        return resolve(txHash);
      }
    };
    // eslint-disable-next-line no-use-before-define
    const account = getAccountByName(profileName);
    const hashKey = (String(skill) + String(organisation)).hashCode();
    SkillsMarket.askForHelp.sendTransaction(
      hashKey,
      account,
      web3.fromAscii(skill),
      time,
      cost,
      { from: account, gas: 300000, value: cost },
      callback);
  });
}

function startConsensus(currentNode, txHash, blockCount, timeout) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-use-before-define
    addTransaction(txHash, false);
    const callback = (err, recipe) => {
      if (err) {
        console.log('Error due achieving consensus');
        return reject(err);
        // eslint-disable-next-line no-else-return
      } else {
        console.log(recipe);
        // eslint-disable-next-line no-use-before-define
        updateTransaction(txHash, true);
        return resolve(txHash, true);
      }
    };

    ethereum.awaitBlockConsensus(currentNode, txHash, blockCount, timeout, callback);
  });
}

const skillRequestEvent = SkillsMarket.SkillRequest();
skillRequestEvent.watch((skillError, result) => {
  if (skillError) {
    console.log(`error: ${error}`);
  } else {
    console.log(`result: ${result}`);
  }
});

// endregion

// region certify

function certify(mentorAccount, menteeAccount, skill, time) {
  return new Promise((resolve, reject) => {
    console.log('[start] certify');
    const callback = (err, txHash) => {
      if (err) {
        reject(prepareResponse(false, err));
      } else {
        // eslint-disable-next-line no-use-before-define
        processInputForTransaction(txHash);
        resolve(prepareResponse(true, txHash));
      }
    };
    const hashKey = (String(skill) + String(ORGANISATION)).hashCode();
    SkillsMarket.certify.sendTransaction(
      mentorAccount,
      menteeAccount,
      web3.fromAscii(skill),
      hashKey,
      time,
      time * COST,
      { from: mentorAccount, gas: 3000000 },
      callback);
  });
}

const mentorCertificationEvent = SkillsMarket.MentorCertification();
mentorCertificationEvent.watch((mentorError, result) => {
  if (mentorError) {
    console.log(`Mentor certify error: ${mentorError}`);
  } else {
    console.log(`Mentor certify result: ${result}`);
    console.log(`Mentor certify result: ${result.mentor} ${result.mentee}`);
  }
});

// endregion

// region Debug

const debugEventListener = SkillsMarket.Debug();
debugEventListener.watch((debugEventError, result) => {
  if (error) {
    console.log(`Debug error: ${error}`);
  } else {
    console.log(`Debug: ${result.code}`);
  }
});

// endregion

// region transactions history

let history = [];

function getHistory() {
  console.log(history);
  return `[${history}]`;
}

function getNameByAccount(account) {
  // eslint-disable-next-line no-use-before-define
  return getKeyByValue(profiles, account);
}

// endregion

// region transaction history

function transactionHistory() {
  return new Promise((resolve) => {
    let latestBlockId = web3.eth.getBlock('latest').number;
    while (latestBlockId > 0) {
      const block = web3.eth.getBlock(latestBlockId, true);
      block.transactions.forEach(function(tx) {
        if (parser.isTrackedTransaction(tx.input)) {
          const result = decoder.decodeData(tx.input);
          var isItRightTx2 = JSON.stringify(result) != JSON.stringify({});
          if (isItRightTx2) {
            console.log(result);
            console.log("===");
            console.log("Skill (unparsed): " + result.inputs[2]);
            console.log("===");
            var item = { 
              "from" : getNameByAccount("0x" + result.inputs[0]), 
              "to" : getNameByAccount("0x" + result.inputs[1]), 
              "skill" : parser.parseSkill(result.inputs[2]), 
              "time" : parser.parseTime(result.inputs[4])
            };
            history.push(JSON.stringify(item));
            console.log(history);
          }
        }
      });
      latestBlockId -= 1;
    }

    console.log('end transactionHistory. Start track history');
    return resolve();
  });
}

// endregion

// region waiting queue

const waitingQueue = [];

function getWaitingQueue() {
  // eslint-disable-next-line no-use-before-define
  console.log(transformQueueIntoJson());
  // eslint-disable-next-line no-use-before-define
  return transformQueueIntoJson();
}

function addToWaitingQueue(person, organisation, skill, time) {
  // eslint-disable-next-line quote-props,object-curly-new-line
  const item = { 'person': person, 'skill': skill, 'time': time, 'mentored': false };// eslint-disable-line object-curly-newline
  waitingQueue.push(item);
}

/**
 * conditions:
 * - one person -> one skill
 * - one person -> two skills
 * - one person -> skill (which is just completed) and the same person who ask for help again
 * solution:
 * - hold all data
 * - add boolean parameter as indicator of processed
 * - iterate over array to find righ tuple<person, skill>
 * - provide decorator whoch convert array of data into json format
 * */

function markedRequestAsProcessedInWaitingQueue(person, organisation, skill) {
  const size = waitingQueue.length;
  console.log('=====================');
  console.log('markedRequestAsProcessedInWaitingQueue');
  let idx = 0;
  for (idx = 0; idx < size; idx += 1) {
    if (waitingQueue[idx].person === person
      && waitingQueue[idx].skill === skill
      && waitingQueue[idx].mentored === false) {
      waitingQueue[idx].mentored = true;
    }
  }
}

function transformQueueIntoJson() {
  const result = [];
  const size = waitingQueue.length;
  let idx = 0;
  for (; idx < size; idx += 1) {
    result.push(JSON.stringify(waitingQueue[idx]));
  }
  return `[${result}]`;
}

// endregion

// region transactions

const transactions = [];

function addTransaction(txHash, isMined) {
  console.log('addTransaction');
  const item = {};
  item[txHash] = isMined;
  transactions.push(item);
}

function updateTransaction(txHash, isMined) {
  let isProcessed = false;
  let idx = 0;
  for (; idx < transactions.length; idx += 1) {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in transactions[idx]) { // eslint-disable-line vars-on-top
      if (txHash === key) {
        const item = {};
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
  web3.eth.getTransaction(txHash, (txError, txResult) => {
    const result = decoder.decodeData(txResult.input);
    console.log(result);
  });
}

// endregion

// region users

// eslint-disable-next-line no-unused-vars
function getUsers() {
  return dataset.users;
}

// endregion

// region helpers

function getAccountByName(searchKey) {
  let account;
  Object.keys(profiles).find(function(key) {
    if (key === searchKey) {
      account = profiles[key];
    }
  });
  return account;
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

// endregion
