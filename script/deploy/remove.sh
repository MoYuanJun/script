#!/usr/bin/expect
# spawn是进入expect环境后才可以执行的expect内部命令
# 设置超时时间, 避免未上传完就挂了
set timeout -1
set user [lindex $argv 0]
set password [lindex $argv 1]
set ip [lindex $argv 2]
set path [lindex $argv 3]

spawn ssh $user@$ip "rm -rf $path/*"

expect {
  "(yes/no)?" { send "yes\r"; exp_continue }
  "password:" { send "$password\r" }
}

expect eof
