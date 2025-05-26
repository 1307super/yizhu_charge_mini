"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
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
    appid: "wxe36b893427127efd6c",
    serverUrl: "http://127.0.0.1:38080/hcp-mp/",
    wsurl: "ws://127.0.0.1/hcp-mp/websocket/charge/"
  },
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:16", "App Launch");
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:19", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:22", "App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
