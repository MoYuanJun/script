#!/usr/bin/env node
const shell = require('shelljs');
const inquirer = require('inquirer');
const handler = (answers) => {
  console.log('--- 脚本开始　---');
  const { folder, productName, productProject, customs } = answers || {};
  if (!shell.which('git')) {
    shell.echo('对不起，请先安装 git');
    shell.exit(1);
  }
  if (shell.exec(`git clone git@172.20.52.100:sailing/PUBLIC-WebConsoleFront.git ${folder}`).code !== 0) {
    shell.echo('git clone 失败');
    shell.exit(1);
  }
  shell.cd(folder);
  shell.rm('-rf', '.git/');
  shell.rm('-rf', 'bin/');
  shell.sed('-i', /%PRODUCT_NAME%/g, productName, 'public/index.html');

  if (shell.exec(`git clone ${productProject} src/productLine`).code !== 0) {
    shell.echo('git clone 失败');
    shell.exit(1);
  }
  shell.cp('-R', `customs/${customs}/defaultConfig.js`, 'src/conf/defaultConfig.js');
  shell.rm('-rf', 'customs/');
  console.log('--- 脚本结束　---');
};

// 交互式数据获取
const promptList = [
  {
    type: "input",
    message: "项目名称",
    name: "folder",
  },
  {
    type: "input",
    message: "系统名称",
    name: "productName",
  },
  {
    type: "input",
    message: "产品线 git 远程仓库",
    name: "productProject",
  },
  {
    type: "input",
    message: "定制化文件名",
    name: "customs",
  },
  {
    type: "list",
    message: "项目选择",
    name: "customs_",
    choices: ['综合日志', '网络审计']
  },
];
inquirer.prompt(promptList).then(handler)
