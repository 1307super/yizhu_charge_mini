"use strict";
var common_vendor = require("../../common/vendor.js");
if (!Math) {
  navbar();
}
const navbar = () => "../../components/navbar/index.js";
const _sfc_main = {
  __name: "privacy-policy",
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "\u9690\u79C1\u4FDD\u62A4\u534F\u8BAE"
        })
      };
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ab43951c"], ["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/pages/user/privacy-policy.vue"]]);
wx.createPage(MiniProgramPage);
