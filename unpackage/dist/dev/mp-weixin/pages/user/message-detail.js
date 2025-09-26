"use strict";
var common_vendor = require("../../common/vendor.js");
var components_js_request = require("../../components/js/request.js");
if (!Array) {
  const _component_van_empty = common_vendor.resolveComponent("van-empty");
  _component_van_empty();
}
if (!Math) {
  navbar();
}
const navbar = () => "../../components/navbar/index.js";
const _sfc_main = {
  __name: "message-detail",
  setup(__props) {
    const messageDetail = common_vendor.ref(null);
    const loading = common_vendor.ref(false);
    const getMessageDetail = (messageId) => {
      loading.value = true;
      components_js_request.request({
        url: `message/${messageId}`,
        method: "GET",
        success: (res) => {
          if (res.data.code === 200) {
            messageDetail.value = res.data.data;
          } else {
            common_vendor.index.showToast({
              title: res.data.msg || "\u83B7\u53D6\u6D88\u606F\u8BE6\u60C5\u5931\u8D25",
              icon: "none"
            });
          }
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "\u7F51\u7EDC\u5F02\u5E38\uFF0C\u8BF7\u91CD\u8BD5",
            icon: "none"
          });
        },
        complete: () => {
          loading.value = false;
        }
      });
    };
    const formatTime = (timeStr) => {
      if (!timeStr)
        return "";
      const date = new Date(timeStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    };
    common_vendor.onMounted(() => {
      var _a;
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const messageId = (_a = currentPage.options) == null ? void 0 : _a.id;
      if (messageId) {
        getMessageDetail(messageId);
      } else {
        common_vendor.index.showToast({
          title: "\u53C2\u6570\u9519\u8BEF",
          icon: "none"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "\u6D88\u606F\u8BE6\u60C5"
        }),
        b: messageDetail.value
      }, messageDetail.value ? {
        c: common_vendor.t(messageDetail.value.title),
        d: common_vendor.t(messageDetail.value.typeName),
        e: common_vendor.t(formatTime(messageDetail.value.createTime)),
        f: messageDetail.value.content
      } : loading.value ? {} : {
        h: common_vendor.p({
          description: "\u6D88\u606F\u4E0D\u5B58\u5728\u6216\u5DF2\u5220\u9664"
        })
      }, {
        g: loading.value
      });
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ecd8a19c"], ["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/pages/user/message-detail.vue"]]);
wx.createPage(MiniProgramPage);
