const shell = require('shelljs');

const companyPath = shell.find('~/Company/ziliao/put.js')[0];
const company = companyPath ?  require(companyPath) : [];

module.exports = [
  ... company,
];
