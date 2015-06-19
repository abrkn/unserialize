/* global describe, it */
import expect from 'expect.js';
import unserialize from '.';

describe('unserialize', () => {
    it('can read null', () => {
        const serialized = 'N;';
        const expected = null;

        const unserialized = unserialize(serialized);
        expect(unserialized).to.be(expected);
    });

    it('can read string', () => {
        const serialized = 's:4:"test";';
        const expected = 'test';

        const unserialized = unserialize(serialized);
        expect(unserialized).to.be(expected);
    });

    it('can read empty string', () => {
        const serialized = 's:0:"";';
        const expected = '';

        const unserialized = unserialize(serialized);
        expect(unserialized).to.be(expected);
    });

    it('can read int', () => {
        const serialized = 'i:500;';
        const expected = 500;

        const unserialized = unserialize(serialized);
        expect(unserialized).to.be(expected);
    });

    it('can read decimal', () => {
        const serialized = 'd:1.0000000000000001E-5;';
        const expected = 1e-5;

        const unserialized = unserialize(serialized);
        expect(unserialized).to.be(expected);
    });

    it('can read array', () => {
        const serialized = 'a:0:{}';
        const expected = {};

        const unserialized = unserialize(serialized);
        expect(unserialized).to.eql(expected);
    });

    it('can read boolean', () => {
        const serialized = 'b:0;';
        const expected = false;

        const unserialized = unserialize(serialized);
        expect(unserialized).to.be(expected);
    });

    it('can read nested arrays', () => {
        const serialized = 'a:1:{i:0;a:0:{}}';
        const expected = { "0": {} };

        const unserialized = unserialize(serialized);
        expect(unserialized).to.eql(expected);
    });

    it('passes example 1', () => {
        const serialized = 'a:2:{s:4:"name";s:4:"Andy";s:3:"age";i:82;}';

        const expected = {
            name: 'Andy',
            age: 82
        };

        const unserialized = unserialize(serialized);

        expect(unserialized).to.eql(expected);
    });

    it('passes example 2', () => {
        const serialized = 'a:1:{s:9:"something";a:4:{s:6:"result";s:19:"123456-AAAAA-XXXXXX";s:5:"abcde";N;s:2:"xy";i:3;s:3:"bog";a:1:{s:6:"oooooo";i:123;}}}';

        const expected = {
            something: {
                result: '123456-AAAAA-XXXXXX',
                abcde: null,
                xy: 3,
                bog: {
                    oooooo: 123
                }
            }
        };

        const unserialized = unserialize(serialized);

        expect(unserialized).to.eql(expected);
    });

    it('finds arrays', () => {
        const serialized = 'a:5:{i:0;i:1;i:1;i:2;i:2;i:3;i:3;i:4;i:4;i:5;}';

        const expected = [1, 2, 3, 4, 5];

        const unserialized = unserialize(serialized);

        expect(unserialized).to.eql(expected);
    });

    it('defaults to object', () => {
        const serialized = 'a:3:{i:0;i:9;i:1;i:8;i:2;s:1:"x";}';

        const expected = {
            0: 9,
            1: 8,
            2: 'x'
        };

        const unserialized = unserialize(serialized);

        expect(unserialized).to.eql(expected);
    });
});
