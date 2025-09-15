"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var common_vendor = require("../../common/vendor.js");
var components_js_request = require("../../components/js/request.js");
var components_js_stationUtils = require("../../components/js/stationUtils.js");
if (!Array) {
  const _component_van_radio = common_vendor.resolveComponent("van-radio");
  const _component_van_button = common_vendor.resolveComponent("van-button");
  const _component_van_slider = common_vendor.resolveComponent("van-slider");
  (_component_van_radio + _component_van_button + _component_van_slider)();
}
if (!Math) {
  navbar();
}
const navbar = () => "../../components/navbar/index.js";
const _sfc_main = {
  __name: "create",
  setup(__props) {
    getApp();
    common_vendor.index.getStorageSync("user");
    const token = common_vendor.index.getStorageSync("token");
    const stationId = common_vendor.ref("");
    const gunNumber = common_vendor.ref("");
    const refreshTimer = common_vendor.ref(null);
    const stationInfo = common_vendor.reactive({
      stationName: "",
      gunNo: "",
      price: 0,
      pricePeriod: "",
      status: null
    });
    const enterpriseWallet = common_vendor.reactive({
      enterpriseName: null,
      walletBalance: null,
      accountingAmount: null,
      consumedAmount: null,
      minLimit: null
    });
    const paymentMethod = common_vendor.ref("prepay");
    const chargePercentage = common_vendor.ref(80);
    const presetAmounts = common_vendor.ref([50, 100, 300, 500]);
    const selectedAmount = common_vendor.ref(50);
    const customAmount = common_vendor.ref("");
    const finalAmount = common_vendor.computed$1(() => {
      if (customAmount.value) {
        return parseFloat(customAmount.value);
      }
      return selectedAmount.value;
    });
    const gunStatusText = common_vendor.computed$1(() => {
      if (stationInfo.status === null)
        return "";
      return components_js_stationUtils.getStatusText(stationInfo.status);
    });
    const canCharge = common_vendor.computed$1(() => {
      return stationInfo.status === 2;
    });
    const availableBalance = common_vendor.computed$1(() => {
      if (enterpriseWallet.walletBalance === null || enterpriseWallet.accountingAmount === null || enterpriseWallet.consumedAmount === null) {
        return 0;
      }
      return enterpriseWallet.walletBalance + enterpriseWallet.accountingAmount - enterpriseWallet.consumedAmount;
    });
    const isEnterpriseBalanceSufficient = common_vendor.computed$1(() => {
      if (enterpriseWallet.minLimit === null)
        return true;
      return availableBalance.value >= enterpriseWallet.minLimit;
    });
    const buttonInfo = common_vendor.computed$1(() => {
      if (stationInfo.status === null) {
        return { text: "\u7ACB\u5373\u5145\u7535", disabled: true, tip: "\u52A0\u8F7D\u4E2D..." };
      }
      switch (stationInfo.status) {
        case 1:
          return { text: "\u7ACB\u5373\u5145\u7535", disabled: true, tip: "\u8BF7\u5148\u63D2\u67AA\u540E\u5145\u7535" };
        case 2:
          return { text: "\u7ACB\u5373\u5145\u7535", disabled: false, tip: "" };
        case 3:
          return { text: "\u5145\u7535\u4E2D", disabled: true, tip: "\u8BE5\u67AA\u6B63\u5728\u5145\u7535\u4E2D" };
        case 4:
          return { text: "\u5DF2\u9884\u7EA6", disabled: true, tip: "\u8BE5\u67AA\u5DF2\u88AB\u9884\u7EA6\u9501\u5B9A" };
        case 0:
          return { text: "\u8BBE\u5907\u79BB\u7F51", disabled: true, tip: "\u8BBE\u5907\u5904\u4E8E\u79BB\u7F51\u72B6\u6001" };
        case 255:
          return { text: "\u8BBE\u5907\u6545\u969C", disabled: true, tip: "\u8BBE\u5907\u51FA\u73B0\u6545\u969C\uFF0C\u65E0\u6CD5\u4F7F\u7528" };
        case 21501:
          return { text: "\u8BBE\u5907\u5347\u7EA7", disabled: true, tip: "\u8BBE\u5907\u6B63\u5728\u5347\u7EA7\u4E2D" };
        case 21502:
          return { text: "\u542F\u52A8\u4E2D", disabled: true, tip: "\u5145\u7535\u542F\u52A8\u4E2D\uFF0C\u8BF7\u7A0D\u5019" };
        case 21503:
          return { text: "\u8BBE\u5907\u7981\u7528", disabled: true, tip: "\u8BBE\u5907\u5DF2\u88AB\u7981\u7528" };
        default:
          return { text: "\u7ACB\u5373\u5145\u7535", disabled: true, tip: "\u8BBE\u5907\u72B6\u6001\u5F02\u5E38" };
      }
    });
    const getStationInfo = () => {
      components_js_request.request({
        url: "charging/port/info",
        data: { stationId: stationId.value, gunNumber: gunNumber.value },
        method: "GET",
        success: (res) => {
          if (res.data.code === 200) {
            Object.assign(stationInfo, res.data.data);
          }
        },
        fail: (error) => {
          console.error("\u83B7\u53D6\u7AD9\u70B9\u4FE1\u606F\u5931\u8D25:", error);
        }
      });
    };
    const getEnterpriseWallet = () => {
      components_js_request.request({
        url: "me/getEnterpriseWallet",
        method: "GET",
        success: (res) => {
          if (res.data.code === 200 && res.data.data) {
            Object.assign(enterpriseWallet, res.data.data);
            if (enterpriseWallet.walletBalance !== null) {
              paymentMethod.value = "enterprise";
            }
          }
        },
        fail: (error) => {
          console.log("\u4F01\u4E1A\u94B1\u5305\u4FE1\u606F\u83B7\u53D6\u5931\u8D25");
        }
      });
    };
    const selectPaymentMethod = (method) => {
      paymentMethod.value = method;
      if (method === "prepay") {
        customAmount.value = "";
        selectedAmount.value = 50;
      }
    };
    const onChargePercentageChange = (e) => {
      var _a, _b;
      const val = (_b = e && e.detail && ((_a = e.detail.value) != null ? _a : e.detail)) != null ? _b : e;
      const percentage = Number(val);
      chargePercentage.value = Math.max(80, Math.min(100, percentage));
    };
    const selectAmount = (amount) => {
      selectedAmount.value = amount;
      customAmount.value = "";
    };
    const onCustomAmountInput = () => {
      if (customAmount.value) {
        selectedAmount.value = null;
      }
    };
    const getStatusClass = () => {
      if (stationInfo.status === null)
        return "";
      return components_js_stationUtils.getStatusClass(stationInfo.status);
    };
    const getGunStatus = () => {
      components_js_request.request({
        url: "charging/port/status",
        data: { stationId: stationId.value, gunNumber: gunNumber.value },
        method: "GET",
        success: (res) => {
          if (res.data.code === 200) {
            stationInfo.status = res.data.data === null ? 0 : res.data.data;
          }
        },
        fail: (error) => {
          console.error("\u83B7\u53D6\u5145\u7535\u67AA\u72B6\u6001\u5931\u8D25:", error);
        }
      });
    };
    const startAutoRefresh = () => {
      stopAutoRefresh();
      refreshTimer.value = setInterval(() => {
        getGunStatus();
      }, 5e3);
    };
    const stopAutoRefresh = () => {
      if (refreshTimer.value) {
        clearInterval(refreshTimer.value);
        refreshTimer.value = null;
      }
    };
    const startCharging = () => {
      if (!canCharge.value) {
        common_vendor.index.showToast({
          title: buttonInfo.value.tip || "\u5F53\u524D\u72B6\u6001\u4E0D\u5141\u8BB8\u5145\u7535",
          icon: "none"
        });
        return;
      }
      if (paymentMethod.value === "enterprise" && !isEnterpriseBalanceSufficient.value) {
        common_vendor.index.showToast({
          title: "\u4F01\u4E1A\u94B1\u5305\u4F59\u989D\u4E0D\u8DB3, \u6700\u5C11\u9700\u8981:" + enterpriseWallet.minLimit + "\u5143",
          icon: "none"
        });
        return;
      }
      if (!token) {
        common_vendor.index.setStorageSync("redirecturl", `/pages/station/create?stationId=${stationId.value}&gunNumber=${gunNumber.value}`);
        common_vendor.index.navigateTo({
          url: "/pages/user/login"
        });
        return;
      }
      if (paymentMethod.value === "prepay") {
        const amount = finalAmount.value;
        if (!amount || amount < 10) {
          common_vendor.index.showToast({
            title: "\u81EA\u5B9A\u4E49\u91D1\u989D\u4E0D\u80FD\u5C11\u4E8E10\u5143",
            icon: "none"
          });
          return;
        }
      }
      if (paymentMethod.value === "enterprise") {
        startEnterpriseCharging();
      } else {
        startPrepayCharging();
      }
    };
    const startEnterpriseCharging = () => {
      components_js_request.request({
        url: "charging/start/enterprise",
        method: "POST",
        data: {
          stationId: stationId.value,
          gunNumber: gunNumber.value,
          soc: chargePercentage.value
        },
        success: (res) => {
          if (res.data.code === 200) {
            common_vendor.index.showToast({
              title: "\u6210\u529F\u5F00\u542F\u5145\u7535"
            });
            setTimeout(() => {
              common_vendor.index.navigateTo({
                url: `/pages/station/powering?orderId=${res.data.data}&stationName=${stationInfo.stationName}&gunNo=${stationInfo.gunNo}`
              });
            }, 1500);
          } else {
            common_vendor.index.showToast({
              title: res.data.msg || "\u5145\u7535\u542F\u52A8\u5931\u8D25",
              icon: "none"
            });
          }
        },
        fail: (error) => {
          console.error("\u5145\u7535\u542F\u52A8\u5931\u8D25:", error);
          common_vendor.index.showToast({
            title: "\u5145\u7535\u542F\u52A8\u5931\u8D25",
            icon: "none"
          });
        }
      });
    };
    const startPrepayCharging = () => {
      components_js_request.request({
        url: "charging/prepay",
        method: "POST",
        data: {
          stationId: stationId.value,
          gunNumber: gunNumber.value,
          amount: finalAmount.value
        },
        success: (res) => {
          if (res.data.code === 200) {
            const { orderId, paymentParams } = res.data.data;
            common_vendor.index.requestPayment(__spreadProps(__spreadValues({
              provider: "wxpay"
            }, paymentParams), {
              success: (payRes) => {
                common_vendor.index.showToast({
                  title: "\u652F\u4ED8\u6210\u529F"
                });
                setTimeout(() => {
                  common_vendor.index.navigateTo({
                    url: `/pages/station/powering?orderId=${orderId}&stationName=${stationInfo.stationName}&gunNo=${stationInfo.gunNo}`
                  });
                }, 1500);
              },
              fail: (payErr) => {
                console.error("\u652F\u4ED8\u5931\u8D25:", payErr);
                common_vendor.index.showToast({
                  title: "\u652F\u4ED8\u5931\u8D25",
                  icon: "none"
                });
              }
            }));
          } else {
            common_vendor.index.showToast({
              title: res.data.msg || "\u9884\u4ED8\u8D39\u8BA2\u5355\u521B\u5EFA\u5931\u8D25",
              icon: "none"
            });
          }
        },
        fail: (error) => {
          console.error("\u9884\u4ED8\u8D39\u8BA2\u5355\u521B\u5EFA\u5931\u8D25:", error);
          common_vendor.index.showToast({
            title: "\u5145\u7535\u542F\u52A8\u5931\u8D25",
            icon: "none"
          });
        }
      });
    };
    common_vendor.onLoad((option) => {
      stationId.value = option.stationId;
      gunNumber.value = option.gunNumber;
      getStationInfo();
      getEnterpriseWallet();
    });
    common_vendor.onShow(() => {
      startAutoRefresh();
    });
    common_vendor.onHide(() => {
      stopAutoRefresh();
    });
    common_vendor.onUnmounted(() => {
      stopAutoRefresh();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "\u8D39\u7528\u786E\u8BA4"
        }),
        b: common_vendor.t(stationInfo.stationName),
        c: common_vendor.t(stationInfo.gunNo),
        d: common_vendor.unref(gunStatusText)
      }, common_vendor.unref(gunStatusText) ? {
        e: common_vendor.t(common_vendor.unref(gunStatusText)),
        f: common_vendor.n(getStatusClass())
      } : {}, {
        g: common_vendor.t(stationInfo.price),
        h: common_vendor.t(stationInfo.pricePeriod),
        i: enterpriseWallet.walletBalance !== null
      }, enterpriseWallet.walletBalance !== null ? {
        j: common_vendor.t(enterpriseWallet.enterpriseName || "\u6682\u65E0"),
        k: common_vendor.t(enterpriseWallet.walletBalance.toFixed(2)),
        l: common_vendor.t(((enterpriseWallet.accountingAmount || 0) - (enterpriseWallet.consumedAmount || 0)).toFixed(2))
      } : {}, {
        m: enterpriseWallet.walletBalance !== null
      }, enterpriseWallet.walletBalance !== null ? {
        n: common_vendor.p({
          checked: paymentMethod.value === "enterprise",
          ["checked-color"]: "#2D55E8"
        }),
        o: paymentMethod.value === "enterprise" ? 1 : "",
        p: common_vendor.o(($event) => selectPaymentMethod("enterprise"))
      } : {}, {
        q: common_vendor.p({
          checked: paymentMethod.value === "prepay",
          ["checked-color"]: "#2D55E8"
        }),
        r: paymentMethod.value === "prepay" ? 1 : "",
        s: common_vendor.o(($event) => selectPaymentMethod("prepay")),
        t: paymentMethod.value === "prepay"
      }, paymentMethod.value === "prepay" ? {
        v: common_vendor.f(presetAmounts.value, (amount, k0, i0) => {
          return {
            a: common_vendor.t(amount),
            b: amount,
            c: common_vendor.o(($event) => selectAmount(amount), amount),
            d: "3e528b70-3-" + i0,
            e: common_vendor.p({
              size: "small",
              type: selectedAmount.value === amount ? "primary" : "default",
              color: selectedAmount.value === amount ? "#2D55E8" : "",
              round: true
            })
          };
        }),
        w: common_vendor.o([($event) => customAmount.value = $event.detail.value, onCustomAmountInput]),
        x: customAmount.value
      } : {}, {
        y: paymentMethod.value === "enterprise"
      }, paymentMethod.value === "enterprise" ? {
        z: common_vendor.t(chargePercentage.value),
        A: common_vendor.o(onChargePercentageChange),
        B: common_vendor.o(onChargePercentageChange),
        C: common_vendor.p({
          value: chargePercentage.value,
          min: 0,
          max: 100,
          activeColor: "#2D55E8",
          inactiveColor: "#f0f2f5",
          barHeight: 8,
          buttonSize: 20
        })
      } : {}, {
        D: common_vendor.unref(buttonInfo).tip && common_vendor.unref(buttonInfo).disabled
      }, common_vendor.unref(buttonInfo).tip && common_vendor.unref(buttonInfo).disabled ? {
        E: common_vendor.t(common_vendor.unref(buttonInfo).tip)
      } : {}, {
        F: common_vendor.t(common_vendor.unref(buttonInfo).text),
        G: common_vendor.o(startCharging),
        H: common_vendor.p({
          round: true,
          block: true,
          color: common_vendor.unref(buttonInfo).disabled ? "#d9d9d9" : "#2D55E8",
          disabled: common_vendor.unref(buttonInfo).disabled
        })
      });
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3e528b70"], ["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/pages/station/create.vue"]]);
wx.createPage(MiniProgramPage);
