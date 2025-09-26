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
  __name: "message",
  setup(__props) {
    const messageList = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const hasMore = common_vendor.ref(true);
    const currentPage = common_vendor.ref(1);
    const pageSize = 10;
    const getMessageList = (page = 1, isLoadMore = false) => {
      loading.value = true;
      components_js_request.request({
        url: "message/list",
        method: "GET",
        data: {
          pageNum: page,
          pageSize
        },
        success: (res) => {
          loading.value = false;
          if (res.data.code === 200) {
            const newMessages = res.data.data.records || [];
            const total = res.data.data.total || 0;
            if (isLoadMore) {
              messageList.value = [...messageList.value, ...newMessages];
            } else {
              messageList.value = newMessages;
            }
            hasMore.value = messageList.value.length < total;
            currentPage.value = page;
          } else {
            common_vendor.index.showToast({
              title: res.data.msg || "\u83B7\u53D6\u6D88\u606F\u5217\u8868\u5931\u8D25",
              icon: "none"
            });
          }
        },
        fail: () => {
          loading.value = false;
          common_vendor.index.showToast({
            title: "\u7F51\u7EDC\u5F02\u5E38\uFF0C\u8BF7\u91CD\u8BD5",
            icon: "none"
          });
        }
      });
    };
    const loadMore = () => {
      if (loading.value || !hasMore.value)
        return;
      getMessageList(currentPage.value + 1, true);
    };
    const goToDetail = (messageId) => {
      common_vendor.index.navigateTo({
        url: `/pages/user/message-detail?id=${messageId}`
      });
    };
    const getContentSummary = (content) => {
      if (!content)
        return "";
      const plainText = content.replace(/<[^>]*>/g, "");
      if (plainText.length > 50) {
        return plainText.substring(0, 50) + "...";
      }
      return plainText;
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
      getMessageList();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "\u6D88\u606F\u5217\u8868"
        }),
        b: messageList.value.length > 0
      }, messageList.value.length > 0 ? {
        c: common_vendor.f(messageList.value, (message, k0, i0) => {
          return common_vendor.e({
            a: !message.isRead
          }, !message.isRead ? {} : {}, {
            b: common_vendor.t(message.title),
            c: message.summary
          }, message.summary ? {
            d: common_vendor.t(message.summary)
          } : message.content ? {
            f: common_vendor.t(getContentSummary(message.content))
          } : {}, {
            e: message.content,
            g: common_vendor.t(formatTime(message.createTime)),
            h: message.messageId,
            i: common_vendor.o(($event) => goToDetail(message.messageId), message.messageId)
          });
        })
      } : !loading.value && messageList.value.length === 0 ? {
        e: common_vendor.p({
          description: "\u6682\u65E0\u6D88\u606F"
        })
      } : {}, {
        d: !loading.value && messageList.value.length === 0,
        f: loading.value
      }, loading.value ? {} : {}, {
        g: hasMore.value && !loading.value
      }, hasMore.value && !loading.value ? {
        h: common_vendor.o(loadMore)
      } : {});
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2620a93c"], ["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/pages/user/message.vue"]]);
wx.createPage(MiniProgramPage);
