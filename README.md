# auto-servers

## describe

自动生成servers的cli工具

## 坑点

### 路径别名

moudle-alias 的 addAlias是失效的, 所以说只能在package.json 中写_moduleAliases 添加路径别名。
moudle-alias 目前路径 @ 指向打包出来的文件夹，开发环境tsconfig-path会生效，指向src文件夹
