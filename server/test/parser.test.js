const subject = require('../parser/parser.js');

const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

const input = '0xa5643bf2' +
	+ '0000000000000000000000000000000000000000000000000000000000000060' +
	+ '0000000000000000000000000000000000000000000000000000000000000001' +
	+ '00000000000000000000000000000000000000000000000000000000000000a0' +
	+ '0000000000000000000000000000000000000000000000000000000000000004' +
	+ '6461766500000000000000000000000000000000000000000000000000000000' +
	+ '0000000000000000000000000000000000000000000000000000000000000003' +
	+ '0000000000000000000000000000000000000000000000000000000000000001' +
	+ '0000000000000000000000000000000000000000000000000000000000000002' +
	+ '0000000000000000000000000000000000000000000000000000000000000003';

test('test parser - get data', () => {
	const params = ['bytes', 'bool', 'uint256[]'];
	const data = subject.parse(web3, input, params);

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
	const params = ['bytes', 'bool', 'uint256[]'];
	const result = subject.createMapping(input, params);

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
	const testInput = '646176650000000000000000000000000' +
		+ '0000000000000000000000000000000';
	const result = web3.toUtf8(testInput);
	expect(result).toBe('dave');
});

test('parseTime - return item', () => {
	const data = '<BN: a>';
	const time = subject.parseTime(data);
	expect(time).toBe(10);
});

test('add signature - signatures size is incremented', () => {
	subject.addSignature(generateSignature());

	expect(subject.getSignatureSize()).toBe(1);
});

test('check valid signature - returns true', () => {
	subject.addSignature(generateSignature());
	const testInput = '0x6660339c0000000000000000000000004';
	const isTrackedTx = subject.isTrackedTransaction(testInput);

	expect(isTrackedTx).toBe(true);
});

test('check invalid signature - returns false', () => {
	subject.addSignature(generateSignature());
	const testInput = '0x234560339c0000000000000000000000004';
	const isTrackedTx = subject.isTrackedTransaction(testInput);

	expect(isTrackedTx).toBe(false);
});

function generateSignature() {
	return web3.sha3('certify(address,address,uint256,uint8,uint8)');
}
