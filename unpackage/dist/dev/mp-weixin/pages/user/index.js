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
    const user = common_vendor.index.getStorageSync("user");
    const phone = common_vendor.index.getStorageSync("phone");
    const score = common_vendor.ref(0);
    const getscore = () => {
      components_js_request.request({
        url: "/me/getUserCredit",
        data: {
          userId: user.memberId
        },
        success: (res) => {
          score.value = res.data.data.credit;
        }
      });
    };
    const month = common_vendor.reactive({});
    const getmonth = () => {
      components_js_request.request({
        url: "me/queryMonthTotalByUserId",
        data: {
          userId: user.memberId
        },
        success: (res) => {
          for (let key in res.data.data) {
            month[key] = res.data.data[key];
          }
        }
      });
    };
    const balance = common_vendor.ref(0);
    const getbalance = () => {
      components_js_request.request({
        url: "/me/getMemberBalanceByUserId",
        data: {
          userId: user.memberId
        },
        success: (res) => {
          balance.value = res.data.data.amount;
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
          title: "\u60A8\u8FD8\u672A\u767B\u5F55\uFF0C\u8BF7\u5148\u767B\u5F55",
          icon: "none"
        });
      }
    };
    common_vendor.onMounted(() => {
      if (token) {
        getscore();
        getbalance();
        getmonth();
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
        f: common_vendor.t(balance.value),
        g: common_vendor.p({
          span: 8
        }),
        h: common_vendor.p({
          span: 8
        }),
        i: common_vendor.t(score.value),
        j: common_vendor.p({
          span: 8
        }),
        k: common_vendor.o(($event) => goabort("/pages/user/order")),
        l: common_vendor.t(month.chargeDegree || 0),
        m: common_vendor.p({
          span: 8
        }),
        n: common_vendor.t(month.chargeAmount || 0),
        o: common_vendor.p({
          span: 8
        }),
        p: common_vendor.t(month.chargeTime || 0),
        q: common_vendor.p({
          span: 8
        }),
        r: common_vendor.p({
          active: 1
        })
      });
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-137d5072"], ["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/pages/user/index.vue"]]);
wx.createPage(MiniProgramPage);
