#!/usr/bin/env node
const shell = require('shelljs');
const inquirer = require('inquirer');
const handler = require('./handler');
const promptList = require('./promptList');

// 1. 校验是否安装 expect
if (!shell.which('expect')) {
  shell.echo('请先安装 expect!');
  shell.exit(1);
}

inquirer.prompt(promptList).then(handler)
