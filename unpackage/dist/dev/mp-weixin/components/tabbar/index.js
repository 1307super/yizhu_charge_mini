"use strict";
var common_vendor = require("../../common/vendor.js");
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
        f: common_vendor.o(scan),
        g: common_vendor.p({
          span: 8
        }),
        h: __props.active == 1 ? user.active : user.default,
        i: common_vendor.n(__props.active == 1 ? "text-active" : "text-default"),
        j: common_vendor.o(($event) => go("/pages/user/index")),
        k: common_vendor.p({
          span: 7
        }),
        l: common_vendor.p({
          span: 1
        })
      };
    };
  }
};
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-44ce5a1c"], ["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/components/tabbar/index.vue"]]);
wx.createComponent(Component);
