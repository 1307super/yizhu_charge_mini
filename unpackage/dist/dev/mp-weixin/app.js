"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports[Symbol.toStringTag] = "Module";
var common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/user/index.js";
  "./pages/station/index.js";
  "./pages/station/create.js";
  "./pages/station/powering.js";
  "./pages/user/order.js";
  "./pages/user/orderdetail.js";
  "./pages/user/setting.js";
  "./pages/user/login.js";
}
const _sfc_main = {
  globalData: {
    appid: "wxbe36fe76127d185a",
    serverUrl: "http://127.0.0.1:38080/yzev-mp/",
    wsurl: "ws://127.0.0.1/yzev-mp/websocket/charge/"
  },
  onLaunch: function() {
    console.log("App Launch");
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
var App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
