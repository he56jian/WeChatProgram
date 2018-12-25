import AppModule from "./lib/App.js";

//创建云开发环境
wx.cloud.init()

const $app = new AppModule();

$app.init();