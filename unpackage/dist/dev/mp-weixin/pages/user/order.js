"use strict";
var common_vendor = require("../../common/vendor.js");
var components_js_request = require("../../components/js/request.js");
if (!Math) {
  navbar();
}
const navbar = () => "../../components/navbar/index.js";
const _sfc_main = {
  __name: "order",
  setup(__props) {
    getApp();
    const tabs = common_vendor.ref([
      { label: "\u5168\u90E8", value: "" },
      { label: "\u8FDB\u884C\u4E2D", value: "1" },
      { label: "\u5DF2\u5B8C\u6210", value: "2" }
    ]);
    const currentTab = common_vendor.ref("");
    const query = common_vendor.reactive({
      orderState: "",
      pageNo: 1,
      pageSize: 10,
      userId: ""
    });
    const orderList = common_vendor.ref([]);
    const isLoading = common_vendor.ref(false);
    const hasMore = common_vendor.ref(true);
    const loadingText = common_vendor.ref("\u4E0A\u6ED1\u52A0\u8F7D\u66F4\u591A");
    const totalOrders = common_vendor.computed$1(() => {
      return orderList.value.length;
    });
    const setActiveTab = (value) => {
      console.log("\u5207\u6362tab:", value);
      currentTab.value = value;
      query.orderState = value;
      console.log("\u67E5\u8BE2\u53C2\u6570:", query);
      resetAndLoad();
    };
    const resetAndLoad = () => {
      orderList.value = [];
      query.pageNo = 1;
      hasMore.value = true;
      isLoading.value = false;
      loadOrderList();
    };
    const loadOrderList = () => {
      if (isLoading.value || !hasMore.value)
        return;
      console.log("\u5F00\u59CB\u52A0\u8F7D\u8BA2\u5355\u5217\u8868\uFF0C\u53C2\u6570:", query);
      isLoading.value = true;
      loadingText.value = "\u52A0\u8F7D\u4E2D...";
      components_js_request.request({
        url: "order/queryOrderList",
        method: "GET",
        data: query,
        success: (res) => {
          console.log("\u63A5\u53E3\u8FD4\u56DE\u7ED3\u679C:", res);
          isLoading.value = false;
          if (res.data.code === 200) {
            const newOrders = res.data.data.records || [];
            if (query.pageNo === 1) {
              orderList.value = newOrders;
            } else {
              orderList.value = orderList.value.concat(newOrders);
            }
            if (res.data.data.pages <= res.data.data.current) {
              hasMore.value = false;
              loadingText.value = "\u6CA1\u6709\u66F4\u591A\u4E86";
            } else {
              loadingText.value = "\u4E0A\u6ED1\u52A0\u8F7D\u66F4\u591A";
            }
          }
        },
        fail: (error) => {
          isLoading.value = false;
          console.error("\u52A0\u8F7D\u8BA2\u5355\u5931\u8D25:", error);
          common_vendor.index.showToast({
            title: "\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5",
            icon: "none"
          });
          loadingText.value = "\u52A0\u8F7D\u5931\u8D25\uFF0C\u70B9\u51FB\u91CD\u8BD5";
        },
        complete: () => {
          isLoading.value = false;
          common_vendor.index.stopPullDownRefresh();
        }
      });
    };
    const getStatusText = (status) => {
      switch (status) {
        case 1:
          return "\u8FDB\u884C\u4E2D";
        case 2:
          return "\u5DF2\u5B8C\u6210";
        case 3:
          return "\u5DF2\u5173\u95ED";
        case 4:
          return "\u9000\u6B3E\u5931\u8D25";
        default:
          return "\u672A\u77E5";
      }
    };
    const getStatusClass = (status) => {
      switch (status) {
        case 1:
          return "status-ongoing";
        case 2:
          return "status-completed";
        case 3:
          return "status-closed";
        case 4:
          return "status-closed";
        default:
          return "";
      }
    };
    const formatTime = (timeStr) => {
      if (!timeStr)
        return "";
      try {
        const date = new Date(timeStr.replace(" ", "T"));
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hour = String(date.getHours()).padStart(2, "0");
        const minute = String(date.getMinutes()).padStart(2, "0");
        return `${year}\u5E74${month}\u6708${day}\u65E5 ${hour}:${minute}`;
      } catch (e) {
        return timeStr;
      }
    };
    const goToDetail = (order) => {
      if (order.batchStatus === 1) {
        common_vendor.index.navigateTo({
          url: `/pages/station/powering?batchNo=${order.batchNo}&stationName=${order.stationName}&licensePlate=${order.licensePlate || ""}`
        });
      } else {
        common_vendor.index.navigateTo({
          url: `/pages/user/orderdetail?batchNo=${order.batchNo}`
        });
      }
    };
    common_vendor.onLoad((options) => {
      const userInfo = common_vendor.index.getStorageSync("user");
      if (userInfo && userInfo.memberId) {
        query.userId = userInfo.memberId;
      }
      if (options.orderState) {
        currentTab.value = options.orderState;
        query.orderState = options.orderState;
      }
      loadOrderList();
    });
    common_vendor.onPullDownRefresh(() => {
      resetAndLoad();
    });
    common_vendor.onReachBottom(() => {
      if (hasMore.value && !isLoading.value) {
        query.pageNo++;
        loadOrderList();
      }
    });
    common_vendor.onMounted(() => {
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "\u6211\u7684\u8BA2\u5355",
          delta: 1
        }),
        b: common_vendor.f(tabs.value, (tab, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(tab.label),
            b: currentTab.value === tab.value
          }, currentTab.value === tab.value ? {} : {}, {
            c: index,
            d: currentTab.value === tab.value ? 1 : "",
            e: common_vendor.o(($event) => setActiveTab(tab.value), index)
          });
        }),
        c: common_vendor.t(common_vendor.unref(totalOrders)),
        d: common_vendor.f(orderList.value, (order, index, i0) => {
          return {
            a: common_vendor.t(order.stationName || "\u5145\u7535\u7AD9"),
            b: common_vendor.t(getStatusText(order.batchStatus)),
            c: common_vendor.n(getStatusClass(order.batchStatus)),
            d: common_vendor.t(order.chargePower || "0"),
            e: common_vendor.t(order.chargeAmount || "0"),
            f: common_vendor.t(order.chargeDuration || "00:00:00"),
            g: common_vendor.t(formatTime(order.startTime)),
            h: order.batchNo || index,
            i: common_vendor.o(($event) => goToDetail(order), order.batchNo || index)
          };
        }),
        e: orderList.value.length > 0
      }, orderList.value.length > 0 ? {
        f: common_vendor.t(loadingText.value)
      } : {}, {
        g: orderList.value.length === 0 && !isLoading.value
      }, orderList.value.length === 0 && !isLoading.value ? {} : {});
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0f0c1843"], ["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/pages/user/order.vue"]]);
wx.createPage(MiniProgramPage);
