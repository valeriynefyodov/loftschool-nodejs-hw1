const fs = require('fs');
const path = require('path');

// Считается ли использование этого модуля
// как реализация с вспомогательными модулями?
//
// Использую исключительно, чтобы удобнее было
// передавать параметры
const args = require('yargs')
  .usage('$0 [args]')
  .option('i', {
    alias: 'input-dir',
    default: 'messy',
    describe: 'directory than should be sorted',
    type: 'string'
  })
  .option('o', {
    alias: 'output-dir',
    default: 'sorted',
    describe: 'directory with sorted content',
    type: 'string'
  })
  .option('d', {
    alias: 'delete-origin',
    default: false,
    describe: 'should the original directory be deleted',
    type: 'boolean'
  })
  .help()
  .argv;

const sortDirectory = require('./sorting-module');

const shouldDelete = args.d,
  messyDir = path.resolve(__dirname, args.i),
  sortedDir = path.resolve(__dirname, args.o);


sortDirectory(messyDir, sortedDir, shouldDelete);