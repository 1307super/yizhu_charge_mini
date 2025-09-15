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
if (!Array) {
  const _component_path = common_vendor.resolveComponent("path");
  const _component_svg = common_vendor.resolveComponent("svg");
  (_component_path + _component_svg)();
}
const _sfc_main = {
  __name: "confirm",
  setup(__props) {
    const baseUrl = "https://api.example.com";
    const gunId = common_vendor.ref(null);
    const stationName = common_vendor.ref("");
    const gunNo = common_vendor.ref("");
    const price = common_vendor.ref(0);
    const pricePeriod = common_vendor.ref("");
    const enterpriseWallet = common_vendor.reactive({
      balance: null,
      creditAmount: null
    });
    const paymentMethod = common_vendor.ref("prepay");
    const chargeToPercent = common_vendor.ref(80);
    const prepayOptions = [50, 100, 300, 500];
    const prepayAmount = common_vendor.ref(50);
    const isCustomAmount = common_vendor.ref(false);
    const customPrepayAmount = common_vendor.ref(null);
    const customAmountFocused = common_vendor.ref(false);
    const fetchStationInfo = (id) => {
      return new Promise((resolve, reject) => {
        common_vendor.index.request({
          url: `${baseUrl}/api/station/info`,
          method: "GET",
          data: { gunId: id },
          success: (res) => {
            if (res.statusCode === 200 && res.data) {
              stationName.value = res.data.stationName;
              gunNo.value = res.data.gunNo;
              price.value = res.data.price;
              pricePeriod.value = res.data.pricePeriod;
              resolve(res.data);
            } else {
              reject({ errMsg: "\u83B7\u53D6\u7AD9\u70B9\u4FE1\u606F\u5931\u8D25" });
            }
          },
          fail: (err) => reject(err)
        });
      });
    };
    const fetchEnterpriseWallet = () => {
      return new Promise((resolve, reject) => {
        common_vendor.index.request({
          url: `${baseUrl}/api/user/enterprise/wallet`,
          method: "GET",
          success: (res) => {
            if (res.statusCode === 200 && res.data && res.data.balance != null) {
              enterpriseWallet.balance = res.data.balance;
              enterpriseWallet.creditAmount = res.data.creditAmount;
              paymentMethod.value = "enterprise";
            }
            resolve(res.data);
          },
          fail: (err) => reject(err)
        });
      });
    };
    const onSliderChange = (e) => {
      chargeToPercent.value = e.detail.value;
    };
    const selectPrepayAmount = (amount) => {
      isCustomAmount.value = false;
      prepayAmount.value = amount;
      customPrepayAmount.value = null;
    };
    const focusCustomAmount = () => {
      isCustomAmount.value = true;
      prepayAmount.value = 0;
      customAmountFocused.value = true;
    };
    const onCustomAmountInput = (e) => {
      customPrepayAmount.value = parseFloat(e.detail.value) || null;
    };
    const doPayment = (paymentParams, orderId) => {
      common_vendor.index.requestPayment(__spreadProps(__spreadValues({}, paymentParams), {
        success: () => {
          common_vendor.index.showToast({ title: "\u652F\u4ED8\u6210\u529F", icon: "success" });
          common_vendor.index.redirectTo({ url: `/pages/station/powering?orderId=${orderId}` });
        },
        fail: () => {
          common_vendor.index.showToast({ title: "\u652F\u4ED8\u5DF2\u53D6\u6D88", icon: "none" });
        },
        complete: () => common_vendor.index.hideLoading()
      }));
    };
    const handlePrepayCharge = () => {
      const amount = isCustomAmount.value ? customPrepayAmount.value : prepayAmount.value;
      if (!amount || amount < 10) {
        common_vendor.index.showToast({ title: "\u91D1\u989D\u5FC5\u987B\u5927\u4E8E\u7B49\u4E8E10\u5143", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "\u6B63\u5728\u521B\u5EFA\u8BA2\u5355..." });
      common_vendor.index.request({
        url: `${baseUrl}/api/charge/prepay`,
        method: "POST",
        data: {
          gunId: gunId.value,
          amount
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data.paymentParams) {
            doPayment(res.data.paymentParams, res.data.orderId);
          } else {
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({ title: res.data.errMsg || "\u521B\u5EFA\u8BA2\u5355\u5931\u8D25", icon: "none" });
          }
        },
        fail: (err) => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "\u8BF7\u6C42\u5931\u8D25", icon: "none" });
        }
      });
    };
    const handleEnterpriseCharge = () => {
      common_vendor.index.showLoading({ title: "\u6B63\u5728\u542F\u52A8..." });
      common_vendor.index.request({
        url: `${baseUrl}/api/charge/start/enterprise`,
        method: "POST",
        data: {
          gunId: gunId.value,
          chargeToPercent: chargeToPercent.value
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data.orderId) {
            common_vendor.index.showToast({ title: "\u5145\u7535\u5DF2\u5F00\u59CB", icon: "success" });
            common_vendor.index.redirectTo({ url: `/pages/station/powering?orderId=${res.data.orderId}` });
          } else {
            common_vendor.index.showToast({ title: res.data.errMsg || "\u542F\u52A8\u5931\u8D25", icon: "none" });
          }
        },
        fail: (err) => {
          common_vendor.index.showToast({ title: "\u8BF7\u6C42\u5931\u8D25", icon: "none" });
        },
        complete: () => common_vendor.index.hideLoading()
      });
    };
    const startCharge = () => {
      if (paymentMethod.value === "enterprise") {
        handleEnterpriseCharge();
      } else {
        handlePrepayCharge();
      }
    };
    common_vendor.onLoad((options) => {
      if (!options.gunId) {
        common_vendor.index.showToast({ title: "\u7F3A\u5C11\u5145\u7535\u67AA\u4FE1\u606F", icon: "error" });
        common_vendor.index.navigateBack();
        return;
      }
      gunId.value = options.gunId;
      common_vendor.index.showLoading({ title: "\u52A0\u8F7D\u4E2D..." });
      Promise.all([
        fetchStationInfo(gunId.value),
        fetchEnterpriseWallet()
      ]).catch((err) => {
        common_vendor.index.showToast({ title: err.errMsg || "\u6570\u636E\u52A0\u8F7D\u5931\u8D25", icon: "none" });
      }).finally(() => {
        common_vendor.index.hideLoading();
      });
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(stationName.value),
        b: common_vendor.p({
          d: "M864 320H640v-64c0-35.2-28.8-64-64-64H448c-35.2 0-64 28.8-64 64v64H160c-17.6 0-32 14.4-32 32v192c0 17.6 14.4 32 32 32h64v256c0 35.2 28.8 64 64 64h64c17.6 0 32-14.4 32-32V608h128v256c0 35.2 28.8 64 64 64h64c17.6 0 32-14.4 32-32V608h64c17.6 0 32-14.4 32-32V352c0-17.6-14.4-32-32-32zM448 256h128v64H448v-64z m128 576H448V608h128v224z m256-224H640V384h192v192z",
          fill: "#2c2c2c"
        }),
        c: common_vendor.p({
          viewBox: "0 0 1024 1024",
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg"
        }),
        d: common_vendor.t(gunNo.value),
        e: common_vendor.t(price.value),
        f: common_vendor.t(pricePeriod.value),
        g: enterpriseWallet.balance > 0
      }, enterpriseWallet.balance > 0 ? {
        h: common_vendor.t(enterpriseWallet.balance),
        i: common_vendor.t(enterpriseWallet.creditAmount)
      } : {}, {
        j: enterpriseWallet.balance > 0
      }, enterpriseWallet.balance > 0 ? {
        k: paymentMethod.value === "enterprise" ? 1 : "",
        l: common_vendor.o(($event) => paymentMethod.value = "enterprise")
      } : {}, {
        m: paymentMethod.value === "prepay" ? 1 : "",
        n: common_vendor.o(($event) => paymentMethod.value = "prepay"),
        o: paymentMethod.value === "enterprise"
      }, paymentMethod.value === "enterprise" ? {
        p: common_vendor.t(chargeToPercent.value),
        q: chargeToPercent.value,
        r: common_vendor.o(onSliderChange)
      } : {}, {
        s: paymentMethod.value === "prepay"
      }, paymentMethod.value === "prepay" ? common_vendor.e({
        t: common_vendor.f(prepayOptions, (a, k0, i0) => {
          return {
            a: common_vendor.t(a),
            b: a,
            c: prepayAmount.value === a ? 1 : "",
            d: common_vendor.o(($event) => selectPrepayAmount(a), a)
          };
        }),
        v: isCustomAmount.value ? 1 : "",
        w: common_vendor.o(focusCustomAmount),
        x: isCustomAmount.value
      }, isCustomAmount.value ? {
        y: common_vendor.o([($event) => customPrepayAmount.value = $event.detail.value, onCustomAmountInput]),
        z: customAmountFocused.value,
        A: customPrepayAmount.value
      } : {}) : {}, {
        B: common_vendor.o(startCharge)
      });
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/pages/station/confirm.vue"]]);
wx.createPage(MiniProgramPage);
