#!/usr/bin/env node
const shell = require('shelljs');
const colors = require('colors');
const inquirer = require('inquirer');
const folderName = process.argv[2];
let productLines = [];

// 1. 判断
if (!folderName) {
  shell.echo(colors.red('对不起，请给定项目目录名称！'));
  shell.exit(1);
}

if (!shell.which('git')) {
  shell.echo(colors.red('对不起，请先安装 git！'));
  shell.exit(1);
}

// 2. 克隆公共部分项目
shell.echo(colors.green('\n1. 开始克隆远程分支到本地......'));
if (shell.exec(`git clone -b dev-pub git@172.20.52.100:sailing/PUBLIC-WebConsoleFront.git ${folderName}`).code !== 0) {
  shell.echo(colors.red('克隆公共部分项目失败!'));
  shell.exit(1);
}
shell.cd(folderName);

// 3. 读取获取配置文件
try {
  const config = shell.cat('./bin/config.json');
  productLines = JSON.parse(config);
} catch (e){
  shell.echo(colors.red('读取配置文件失败!'));
  shell.exit(1);
}
if (productLines.length < 1){
  shell.echo(colors.red('未读取到有效生产线配置信息!'));
  shell.exit(1);
}

// 4. 采集用户数据, 并构建项目
inquirer.prompt([  {
  type: "list",
  name: "productLine",
  message: "请选择需要构建的项目",
  choices: productLines.map(v => ({ name: v.title, value: v }))
}]).then(({ productLine }) => {
  const { title, depository, customs, publickBranch } = productLine;

  // 4.1 切到公共部分指定分支
  publickBranch && shell.exec(`git checkout ${publickBranch}`);

  // 4.1 项目设置
  title && shell.sed('-i', /%PRODUCT_NAME%/g, title, 'public/index.html');

  // 4.2 拉取生产线
  shell.rm('-rf', 'src/productLine');
  shell.echo(colors.green('\n2. 开始拉取生产线代码......'));
  if (depository && shell.exec(`git clone ${depository} src/productLine`).code !== 0) {
    shell.echo('克隆生产线项目失败');
    shell.exit(1);
  }

  // 4.3 拷贝默认定制化配置
  customs && shell.cp('-R', `customs/${customs}/defaultConfig.js`, 'src/conf/defaultConfig.js');

  // 4.4 删除其余配置
  shell.rm('-rf', '.git/');
  shell.rm('-rf', 'bin/');
  shell.rm('-rf', 'customs/');

  // 4.5 安装依赖包
  shell.echo(colors.green('\n3. 正在安装项目依赖......'));
  if (shell.exec(`npm i`).code !== 0) {
    shell.echo('项目依赖安装失败!');
    shell.exit(1);
  }

  shell.echo(colors.green('\n4. 脚本执行完成！'));
})
