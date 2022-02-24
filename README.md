# auto-servers

## describe

自动生成servers的cli工具

## 坑点

### 路径别名

moudle-alias 的 addAlias是失效的, 所以说只能在package.json 中写_moduleAliases 添加路径别名。
moudle-alias 目前路径 @ 指向打包出来的文件夹，开发环境tsconfig-path会生效，指向src文件夹

## 运行流程

create: create -> 获取apis -> 将api打平获取本次允许所要使用的api -> 创建类型的 -> 创建函数
