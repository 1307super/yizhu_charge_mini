"use strict";
var common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_van_icon = common_vendor.resolveComponent("van-icon");
  _component_van_icon();
}
const _sfc_main = {
  __name: "index",
  props: {
    title: String,
    showarrow: {
      type: Boolean,
      default: true
    },
    delta: {
      type: Number,
      default: 1
    }
  },
  setup(__props) {
    const navBarStyle = common_vendor.ref({});
    common_vendor.onMounted(() => {
      const menuButtonInfo = common_vendor.index.getMenuButtonBoundingClientRect();
      navBarStyle.value = {
        paddingTop: `${menuButtonInfo.top}px`,
        height: `${menuButtonInfo.height}px`
      };
    });
    const back = (delta) => {
      common_vendor.index.navigateBack({
        delta
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.showarrow
      }, __props.showarrow ? {
        b: common_vendor.o(($event) => back(__props.delta)),
        c: common_vendor.p({
          name: "arrow-left",
          size: "20px"
        })
      } : {}, {
        d: common_vendor.t(__props.title),
        e: !__props.title ? 1 : "",
        f: common_vendor.s(navBarStyle.value)
      });
    };
  }
};
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-be923164"], ["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/components/navbar/index.vue"]]);
wx.createComponent(Component);
