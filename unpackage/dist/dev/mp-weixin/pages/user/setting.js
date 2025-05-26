"use strict";
const common_vendor = require("../../common/vendor.js");
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
        title: "确定退出?",
        showCancel: true,
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.removeStorageSync("user");
            common_vendor.index.showToast({
              title: "退出成功",
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
          title: "设置"
        }),
        b: common_vendor.o(logout),
        c: common_vendor.p({
          type: "default"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-806b15dc"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/setting.js.map
