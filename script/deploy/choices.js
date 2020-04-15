const shell = require('shelljs');

const company = shell.find('~/Company/ziliao')
  .filter(file => file.match(/put\.js$/))
  .map(file => require(file));

module.exports = [
  ... company,
];
