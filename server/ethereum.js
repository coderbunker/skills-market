
var types = {
  'offset' : 10,
  'uint256' : 64,
  'address' : 64,
  'bytes32' : 64, // TODO check me
  'uint32' : 64,
  'bytes3' : 64,
  'bool' : 64,
  'uint' : 64,
  'uint8' : 64
}

module.exports = {

    printTransaction: function(eth, txHash) {
        eth.getTransaction(txHash, function(err, result) {
          console.log("w3", "getTransaction");
          if (err) {
            console.log("w3", err);
          } else {
            console.log("  tx hash          : " + result.hash + "\n"
              + "   nonce           : " + result.nonce + "\n"
              + "   blockHash       : " + result.blockHash + "\n"
              + "   blockNumber     : " + result.blockNumber + "\n"
              + "   transactionIndex: " + result.transactionIndex + "\n"
              + "   from            : " + result.from + "\n" 
              + "   to              : " + result.to + "\n"
              + "   value           : " + result.value + "\n"
              + "   gasPrice        : " + result.gasPrice + "\n"
              + "   gas             : " + result.gas + "\n"
              + "   input           : " + result.input);
          }
        });
    },

    printTransactionReceipt: function(eth, txHash) {
        eth.getTransactionReceipt(txHash, function(err, result) {
          console.log("w3", "getTransactionReceipt");
          if (err) {
            console.log("w3", err);
          } else {
            console.log("w3", result);
          }
        });

        // var txReceipt = eth.getTransactionReceipt(txHash);
        // if (txReceipt != null) {
        //   console.log(
        //     "blockHash : " + txReceipt.blockHash + "\n" + 
        //     "gasUsed   : " + txReceipt.gasUsed + "\n"
        //   );
        // }
    },

    printBlock: function(eth, block) {
        console.log("Block number     : " + block.number + "\n"
            + " hash            : " + block.hash + "\n"
            + " parentHash      : " + block.parentHash + "\n"
            + " nonce           : " + block.nonce + "\n"
            + " sha3Uncles      : " + block.sha3Uncles + "\n"
            + " logsBloom       : " + block.logsBloom + "\n"
            + " transactionsRoot: " + block.transactionsRoot + "\n"
            + " stateRoot       : " + block.stateRoot + "\n"
            + " miner           : " + block.miner + "\n"
            + " difficulty      : " + block.difficulty + "\n"
            + " totalDifficulty : " + block.totalDifficulty + "\n"
            + " extraData       : " + block.extraData + "\n"
            + " size            : " + block.size + "\n"
            + " gasLimit        : " + block.gasLimit + "\n"
            + " gasUsed         : " + block.gasUsed + "\n"
            + " timestamp       : " + block.timestamp + "\n"
            + " transactions    : " + block.transactions + "\n"
            + " uncles          : " + block.uncles);
        if (block.transactions != null) {
          console.log("--- transactions ---");
          block.transactions.forEach( function(e) {
            module.exports.printTransaction(e);
          })
        }
    },

    printUncle: function(eth, block, uncleNumber, uncle) {
        console.log("Block number     : " + block.number + " , uncle position: " + uncleNumber + "\n"
          + " Uncle number    : " + uncle.number + "\n"
          + " hash            : " + uncle.hash + "\n"
          + " parentHash      : " + uncle.parentHash + "\n"
          + " nonce           : " + uncle.nonce + "\n"
          + " sha3Uncles      : " + uncle.sha3Uncles + "\n"
          + " logsBloom       : " + uncle.logsBloom + "\n"
          + " transactionsRoot: " + uncle.transactionsRoot + "\n"
          + " stateRoot       : " + uncle.stateRoot + "\n"
          + " miner           : " + uncle.miner + "\n"
          + " difficulty      : " + uncle.difficulty + "\n"
          + " totalDifficulty : " + uncle.totalDifficulty + "\n"
          + " extraData       : " + uncle.extraData + "\n"
          + " size            : " + uncle.size + "\n"
          + " gasLimit        : " + uncle.gasLimit + "\n"
          + " gasUsed         : " + uncle.gasUsed + "\n"
          + " timestamp       : " + uncle.timestamp + "\n"
          + " transactions    : " + uncle.transactions + "\n");
    },

    getMinedBlocks: function(eth, miner, startBlockNumber, endBlockNumber) {
        if (endBlockNumber == null) {
            endBlockNumber = eth.blockNumber;
            console.log("Using endBlockNumber: " + endBlockNumber);
        }
        if (startBlockNumber == null) {
            startBlockNumber = endBlockNumber - 10000;
            console.log("Using startBlockNumber: " + startBlockNumber);
        }
        console.log("Searching for miner \"" + miner + "\" within blocks "  + startBlockNumber + " and " + endBlockNumber + "\"");
        
        for (var i = startBlockNumber; i <= endBlockNumber; i++) {
            if (i % 1000 == 0) {
              console.log("Searching block " + i);
            }
            var block = eth.getBlock(i);
            if (block != null) {
              if (block.miner == miner || miner == "*") {
                console.log("Found block " + block.number);
                module.exports.printBlock(block);
              }
              if (block.uncles != null) {
                for (var j = 0; j < 2; j++) {
                  var uncle = eth.getUncle(i, j);
                  if (uncle != null) {
                    if (uncle.miner == miner || miner == "*") {
                      console.log("Found uncle " + block.number + " uncle " + j);
                      module.exports.printUncle(block, j, uncle);
                    }
                  }          
                }
              }
            }
        }
    },

    getMyMinedBlocks: function(eth, startBlockNumber, endBlockNumber) {
        module.exports.getMinedBlocks(eth.accounts[0], startBlockNumber, endBlockNumber);
    },

    getBlockFromTransaction: function(eth, txHash) {
        eth.getTransaction(txHash, function(err, result) {
            return result.blockNumber;
        });
    }, 

    // @method awaitBlockConsensus
    // @param web3s[0] is the node you submitted the transaction to,  the other web3s 
    //    are for cross verification, because you shouldn't trust one node.
    // @param txhash is the transaction hash from when you submitted the transaction
    // @param blockCount is the number of blocks to wait for.
    // @param timout in seconds 
    // @param callback - callback(error, transaction_receipt) 
    // @link {https://ethereum.stackexchange.com/questions/1187/how-can-a-dapp-detect-a-fork-or-chain-reorganization-using-web3-js-or-additional}
    awaitBlockConsensus: function(txWeb3, txhash, blockCount, timeout, callback) {
      var startBlock = Number.MAX_SAFE_INTEGER;
      var interval;
      var stateEnum = { start: 1, mined: 2, awaited: 3, confirmed: 4, unconfirmed: 5 };
      var savedTxInfo;
      var attempts = 0;
   
      var pollState = stateEnum.start;
   
      var poll = function() {
        if (pollState === stateEnum.start) {
          txWeb3.eth.getTransaction(txhash, function(e, txInfo) {
            if (e || txInfo == null) {
              return; // XXX silently drop errors
            }
            if (txInfo.blockHash != null) {
              startBlock = txInfo.blockNumber;
              savedTxInfo = txInfo;
              console.log("mined");
              pollState = stateEnum.mined;
            }
          });
        }
        else if (pollState == stateEnum.mined) {
            txWeb3.eth.getBlockNumber(function (e, blockNum) {
              if (e) {
                return; // XXX silently drop errors
              }
              console.log("blockNum: ", blockNum);
              if (blockNum >= (blockCount + startBlock)) {
                pollState = stateEnum.awaited;
              }
            });
        }
        else if (pollState == stateEnum.awaited) {
            txWeb3.eth.getTransactionReceipt(txhash, function(e, receipt) {
              if (e || receipt == null) {
                return; // XXX silently drop errors.  TBD callback error?
              }
              // confirm we didn't run out of gas
              // XXX this is where we should be checking a plurality of nodes.  TBD
              clearInterval(interval);
              if (receipt.gasUsed >= savedTxInfo.gas) {
                pollState = stateEnum.unconfirmed;
                callback(new Error("we ran out of gas, not confirmed!"), null);
              } else {
                pollState = stateEnum.confirmed;
                callback(null, receipt);
              }
          });
        } else {
          throw(new Error("We should never get here, illegal state: " + pollState));
        }
   
        // note assuming poll interval is 1 second
        attempts++;
        if (attempts > timeout) {
          clearInterval(interval);
          pollState = stateEnum.unconfirmed;
          callback(new Error("Timed out, not confirmed"), null);
        }
      };
   
      interval = setInterval(poll, 1000);
      poll();
    },

    parseDynamicInput: function(web3, input, params) {
      // data 
      var result = [];
      var shift = 0;
      for (var idx = 0; idx < params.length; idx++) {
        // TODO get offset from params
        // TODO get dynamic params, check length 
        var resultObj;
        if (params[idx].type == 'dynamic') {
          resultObj = module.exports.parseDynamic(web3, params[idx].data, input, params);
        } else {
          resultObj = module.exports.parseStatic();
        }
        for (var id = 0; id < resultObj.data.length; id++) {
          result.push(resultObj.data[id]);
        }
      }
      console.log(result);
    },

    parseDynamic: function(web3, data, originInput, dataPointer) {
      var result = new Object();
      result.data = [];
      result.offset = 0;

      var pointer = parseInt(dataPointer, 16);
      var shift = pointer * 2;
      if (data instanceof Array) {
        for (var idx = 0; idx < data.length; idx++) {
          var resultObj = module.exports.extractData(originInput, data[idx], shift);
          result.data.push(resultObj.data);
          shift = resultObj.offset;
        }
      } else {
        // we can not use shift here as it doesn't go within the order 
        var resultObj = module.exports.extractData(originInput, data, shift);
        result.data.push(resultObj.data);
      }

      result.offset = shift;
      return result;
    },

    parseStatic: function(web3, input, params) {

    },

    extractData: function(input, parameter, shift) {
      var offset = types[param];
      var data = originInput.slice(shift, shift + offset);
      shift += offset;

      var result = new Object();
      result.data = data;
      result.offset = offset;  
      return result;
    },

    parseInput: function(web3, input, params) {
      var result = [];
      var shift = 0;
      for (var idx = 0; idx < params.length; idx++) {
        var param = params[idx];
        var offset = types[param];
        
        // TODO right straightforward alg first
        // TODO static types - get type from array and read the data
        // TODO right padding data - the same plus add '0x' for conversion
        // TODO dynamic data - look for data location bytes, use them as offset to read the data 

        // module.exports.debug("Shift:     " + shift);
        // module.exports.debug("Shift end: " + (shift + offset));
        
        var data = input.slice(shift, shift + offset);
        result.push(data);
        shift += offset;

        module.exports.debug("Data: " + data);
        try {
          module.exports.printToken(web3, param, data);
        } catch(err) {
          console.log("=== === ===");
          console.log("Error");
          console.log(err);
          console.log("=== === ===");
        }
      }
      // TODO get order of parameters
      // TODO for each parameter get binded integer
      // TODO got through input and with offset make a shift
    },

    parseRightPaddedData: function(web3) {
      // [OK!] 'Hello World!'
      var dataInput = '0x48656c6c6f2c20776f726c642100000000000000000000000000000000000000';
      var result = web3.toUtf8(dataInput);
      console.log("result: " + result);

      // abc
      var dataInput2 = '0x6162630000000000000000000000000000000000000000000000000000000000';
      var result2 = web3.toUtf8(dataInput2);
      console.log("result2: " + result2);

      // def
      var dataInput3 = '0x6465660000000000000000000000000000000000000000000000000000000000';
      var result3 = web3.toUtf8(dataInput3);
      console.log("result3: " + result3);
    },

    printToken: function(web3, dataType, data) {
      console.log("printToken");
      switch(dataType) {
        case 'uint256':
          // web3.toBigNumber(data);
          var dataInHex = module.exports.addHexPrefix(data);
          module.exports.debug('uint256 type');
          module.exports.debug(web3.toBigNumber(dataInHex).toFixed());
          break;
        case 'address':
          module.exports.debug('address type');
          module.exports.debug(data);
          break;
        case 'bytes32':
          module.exports.debug('bytes32 type');  
          module.exports.debug(web3.toUtf8(data));
          break;  
        case 'uint32':
          // [TEST PASSED]
          module.exports.debug('uint32 type');
          module.exports.debug(parseInt(data, 16));
          break;
        case 'bytes3':
          // [TEST PASSED]
          var dataInHex = module.exports.addHexPrefix(data);
          module.exports.debug('bytes3: ' + dataInHex);
          module.exports.debug(web3.toUtf8(dataInHex));
          break;
        case 'bool':
          // [TEST PASSED]
          module.exports.debug('bool type');
          var boolAsInt = parseInt(data, 16);
          module.exports.debug(boolAsInt == '1');
          break;
        case 'uint':
          // [TEST PASSED]
          module.exports.debug('uint type');
          module.exports.debug(parseInt(data, 16));
          break;
        case 'uint8':
          // [TEST PASSED]
          module.exports.debug('uint8 type');
          module.exports.debug(parseInt(data, 16));
          break; 
        case 'address':
          var dataInHex = '0x' + data;//module.exports.addHexPrefix(data);
          module.exports.debug('address type: ' + dataInHex);
          module.exports.debug(web3.toUtf8(dataInHex));
          break;
      }
    },

    addHexPrefix: function(data) {
      return '0x' + data;
    },

    debug: function(data) {
      console.log(data);
    },

}