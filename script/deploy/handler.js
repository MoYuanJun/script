const shell = require('shelljs');
const path = require('path');
const choices = require('./choices');
const node_ssh = require('node-ssh');
require('colors');

const ssh = new node_ssh();

// 延时
const delayed = time => new Promise(resolve => {
  setTimeout(resolve, time)
});

// 连接服务
const connectSearve = (options) => new Promise(resolve => {
  ssh.connect(options).then(() => {
    console.log('连接服务器成功!'.green);
    resolve(true);
  }).catch((err) => {
    console.log(`连接服务器失败! 输入密码: ${options.password}`.red, err);
    shell.exit(0);
  });
});

// 删除远程代码
const removeCode = ({ storagePath }) => new Promise(resolve => {
  ssh.execCommand(`rm -rf ${storagePath}/*`).then(() => {
    console.log('删除远程旧代码成功!'.green);
    resolve(true);
  }).catch(() => {
    console.log('删除远程旧代码失败!'.red);
    shell.exit(0);
  });
});

// 上传文件
const putDirectory = ({ storagePath }) => new Promise(resolve => {
  console.log('文件上传中.......'.grey);
  ssh.putDirectory(
    path.resolve(__dirname, '../../build'), 
    storagePath, 
    { recursive: true }
  ).then(v => {
    console.log('上传 build 成功!'.green);
    resolve(true);
  }).catch((err) => {
    console.log('上传 build 失败!'.red, err);
    shell.exit(0);
  });
});

module.exports = async (answers) => {
  const { password: inputPassword, project, ok } = answers;
  const { 
    ip, 
    user, 
    password,
    port = 22,
    path: storagePath,
  } = choices.find(v => v.name === project);

  // 建立 SSH 连接
  await connectSearve({
    port,
    host: ip,
    username: user,
    password: inputPassword || password,
  });

  // 1. 删除模拟 api
  shell.rm('-rf', './build/api');

  // 2. 删除远程 build 包
  await removeCode({ storagePath });

  await delayed(1000);

  // 3. 上传文件夹
  await putDirectory({ storagePath });
  console.log('项目部署成功!'.green);
  shell.exit(0);
}
