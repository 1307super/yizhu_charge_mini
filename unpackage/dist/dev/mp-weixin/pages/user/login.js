"use strict";
const common_vendor = require("../../common/vendor.js");
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
                  title: "登录成功"
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
          title: "登录"
        }),
        b: common_vendor.o(getPhoneNumber)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6163e5ce"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/login.js.map
