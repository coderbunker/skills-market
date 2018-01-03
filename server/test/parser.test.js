const subject = require('../parser/parser.js');

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545')); 

test('test parser - get data', () => {
    var input = '0xa5643bf20000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000464617665000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003';
    var params = ['bytes', 'bool', 'uint256[]'];
    var data = subject.parse(web3, input, params);
    
    expect(data[0].type).toBe('bytes');
    expect(data[0].data).toBe('dave');
    expect(data[1].type).toBe('bool');
    expect(data[1].data).toBe(true);
    expect(data[2].type).toBe('uint256[]');
    expect(data[2].data).toBe('1');
    expect(data[3].type).toBe('uint256[]');
    expect(data[3].data).toBe('2');
    expect(data[4].type).toBe('uint256[]');
    expect(data[4].data).toBe('3');
});

test('isDynamicType - bytes - true', () => {
    expect(subject.isDynamicType('bytes')).toBe(true);
});

test('isDynamicType - string - true', () => {
    expect(subject.isDynamicType('string')).toBe(true);
});

test('isDynamicType - uint256[] - true', () => {
    expect(subject.isDynamicType('uint256[]')).toBe(true);
});

test('isDynamicType - uint32 - false', () => {
    expect(subject.isDynamicType('uint32')).toBe(false);
});

test('createMapping - 5 params', () => {
    var input = '0xa5643bf20000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000464617665000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003';
    var params = ['bytes', 'bool', 'uint256[]'];
    var result = subject.createMapping(input, params);

    expect(result.length).toBe(3);

    expect(result[0].type).toBe('bytes');
    expect(result[0].begin).toBe(192);
    expect(result[0].end).toBe(256);

    expect(result[1].type).toBe('bool');
    expect(result[1].begin).toBe(64);
    expect(result[1].end).toBe(128);

    expect(result[2].type).toBe('uint256[]');
    expect(result[2].begin).toBe(320);
    expect(result[2].end).toBe(576);
});

test('test continuation bytes - dave as bytes', () => {
    var input = '6461766500000000000000000000000000000000000000000000000000000000';
    var result = web3.toUtf8(input);
    expect(result).toBe('dave');
});

test('parseTime - return item', () => {
    var data = "<BN: a>";
    var time = subject.parseTime(data);
    expect(time).toBe(10);
});

test('add signature - signatures size is incremented', () => {
    subject.addSignature(generateSignature());

    expect(subject.getSignatureSize()).toBe(1);
});

test('check valid signature - returns true', () => {
    subject.addSignature(generateSignature());
    const isTrackedTx = subject.isTrackedTransaction('0x6660339c0000000000000000000000004');

    expect(isTrackedTx).toBe(true);
});

test('check invalid signature - returns false', () => {
    subject.addSignature(generateSignature());
    const isTrackedTx = subject.isTrackedTransaction('0x234560339c0000000000000000000000004');

    expect(isTrackedTx).toBe(false);
});

function generateSignature() {
    return web3.sha3('certify(address,address,uint256,uint8,uint8)');
}