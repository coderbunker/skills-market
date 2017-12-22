const utils = require('./utils');
const ethereum = require('../ethereum.js');
const Promise = require('promise');

module.exports = {
    // something wrong with passing contract as a parameter inside function here
    askForHelp : function(web3, SkillsMarket, profileName, organisation, skill, time, cost) {
        console.log("w3", "print data");
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
    
            var account = utils.getAccountByName(profileName); 
            const result = SkillsMarket.getSkillForMember.call(account);
            console.log("w3", "Result: " + result);
            
            var hashKey = (String(skill) + String(organisation)).hashCode();
            SkillsMarket.askForHelp.sendTransaction(
                hashKey,
                account,
                web3.fromAscii(skill),
                time,
                time * cost,
                {from: account, gas: 300000, value: cost},
                callback
            );
            
            console.log("w3", "end request");
        });
    },

    startConsensus : function(currentNode, txHash, blockCount, timeout) {
        return new Promise(function(resolve, reject) {
            console.log("w3", "start consensus");
            utils.addTransaction(txHash, false);
            var callback = function(err, recipe) {
                // TODO process data on the node 
                if (err) {
                    console.log("w3", "Error due achieving consensus");
                    return reject(err);
                } else {
                    console.log("w3", recipe);
                    utils.updateTransaction(txHash, true);
                    // TODO track history
                    return resolve(txHash, true);
                }
            }
            ethereum.awaitBlockConsensus(currentNode, txHash, blockCount, timeout, callback);
        });
    }
}