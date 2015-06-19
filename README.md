# unserialize

Node.js port of PHP's unserialize

[![Build Status](https://travis-ci.org/abrkn/unserialize.svg?branch=master)](https://travis-ci.org/abrkn/unserialize)

## Installation

`npm install unserialize`

## Usage

```
var unserialize = require('unserialize');

console.log(unserialize('a:2:{s:4:"name";s:4:"Andy";s:3:"age";i:82;}'));

// { name: 'Andy', age: 82 }
```

## Tests

`npm test`

## Author

Andreas Brekken <andreas@brekken.co>

## License

ISC
