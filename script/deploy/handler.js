const shell = require('shelljs');
const ora = require('ora');
const choices = require('./choices');
const node_ssh = require('node-ssh');
const compressing = require('compressing');
require('colors');

const ssh = new node_ssh();

const Spinner = ora();

// 延时
const delayed = time => new Promise(resolve => {
  setTimeout(resolve, time)
});

// 连接服务
const connectSearve = (options) => new Promise(resolve => {
  ssh.connect(options).then(() => {
    Spinner.succeed('连接服务器成功!'.green);
    resolve(true);
  }).catch((err) => {
    Spinner.fail(`连接服务器失败! 输入密码: ${options.password}`.red);
    shell.exit(0);
  });
});

// 删除远程代码
const removeCode = (command) => new Promise(resolve => {
  ssh.execCommand(command).then(() => {
    Spinner.succeed('删除远程旧代码成功!'.green);
    resolve(true);
  }).catch(() => {
    Spinner.fail('删除远程旧代码失败!'.red);
    shell.exit(0);
  });
});

//压缩build文件
const buildZip = () => new Promise(resolve => {
  let spinner = ora('正在压缩文件\n');
  spinner.start();
  compressing.zip.compressDir(
    './build',
    './ROOT.zip',
  )
    .then(() => {
      spinner.succeed('压缩build文件成功'.green);
      resolve(true);
    })
    .catch(err => {
      spinner.fail('压缩build文件失败'.red);
      shell.exit(0);
    });
});

//解压文件夹
const unZip = ({ storagePath }) => new Promise(resolve => {
  let spinner = ora('正在解压文件\n');
  spinner.start();
  ssh.execCommand('unzip -oq ROOT.zip', { cwd: storagePath }).then((res) => {
    if (res.code === 0) {
      spinner.succeed('解压成功!'.green);
      ssh.execCommand('mv build ROOT', { cwd: storagePath });
      resolve(true);
    } else {
      spinner.fail('解压失败!'.red);
      shell.exit(0);
    }
  }).catch(() => {
    spinner.fail('解压失败!'.red);
    shell.exit(0);
  });
});

// 上传文件
const putDirectory = ({ storagePath }) => new Promise(resolve => {
  let spinner = ora('正在上传文件\n');
  spinner.start();
  ssh.putFile(
    './ROOT.zip',
    storagePath + '/ROOT.zip'
  ).then(e => {
    spinner.succeed('上传成功'.green);
    resolve(true);
  }).catch(error => {
    spinner.fail('上传失败'.red);
    shell.exit(0);
  });
});

// 删除服务器zip和本地zip包
const deleteZip = async ({ storagePath }) => {
  await removeCode(`rm -rf ${storagePath}/ROOT.zip`);
  shell.rm('-rf', './ROOT.zip');
};

module.exports = async (answers) => {
  const { password: inputPassword, project, ok, build } = answers;
  const {
    ip,
    user,
    password,
    port = 22,
    path: storagePath,
  } = choices.find(v => v.name === project);

  !ok && shell.exit(0);

  build && await shell.exec('npm run build');

  // 1. 本地build文件夹删除模拟 api
  shell.rm('-rf', './build/api');

  // 2. 压缩build 文件
  await buildZip();

  // 3. 建立 SSH 连接
  await connectSearve({
    port,
    host: ip,
    username: user,
    password: inputPassword || password,
  });

  // 4. 删除远程 ROOT包
  await removeCode(`rm -rf ${storagePath}/*ROOT*`);

  // 延时等待
  await delayed(1000);

  // 5. 上传文件夹
  await putDirectory({ storagePath });

  // 6.服务器端解压文件夹
  await unZip({ storagePath });

  // 7.删除服务器zip包和本地zip包
  await deleteZip({ storagePath });

  Spinner.succeed('项目部署成功!'.green);
  shell.exit(0);
};
