const SkillsMarket = artifacts.require('../test/SkillsMarket.sol');

contract('SkillsMarket', function(accounts) {

    it(`check conversion`, async() => {
        var data = 10;
        var data2 = 10;
        assert.equal(data + data2, 20);
    });

    it(`check conversion - string to int ad sum after that`, async() => {
        var data = '10';
        var data2 = 10;
        var result;

        console.log(typeof(data));

        result = parseInt(result, data);
        assert.equal(result + data2, 20);
    });
    

})

