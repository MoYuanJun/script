module.exports = [
  {
    user: 'root',
    port: 40000,
    // password: '可以配置密码, 这样就不用手动输入了',
    ip: '172.20.54.119',
    name: '集成框架(54.119)',
    path: '/opt/sgg/web/apache-tomcat-8.5.32/webapps',
  },
  {
    user: 'root',
    port: 22,
    ip: '172.20.54.141',
    name: 'BSC(54.141)',
    path: '/opt/sailing/web/apache-tomcat-8.5.32/webapps',
  },
  {
    user: 'root',
    port: 22,
    ip: '172.20.54.140',
    name: 'SCMS(54.140)',
    path: '/opt/sailing/web/apache-tomcat-8.5.32/webapps',
  }
];
