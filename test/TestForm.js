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

    it(`get value by key from array`, async() => {
        var account;
        var dmitry = Object.keys(users).find(key => account = users[key]);
        
        assert.equal(account, '0xa475dbd06aef482ab49349c54fccfd34b9a4bfd8');
    });

    it(`obtain profile for key`, async() => {
        var acc = getData("Dmitry");

        assert.equal(acc, "0xa475dbd06aef482ab49349c54fccfd34b9a4bfd8");
    });

    it(`generate hash function`, async() => {
        var str = "Dmitry" + "testOrg";
        var strHashCode = str.hashCode();
        console.log("Hash code: " + strHashCode);

        assert.equal(1, 1);
    });
    
    it(`get hash code from string inside function`, async() => {
        var hashKey = createCertificate("Java", "Coderbunker");
        console.log("w3", hashKey);
        assert.equal(1, 1);
    });

    it(`ask for the account - account doesn't exist - there is an empty string`, async() => {
        var acc = getAccountByName("Alex");
        assert.equal(acc, "");
    });

    it(`get account name inside array - false account - key doesn't exist`, async() => {
        assert.equal('Alex' in users, false); 
    });

    it(`covvert byte input back to string`, async() => {
        var input = "0x0d844af3000000000000000000000000717b5f971bb51ab1b18d4c14f7b6460a4fc3a6e0ffffffffffffffffffffffffffffffffffffffffffffffffffffffff915b27d9526561637400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000064";
        assert.equal(web3.toUtf8(input), "React");
    });
})

var users = {
	'Dmitry' : '0xa475dbd06aef482ab49349c54fccfd34b9a4bfd8',
	'Ricky' : '0xd51577c17cce88196c5bf8bd8107a277a74590ff',
	'Abhishek' : '0xd51577c17cce88196c5bf8bd8107a277a74590ff'
}

function createCertificate(skill, organization) {
	// TODO obtain data 
	// registerMemberSkills(address member, uint hashKey, bytes32 skill, uint spendHours, uint demandHours)
    var hashKey = (String(skill) + String(organization)).hashCode(); // TODO generate hashKey based on 
    return hashKey;
}

function getAccountByName(key) {
    var account;
    Object.keys(users).find(key => account = users[key]);
    return account;
}

String.prototype.hashCode = function() {
    var hash = 0;
    if (this.length == 0) {
        return hash;
    }
    for (var i = 0; i < this.length; i++) {
        char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

