const users = [
  'Zara',
  'Nick',
  'Evelyn',
];

const transactions = [];

module.exports = {

  prepareResponse(message) {
    // TODO for now simple message is left for backward compatibility
    // var response = {'status' : status, 'message' : message};
    return message;
  },

  getAccountByName(profiles, searchKey) {
    console.log('w3', 'getAccountByName');
    let account;
    Object.keys(profiles).find((key) => {
      if (key === searchKey) {
        account = profiles[key];
        return account;
      }
      return false;
    });
    return account;
  },

  addTransaction(txHash, isMined) {
    console.log('w3', `addTransaction: ${txHash}`);
    const item = {};
    item[txHash] = isMined;
    transactions.push(item);
  },

  updateTransaction(txHash, isMined) {
    console.log('w3', `updateTransaction: ${txHash}`);
    let isProcessed = false;
    for (let idx = 0; idx < transactions.length; idx += 1) {
      // eslint-disable-next-line no-restricted-syntax
      for (const key in transactions[idx]) {
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
      module.exports.addTransaction(txHash, isMined);
    }
  },

  isAccountInProfiles(profiles, searchValue) {
    console.log('w3', 'isAccountInProfiles: ');
    const account = Object.keys(profiles)
      .find(key => profiles[key] === searchValue);
    return (typeof account !== 'undefined');
  },

  getKeyByValue(dataset, value) {
    return Object.keys(dataset).find(key => dataset[key] === value);
  },

  getUsers() {
    return users;
  },
};
