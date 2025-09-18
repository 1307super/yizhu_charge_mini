"use strict";
var common_vendor = require("../../common/vendor.js");
var components_js_request = require("../../components/js/request.js");
if (!Array) {
  const _component_van_checkbox = common_vendor.resolveComponent("van-checkbox");
  const _component_van_button = common_vendor.resolveComponent("van-button");
  const _component_van_popup = common_vendor.resolveComponent("van-popup");
  (_component_van_checkbox + _component_van_button + _component_van_popup)();
}
if (!Math) {
  navbar();
}
const navbar = () => "../../components/navbar/index.js";
const _sfc_main = {
  __name: "invoice",
  setup(__props) {
    const token = common_vendor.index.getStorageSync("token");
    const user = common_vendor.index.getStorageSync("user");
    const showTimeDrawer = common_vendor.ref(false);
    const selectedTimeOption = common_vendor.ref("halfYear");
    const startDate = common_vendor.ref("");
    const endDate = common_vendor.ref("");
    const quickTimeOptions = [
      { key: "halfYear", label: "\u8FD1\u534A\u5E74" },
      { key: "oneYear", label: "\u8FD1\u4E00\u5E74" },
      { key: "custom", label: "\u81EA\u5B9A\u4E49\u65F6\u95F4" }
    ];
    const invoiceHeader = common_vendor.reactive({
      id: null,
      headerType: null,
      companyName: "",
      customerName: "",
      taxNumber: "",
      invoiceType: null,
      email: "",
      contactPhone: ""
    });
    const orderList = common_vendor.ref([]);
    const selectedOrders = common_vendor.ref([]);
    const timeRangeText = common_vendor.computed$1(() => {
      const option = quickTimeOptions.find((opt) => opt.key === selectedTimeOption.value);
      if (selectedTimeOption.value === "custom" && startDate.value && endDate.value) {
        return `${startDate.value} \u81F3 ${endDate.value}`;
      }
      return (option == null ? void 0 : option.label) || "\u8FD1\u534A\u5E74";
    });
    const isAllSelected = common_vendor.computed$1(() => {
      return orderList.value.length > 0 && selectedOrders.value.length === orderList.value.length;
    });
    const totalAmount = common_vendor.computed$1(() => {
      return orderList.value.filter((order) => selectedOrders.value.includes(order.batchNo)).reduce((sum, order) => sum + parseFloat(order.chargeAmount || 0), 0);
    });
    const openTimeFilter = () => {
      showTimeDrawer.value = true;
    };
    const closeTimeFilter = () => {
      showTimeDrawer.value = false;
    };
    const selectQuickTime = (key) => {
      selectedTimeOption.value = key;
      if (key === "halfYear") {
        const now = new Date();
        const halfYearAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        startDate.value = formatDateForPicker(halfYearAgo);
        endDate.value = formatDateForPicker(now);
      } else if (key === "oneYear") {
        const now = new Date();
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        startDate.value = formatDateForPicker(oneYearAgo);
        endDate.value = formatDateForPicker(now);
      }
    };
    const onStartDateChange = (e) => {
      startDate.value = e.detail.value;
      selectedTimeOption.value = "custom";
    };
    const onEndDateChange = (e) => {
      const selectedEndDate = e.detail.value;
      if (startDate.value && selectedEndDate < startDate.value) {
        common_vendor.index.showToast({
          title: "\u7ED3\u675F\u65F6\u95F4\u4E0D\u80FD\u5C0F\u4E8E\u5F00\u59CB\u65F6\u95F4",
          icon: "none"
        });
        return;
      }
      endDate.value = selectedEndDate;
      selectedTimeOption.value = "custom";
    };
    const confirmTimeFilter = () => {
      if (!startDate.value || !endDate.value) {
        common_vendor.index.showToast({
          title: "\u8BF7\u9009\u62E9\u5B8C\u6574\u7684\u65F6\u95F4\u8303\u56F4",
          icon: "none"
        });
        return;
      }
      showTimeDrawer.value = false;
      loadOrderList();
    };
    const formatDateForPicker = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    const formatDate = (dateStr) => {
      if (!dateStr)
        return "";
      const date = new Date(dateStr);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${month}-${day}`;
    };
    const toggleOrderSelection = (batchNo) => {
      const index = selectedOrders.value.indexOf(batchNo);
      if (index > -1) {
        selectedOrders.value.splice(index, 1);
      } else {
        selectedOrders.value.push(batchNo);
      }
    };
    const toggleSelectAll = () => {
      if (isAllSelected.value) {
        selectedOrders.value = [];
      } else {
        selectedOrders.value = orderList.value.map((order) => order.batchNo);
      }
    };
    const goToHistory = () => {
      common_vendor.index.navigateTo({
        url: "/pages/user/invoice-history"
      });
    };
    const goToInvoiceHeader = () => {
      common_vendor.index.navigateTo({
        url: "/pages/user/invoice-header-list"
      });
    };
    const showHelp = () => {
      common_vendor.index.navigateTo({
        url: "/pages/user/invoice-help"
      });
    };
    const submitInvoiceRequest = () => {
      if (selectedOrders.value.length === 0) {
        common_vendor.index.showToast({
          title: "\u8BF7\u9009\u62E9\u8981\u5F00\u7968\u7684\u8BA2\u5355",
          icon: "none"
        });
        return;
      }
      if (!invoiceHeader.id) {
        common_vendor.index.showToast({
          title: "\u8BF7\u5148\u6DFB\u52A0\u53D1\u7968\u62AC\u5934",
          icon: "none"
        });
        return;
      }
      components_js_request.request({
        url: "invoice/apply",
        method: "POST",
        data: {
          batchIds: selectedOrders.value,
          headerType: invoiceHeader.headerType,
          headerId: invoiceHeader.id
        },
        success: (res) => {
          if (res.data.code === 200) {
            common_vendor.index.showToast({
              title: "\u5F00\u7968\u7533\u8BF7\u63D0\u4EA4\u6210\u529F"
            });
            selectedOrders.value = [];
            loadOrderList();
          } else {
            common_vendor.index.showToast({
              title: res.data.msg || "\u7533\u8BF7\u5931\u8D25",
              icon: "none"
            });
          }
        },
        fail: (error) => {
          common_vendor.index.showToast({
            title: "\u7533\u8BF7\u5931\u8D25",
            icon: "none"
          });
        }
      });
    };
    const getInvoiceHeader = () => {
      components_js_request.request({
        url: "invoice/header/default",
        method: "GET",
        data: {
          userId: user.memberId
        },
        success: (res) => {
          if (res.data.code === 200 && res.data.data) {
            Object.assign(invoiceHeader, res.data.data);
          }
        },
        fail: (error) => {
          console.log("\u83B7\u53D6\u53D1\u7968\u62AC\u5934\u5931\u8D25");
        }
      });
    };
    const loadOrderList = () => {
      components_js_request.request({
        url: "invoice/orders",
        method: "GET",
        data: {
          startDate: startDate.value,
          endDate: endDate.value,
          userId: user.memberId
        },
        success: (res) => {
          if (res.data.code === 200) {
            orderList.value = res.data.data || [];
          }
        },
        fail: (error) => {
          console.log("\u83B7\u53D6\u8BA2\u5355\u5217\u8868\u5931\u8D25");
        }
      });
    };
    common_vendor.onMounted(() => {
      if (!token) {
        common_vendor.index.showToast({
          title: "\u8BF7\u5148\u767B\u5F55",
          icon: "none"
        });
        setTimeout(() => {
          common_vendor.index.navigateTo({
            url: "/pages/user/login"
          });
        }, 1500);
        return;
      }
      selectQuickTime("halfYear");
      getInvoiceHeader();
      loadOrderList();
      common_vendor.index.$on("selectInvoiceHeader", (header) => {
        console.log("\u6536\u5230\u9009\u4E2D\u7684\u62AC\u5934:", header);
        Object.assign(invoiceHeader, header);
      });
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "\u5F00\u7968\u7BA1\u7406"
        }),
        b: common_vendor.t(common_vendor.unref(timeRangeText)),
        c: common_vendor.o(openTimeFilter),
        d: common_vendor.o(goToHistory),
        e: !invoiceHeader.id
      }, !invoiceHeader.id ? {} : {}, {
        f: !invoiceHeader.id
      }, !invoiceHeader.id ? {} : {
        g: common_vendor.t(invoiceHeader.headerType === "enterprise" ? invoiceHeader.companyName : invoiceHeader.customerName),
        h: common_vendor.t(invoiceHeader.invoiceType === "special" ? "\u589E\u503C\u7A0E\u4E13\u7528\u53D1\u7968" : "\u589E\u503C\u7A0E\u666E\u901A\u53D1\u7968")
      }, {
        i: common_vendor.o(goToInvoiceHeader),
        j: common_vendor.f(orderList.value, (order, index, i0) => {
          return {
            a: common_vendor.o(($event) => toggleOrderSelection(order.batchNo)),
            b: "26c9e962-1-" + i0,
            c: common_vendor.p({
              value: selectedOrders.value.includes(order.batchNo)
            }),
            d: common_vendor.t(order.stationName),
            e: common_vendor.t(formatDate(order.createTime)),
            f: common_vendor.t(order.chargeDegree),
            g: common_vendor.t(order.chargeAmount),
            h: order.batchNo
          };
        }),
        k: common_vendor.o(toggleSelectAll),
        l: common_vendor.p({
          value: common_vendor.unref(isAllSelected)
        }),
        m: common_vendor.t(selectedOrders.value.length),
        n: common_vendor.t(common_vendor.unref(totalAmount).toFixed(2)),
        o: common_vendor.o(showHelp),
        p: common_vendor.o(submitInvoiceRequest),
        q: common_vendor.p({
          type: "primary",
          color: "#2D55E8",
          disabled: selectedOrders.value.length === 0,
          round: true
        }),
        r: common_vendor.o(closeTimeFilter),
        s: common_vendor.f(quickTimeOptions, (option, k0, i0) => {
          return {
            a: common_vendor.t(option.label),
            b: option.key,
            c: selectedTimeOption.value === option.key ? 1 : "",
            d: common_vendor.o(($event) => selectQuickTime(option.key), option.key)
          };
        }),
        t: common_vendor.t(startDate.value || "\u8BF7\u9009\u62E9"),
        v: startDate.value,
        w: common_vendor.o(onStartDateChange),
        x: common_vendor.t(endDate.value || "\u8BF7\u9009\u62E9"),
        y: endDate.value,
        z: common_vendor.o(onEndDateChange),
        A: common_vendor.o(confirmTimeFilter),
        B: common_vendor.p({
          type: "primary",
          color: "#2D55E8",
          block: true
        }),
        C: common_vendor.o(($event) => showTimeDrawer.value = $event),
        D: common_vendor.p({
          position: "bottom",
          show: showTimeDrawer.value
        })
      });
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-26c9e962"], ["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/pages/user/invoice.vue"]]);
wx.createPage(MiniProgramPage);
