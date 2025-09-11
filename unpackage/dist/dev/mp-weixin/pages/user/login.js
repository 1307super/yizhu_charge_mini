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
    const getPhoneNumber = (e) => {
      if (e.detail.code) {
        common_vendor.index.login({
          provider: "weixin",
          success: (res) => {
            const params = {};
            params.code = res.code;
            common_vendor.index.getUserInfo({
              provider: "weixin",
              success: (loginRes) => {
                if (loginRes && loginRes.errMsg == "getUserInfo:ok") {
                  params.encryptedData = loginRes.encryptedData;
                  params.iv = loginRes.iv;
                  login(params, e);
                }
              },
              fail: function(err) {
              }
            });
          }
        });
      }
    };
    const redirecturl = common_vendor.index.getStorageSync("redirecturl");
    const login = (params, e) => {
      common_vendor.index.request({
        url: app.globalData.serverUrl + "v1/auth/login",
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          appid: app.globalData.appid,
          code: params.code
        },
        success: (res) => {
          if (res.data.code == 200) {
            common_vendor.index.setStorageSync("token", res.data.data.token);
            common_vendor.index.setStorageSync("user", res.data.data.member);
            common_vendor.index.request({
              url: app.globalData.serverUrl + "v1/auth/appletBindMobile",
              method: "GET",
              data: {
                appid: app.globalData.appid,
                code: e.detail.code,
                openId: res.data.data.member.weixinOpenid
              },
              success: (res1) => {
                common_vendor.index.setStorageSync("phone", res1.data.data.mobile);
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
              }
            });
          }
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
        b: common_vendor.o(getPhoneNumber)
      };
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-802e0a44"], ["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/pages/user/login.vue"]]);
wx.createPage(MiniProgramPage);
