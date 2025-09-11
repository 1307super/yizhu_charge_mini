"use strict";
var common_vendor = require("../../common/vendor.js");
var components_js_request = require("../../components/js/request.js");
if (!Math) {
  navbar();
}
const navbar = () => "../../components/navbar/index.js";
const _sfc_main = {
  __name: "orderdetail",
  setup(__props) {
    getApp();
    const form = common_vendor.reactive({});
    const show = (params) => {
      components_js_request.request({
        url: "/order/orderDetail",
        data: params,
        success: (res) => {
          for (let key in res.data.data) {
            form[key] = res.data.data[key];
          }
        }
      });
    };
    common_vendor.onLoad((option) => {
      show(option);
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "\u8BA2\u5355\u8BE6\u60C5"
        }),
        b: common_vendor.t(form.orderState == 1 ? "\u8FDB\u884C\u4E2D" : "\u5DF2\u5B8C\u6210"),
        c: common_vendor.t(form.address),
        d: common_vendor.t(form.pileId),
        e: common_vendor.t(form.pileType == 1 ? "\u5FEB\u5145" : "\u6162\u5145"),
        f: common_vendor.t(form.portName),
        g: common_vendor.t(form.electricity),
        h: common_vendor.t(form.voltage),
        i: common_vendor.t(form.maxPower),
        j: common_vendor.t(form.hour),
        k: common_vendor.t(form.orderNumber),
        l: common_vendor.t(form.startTime),
        m: common_vendor.t(form.endTime),
        n: common_vendor.t(form.chargeFee || 0),
        o: common_vendor.t(form.serviceFee || 0),
        p: common_vendor.t(form.ordergold || 0),
        q: common_vendor.t(form.payType || "\u8D26\u6237\u4F59\u989D\u6263\u6B3E"),
        r: common_vendor.f(form.logList, (item, index, i0) => {
          return {
            a: common_vendor.t(item.createTime),
            b: common_vendor.t(item.logContent),
            c: index
          };
        })
      };
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-308973d4"], ["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/pages/user/orderdetail.vue"]]);
wx.createPage(MiniProgramPage);
