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

test('parseSkill - return React', () => {
    var data = "<Buffer 52 65 61 63 74 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00>";
    var skill = subject.parseSkill(data);
    skill = web3.toUtf8(skill);
    expect(skill).toBe('React');
});

test('parseSkill - second attempt', () => {
    var data = "{\"type\":\"Buffer\",\"data\":[82,101,97,99,116,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}";
});

test('parseTime - return item', () => {
    var data = "<BN: a>";
    var time = subject.parseTime(data);
    expect(time).toBe(10);
});

test('write to buffer - return buffer', () => {
    // var data = "React";
    // var result = subject.printBuffer();
    // result = JSON.stringify(result);
    // console.log(result);
    // console.log(result.length);
    
    // console.log("String before: " + result.length);
    // var result = result.replace(/\0/g, '');
    // console.log("String before: " + result.length);
    // result = result.replace('\u0000', '');
    // result = result.substring(0, data.length);
    // console.log(result);
    // console.log(JSON.stringify(result));
    expect(result).toEqual(data);
});

// test('replace null utf8 symbols', () => {
//     var string = 'MyString\u0000\u0000\u0000';
//     console.log(string.length); // 11
//     console.log(string.replace(/\0/g, '').length); // 8

//     expect(string).toBe('MyString');
// });
