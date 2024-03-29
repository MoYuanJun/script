# 加载自定义配置, 需要在 source $ZSH/oh-my-zsh.sh 引入自定义配置

npm run link

# source ~/.qy/zsh.sh
# source $ZSH/oh-my-zsh.sh

# 环境变量配置
# export MANPATH="/usr/local/man:$MANPATH"

# 别名配置

## 1.1 添加所有修改、并允许 npm 脚本进行提交
alias gnc="git add . && npm run commit || npm run cz"

## 1.2 npm run 快捷命令
alias nr="npm run"

## 1.3 进入 /Users/linheng/Works/insight_v2
alias cdi="cd /Users/linheng/Works/insight_v2"

## 1.4 进入 /Users/linheng/Works/insight-manager
alias cdim="cd /Users/linheng/Works/insight-manager"

# 自定义函数: $1 $2 …… 分别接收第一参数、第二参数……

## 2.1 git 开启新的版本
function gbn() {
  # 切换 master
  git checkout master;

  # 更新远程信息
  git pull;
  git fetch;

  # 清除本地那些没有超前于主分支的分支
  git branch --no-color --merged | command grep -vE "^(\+|\*|\s*($(git_main_branch)|development|develop|devel|dev)\s*$)" | command xargs -n 1 git branch -d

  # 删除那些远程已经删除的本地分支记录
  git remote prune origin;

  # 判断是否输入参数(, 如果有的话将自动切一个分支
  if [ "$1" ] ; then
    release=`git branch -r | grep "release"`
    git checkout -b $1 ${release/  /''} # ${release/  /'' 将两个空格替换为 ''
    git branch --unset-upstrea; # 取消上游信息的设置
  else
    echo '未指定分支后缀! 无法切新分支'
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

## 2.3 切换到上一个分支
function gcpre {
  echo "上一个分支: ${PRE_BR}"
  git checkout ${PRE_BR}
}

echo 'xxxx'