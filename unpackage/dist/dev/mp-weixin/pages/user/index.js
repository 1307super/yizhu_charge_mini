"use strict";
var common_vendor = require("../../common/vendor.js");
var components_js_request = require("../../components/js/request.js");
if (!Array) {
  const _component_van_col = common_vendor.resolveComponent("van-col");
  const _component_van_row = common_vendor.resolveComponent("van-row");
  (_component_van_col + _component_van_row)();
}
if (!Math) {
  (navbar + tabbar)();
}
const navbar = () => "../../components/navbar/index.js";
const tabbar = () => "../../components/tabbar/index.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    getApp();
    const token = common_vendor.index.getStorageSync("token");
    common_vendor.index.getStorageSync("user");
    const phone = common_vendor.index.getStorageSync("phone");
    const month = common_vendor.reactive({});
    const getmonth = () => {
      components_js_request.request({
        url: "me/monthlyChargeStats",
        method: "GET",
        success: (res) => {
          for (let key in res.data.data) {
            month[key] = res.data.data[key];
          }
        }
      });
    };
    const enterpriseWallet = common_vendor.reactive({
      enterpriseName: null,
      walletBalance: null,
      accountingAmount: null,
      consumedAmount: null,
      minLimit: null
    });
    const getEnterpriseWallet = () => {
      components_js_request.request({
        url: "me/getEnterpriseWallet",
        method: "GET",
        success: (res) => {
          if (res.data.code === 200 && res.data.data) {
            Object.assign(enterpriseWallet, res.data.data);
          }
        },
        fail: (error) => {
          console.log("\u4F01\u4E1A\u94B1\u5305\u4FE1\u606F\u83B7\u53D6\u5931\u8D25");
        }
      });
    };
    const go = (url) => {
      common_vendor.index.navigateTo({
        url
      });
    };
    const goabort = (url) => {
      if (token) {
        go(url);
      } else {
        common_vendor.index.showToast({
          title: "\u8BF7\u5148\u767B\u5F55",
          icon: "none",
          duration: 2e3
        });
        setTimeout(() => {
          common_vendor.index.navigateTo({
            url: "/pages/user/login"
          });
        }, 1e3);
      }
    };
    common_vendor.onMounted(() => {
      if (token) {
        getmonth();
        getEnterpriseWallet();
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "\u6211\u7684",
          showarrow: false
        }),
        b: common_vendor.unref(token)
      }, common_vendor.unref(token) ? {
        c: common_vendor.t(common_vendor.unref(phone))
      } : {
        d: common_vendor.o(($event) => go("/pages/user/login"))
      }, {
        e: common_vendor.o(($event) => goabort("/pages/user/setting")),
        f: enterpriseWallet.walletBalance !== null
      }, enterpriseWallet.walletBalance !== null ? {
        g: common_vendor.t(enterpriseWallet.walletBalance.toFixed(2)),
        h: common_vendor.t(((enterpriseWallet.accountingAmount || 0) - (enterpriseWallet.consumedAmount || 0)).toFixed(2))
      } : {}, {
        i: common_vendor.o(($event) => goabort("/pages/user/order")),
        j: common_vendor.o(($event) => goabort("/pages/user/invoice")),
        k: common_vendor.t(month.totalChargeDegree || 0),
        l: common_vendor.p({
          span: 12
        }),
        m: common_vendor.t(month.totalChargeAmount || 0),
        n: common_vendor.p({
          span: 12
        }),
        o: common_vendor.p({
          active: 1
        })
      });
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-137d5072"], ["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/pages/user/index.vue"]]);
wx.createPage(MiniProgramPage);
