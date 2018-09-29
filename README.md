# web

基于[Vue-cli](https://github.com/vuejs/vue-cli)搭建的前端工程

## 环境配置

#### 安装Node.js

**Windows系统**

windows系统直接从官网下载最新版安装包

**类Unix系统**

先安装[nvm](https://github.com/creationix/nvm)，然后按nvm的文档安装Node.js版本

**配置npm镜像**

**方法一：** 通过命令安装cnpm 

```
npm install -g cnpm --registry=https://registry.npm.taobao.org
``` 

**方法二：** 通过安装[nrm](https://github.com/Pana/nrm)，在nrm中指定某镜像

## 项目搭建

进入到前端工程目录

``` bash
# 安装所有依赖
cnpm i

# 开启开发环境，命令运行正常，会自动打开浏览器
npm run dev

# 打包构建生产环境
npm run build
```

## 前端规范文档

[前端规范文档](http://git.ygsoft.com/cooco/COOCO/blob/master/javaSrc/cooco-mgr/src/main/web/doc/specification.md)

## 使用相关文档

[EChats使用文档](http://git.ygsoft.com/cooco/COOCO/blob/master/javaSrc/cooco-mgr/src/main/web/doc/ECHARTS.md)

[自定义模态窗使用文档](http://git.ygsoft.com/cooco/COOCO/blob/master/javaSrc/cooco-mgr/src/main/web/doc/modal.md)

### 附：

* [ES6教程（包含ES2015、ES2016、ES2017）](http://es6.ruanyifeng.com/)

* [Vue中文文档](https://cn.vuejs.org/v2/guide/)

* [Vue路由中文文档](https://router.vuejs.org/zh-cn/essentials/getting-started.html)

* [Vuex中文文档](https://vuex.vuejs.org/zh-cn/intro.html)

* Webpack[中文文档](https://doc.webpack-china.org/concepts)并不全，建议直接阅读[英文文档](https://webpack.js.org/guides/)