"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const components_js_request = require("../../components/js/request.js");
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
          title: "电站主页"
        }),
        b: common_assets._imports_0$3,
        c: common_vendor.f(form.fastPileList, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.notBusyNum > 0 ? "空闲" : "忙碌"),
            b: common_vendor.n(item.notBusyNum > 0 ? "device-free" : "device-busy"),
            c: common_vendor.t(item.pileNo),
            d: common_vendor.t(item.electricity),
            e: common_vendor.t(item.voltage),
            f: common_vendor.t(item.maxPower),
            g: item.notBusyNum > 0
          }, item.notBusyNum > 0 ? {
            h: "78114d96-1-" + i0,
            i: common_vendor.p({
              type: "primary",
              size: "mini"
            })
          } : {}, {
            j: index,
            k: common_vendor.o(($event) => item.notBusyNum > 0 ? go("/pages/station/create?key=" + item.pileNo) : "", index)
          });
        }),
        d: common_vendor.f(form.slowPileList, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.notBusyNum > 0 ? "空闲" : "忙碌"),
            b: common_vendor.n(item.notBusyNum > 0 ? "device-free" : "device-busy"),
            c: common_vendor.t(item.pileNo),
            d: common_vendor.t(item.electricity),
            e: common_vendor.t(item.voltage),
            f: common_vendor.t(item.maxPower),
            g: item.notBusyNum > 0
          }, item.notBusyNum > 0 ? {
            h: "78114d96-2-" + i0,
            i: common_vendor.p({
              type: "primary",
              size: "mini"
            })
          } : {}, {
            j: index,
            k: common_vendor.o(($event) => go("/pages/station/create?key=" + item.pileNo), index)
          });
        }),
        e: common_vendor.t(form.price),
        f: common_vendor.o(scan),
        g: common_vendor.p({
          round: true,
          color: "linear-gradient(to right, #569AFF, #4A6EF3)"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-78114d96"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/station/index.js.map
