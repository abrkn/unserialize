# unserialize

Node.js port of PHP's unserialize

TODO: build status

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
