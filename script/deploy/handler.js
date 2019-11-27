const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const shell = require('shelljs');
const choices = require('./choices');
const { readFileList } = require('../../utils');

module.exports = (answers) => {
  const { password, project, ok } = answers;
  const { user, ip, path: storagePath } = choices.find(v => v.name === project);
  if (!ok){shell.exit()}
  // 1. 删除模拟 api
  shell.rm('-rf', './build/api');

  // 2. 删除远程数据
  shell.exec(`expect ${path.resolve(__dirname, 'remove.sh')} ${user} ${password} ${ip} ${storagePath}`);

  // 3. 拷贝本地 build 包到远程
  shell.exec(`expect ${path.resolve(__dirname, 'cp.sh')} ${user} ${password} ${ip} ${storagePath}`);

  // 3. 删除本地 build 包
  // shell.rm('-rf', './build');
}
