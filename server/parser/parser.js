var types = {
    'offset' : 10,
    'uint256' : 64,
    'address' : 64,
    'bytes32' : 64, // TODO check me
    'uint32' : 64,
    'bytes3' : 64,
    'bool' : 64,
    'uint' : 64,
    'uint8' : 64
}

var ELEMENT_SIZE = 64;

var output = [];

/**
 * Dynamic part:
 * - begin = offset since the begining of string, point out on array length
 * - end   = offset of the end of the last element in array
 *  (* in case of bytes we should skip length of the array *)
 */

module.exports = {

    test: function(input) {
        input = module.exports.getInputWithoutSignature(input);
        console.log(input);
        var str = input.slice(384, 576);
        return str;
    },

    parse: function(web3, input, params) {
        const mapping = module.exports.createMapping(input, params);
        const size = JSON.parse(JSON.stringify(mapping.length));;
        input = module.exports.getInputWithoutSignature(input);
        for (var id = 0; id < size; id++) {
            var locator = mapping[id];
            module.exports.extractData(id, 
                input, 
                locator.type, 
                locator.begin, 
                locator.end);
        }

        return module.exports.getData();
        // return module.exports.convertFromHexToData(web3, module.exports.getData());
    },

    getData: function() {
        return output;
    },

    pushData: function(data, type) {
        console.log(type + " : " + data);
        var item = new Object();
        item.type = type;
        item.data = data;
        output.push(item);
    },

    extractData: function(id, input, type, begin, end) {
        // for dynamic part calculate amount of elements 
        // for static part extract data from start to end
        if (module.exports.isDynamicType(type)) {
            // get the length of array
            module.exports.extractDynamicData(input, type, begin, end);
        } else {
            var element = input.slice(begin, end);
            // data.push(element);
            module.exports.pushData(element, type);
        }
    },

    extractDynamicData: function(input, type, begin, end) {
        var element = input.slice(begin, end);
        var length = parseInt(element, 16);
        var offset = begin + ELEMENT_SIZE;
        console.log("TYPE: " + type);
        if (module.exports.isTypeIsArray(type)) {
            var element = input.slice(begin, begin + ELEMENT_SIZE);
            element = '0x' + element;
            var length = parseInt(element, 16);
            var offset = begin + ELEMENT_SIZE;
            for (var id = 0; id < length; id++) {
                var element = input.slice(offset, offset + ELEMENT_SIZE);
                module.exports.pushData(element, type);
                offset += ELEMENT_SIZE;
            }
        } else if (module.exports.isDynamicType(type)) {
            begin = begin + ELEMENT_SIZE;
            end = begin + ELEMENT_SIZE;
            var element = input.slice(begin, end);
            module.exports.pushData(element, type);
        } else {
            var element = input.slice(begin, end);
            module.exports.pushData(element, type);
        }
    },

    createMapping: function(input, paramTypes) {
        var data = [];
        var str = module.exports.getInputWithoutSignature(input);
        var shift = 0;
        for (var id = 0; id < paramTypes.length; id++) {
            if (module.exports.isDynamicType(paramTypes[id])) {
                // process dynamic type
                // for dynamic param find amount of elements in the array
                var start = module.exports.findStartOfDynamicParam(str, shift);
                var end = module.exports.findEndOfDynamicParam(paramTypes[id], str, start);
                module.exports.addParamData(data, paramTypes[id], start, end);
                shift += ELEMENT_SIZE;
            } else {
                // process static type
                var start = shift;
                var end = module.exports.findEndOfStaticParam(shift);
                module.exports.addParamData(data, paramTypes[id], start, end);
                shift += ELEMENT_SIZE;
            }
        }
        return data;
    },    

    findEndOfStaticParam: function(offset) {
        return offset + ELEMENT_SIZE;
    },

    findStartOfDynamicParam: function(str, offset) {
        var data = str.slice(offset, offset + ELEMENT_SIZE);
        var startOfArrayDataPart = parseInt(data, 16);
        return startOfArrayDataPart * 2; 
    },

    findEndOfDynamicParam: function(paramType, str, offset) {
        // offset is a data locatior value which point out on the length of array
        var arrayDataPartEnd = offset + ELEMENT_SIZE;
        var end;
        if (module.exports.isTypeIsArray(paramType)) {
            var data = str.slice(offset, arrayDataPartEnd);
            var elementsCount = parseInt(data, 16);
            end = arrayDataPartEnd + elementsCount * ELEMENT_SIZE;
        } else {
            // in case of 'bytes' and 'string' we skip length of the array and read data directly
            end = arrayDataPartEnd;
        }
        
        return end;
    },

    isDynamicType: function(paramType) {
        var result = false;
        if (paramType == 'bytes') {
            result = true;
        } else if (paramType == 'string') {
            result = true;
        } else if (module.exports.isTypeIsArray(paramType)) {
            result = true;
        }
        return result;
    },

    isTypeIsArray: function(paramType) {
        return paramType.substring(paramType.length - 2) == '[]';
    },

    addParamData: function(data, paramType, start, end) {
        // add begining and ending for this type
        var paramData = new Object();
        paramData.type = paramType;
        paramData.begin = start;
        paramData.end = end;
        data.push(paramData);
    },

    getInputWithoutSignature: function(data) {
        var start = 10;
        var end = data.length;
        return data.substring(start, end);
    },

    convertFromHexToData: function(web3, data) { 
        var result = [];
        for (var id = 0; id < data.length; id++) {
            var converted = module.exports.convert(web3, data[id].type, data[id].data);
            result.push(converted);
        }
        return result;
    },

    convert: function(web3, dataType, data) {
        var result = new Object();
        result.type = dataType;
        result.data = "tbd";
        data = '0x' + data;
        switch(dataType) {
          case 'uint256[]':
          case 'uint256':
            var dataInHex = module.exports.addHexPrefix(data);
            result.data = web3.toBigNumber(dataInHex).toFixed();
            break;
          case 'bytes32':
          case 'bytes':
            result.data = web3.toUtf8(data);
            break;
          case 'uint32':
            result.data = parseInt(data, 16);
            break;
          case 'bytes3':
            var dataInHex = module.exports.addHexPrefix(data);
            result.data = web3.toUtf8(dataInHex);
            break;
          case 'bool':
            var boolAsInt = parseInt(data, 16);
            result.data = boolAsInt == '1';
            break;
          case 'uint':
          case 'uint8':
            result.data = parseInt(data, 16);
            break; 
          case 'address':
            var dataInHex = '0x' + data;
            result.data = web3.toUtf8(dataInHex);
            break;
          default:
            throw 'Unsupported data type: ' + dataType;
        }

        return result; 
    },
  
    addHexPrefix: function(data) {
        return '0x' + data;
    },

    debug: function(data) {
        console.log(data);
    }
}