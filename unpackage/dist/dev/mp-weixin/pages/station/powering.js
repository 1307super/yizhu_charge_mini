"use strict";
var common_vendor = require("../../common/vendor.js");
var components_js_request = require("../../components/js/request.js");
if (!Array) {
  const _component_van_count_down = common_vendor.resolveComponent("van-count-down");
  const _component_van_button = common_vendor.resolveComponent("van-button");
  (_component_van_count_down + _component_van_button)();
}
if (!Math) {
  navbar();
}
const navbar = () => "../../components/navbar/index.js";
const _sfc_main = {
  __name: "powering",
  setup(__props) {
    const app = getApp();
    const time = common_vendor.ref(0);
    const form = common_vendor.reactive({});
    const wsform = common_vendor.reactive({});
    const hours = common_vendor.ref(0);
    const minutes = common_vendor.ref(0);
    const socketTask = common_vendor.ref(null);
    const wsurl = app.globalData.wsurl;
    const initsocket = (order) => {
      socketTask.value = common_vendor.index.connectSocket({
        url: wsurl + order,
        complete: () => {
        }
      });
      common_vendor.index.onSocketOpen(function(res) {
        console.log("WebSocket\u8FDE\u63A5\u5DF2\u6253\u5F00\uFF01", res);
      });
      common_vendor.index.onSocketMessage(function(res) {
        const result = JSON.parse(res.data);
        for (let key in result) {
          wsform[key] = result[key];
        }
        time.value = (parseInt(form.hour) * 3600 - wsform.realTimePower) * 1e3;
        const duration = common_vendor.hooks.duration(wsform.realTimePower, "seconds");
        hours.value = duration.hours();
        minutes.value = duration.minutes();
      });
    };
    const finish = () => {
      common_vendor.index.showModal({
        title: "\u786E\u5B9A\u7ED3\u675F\u5145\u7535?",
        showCancel: true,
        success: (res) => {
          if (res.confirm) {
            components_js_request.request({
              url: "/order/endCharge",
              data: form,
              success: (res2) => {
                if (res2.data.code == 200) {
                  common_vendor.index.showToast({
                    title: "\u7ED3\u675F\u6210\u529F"
                  });
                  setTimeout(() => {
                    common_vendor.index.redirectTo({
                      url: "/pages/user/order"
                    });
                  }, 1500);
                } else {
                  common_vendor.index.showToast({
                    title: "\u7ED3\u675F\u5931\u8D25",
                    icon: "none"
                  });
                }
              }
            });
          }
        }
      });
    };
    common_vendor.onLoad((option) => {
      for (let key in option) {
        form[key] = option[key];
      }
      form.delta = parseInt(form.delta);
      initsocket(form.orderNumber);
    });
    common_vendor.onUnload(() => {
      socketTask.value.close({
        success: () => {
          console.log("\u5173\u95ED\u6210\u529F");
        }
      });
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "\u6B63\u5728\u5145\u7535",
          delta: form.delta
        }),
        b: common_vendor.t(form.portname),
        c: common_vendor.t(form.stationName),
        d: common_vendor.t(form.pileId),
        e: common_vendor.t(wsform.soc),
        f: common_vendor.p({
          time: time.value
        }),
        g: common_vendor.t(wsform.hasChargePower ? parseFloat(wsform.totalFee).toFixed(2) : 0),
        h: common_vendor.o(finish),
        i: common_vendor.p({
          type: "primary"
        })
      };
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f0ec609e"], ["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/pages/station/powering.vue"]]);
wx.createPage(MiniProgramPage);
