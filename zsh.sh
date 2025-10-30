# 加载自定义配置需要在 source $ZSH/oh-my-zsh.sh 引入自定义配置
# 1. 编辑终端配置文件 .zshrc、.bashrc
# 2. 在文件中添加 source ~/[项目目录]/zsh.sh.  =>  其实就是将项目目录下的 zsh.sh 文件引入到终端配置文件中
# 3. 在终端中执行 source ~/.zshrc 或 source ~/.bashrc 使配置生效

#region 环境变量配置
# export MANPATH="/usr/local/man:$MANPATH"
#endregion

#region 别名配置

## 1.1 添加所有修改、并允许 npm 脚本进行提交
alias gnc="git add . && npm run commit || npm run cz"

## 1.2 npm run 快捷命令
alias nr="npm run"

#endregion

#region 自定义函数 定义函数: $1 $2 …… 分别接收第一参数、第二参数……

## 检测当前分支是否有未合并到目标分支的提交
function gCheck() {
  # 1. 获取当前分支（推荐用 git 自带命令）
  currBr=$(git branch --show-current)

  # 2. 没有输入目标分支则抛出错误
  if [ -z "$1" ]; then
    echo "\033[31m请输入目标分支\033[0m"
    return 1
  fi

  # 3. 目标分支
  targetBr=$1;

  # 4. 拉取远程目标分支(/dev/null 2>&1: 把标准输出(stdout) 和 标准错误(stderr) 都重定向到“黑洞”（即不显示任何输出）)
  git fetch origin $targetBr >/dev/null 2>&1

  # 5. 打印当前分支和目标分支
  echo "当前分支: $currBr"
  echo "目标分支: $targetBr"
  echo "\n"

  # 6. 检测当前分支是否有未合并到目标分支的提交
  if git cherry origin/$targetBr $currBr | grep -q '^+'; then
    echo "\033[31m🚧 $currBr 有未合并到 $targetBr 的提交\033[0m"
  else
    echo "\033[32m✅ $currBr 已完全合并到 $targetBr\033[0m"
  fi
}
#endregion
