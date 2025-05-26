"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const components_js_request = require("../../components/js/request.js");
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
          title: "您还未登录，请先登录",
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
          title: "我的",
          showarrow: false
        }),
        b: common_assets._imports_0$2,
        c: common_vendor.unref(token)
      }, common_vendor.unref(token) ? {
        d: common_vendor.t(common_vendor.unref(phone))
      } : {
        e: common_vendor.o(($event) => go("/pages/user/login"))
      }, {
        f: common_vendor.o(($event) => goabort("/pages/user/setting")),
        g: common_assets._imports_1$1,
        h: common_vendor.t(balance.value),
        i: common_vendor.p({
          span: 8
        }),
        j: common_vendor.p({
          span: 8
        }),
        k: common_vendor.t(score.value),
        l: common_vendor.p({
          span: 8
        }),
        m: common_assets._imports_2,
        n: common_vendor.o(($event) => goabort("/pages/user/order")),
        o: common_vendor.t(month.chargeDegree || 0),
        p: common_vendor.p({
          span: 8
        }),
        q: common_vendor.t(month.chargeAmount || 0),
        r: common_vendor.p({
          span: 8
        }),
        s: common_vendor.t(month.chargeTime || 0),
        t: common_vendor.p({
          span: 8
        }),
        v: common_vendor.p({
          active: 1
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-79e6a490"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/index.js.map
