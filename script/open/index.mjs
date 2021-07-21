#!/usr/bin/env node
import open from 'open';
import fs from 'fs';
import chalk from 'chalk';

try {
  const setting = fs.readFileSync('/Users/linheng/Works/doc/open-browser.json', 'utf-8');
  const openList = JSON.parse(setting)?.[process.argv?.[2]];

  if (!openList) {
    console.log(chalk.red('需要提供一个参数, 指定一个打开链接列表!'));
    process.exit(1);
  }

  openList.forEach(path => {
    open(path)
  })

  console.log(chalk.green('命令执行完成!'));
  process.exit(1);
} catch (e) {
  console.log(chalk.red(e));
}
