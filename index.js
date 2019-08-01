#!/usr/bin/env node
const program = require('commander');
const version = require('./package.json').version;

program
  .version(version)
  .description('测试 cli 命令工具')
  // program.add 将返回 undefined 或者 true， 
  // 表示 hello-cli 在执行时是否使用了选项 -a 或 --add
  .option('-a, --add', '是否添加文件')
  // 通过 --no 获取相反值， program.remove 将返回 true 或者 false
  // 执行 hello-cli --no-remove 则 program.remove 将返回  false
  .option('--no-remove', '是否禁止移除')
  // 下面多单词的情况下可通过 program.addFile 获取 cli 执行情况
  .option('--add-file', '是否添加文件')
  // 通过 <必填内容> 规定在使用 -p 选项情况下必须跟随参数，program.print 将获取到参数内容
  .option('-p, --print <必填内容>', '指定打印输出')
    // 通过 [必填内容] 规定在使用 -p 选项情况下可填内容，program.console 将获取到参数内容
    .option('-c, --console <选填内容>', '指定 console 内容')
  .parse(process.argv);  

console.log(program.add);
console.log(program.remove);
console.log(program.addFile);
console.log(program.print);
console.log(program.console);
