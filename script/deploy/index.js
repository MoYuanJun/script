#!/usr/bin/env node
const inquirer = require('inquirer');
const handler = require('./handler');
const promptList = require('./promptList');

inquirer.prompt(promptList).then(handler)
