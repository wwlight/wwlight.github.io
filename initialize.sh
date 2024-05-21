#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 初始化项目，自动化部署
rm -rf .git

git init

git config --local user.name "wwlight"
git config --local user.email "1942459198@qq.com"

git add -A
git commit -m "update"

git remote add github-origin git@github.com:wwlight/wwlight.github.io.git
# git remote add gitee-origin git@gitee.com:wwlight/wwlight.git

git push -f github-origin main
# git push -f gitee-origin main:master

cd /
