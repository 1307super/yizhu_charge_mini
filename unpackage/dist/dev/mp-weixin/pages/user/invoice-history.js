"use strict";
var common_vendor = require("../../common/vendor.js");
var components_js_request = require("../../components/js/request.js");
if (!Array) {
  const _component_van_empty = common_vendor.resolveComponent("van-empty");
  const _component_van_button = common_vendor.resolveComponent("van-button");
  const _component_van_popup = common_vendor.resolveComponent("van-popup");
  (_component_van_empty + _component_van_button + _component_van_popup)();
}
if (!Math) {
  navbar();
}
const navbar = () => "../../components/navbar/index.js";
const _sfc_main = {
  __name: "invoice-history",
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
    const historyList = common_vendor.ref([]);
    const expandedItems = common_vendor.ref([]);
    const timeRangeText = common_vendor.computed$1(() => {
      const option = quickTimeOptions.find((opt) => opt.key === selectedTimeOption.value);
      if (selectedTimeOption.value === "custom" && startDate.value && endDate.value) {
        return `${startDate.value} \u81F3 ${endDate.value}`;
      }
      return (option == null ? void 0 : option.label) || "\u8FD1\u534A\u5E74";
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
      loadHistoryList();
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
    const formatDateTime = (dateStr) => {
      if (!dateStr)
        return "";
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hour = String(date.getHours()).padStart(2, "0");
      const minute = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hour}:${minute}`;
    };
    const getStatusText = (status) => {
      const statusMap = {
        pending: "\u7533\u8BF7\u4E2D",
        processing: "\u5F00\u7968\u4E2D",
        completed: "\u5DF2\u5F00\u7968",
        rejected: "\u5DF2\u62D2\u7EDD"
      };
      return statusMap[status] || "\u672A\u77E5\u72B6\u6001";
    };
    const getStatusClass = (status) => {
      return status;
    };
    const toggleDetails = (invoiceId) => {
      const index = expandedItems.value.indexOf(invoiceId);
      if (index > -1) {
        expandedItems.value.splice(index, 1);
      } else {
        const invoice = historyList.value.find((item) => item.invoiceId === invoiceId);
        if (invoice && !invoice.orders) {
          loadInvoiceDetail(invoice.invoiceNo, invoiceId);
        } else {
          expandedItems.value.push(invoiceId);
        }
      }
    };
    const loadInvoiceDetail = (invoiceNo, invoiceId) => {
      common_vendor.index.showLoading({
        title: "\u52A0\u8F7D\u8BE6\u60C5\u4E2D..."
      });
      components_js_request.request({
        url: `invoice/detail/${invoiceNo}`,
        method: "GET",
        success: (res) => {
          common_vendor.index.hideLoading();
          if (res.data.code === 200) {
            const invoiceIndex = historyList.value.findIndex((item) => item.invoiceId === invoiceId);
            if (invoiceIndex > -1) {
              historyList.value[invoiceIndex].orders = res.data.data.batches || [];
              expandedItems.value.push(invoiceId);
            }
          } else {
            common_vendor.index.showToast({
              title: res.data.msg || "\u83B7\u53D6\u8BE6\u60C5\u5931\u8D25",
              icon: "none"
            });
          }
        },
        fail: (error) => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "\u83B7\u53D6\u8BE6\u60C5\u5931\u8D25",
            icon: "none"
          });
        }
      });
    };
    const downloadPdf = (pdfUrl, invoiceNo) => {
      if (!pdfUrl) {
        common_vendor.index.showToast({
          title: "PDF\u6587\u4EF6\u4E0D\u5B58\u5728",
          icon: "none"
        });
        return;
      }
      common_vendor.index.setClipboardData({
        data: pdfUrl,
        success: () => {
          common_vendor.index.showToast({
            title: "PDF\u94FE\u63A5\u5DF2\u590D\u5236"
          });
        }
      });
      common_vendor.index.downloadFile({
        url: pdfUrl,
        success: (res) => {
          if (res.statusCode === 200) {
            common_vendor.index.openDocument({
              filePath: res.tempFilePath,
              success: () => {
                console.log("\u6253\u5F00PDF\u6210\u529F");
              },
              fail: (err) => {
                console.log("\u6253\u5F00PDF\u5931\u8D25", err);
                common_vendor.index.showToast({
                  title: "\u65E0\u6CD5\u6253\u5F00PDF\u6587\u4EF6",
                  icon: "none"
                });
              }
            });
          }
        },
        fail: (err) => {
          console.log("\u4E0B\u8F7DPDF\u5931\u8D25", err);
          common_vendor.index.showToast({
            title: "\u4E0B\u8F7DPDF\u5931\u8D25",
            icon: "none"
          });
        }
      });
    };
    const handleReapply = (item) => {
      common_vendor.index.navigateTo({
        url: `/pages/user/invoice-header-list?reapply=true&originalInvoiceNo=${item.invoiceNo}`
      });
    };
    const loadHistoryList = () => {
      components_js_request.request({
        url: "invoice/history",
        method: "GET",
        data: {
          startDate: startDate.value,
          endDate: endDate.value,
          userId: user.memberId
        },
        success: (res) => {
          if (res.data.code === 200) {
            historyList.value = res.data.data || [];
          }
        },
        fail: (error) => {
          console.log("\u83B7\u53D6\u5F00\u7968\u5386\u53F2\u5931\u8D25");
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
      loadHistoryList();
      common_vendor.index.$on("refreshInvoiceHistory", () => {
        console.log("\u6536\u5230\u5237\u65B0\u53D1\u7968\u5386\u53F2\u4E8B\u4EF6");
        loadHistoryList();
      });
    });
    common_vendor.onShow(() => {
      if (historyList.value.length > 0 || token) {
        console.log("\u9875\u9762\u663E\u793A\uFF0C\u5237\u65B0\u53D1\u7968\u5386\u53F2\u6570\u636E");
        loadHistoryList();
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "\u5F00\u7968\u5386\u53F2"
        }),
        b: common_vendor.t(common_vendor.unref(timeRangeText)),
        c: common_vendor.o(openTimeFilter),
        d: historyList.value.length === 0
      }, historyList.value.length === 0 ? {
        e: common_vendor.p({
          description: "\u6682\u65E0\u5F00\u7968\u8BB0\u5F55"
        })
      } : {}, {
        f: common_vendor.f(historyList.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.invoiceNo),
            b: common_vendor.t(formatDateTime(item.createTime)),
            c: common_vendor.t(getStatusText(item.status)),
            d: common_vendor.n(getStatusClass(item.status)),
            e: common_vendor.t(item.companyName),
            f: common_vendor.t(item.taxNumber),
            g: common_vendor.t(item.totalAmount.toFixed(2)),
            h: item.status === "completed" && item.pdfUrl
          }, item.status === "completed" && item.pdfUrl ? {
            i: common_vendor.o(($event) => downloadPdf(item.pdfUrl, item.invoiceNo))
          } : {}, {
            j: item.status === "rejected"
          }, item.status === "rejected" ? {
            k: common_vendor.t(item.rejectReason || "\u6682\u65E0\u9A73\u56DE\u539F\u56E0"),
            l: common_vendor.o(($event) => handleReapply(item)),
            m: "bf7de8ae-2-" + i0,
            n: common_vendor.p({
              type: "primary",
              size: "small",
              color: "#2D55E8"
            })
          } : {}, {
            o: expandedItems.value.includes(item.invoiceId)
          }, expandedItems.value.includes(item.invoiceId) ? {
            p: common_vendor.f(item.orders, (order, k1, i1) => {
              return {
                a: common_vendor.t(order.stationName),
                b: common_vendor.t(formatDate(order.createTime)),
                c: common_vendor.t(order.chargeDegree),
                d: common_vendor.t(order.chargeAmount),
                e: order.batchNo
              };
            })
          } : {}, {
            q: common_vendor.t(expandedItems.value.includes(item.invoiceId) ? "\u6536\u8D77\u8BE6\u60C5" : "\u67E5\u770B\u8BE6\u60C5"),
            r: common_vendor.o(($event) => toggleDetails(item.invoiceId)),
            s: item.invoiceId
          });
        }),
        g: common_vendor.o(closeTimeFilter),
        h: common_vendor.f(quickTimeOptions, (option, k0, i0) => {
          return {
            a: common_vendor.t(option.label),
            b: option.key,
            c: selectedTimeOption.value === option.key ? 1 : "",
            d: common_vendor.o(($event) => selectQuickTime(option.key), option.key)
          };
        }),
        i: common_vendor.t(startDate.value || "\u8BF7\u9009\u62E9"),
        j: startDate.value,
        k: common_vendor.o(onStartDateChange),
        l: common_vendor.t(endDate.value || "\u8BF7\u9009\u62E9"),
        m: endDate.value,
        n: common_vendor.o(onEndDateChange),
        o: common_vendor.o(confirmTimeFilter),
        p: common_vendor.p({
          type: "primary",
          color: "#2D55E8",
          block: true
        }),
        q: common_vendor.o(($event) => showTimeDrawer.value = $event),
        r: common_vendor.p({
          position: "bottom",
          show: showTimeDrawer.value
        })
      });
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bf7de8ae"], ["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/pages/user/invoice-history.vue"]]);
wx.createPage(MiniProgramPage);
