const boxen = require('boxen');
const colors = require('colors');
const choices = require('./choices');

module.exports = [
  {
    type: "list",
    message: "选择项目",
    name: "project",
    choices: choices,
  },
  {
    type: "password",
    message: "密码",
    name: "password",
  },
  {
    name: "ok",
    type: "confirm",
    default: false,
    message: ({ project }) => {
      const { user, ip, path, name } = choices.find(v => v.name === project);
      const message = [
        { label: 'SSH 用户', value: user },
        { label: 'SSH IP', value: ip },
        { label: '项目备注名称', value: name },
        { label: '项目存储路径', value: path },
      ].reduce((mes, item) => {
        const br = mes ? '\n' : '';
        const label = `${item.label}: `.green;
        const value = `${item.value}`.yellow;
        return `${mes}${br}${label}${value}`;
      },'');
      const options = {
        padding: 1,
        borderColor: 'green',
      };
      console.log(boxen(message, options));
      return '是否确认当前选择?'
    },
  },
];
