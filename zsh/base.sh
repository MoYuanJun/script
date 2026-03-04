#region 别名配置

## 以非分页形式查看 git 提交记录

# 以非分页形式查看 git 分支
alias mgb="git --no-pager branch"

# 查看 git 提交记录
mglo() {
  git --no-pager log --graph --decorate \
    --date=format:'%Y-%m-%d %H:%M:%S' \
    --format='%C(auto)%h%Creset %ad %C(green)%an <%ae>%Creset %s %C(auto)%d%Creset' \
    -n "${1:-20}"
}
#endregion
