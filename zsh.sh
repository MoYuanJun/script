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

## 1.3 切换到上一个分支
alias gcpre="git checkout ${PRE_BR}"

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

## 2.2 合并分支到 dev
function gmdev {
  # - 获取当前分支名
  brWithStar=`git branch | grep "*"`;
  currBr=${brWithStar/* /};

  # - 暴露出环境变量, 方便快速回退到分支
  export PRE_BR=${currBr}

  # - 切换到 develop 并拉取最新代码
  git checkout develop && git pull;

  # - 合并分支代码到 develop
  git merge ${currBr}
}
