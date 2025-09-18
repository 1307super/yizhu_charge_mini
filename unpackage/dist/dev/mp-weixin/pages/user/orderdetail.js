"use strict";
var common_vendor = require("../../common/vendor.js");
var components_js_request = require("../../components/js/request.js");
if (!Math) {
  navbar();
}
const navbar = () => "../../components/navbar/index.js";
const _sfc_main = {
  __name: "orderdetail",
  setup(__props) {
    getApp();
    const batchInfo = common_vendor.reactive({
      batchNo: "",
      stationName: "",
      licensePlate: "",
      vehicleVin: "",
      startTime: "",
      status: 0,
      totalChargeFee: "0",
      totalPower: "0",
      totalOriginalServiceFee: "0",
      totalServiceFee: "0",
      totalAmount: "0"
    });
    const ordersList = common_vendor.ref([]);
    const isLoading = common_vendor.ref(false);
    const showOriginalPrice = common_vendor.computed$1(() => {
      return batchInfo.totalOriginalServiceFee && batchInfo.totalOriginalServiceFee !== batchInfo.totalServiceFee && parseFloat(batchInfo.totalOriginalServiceFee) > parseFloat(batchInfo.totalServiceFee);
    });
    const getBatchDetail = (batchNo) => {
      if (!batchNo)
        return;
      isLoading.value = true;
      components_js_request.request({
        url: "/order/getChargingOrderDetail",
        method: "GET",
        data: { batchNo },
        success: (res) => {
          isLoading.value = false;
          if (res.data.code === 200) {
            const data = res.data.data;
            Object.assign(batchInfo, {
              batchNo: data.batchNo || "",
              stationName: data.stationName || "",
              licensePlate: data.licensePlate || "",
              vehicleVin: data.vehicleVin || "",
              startTime: data.startTime || "",
              status: data.status || 0,
              totalChargeFee: data.totalChargeFee || "0",
              totalPower: data.totalPower || "0",
              totalOriginalServiceFee: data.totalOriginalServiceFee || "0",
              totalServiceFee: data.totalServiceFee || "0",
              totalAmount: data.totalAmount || "0"
            });
            ordersList.value = data.orders || [];
          } else {
            common_vendor.index.showToast({
              title: res.data.msg || "\u83B7\u53D6\u8BE6\u60C5\u5931\u8D25",
              icon: "none"
            });
          }
        },
        fail: (error) => {
          isLoading.value = false;
          console.error("\u83B7\u53D6\u6279\u6B21\u8BE6\u60C5\u5931\u8D25:", error);
          common_vendor.index.showToast({
            title: "\u7F51\u7EDC\u5F02\u5E38\uFF0C\u8BF7\u91CD\u8BD5",
            icon: "none"
          });
        },
        complete: () => {
          isLoading.value = false;
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
          return "\u672A\u77E5\u72B6\u6001";
      }
    };
    const getStatusSubtitle = (status) => {
      switch (status) {
        case 1:
          return "\u8BF7\u8010\u5FC3\u7B49\u5F85\u5145\u7535\u5B8C\u6210";
        case 2:
          return "\u611F\u8C22\u4F7F\u7528\u5409\u8FD0\u8D85\u5145\uFF0C\u6B22\u8FCE\u4E0B\u6B21\u518D\u6765\uFF01";
        case 3:
          return "\u5145\u7535\u5DF2\u5173\u95ED";
        case 4:
          return "\u9000\u6B3E\u5904\u7406\u5931\u8D25\uFF0C\u8BF7\u8054\u7CFB\u5BA2\u670D";
        default:
          return "";
      }
    };
    const getStatusIcon = (status) => {
      switch (status) {
        case 1:
          return "\u26A1";
        case 2:
          return "\u2713";
        case 3:
          return "\u2715";
        case 4:
          return "\u26A0";
        default:
          return "?";
      }
    };
    const getStatusIconClass = (status) => {
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
    const formatDateTime = (timeStr) => {
      if (!timeStr)
        return "";
      try {
        const date = new Date(timeStr.replace(" ", "T"));
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hour = String(date.getHours()).padStart(2, "0");
        const minute = String(date.getMinutes()).padStart(2, "0");
        const second = String(date.getSeconds()).padStart(2, "0");
        return `${year}\u5E74${month}\u6708${day}\u65E5 ${hour}:${minute}:${second}`;
      } catch (e) {
        return timeStr;
      }
    };
    common_vendor.onLoad((options) => {
      if (options.batchNo) {
        getBatchDetail(options.batchNo);
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
    common_vendor.onMounted(() => {
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "\u8BA2\u5355\u8BE6\u60C5",
          delta: 1
        }),
        b: common_vendor.t(getStatusIcon(batchInfo.status)),
        c: common_vendor.n(getStatusIconClass(batchInfo.status)),
        d: common_vendor.t(getStatusText(batchInfo.status)),
        e: common_vendor.t(getStatusSubtitle(batchInfo.status)),
        f: common_vendor.t(batchInfo.totalPower || "0"),
        g: common_vendor.t(batchInfo.totalChargeFee || "0"),
        h: common_vendor.t(batchInfo.totalPower || "0"),
        i: common_vendor.t(batchInfo.totalServiceFee || "0"),
        j: common_vendor.unref(showOriginalPrice)
      }, common_vendor.unref(showOriginalPrice) ? {
        k: common_vendor.t(batchInfo.totalOriginalServiceFee || "0")
      } : {}, {
        l: common_vendor.t(batchInfo.totalAmount || "0"),
        m: common_vendor.t(batchInfo.stationName || "\u5145\u7535\u7AD9"),
        n: common_vendor.t(batchInfo.batchNo || ""),
        o: common_vendor.f(ordersList.value, (order, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(order.gunNo),
            b: common_vendor.t(order.power || "0"),
            c: common_vendor.t(order.chargeFee || "0"),
            d: common_vendor.t(order.power || "0"),
            e: common_vendor.t(order.serviceFee || "0"),
            f: order.originalServiceFee && order.originalServiceFee !== order.serviceFee
          }, order.originalServiceFee && order.originalServiceFee !== order.serviceFee ? {
            g: common_vendor.t(order.originalServiceFee)
          } : {}, {
            h: common_vendor.t(order.actualAmount || "0"),
            i: common_vendor.t(order.orderNumber || ""),
            j: common_vendor.t(formatDateTime(order.startTime)),
            k: common_vendor.t(formatDateTime(order.endTime)),
            l: common_vendor.t(order.chargeDuration || "00:00:00"),
            m: index < ordersList.value.length - 1
          }, index < ordersList.value.length - 1 ? {} : {}, {
            n: order.orderNumber || index
          });
        }),
        p: ordersList.value.length === 0 && !isLoading.value
      }, ordersList.value.length === 0 && !isLoading.value ? {} : {}, {
        q: isLoading.value
      }, isLoading.value ? {} : {});
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-308973d4"], ["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/pages/user/orderdetail.vue"]]);
wx.createPage(MiniProgramPage);
