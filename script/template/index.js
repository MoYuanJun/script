#!/usr/bin/env node
const shell = require('shelljs');
const path = require('path');

const dirName = process.argv[2] || 'demo';

shell.cp('-Rf', path.resolve(__dirname, './demo/'), `./${dirName}`);
