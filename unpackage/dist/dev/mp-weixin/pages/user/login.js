"use strict";
var common_vendor = require("../../common/vendor.js");
if (!Math) {
  navbar();
}
const navbar = () => "../../components/navbar/index.js";
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const app = getApp();
    const agreed = common_vendor.ref(false);
    const shouldShake = common_vendor.ref(false);
    const toggleAgreement = () => {
      agreed.value = !agreed.value;
    };
    const viewUserAgreement = () => {
      common_vendor.index.navigateTo({
        url: "/pages/user/user-agreement"
      });
    };
    const viewPrivacyPolicy = () => {
      common_vendor.index.navigateTo({
        url: "/pages/user/privacy-policy"
      });
    };
    const handleLoginClick = () => {
      if (!agreed.value) {
        common_vendor.index.showToast({
          title: "\u8BF7\u9605\u8BFB\u5E76\u540C\u610F\u7528\u6237\u534F\u8BAE\u53CA\u9690\u79C1\u4FDD\u62A4\u534F\u8BAE",
          icon: "none",
          duration: 2e3
        });
        triggerShake();
        return;
      }
    };
    const triggerShake = () => {
      shouldShake.value = true;
      setTimeout(() => {
        shouldShake.value = false;
      }, 500);
    };
    const getPhoneNumber = (e) => {
      if (e.detail.code) {
        common_vendor.index.login({
          provider: "weixin",
          success: (res) => {
            loginWithPhone(res.code, e.detail.code);
          },
          fail: function(err) {
            common_vendor.index.showToast({
              title: "\u767B\u5F55\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5",
              icon: "none"
            });
          }
        });
      }
    };
    const redirecturl = common_vendor.index.getStorageSync("redirecturl");
    const loginWithPhone = (code, phoneCode) => {
      common_vendor.index.request({
        url: app.globalData.serverUrl + "v1/auth/loginWithPhone",
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          appid: app.globalData.appid,
          code,
          phoneCode
        },
        success: (res) => {
          if (res.data.code == 200) {
            common_vendor.index.setStorageSync("token", res.data.data.token);
            common_vendor.index.setStorageSync("user", res.data.data.member);
            common_vendor.index.setStorageSync("phone", res.data.data.member.mobile || res.data.data.mobile);
            common_vendor.index.showToast({
              title: "\u767B\u5F55\u6210\u529F"
            });
            setTimeout(() => {
              if (redirecturl) {
                common_vendor.index.removeStorageSync("redirecturl");
                common_vendor.index.redirectTo({
                  url: redirecturl
                });
              } else {
                common_vendor.index.redirectTo({
                  url: "/pages/user/index"
                });
              }
            }, 1500);
          } else {
            common_vendor.index.showToast({
              title: res.data.message || "\u767B\u5F55\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5",
              icon: "none"
            });
          }
        },
        fail: (err) => {
          common_vendor.index.showToast({
            title: "\u7F51\u7EDC\u9519\u8BEF\uFF0C\u8BF7\u91CD\u8BD5",
            icon: "none"
          });
        }
      });
    };
    common_vendor.onMounted(() => {
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "\u767B\u5F55"
        }),
        b: agreed.value ? "getPhoneNumber|agreePrivacyAuthorization" : "",
        c: common_vendor.o(getPhoneNumber),
        d: common_vendor.o(handleLoginClick),
        e: agreed.value,
        f: common_vendor.o(viewUserAgreement),
        g: common_vendor.o(viewPrivacyPolicy),
        h: common_vendor.o(toggleAgreement),
        i: shouldShake.value ? 1 : ""
      };
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-802e0a44"], ["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/pages/user/login.vue"]]);
wx.createPage(MiniProgramPage);
