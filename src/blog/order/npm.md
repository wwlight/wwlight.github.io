# npm 命令

::: tip 学习资料
- [npm 中文文档](https://www.npmjs.cn/)
:::

## 查看模块版本
```sh
$ npm view/info <packageName> version
$ npm view/info <packageName> versions
```
## 检查过时的包
```sh
$ npm outdated <packageName>
```

## 查看本地配置参数
```sh
$ npm config ls -l
```

## 更新依赖包（[Taze](https://github.com/antfu/taze)）
```sh
$ npx taze
```

## --ignore-scripts
```sh
$ npm i --ignore-scripts
$ npx can-i-ignore-scripts
```

## 清除本地缓存
```sh
$ npm cache verify
```
