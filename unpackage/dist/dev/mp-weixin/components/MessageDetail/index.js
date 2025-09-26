"use strict";
var common_vendor = require("../../common/vendor.js");
var components_js_request = require("../js/request.js");
if (!Array) {
  const _component_van_icon = common_vendor.resolveComponent("van-icon");
  _component_van_icon();
}
const _sfc_main = {
  __name: "index",
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  emits: ["close"],
  setup(__props, { emit: emits }) {
    const props = __props;
    const messageDetail = common_vendor.ref({});
    const loading = common_vendor.ref(false);
    const contentMaxHeight = common_vendor.computed$1(() => {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      const windowHeight = systemInfo.windowHeight;
      const rpxRatio = systemInfo.windowWidth / 750;
      const availableHeight = windowHeight - (80 + 120 + 50) * rpxRatio;
      return Math.floor(availableHeight / rpxRatio);
    });
    const formatTime = (timeStr) => {
      if (!timeStr)
        return "";
      const date = new Date(timeStr);
      return date.getFullYear() + "\u5E74" + (date.getMonth() + 1).toString().padStart(2, "0") + "\u6708" + date.getDate().toString().padStart(2, "0") + "\u65E5 " + date.getHours().toString().padStart(2, "0") + ":" + date.getMinutes().toString().padStart(2, "0");
    };
    const getMessageDetail = () => {
      if (!props.message || !props.message.noticeId)
        return;
      loading.value = true;
      components_js_request.request({
        url: `user/notice/${props.message.noticeId}`,
        method: "GET",
        success: (res) => {
          loading.value = false;
          if (res.data.code === 200 && res.data.data) {
            messageDetail.value = res.data.data;
          } else {
            common_vendor.index.showToast({
              title: "\u52A0\u8F7D\u5931\u8D25",
              icon: "none"
            });
          }
        },
        fail: () => {
          loading.value = false;
          common_vendor.index.showToast({
            title: "\u52A0\u8F7D\u5931\u8D25",
            icon: "none"
          });
        }
      });
    };
    const closeModal = () => {
      emits("close");
    };
    const handleOverlayClick = () => {
      closeModal();
    };
    common_vendor.watch(() => props.message, (newMessage) => {
      if (newMessage && newMessage.noticeId) {
        getMessageDetail();
      }
    }, { immediate: true });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(messageDetail.value.noticeTitle),
        b: common_vendor.o(closeModal),
        c: common_vendor.p({
          name: "cross",
          size: "24px"
        }),
        d: common_vendor.t(formatTime(messageDetail.value.createTime)),
        e: messageDetail.value.noticeContent,
        f: common_vendor.unref(contentMaxHeight) + "rpx",
        g: common_vendor.o(() => {
        }),
        h: common_vendor.o(handleOverlayClick)
      };
    };
  }
};
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-012a26b0"], ["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/components/MessageDetail/index.vue"]]);
wx.createComponent(Component);
