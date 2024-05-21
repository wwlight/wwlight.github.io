#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

git config --local user.name "wwlight"
git config --local user.email "1942459198@qq.com"

note=`git status`

git add -A
git commit -m "$note"

# git branch --set-upstream-to=github-origin/main main
# git branch --set-upstream-to=gitee-origin/master main

git push github-origin main
# git push gitee-origin main:master

cd /
