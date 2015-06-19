import assert from 'assert';
import lodash from 'lodash';

// Node.js version of PHP's unserialize.
export default function unserialize(buffer, opts) {
    opts = lodash.extend({
        emptyArray: {},
        useMap: false,
        findArrays: true
    }, opts)

    if (typeof buffer == 'string') {
        buffer = new Buffer(buffer);
    }

    assert(Buffer.isBuffer(buffer));

    let offset = 0;

    function readChar() {
        return String.fromCharCode(buffer[offset++]);
    }

    function expectChar(expected) {
        const char = readChar();
        if (char === expected) { return; }
        throw new Error(`Expect char "${expected}" but got "${char}" at ${offset-1}`);
    }

    function readValue() {
        const type = readChar();

        if (type == 'N') { return readNullValue(); }
        if (type == 'i') { return readIntValue(); }
        if (type == 'd') { return readDecimalValue(); }
        if (type == 'b') { return readBooleanValue(); }
        if (type == 's') { return readStringValue(); }
        if (type == 'a') { return readArrayValue(); }

        throw new Error(`Unknown data type ${type} at ${offset-1}`);
    }

    function mapToObject(map) {
        const res = {}
        for (let [key, value] of map) {
            res[key] = value;
        }
        return res;
    }

    // a:n:{val1;val2;...valn};
    function readArrayValue() {
        expectChar(':');
        const length = readInt(':');
        expectChar('{');
        const map = new Map();
        for (let i = 0; i < length; i++) {
            const key = readValue();
            const value = readValue();
            map.set(key, value);
        }
        expectChar('}');

        // Parsing is complete.
        if (!map.size) { return opts.emptyArray; }

        if (!opts.findArrays) {
            return opts.useMap ? map : mapToObject(map)
        }

        // Detect array (keys 0..size-1 are defined)
        for (var i = 0; i < map.size; i++) {
            if (map.has(i)) { continue; }
            if (opts.useMap) { return map; }

            // Convert to object {"a":1,"b":2}
            return mapToObject(map);
        }

        // The map can be represented by an array
        return [...map.values()];
    }

    // i:123;
    function readIntValue() {
        expectChar(':');
        const value = readInt(';');
        return value;
    }

    // d:1.000e-3;
    function readDecimalValue() {
        expectChar(':');

        let res = '';

        while (offset < buffer.length) {
            const char = readChar();
            if (char === ';') { return parseFloat(res); }
            res += char;
        }

        throw new Error('End of buffer');
    }

    // b:0;
    function readBooleanValue() {
        const result = readIntValue();
        if (result === 0) { return false; }
        if (result === 1) { return true; }
        throw new Error(`Unexpected value for boolean, "${char} at ${offset-1}"`);
    }

    // N;
    function readNullValue() {
        expectChar(';');
        return null;
    }

    function readInt(untilChar) {
        let res = '';

        while (offset < buffer.length) {
            const char = readChar();
            if (char === untilChar) { return parseInt(res); }
            res += char;
        }
        throw new Error('End of buffer');
    }

    // s:3:abc;
    function readStringValue() {
        expectChar(':');
        const length = readInt(':');
        expectChar('"');
        const value = buffer.toString('utf8', offset, offset + length);
        offset += length;
        expectChar('"');
        expectChar(';');
        return value;
    }

    const result = readValue();
    if (offset < buffer.length) {
        throw new Error(`Buffer still has ${buffer.length - offset} bytes`);
    }
    return result;
};
