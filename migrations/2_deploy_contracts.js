var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");
var SkillsMarket = artifacts.require("./SkillsMarket.sol");
var Test = artifacts.require("./Test.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
  deployer.deploy(SkillsMarket);
  deployer.deploy(Test);
};
