# 终端配置

加载自定义配置需要在 source $ZSH/oh-my-zsh.sh 引入自定义配置

别名、方法名都已 m 开头, 表示墨渊君的缩写

## 设置

1. 编辑终端配置文件 .zshrc、.bashrc
2. 在文件中添加 source ~/[项目目录]/zsh/index.sh.  =>  其实就是将项目目录下的 zsh.sh 文件引入到终端配置文件中
3. 在终端中执行 source ~/.zshrc 或 source ~/.bashrc 使配置生效


> region 环境变量配置
> export MANPATH="/usr/local/man:$MANPATH"
