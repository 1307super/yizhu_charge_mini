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
var components_js_uploadFile = require("../../components/js/uploadFile.js");
if (!Array) {
  const _component_van_icon = common_vendor.resolveComponent("van-icon");
  const _component_van_button = common_vendor.resolveComponent("van-button");
  const _component_van_popup = common_vendor.resolveComponent("van-popup");
  (_component_van_icon + _component_van_button + _component_van_popup)();
}
if (!Math) {
  navbar();
}
const navbar = () => "../../components/navbar/index.js";
const _sfc_main = {
  __name: "setting",
  setup(__props) {
    const userInfo = common_vendor.ref({
      avatar: "",
      nickname: ""
    });
    const showNickname = common_vendor.ref(false);
    const tempNickname = common_vendor.ref("");
    common_vendor.onMounted(() => {
      loadUserInfo();
    });
    const loadUserInfo = () => {
      const user = common_vendor.index.getStorageSync("user");
      if (user) {
        userInfo.value = {
          avatar: user.avatar || "",
          nickname: user.nickname || ""
        };
      }
    };
    const onChooseAvatar = async (e) => {
      const avatarUrl = e.detail.avatarUrl;
      console.log("\u9009\u62E9\u5934\u50CF:", avatarUrl);
      try {
        common_vendor.index.showLoading({ title: "\u4E0A\u4F20\u4E2D..." });
        components_js_uploadFile.uploadFile({
          url: "/me/avatar",
          filePath: avatarUrl,
          name: "file",
          success: (res) => {
            try {
              const data = JSON.parse(res.data);
              if (data.code === 200) {
                if (data.data && data.data.avatar) {
                  userInfo.value.avatar = data.data.avatar;
                  const currentUser = common_vendor.index.getStorageSync("user") || {};
                  common_vendor.index.setStorageSync("user", __spreadProps(__spreadValues({}, currentUser), { avatar: data.data.avatar }));
                }
                common_vendor.index.hideLoading();
                common_vendor.index.showToast({
                  title: "\u5934\u50CF\u66F4\u65B0\u6210\u529F",
                  icon: "success"
                });
              } else {
                throw new Error(data.message || "\u4E0A\u4F20\u5931\u8D25");
              }
            } catch (parseError) {
              common_vendor.index.hideLoading();
              console.error("\u54CD\u5E94\u89E3\u6790\u5931\u8D25:", parseError);
              common_vendor.index.showToast({
                title: "\u4E0A\u4F20\u5931\u8D25",
                icon: "none"
              });
            }
          },
          fail: (error) => {
            common_vendor.index.hideLoading();
            console.error("\u5934\u50CF\u4E0A\u4F20\u5931\u8D25:", error);
            common_vendor.index.showToast({
              title: "\u5934\u50CF\u66F4\u65B0\u5931\u8D25",
              icon: "none"
            });
          }
        });
      } catch (error) {
        common_vendor.index.hideLoading();
        console.error("\u5934\u50CF\u4E0A\u4F20\u5F02\u5E38:", error);
        common_vendor.index.showToast({
          title: "\u5934\u50CF\u66F4\u65B0\u5931\u8D25",
          icon: "none"
        });
      }
    };
    const showNicknameDrawer = () => {
      tempNickname.value = userInfo.value.nickname;
      showNickname.value = true;
    };
    const onNicknameInput = (e) => {
      tempNickname.value = e.detail.value;
      console.log("\u6635\u79F0\u8F93\u5165:", e.detail.value);
    };
    const onNicknameConfirm = (e) => {
      console.log("\u6635\u79F0\u786E\u8BA4:", e.detail.value);
    };
    const saveNickname = async () => {
      if (!tempNickname.value.trim()) {
        common_vendor.index.showToast({
          title: "\u8BF7\u8F93\u5165\u6635\u79F0",
          icon: "none"
        });
        return;
      }
      try {
        common_vendor.index.showLoading({ title: "\u4FDD\u5B58\u4E2D..." });
        await updateUserProfile({
          nickname: tempNickname.value.trim()
        });
        userInfo.value.nickname = tempNickname.value.trim();
        const currentUser = common_vendor.index.getStorageSync("user") || {};
        common_vendor.index.setStorageSync("user", __spreadProps(__spreadValues({}, currentUser), { nickname: tempNickname.value.trim() }));
        showNickname.value = false;
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "\u6635\u79F0\u66F4\u65B0\u6210\u529F",
          icon: "success"
        });
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "\u6635\u79F0\u66F4\u65B0\u5931\u8D25",
          icon: "none"
        });
      }
    };
    const updateUserProfile = (data) => {
      return new Promise((resolve, reject) => {
        common_vendor.index.getStorageSync("token");
        components_js_request.request({
          url: "/me/profile",
          method: "PUT",
          data,
          success: (res) => {
            if (res.data.code === 200) {
              resolve(res.data);
            } else {
              reject(new Error(res.data.message || "\u8BF7\u6C42\u5931\u8D25"));
            }
          },
          fail: (error) => {
            reject(error);
          }
        });
      });
    };
    const logout = () => {
      common_vendor.index.showModal({
        title: "\u786E\u5B9A\u9000\u51FA?",
        showCancel: true,
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.removeStorageSync("user");
            common_vendor.index.showToast({
              title: "\u9000\u51FA\u6210\u529F",
              icon: "none"
            });
            setTimeout(() => {
              common_vendor.index.redirectTo({
                url: "/pages/user/index"
              });
            }, 1500);
          }
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: ""
        }),
        b: userInfo.value.avatar || "../../static/image/avatar.png",
        c: common_vendor.o(onChooseAvatar),
        d: common_vendor.p({
          name: "arrow"
        }),
        e: common_vendor.t(userInfo.value.nickname || "\u672A\u8BBE\u7F6E"),
        f: common_vendor.p({
          name: "arrow"
        }),
        g: common_vendor.o(showNicknameDrawer),
        h: common_vendor.o(logout),
        i: common_vendor.p({
          type: "default"
        }),
        j: common_vendor.o(($event) => showNickname.value = false),
        k: common_vendor.p({
          name: "cross"
        }),
        l: common_vendor.o([($event) => tempNickname.value = $event.detail.value, onNicknameInput]),
        m: common_vendor.o(onNicknameConfirm),
        n: showNickname.value,
        o: tempNickname.value,
        p: common_vendor.o(saveNickname),
        q: !tempNickname.value || !tempNickname.value.trim(),
        r: common_vendor.o(($event) => showNickname.value = false),
        s: common_vendor.p({
          show: showNickname.value,
          position: "bottom",
          round: true
        })
      };
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-52e26b05"], ["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/pages/user/setting.vue"]]);
wx.createPage(MiniProgramPage);
