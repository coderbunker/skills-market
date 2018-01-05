const signatures = [];

const ELEMENT_SIZE = 64;

const output = [];

/**
 * Dynamic part:
 * - begin = offset since the begining of string, point out on array length
 * - end   = offset of the end of the last element in array
 *  (* in case of bytes we should skip length of the array *)
 */

module.exports = {

	parse(web3, input, params) {
		const mapping = module.exports.createMapping(input, params);
		const size = JSON.parse(JSON.stringify(mapping.length));
		input = module.exports.getInputWithoutSignature(input);
		for (let id = 0; id < size; id++) {
			const locator = mapping[id];
			module.exports.extractData(
				id,
				input,
				locator.type,
				locator.begin,
				locator.end
			);
		}
		return module.exports.convertFromHexToData(web3, output);
	},

	pushData(data, type) {
		const item = {};
		item.type = type;
		item.data = data;
		output.push(item);
	},

	extractData(id, input, type, begin, end) {
		// for dynamic part calculate amount of elements
		// for static part extract data from start to end
		if (module.exports.isDynamicType(type)) {
			// get the length of array
			module.exports.extractDynamicData(input, type, begin, end);
		} else {
			const element = input.slice(begin, end);
			// data.push(element);
			module.exports.pushData(element, type);
		}
	},

	extractDynamicData(input, type, begin, end) {
		let element = input.slice(begin, end);
		let length = parseInt(element, 16);
		let offset = begin + ELEMENT_SIZE;
		if (module.exports.isTypeIsArray(type)) {
			element = input.slice(begin, begin + ELEMENT_SIZE);
			element = `0x${element}`;
			length = parseInt(element, 16);
			offset = begin + ELEMENT_SIZE;
			for (let id = 0; id < length; id++) {
				element = input.slice(offset, offset + ELEMENT_SIZE);
				module.exports.pushData(element, type);
				offset += ELEMENT_SIZE;
			}
		} else if (module.exports.isDynamicType(type)) {
			begin += ELEMENT_SIZE;
			end = begin + ELEMENT_SIZE;
			element = input.slice(begin, end);
			module.exports.pushData(element, type);
		} else {
			element = input.slice(begin, end);
			module.exports.pushData(element, type);
		}
	},

	createMapping(input, paramTypes) {
		const data = [];
		const str = module.exports.getInputWithoutSignature(input);
		let shift = 0;
		for (let id = 0; id < paramTypes.length; id++) {
			if (module.exports.isDynamicType(paramTypes[id])) {
				// process dynamic type
				// for dynamic param find amount of elements in the array
				let start = module.exports.findStartOfDynamicParam(str, shift);
				let end = module.exports
					.findEndOfDynamicParam(paramTypes[id], str, start);
				module.exports.addParamData(data, paramTypes[id], start, end);
				shift += ELEMENT_SIZE;
			} else {
				// process static type
				let start = shift;
				let end = module.exports.findEndOfStaticParam(shift);
				module.exports.addParamData(data, paramTypes[id], start, end);
				shift += ELEMENT_SIZE;
			}
		}
		return data;
	},

	findEndOfStaticParam(offset) {
		return offset + ELEMENT_SIZE;
	},

	findStartOfDynamicParam(str, offset) {
		const data = str.slice(offset, offset + ELEMENT_SIZE);
		const startOfArrayDataPart = parseInt(data, 16);
		return startOfArrayDataPart * 2;
	},

	findEndOfDynamicParam(paramType, str, offset) {
		// offset is a data locatior value which point out on the length of array
		const arrayDataPartEnd = offset + ELEMENT_SIZE;
		let end;
		if (module.exports.isTypeIsArray(paramType)) {
			const data = str.slice(offset, arrayDataPartEnd);
			const elementsCount = parseInt(data, 16);
			end = arrayDataPartEnd + elementsCount * ELEMENT_SIZE;
		} else {
			// in case of 'bytes' and 'string' we skip length of the
			// array and read data directly
			end = arrayDataPartEnd;
		}

		return end;
	},

	isDynamicType(paramType) {
		let result = false;
		if (paramType == 'bytes') {
			result = true;
		} else if (paramType == 'string') {
			result = true;
		} else if (module.exports.isTypeIsArray(paramType)) {
			result = true;
		}
		return result;
	},

	isTypeIsArray(paramType) {
		return paramType.substring(paramType.length - 2) == '[]';
	},

	addParamData(data, paramType, start, end) {
		// add begining and ending for this type
		const paramData = {};
		paramData.type = paramType;
		paramData.begin = start;
		paramData.end = end;
		data.push(paramData);
	},

	getInputWithoutSignature(data) {
		const start = 10;
		const end = data.length;
		return data.substring(start, end);
	},

	convertFromHexToData(web3, data) {
		const result = [];
		for (let id = 0; id < data.length; id++) {
			const converted = module.exports
				.convert(web3, data[id].type, data[id].data);
			result.push(converted);
		}
		return result;
	},

	convert(web3, dataType, data) {
		const result = {};
		result.type = dataType;
		result.data = 'tbd';
		switch (dataType) {
		case 'uint256[]':
		case 'uint256':
			result.data = web3.toBigNumber(module.exports.addHexPrefix(data))
					.toFixed();
			break;
		case 'bytes32':
		case 'bytes':
			result.data = web3.toUtf8(data);
			break;
		case 'uint32':
			result.data = parseInt(data, 16);
			break;
		case 'bytes3':
			result.data = web3.toUtf8(module.exports.addHexPrefix(data));
			break;
		case 'bool':
			result.data = parseInt(data, 16) == '1';
			break;
		case 'uint':
		case 'uint8':
			result.data = parseInt(data, 16);
			break;
		case 'address':
			result.data = web3.toUtf8(`0x ${data}`);
			break;
		default:
			console.log(dataType);
		}

		return result;
	},

	addSignature(signature) {
		const key = signature.substring(0, 10);
		signatures.push(key);
	},

	getParamsForSignature(input) {
		const key = input.substring(0, 10);
		const params = signatures[key];
		return params == 'undefined' ? [] : signatures[key];
	},

	getSignatureSize() {
		return signatures.length;
	},

	getSignatures() {
		return signatures;
	},

	isTrackedTransaction(input) {
		const key = input.substring(0, 10);
		return signatures.includes(key);
	},

	addHexPrefix(data) {
		return `0x${data}`;
	},

	parseSkillFromByteArrayInString(result) {
		const tokens = JSON.stringify(result.inputs[2]).split(':');
		let data = tokens[3];
		data = data.slice(0, data.length - 1);
		return data;
	},

	parseSkill(data) {
		const buffer = new Buffer(data).toString();
		const result = buffer.replace(/\0/g, '');
		return result;
	},

	parseTime(data) {
		data = JSON.stringify(data);
		data = data.substring(5, data.length - 2);
		const result = parseInt(data, 16);
		return result;
	},

	debug(data) {
		console.log(data);
	},
};
