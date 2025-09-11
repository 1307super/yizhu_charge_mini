"use strict";
var common_vendor = require("../../common/vendor.js");
var components_js_request = require("../../components/js/request.js");
if (!Array) {
  const _component_van_button = common_vendor.resolveComponent("van-button");
  _component_van_button();
}
if (!Math) {
  navbar();
}
const navbar = () => "../../components/navbar/index.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    getApp();
    const go = (url) => {
      common_vendor.index.navigateTo({
        url
      });
    };
    const form = common_vendor.reactive({});
    const show = (params) => {
      components_js_request.request({
        url: "/charging/plotDetail",
        data: params,
        success: (res) => {
          for (let key in res.data.data) {
            form[key] = res.data.data[key];
          }
        }
      });
    };
    const scan = () => {
      common_vendor.index.scanCode({
        success: function(res) {
          go("/pages/station/create?key=" + res.result);
        }
      });
    };
    common_vendor.onLoad((option) => {
      form.distance = option.distance;
      show(option);
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "\u7535\u7AD9\u4E3B\u9875"
        }),
        b: common_vendor.f(form.fastPileList, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.notBusyNum > 0 ? "\u7A7A\u95F2" : "\u5FD9\u788C"),
            b: common_vendor.n(item.notBusyNum > 0 ? "device-free" : "device-busy"),
            c: common_vendor.t(item.pileNo),
            d: common_vendor.t(item.electricity),
            e: common_vendor.t(item.voltage),
            f: common_vendor.t(item.maxPower),
            g: item.notBusyNum > 0
          }, item.notBusyNum > 0 ? {
            h: "e5c43de4-1-" + i0,
            i: common_vendor.p({
              type: "primary",
              size: "mini"
            })
          } : {}, {
            j: index,
            k: common_vendor.o(($event) => item.notBusyNum > 0 ? go("/pages/station/create?key=" + item.pileNo) : "", index)
          });
        }),
        c: common_vendor.f(form.slowPileList, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.notBusyNum > 0 ? "\u7A7A\u95F2" : "\u5FD9\u788C"),
            b: common_vendor.n(item.notBusyNum > 0 ? "device-free" : "device-busy"),
            c: common_vendor.t(item.pileNo),
            d: common_vendor.t(item.electricity),
            e: common_vendor.t(item.voltage),
            f: common_vendor.t(item.maxPower),
            g: item.notBusyNum > 0
          }, item.notBusyNum > 0 ? {
            h: "e5c43de4-2-" + i0,
            i: common_vendor.p({
              type: "primary",
              size: "mini"
            })
          } : {}, {
            j: index,
            k: common_vendor.o(($event) => go("/pages/station/create?key=" + item.pileNo), index)
          });
        }),
        d: common_vendor.t(form.price),
        e: common_vendor.o(scan),
        f: common_vendor.p({
          round: true,
          color: "linear-gradient(to right, #569AFF, #4A6EF3)"
        })
      };
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e5c43de4"], ["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/pages/station/index.vue"]]);
wx.createPage(MiniProgramPage);
