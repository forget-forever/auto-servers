# auto-servers

## describe

自动生成servers的cli工具

## 坑点

### 路径别名

moudle-alias 的 addAlias是失效的, 所以说只能在package.json 中写_moduleAliases 添加路径别名。
moudle-alias 目前路径 @ 指向打包出来的文件夹，开发环境tsconfig-path会生效，指向src文件夹

## 运行流程

create: create -> 获取apis -> 将api打平获取本次允许所要使用的api -> 创建类型的 -> 创建函数

## 使用方法

### 安装与初始化

```bash
npm install auto-servers -g & yarn add auto-servers -g
auto-servers init # 项目初始化，配置文件默认名称 .asconfig.js
auto-servers init xxx # 项目初始化，配置文件默认名称 xxx.asconfig.js
```

### 生成

```bash
auto-servers create # 获取全部的接口类型
auto-servers create -t xxxxx # 获取xxxx类型的接口，或者url为xxxxx的接口，脚手架会自动识别

# 默认会以当前目录的.asconfig.js作为配置文件
auto-servers create -c xxxx # 以当前目录的xxxx文件作为配置文件创建接口
auto-servers create -t xxxxx -c xxxx # 获取xxxx类型或url，以当前目录的xxxx文件作为配置文件创建接口
```

## 配置文件辅助包

使用辅助包之后，配置文件中可以有相关的代码提示

```bash
npm install as-config & yarn add as-config
```

## TODO

接口更新目录开发
