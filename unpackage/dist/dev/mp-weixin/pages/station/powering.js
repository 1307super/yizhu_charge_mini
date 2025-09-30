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
  __name: "powering",
  setup(__props) {
    getApp();
    const form = common_vendor.reactive({
      batchNo: "",
      stationName: "",
      licensePlate: "",
      delta: 1
    });
    const ordersList = common_vendor.ref([]);
    const chargeStartTime = common_vendor.ref(Date.now());
    const countdownTimer = common_vendor.ref(null);
    const dataRefreshTimer = common_vendor.ref(null);
    const stopStatusTimer = common_vendor.ref(null);
    const remainingWaitTime = common_vendor.ref(90);
    const isStoppingCharge = common_vendor.ref(false);
    const totalChargeFee = common_vendor.computed$1(() => {
      return ordersList.value.reduce((total, order) => total + (parseFloat(order.actualAmount) || 0), 0);
    });
    const totalChargedAmount = common_vendor.computed$1(() => {
      return ordersList.value.reduce((total, order) => total + (order.power || 0), 0);
    });
    const canEndCharge = common_vendor.computed$1(() => {
      return remainingWaitTime.value <= 0;
    });
    const getChargingBatchDetail = () => {
      components_js_request.request({
        url: "order/getChargingOrderDetail",
        method: "GET",
        data: { batchNo: form.batchNo },
        success: (res) => {
          if (res.data.code === 200) {
            const batchData = res.data.data;
            if (batchData.status !== 2) {
              clearTimers();
              common_vendor.index.showToast({
                title: "\u5145\u7535\u5DF2\u7ED3\u675F",
                icon: "success"
              });
              setTimeout(() => {
                common_vendor.index.redirectTo({
                  url: "/pages/user/order"
                });
              }, 1500);
              return;
            }
            form.stationName = batchData.stationName || "\u5145\u7535\u7AD9\u540D\u79F0";
            form.licensePlate = batchData.licensePlate || "\u8F66\u724C\u53F7/\u8F66\u67B6\u53F7";
            ordersList.value = batchData.orders || [];
            if (batchData.startTime) {
              chargeStartTime.value = new Date(batchData.startTime.replace(" ", "T")).getTime();
            }
          }
        },
        fail: (error) => {
          console.error("\u83B7\u53D6\u6279\u6B21\u8BE6\u60C5\u5931\u8D25:", error);
          common_vendor.index.showToast({
            title: "\u83B7\u53D6\u5145\u7535\u4FE1\u606F\u5931\u8D25",
            icon: "none"
          });
        }
      });
    };
    const startCountdown = () => {
      countdownTimer.value = setInterval(() => {
        const elapsed = Math.floor((Date.now() - chargeStartTime.value) / 1e3);
        remainingWaitTime.value = Math.max(0, 90 - elapsed);
        if (remainingWaitTime.value <= 0) {
          clearInterval(countdownTimer.value);
        }
      }, 1e3);
    };
    const startDataRefresh = () => {
      dataRefreshTimer.value = setInterval(() => {
        getChargingBatchDetail();
      }, 15e3);
    };
    const checkStopChargeStatus = () => {
      components_js_request.request({
        url: "order/checkStopChargeStatus",
        method: "GET",
        data: { batchNo: form.batchNo },
        success: (res) => {
          if (res.data.code === 200) {
            const status = res.data.data;
            if (status !== 1) {
              stopCheckingStatus();
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({
                title: status === 2 ? "\u5145\u7535\u5DF2\u5B8C\u6210" : status === 3 ? "\u5145\u7535\u5DF2\u5173\u95ED" : "\u9000\u6B3E\u5931\u8D25",
                icon: status === 2 ? "success" : "none"
              });
              setTimeout(() => {
                common_vendor.index.redirectTo({
                  url: `/pages/user/order?batchNo=${form.batchNo}`
                });
              }, 1500);
            }
          }
        },
        fail: (error) => {
          console.error("\u68C0\u67E5\u505C\u6B62\u72B6\u6001\u5931\u8D25:", error);
        }
      });
    };
    const startCheckingStatus = () => {
      stopStatusTimer.value = setInterval(() => {
        checkStopChargeStatus();
      }, 1e3);
    };
    const stopCheckingStatus = () => {
      if (stopStatusTimer.value) {
        clearInterval(stopStatusTimer.value);
        stopStatusTimer.value = null;
      }
      isStoppingCharge.value = false;
    };
    const finish = () => {
      if (!canEndCharge.value) {
        common_vendor.index.showToast({
          title: `\u8BF7\u7B49\u5F85${remainingWaitTime.value}\u79D2\u540E\u518D\u7ED3\u675F\u5145\u7535`,
          icon: "none"
        });
        return;
      }
      common_vendor.index.showModal({
        title: "\u786E\u5B9A\u7ED3\u675F\u5145\u7535\uFF1F",
        content: "\u7ED3\u675F\u5145\u7535\u540E\u5C06\u751F\u6210\u5145\u7535\u8D26\u5355",
        showCancel: true,
        confirmText: "\u786E\u5B9A\u7ED3\u675F",
        cancelText: "\u7EE7\u7EED\u5145\u7535",
        success: (res) => {
          if (res.confirm) {
            endCharging();
          }
        }
      });
    };
    const endCharging = () => {
      isStoppingCharge.value = true;
      common_vendor.index.showLoading({
        title: "\u6B63\u5728\u7ED3\u675F\u5145\u7535...",
        mask: true
      });
      components_js_request.request({
        url: "order/endCharging?batchNo=" + form.batchNo,
        method: "POST",
        success: (res) => {
          if (res.data.code === 200) {
            startCheckingStatus();
          } else {
            common_vendor.index.hideLoading();
            isStoppingCharge.value = false;
            common_vendor.index.showToast({
              title: res.data.msg || "\u7ED3\u675F\u5145\u7535\u5931\u8D25",
              icon: "none"
            });
          }
        },
        fail: (error) => {
          common_vendor.index.hideLoading();
          isStoppingCharge.value = false;
          console.error("\u7ED3\u675F\u5145\u7535\u5931\u8D25:", error);
          common_vendor.index.showToast({
            title: "\u7ED3\u675F\u5145\u7535\u5931\u8D25",
            icon: "none"
          });
        }
      });
    };
    const clearTimers = () => {
      if (countdownTimer.value) {
        clearInterval(countdownTimer.value);
        countdownTimer.value = null;
      }
      if (dataRefreshTimer.value) {
        clearInterval(dataRefreshTimer.value);
        dataRefreshTimer.value = null;
      }
      if (stopStatusTimer.value) {
        clearInterval(stopStatusTimer.value);
        stopStatusTimer.value = null;
      }
      isStoppingCharge.value = false;
    };
    common_vendor.onLoad((options) => {
      Object.assign(form, options);
      getChargingBatchDetail();
      startCountdown();
      startDataRefresh();
    });
    common_vendor.onShow(() => {
      if (!dataRefreshTimer.value && form.batchNo) {
        startDataRefresh();
      }
    });
    common_vendor.onHide(() => {
      if (dataRefreshTimer.value) {
        clearInterval(dataRefreshTimer.value);
        dataRefreshTimer.value = null;
      }
    });
    common_vendor.onUnload(() => {
      clearTimers();
    });
    common_vendor.onUnmounted(() => {
      clearTimers();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "",
          delta: form.delta
        }),
        b: common_vendor.t(form.stationName || "\u5145\u7535\u7AD9\u540D\u79F0"),
        c: common_vendor.t(form.licensePlate || form.vehicleVin),
        d: common_vendor.f(ordersList.value, (order, index, i0) => {
          return {
            a: common_vendor.t(order.gunNo),
            b: common_vendor.t(order.estimatedTime),
            c: common_vendor.t(order.soc),
            d: `conic-gradient(#2D55E8 0deg ${order.soc * 3.6}deg, #f0f2f5 ${order.soc * 3.6}deg 360deg)`,
            e: common_vendor.t(order.actualAmount),
            f: common_vendor.t(order.power.toFixed(2)),
            g: common_vendor.t((order.current * order.voltage / 100).toFixed(2)),
            h: common_vendor.t(order.current),
            i: common_vendor.t(order.voltage),
            j: order.orderId
          };
        }),
        e: common_vendor.t(common_vendor.unref(totalChargeFee).toFixed(2)),
        f: common_vendor.t(common_vendor.unref(totalChargedAmount).toFixed(2)),
        g: common_vendor.t(isStoppingCharge.value ? "\u6B63\u5728\u7ED3\u675F\u5145\u7535..." : common_vendor.unref(canEndCharge) ? "\u7ED3\u675F\u5145\u7535" : `\u8BF7\u7B49\u5F85 ${remainingWaitTime.value}s`),
        h: common_vendor.o(finish),
        i: common_vendor.p({
          type: "primary",
          disabled: !common_vendor.unref(canEndCharge) || isStoppingCharge.value,
          color: common_vendor.unref(canEndCharge) && !isStoppingCharge.value ? "#2D55E8" : "#d9d9d9",
          round: true,
          block: true
        })
      };
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f0ec609e"], ["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/pages/station/powering.vue"]]);
wx.createPage(MiniProgramPage);
