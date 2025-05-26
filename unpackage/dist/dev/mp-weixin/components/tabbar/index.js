"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _component_van_col = common_vendor.resolveComponent("van-col");
  const _component_van_row = common_vendor.resolveComponent("van-row");
  (_component_van_col + _component_van_row)();
}
const _sfc_main = {
  __name: "index",
  props: {
    active: Number
  },
  setup(__props) {
    const home = {
      active: "../../static/image/home-active.png",
      default: "../../static/image/home-default.png"
    };
    const user = {
      active: "../../static/image/user-active.png",
      default: "../../static/image/user-default.png"
    };
    const go = (url) => {
      common_vendor.index.redirectTo({
        url
      });
    };
    const scan = () => {
      common_vendor.index.scanCode({
        success: function(res) {
          go("/pages/station/create?key=" + res.result);
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          span: 1
        }),
        b: __props.active == 0 ? home.active : home.default,
        c: common_vendor.n(__props.active == 0 ? "text-active" : "text-default"),
        d: common_vendor.o(($event) => go("/pages/index/index")),
        e: common_vendor.p({
          span: 7
        }),
        f: common_assets._imports_0$4,
        g: common_vendor.o(scan),
        h: common_vendor.p({
          span: 8
        }),
        i: __props.active == 1 ? user.active : user.default,
        j: common_vendor.n(__props.active == 1 ? "text-active" : "text-default"),
        k: common_vendor.o(($event) => go("/pages/user/index")),
        l: common_vendor.p({
          span: 7
        }),
        m: common_vendor.p({
          span: 1
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0e399a7b"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/tabbar/index.js.map
