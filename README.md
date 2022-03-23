# auto-servers

## description

自动抓取yapi上的接口信息，并生成servers方法的cli工具

## 坑点

### 路径别名

- moudle-alias 的 addAlias是失效的, 所以说只能在package.json 中写_moduleAliases 添加路径别名。
- moudle-alias 目前路径 @ 指向打包出来的文件夹，开发环境tsconfig-path会生效，指向src文件夹

## 运行流程

create: create -> 获取apis -> 将api打平获取本次允许所要使用的api -> 创建类型的 -> 创建函数

## 使用方法

### 安装与初始化

```bash
npm install auto-servers -g & yarn add auto-servers global
auto-servers init # 项目初始化，配置文件默认名称 .asconfig.js
auto-servers init xxx # 项目初始化，配置文件默认名称 xxx.asconfig.js
```

### 生成

#### 通过默认配置文件

默认会以当前目录的.asconfig.js作为配置文件

```bash
auto-servers create # 获取全部的接口类型
auto-servers create -t xxxxx # 获取xxxx类型的接口，或者url为xxxxx，或者xxxx集合的接口脚手架会自动识别
```

#### 指定配置文件

```bash
auto-servers create -c xxxx # 以当前目录的xxxx文件作为配置文件创建接口
auto-servers create -t xxxxx -c xxxx # 获取xxxx类型或url或集合，以当前目录的xxxx文件作为配置文件创建接口
```

## 配置文件

### AsCofig

| 属性 | 说明 | 类型 | 默认值 | 必须 |
| ----| ---- | ---- | ---- | ---- |
| projectId | 项目id | string | - | true |
| token | 项目token | string | - | true |
| mockUrl | yapi的mock地址，写上域名就够了，例如：<http://yapi.xxxxxxx.com> | string | 'http://yapi.sfjswl.com' | false |
| importModel | 引入的modules | string[] | ["import request from '@/utils/request'"] | false |
| collections | 接口集合，通过yapi上的tag和分类来区分集合,是数组的时候识别为tag，字符串的时候识别为分类 | string | {} | false |
| outPath | 方法生成的目录 | string | 'src/servers' | false |
| serviceTemplate | 生成的方法模版 | [TemplateFunction](#TemplateFunction) | '(&#36;RequestQuery) => request<&#36;ResponseType>(&#36;Url, { params: &#36;Params, data: &#36;Data, method: &#36;Method})' | false |
| importTypeModel | 类型文件中引入的module | string[] | [] | false |
| typeRootNode | 返回的参数解析类型的节点，默认是data节点开始解析 | string | 'data' | false |
| extendName | 生成的文件的拓展名，分为.js 和 .ts | '.js'&#124;'.ts' | '.ts' | false |
| tsType | 是否需要生成ts类型 | boolean | true | false |
| exportType | 类型的导出形式，分为 declare 和 export两种 | 'declare'&#124;'export' | 'declare' | false |
| typeNamespace | 型的命名空间 | string | 'Request' | false |
| defaultApisType | 默认的接口分类,当接口找不到分类时用的分类目录名称 | string | 'utils' | false |

### TemplateFunction {#TemplateFunction}

- 生成方法的模版方法，默认的是一个字符串，集成了一个servers方法主要部分的的语法糖

```typescript
`($RequestQuery) => request<$ResponseType>($Url, { params: $Params, data: $Data, method: $Method})`
```

| 属性 | 说明 |
| ---- | ---- |
| $RequestQuery | 参数的方法，有query参数会生成 params, 有请求体参数会生成data |
| $ResponseType | 响应类型的 |
| $Method | 请求方式 |
| $Url | 请求的url，集成了路由穿参的处理 |
| $Params | 请求的query参数，会自动识别方法中的第一个参数名称 |
| $Data | 请求的请求体data参数，会自动识别方法中的第二个参数名称 |

- 也可以是一个函数，通过自己的编程方式动态生成方法，在这个方法中同样也是可以使用模板方法中集成的语法糖

```typescript
(api) => {
  const {url, paramsType, dataType, responseType , method, paramsHandle,  urlHandle, requestDataHandle, apiDetail} = api
  return (
    `(${paramsHandle(paramsType, dataType)}) => 
request<$ResponseType>($Url, { params: $Params, data: $Data, method: $Method })`
  )
}
```

参数说明：
| 属性 | 说明 | 类型 |
| ---- | ------- | ---- |
| url | 接口的url | string  |
| paramsType | query参数类型，没有query时为空字符串 | string |
| dataType | 请求体参数类型，没有请求体时为空字符串 | string |
| responseType | 响应的类型，没有响应的数据是为空字符串 | string |
| method | 请求方式 | string |
| paramsHandle | $RequestQuery 的处理函数 | (paramsType?: string, dataType?: string, params?: string, data?: string) => string |
| requestDataHandle | $Params 和 $Data 共同的处理函数 | (paramsType?: string, dataType?: string, params?: string, data?: string) => string |
| urlHandle | $Url 的处理函数 | (url: string, params?: string) => string |
| apiDetail | yapi上接口的详细数据 | ApiDetail |

## 配置文件辅助包

使用辅助包之后，配置文件中可以有相关的代码提示

```bash
npm install as-config & yarn add as-config
```

## TODO

方法的更新操作
