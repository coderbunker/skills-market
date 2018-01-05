var users = [
    'Zara',
    'Nick',
    'Evelyn'
];

var transactions = [];

module.exports = {

    prepareResponse : function(message) {
        // TODO for now simple message is left for backward compatibility
        // var response = {'status' : status, 'message' : message};
        return message;
    },

    getAccountByName : function(profiles, searchKey) {
        console.log("w3", "getAccountByName");
        var account;
        Object.keys(profiles).find(function(key) {
            if (key === searchKey) {
                account = profiles[key];
            }
        });
        return account;
    },

    addTransaction : function(txHash, isMined) {
        console.log("w3", "addTransaction: " + txHash);
        var item = {};
        item[txHash] = isMined;
        transactions.push(item);
    },

    updateTransaction : function(txHash, isMined) {
        console.log("w3", "updateTransaction: " + txHash);
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
            module.exports.addTransaction(txHash, isMined);
        }
    },

    isAccountInProfiles : function(profiles, searchValue) {
        console.log("w3", "isAccountInProfiles: ");
        var account = Object.keys(profiles).find(key => profiles[key] === searchValue);
        return (typeof account != "undefined");
    },

    getKeyByValue : function(dataset, value) {
        return Object.keys(dataset).find(key => dataset[key] === value);
    },

    getUsers : function() {
        return users;
    }
}