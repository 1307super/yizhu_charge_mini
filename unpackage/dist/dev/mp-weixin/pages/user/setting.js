"use strict";
var common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_van_button = common_vendor.resolveComponent("van-button");
  _component_van_button();
}
if (!Math) {
  navbar();
}
const navbar = () => "../../components/navbar/index.js";
const _sfc_main = {
  __name: "setting",
  setup(__props) {
    const logout = () => {
      common_vendor.index.showModal({
        title: "\u786E\u5B9A\u9000\u51FA?",
        showCancel: true,
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.removeStorageSync("user");
            common_vendor.index.showToast({
              title: "\u9000\u51FA\u6210\u529F",
              icon: "none"
            });
            setTimeout(() => {
              common_vendor.index.redirectTo({
                url: "/pages/user/index"
              });
            }, 1500);
          }
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "\u8BBE\u7F6E"
        }),
        b: common_vendor.o(logout),
        c: common_vendor.p({
          type: "default"
        })
      };
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-52e26b05"], ["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/pages/user/setting.vue"]]);
wx.createPage(MiniProgramPage);
