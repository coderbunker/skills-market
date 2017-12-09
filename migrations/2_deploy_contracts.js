var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");
var Market = artifacts.require("./Market.sol");
var Test = artifacts.require("./Test.sol");
var TestArray = artifacts.require("./TestArray.sol");
var SkillsMarket3 = artifacts.require("./SkillsMarket3.sol");
var Storage = artifacts.require("./Storage.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
  deployer.deploy(Market);
  deployer.deploy(Test);
  deployer.deploy(TestArray);
  deployer.deploy(SkillsMarket3);
  deployer.deploy(Storage);
};
