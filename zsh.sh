# 加载自定义配置, 需要在 source $ZSH/oh-my-zsh.sh 引入自定义配置
# source ~/.qy/zsh.sh
# source $ZSH/oh-my-zsh.sh

# 环境变量配置
# export MANPATH="/usr/local/man:$MANPATH"

# 别名配置

## 1.1 添加所有修改、并允许 npm 脚本进行提交
alias gnc="git add . && npm run commit"

## 1.2 npm run 快捷命令
alias nr="npm run"

# 自定义函数: $1 $2 …… 分别接收第一参数、第二参数……

## 2.1 git 开启新的版本
function gnv() {
  # 切换 master
  git checkout master;

  # 更新远程信息
  git pull;
  git fetch;

  # 清除本地那些没有超前于主分支的分支
  git branch --no-color --merged | command grep -vE "^(\+|\*|\s*($(git_main_branch)|development|develop|devel|dev)\s*$)" | command xargs -n 1 git branch -d

  # 删除那些远程已经删除的本地分支记录
  git remote prune origin;

  # 判断是否输入参数(版本号), 如果有的话将自动切一个版本分支出来
  if [ "$1" ] ; then
    git checkout -b develop-${USER}-$1 origin/release-$1;
    git branch --unset-upstrea; # 取消上游信息的设置
  else
    echo '未指定版本号! 无法切新分支'
  fi
}

## 2.2 切换到个人分支
function gcmdev() {
  br=`git branch | grep "${USER}"`
  echo ${br/* /}
  git checkout ${br/* /}
}

## 2.2 合并个人分支到 dev
function gmdev() {
  git checkout develop
  git pull

  br=`git branch | grep "develop-${USER}-${1}"`
  git merge ${br/* /}
}
