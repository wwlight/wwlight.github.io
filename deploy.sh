#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e
# 生成静态文件
npm run build

# 进入生成的打包文件夹
cd .vitepress/dist

echo '
<h3>
    <a href="https://wwlight.github.io/" target="_blank">
    <img src="https://img.shields.io/badge/GitHub_%E5%9C%B0%E5%9D%80%EF%BC%9A-https%3A%2F%2Fwwlight.github.io%2F-green" alt="访问地址"/>
    </a>
</h3>
' > README.md

git init

git config --local user.name "wwlight"
git config --local user.email "1942459198@qq.com"

git add -A
git commit -m "deploy"

# git remote add github-origin git@github.com:wwlight/wwlight.github.io.git
# git remote add gitee-origin git@gitee.com:wwlight/wwlight.git

git branch -M gh-pages
git push -f github-origin gh-pages
# git push -f gitee-origin gh-pages:pages

cd /
