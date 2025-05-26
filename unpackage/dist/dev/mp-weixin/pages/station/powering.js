"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const components_js_request = require("../../components/js/request.js");
if (!Array) {
  const _component_van_count_down = common_vendor.resolveComponent("van-count-down");
  const _component_van_col = common_vendor.resolveComponent("van-col");
  const _component_van_row = common_vendor.resolveComponent("van-row");
  const _component_van_button = common_vendor.resolveComponent("van-button");
  (_component_van_count_down + _component_van_col + _component_van_row + _component_van_button)();
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
        common_vendor.index.__f__("log", "at pages/station/powering.vue:197", "WebSocket连接已打开！", res);
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
        title: "确定结束充电?",
        showCancel: true,
        success: (res) => {
          if (res.confirm) {
            components_js_request.request({
              url: "/order/endCharge",
              data: form,
              success: (res2) => {
                if (res2.data.code == 200) {
                  common_vendor.index.showToast({
                    title: "结束成功"
                  });
                  setTimeout(() => {
                    common_vendor.index.redirectTo({
                      url: "/pages/user/order"
                    });
                  }, 1500);
                } else {
                  common_vendor.index.showToast({
                    title: "结束失败",
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
          common_vendor.index.__f__("log", "at pages/station/powering.vue:253", "关闭成功");
        }
      });
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "正在充电",
          delta: form.delta
        }),
        b: common_vendor.t(form.portname),
        c: common_vendor.t(form.stationName),
        d: common_assets._imports_0$1,
        e: common_vendor.t(form.pileId),
        f: common_vendor.t(wsform.soc),
        g: common_vendor.p({
          time: time.value
        }),
        h: common_vendor.t(wsform.hasChargePower ? parseFloat(wsform.totalFee).toFixed(2) : 0),
        i: common_vendor.p({
          span: 8
        }),
        j: common_vendor.t(wsform.totalFee ? parseFloat(wsform.totalFee).toFixed(2) : 0),
        k: common_vendor.p({
          span: 8
        }),
        l: common_vendor.t(hours.value),
        m: common_vendor.t(minutes.value),
        n: common_vendor.p({
          span: 8
        }),
        o: common_vendor.t(wsform.voltage),
        p: common_vendor.p({
          span: 8
        }),
        q: common_vendor.t(wsform.electricity),
        r: common_vendor.p({
          span: 8
        }),
        s: common_vendor.t(wsform.voltage ? (wsform.voltage / wsform.electricity).toFixed(2) : 0),
        t: common_vendor.p({
          span: 8
        }),
        v: common_vendor.o(finish),
        w: common_vendor.p({
          type: "primary"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9788b60e"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/station/powering.js.map
