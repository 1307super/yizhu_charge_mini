"use strict";
var common_vendor = require("../../common/vendor.js");
var components_js_request = require("../../components/js/request.js");
if (!Array) {
  const _component_van_empty = common_vendor.resolveComponent("van-empty");
  const _component_van_action_sheet = common_vendor.resolveComponent("van-action-sheet");
  (_component_van_empty + _component_van_action_sheet)();
}
if (!Math) {
  navbar();
}
const navbar = () => "../../components/navbar/index.js";
const _sfc_main = {
  __name: "invoice-header-list",
  setup(__props) {
    const token = common_vendor.index.getStorageSync("token");
    const user = common_vendor.index.getStorageSync("user");
    const reapply = common_vendor.ref(false);
    const originalInvoiceNo = common_vendor.ref("");
    const headerList = common_vendor.ref([]);
    const showActions = common_vendor.ref(false);
    const actionSheetActions = common_vendor.ref([]);
    const currentHeader = common_vendor.ref(null);
    const currentIndex = common_vendor.ref(-1);
    const showActionSheet = (header, index) => {
      currentHeader.value = header;
      currentIndex.value = index;
      const actions = [
        { name: "\u7F16\u8F91", color: "#333" }
      ];
      if (!header.isDefault) {
        actions.push({ name: "\u8BBE\u4E3A\u9ED8\u8BA4", color: "#2D55E8" });
      }
      actions.push({ name: "\u5220\u9664", color: "#ff4444" });
      actionSheetActions.value = actions;
      showActions.value = true;
    };
    const onActionSelect = (event) => {
      console.log("\u9009\u62E9\u4E8B\u4EF6:", event);
      const selectedAction = event.detail;
      console.log("\u9009\u62E9\u7684\u64CD\u4F5C:", selectedAction);
      const header = currentHeader.value;
      const headerIndex = currentIndex.value;
      showActions.value = false;
      if (!header) {
        console.log("\u672A\u627E\u5230\u5F53\u524D\u64CD\u4F5C\u7684\u62AC\u5934");
        return;
      }
      if (!selectedAction || !selectedAction.name) {
        console.log("\u672A\u627E\u5230\u64CD\u4F5C\u540D\u79F0");
        return;
      }
      const actionName = selectedAction.name;
      console.log("\u64CD\u4F5C\u540D\u79F0:", actionName);
      switch (actionName) {
        case "\u7F16\u8F91":
          console.log("\u6267\u884C\u7F16\u8F91\u64CD\u4F5C");
          goToEditHeader(header);
          break;
        case "\u8BBE\u4E3A\u9ED8\u8BA4":
          console.log("\u6267\u884C\u8BBE\u4E3A\u9ED8\u8BA4\u64CD\u4F5C");
          setAsDefault(header.id);
          break;
        case "\u5220\u9664":
          console.log("\u6267\u884C\u5220\u9664\u64CD\u4F5C");
          deleteHeader(header.id, headerIndex);
          break;
        default:
          console.log("\u672A\u77E5\u64CD\u4F5C:", actionName);
      }
    };
    const selectHeader = (header) => {
      console.log("selectHeader\u88AB\u8C03\u7528", { reapply: reapply.value, originalInvoiceNo: originalInvoiceNo.value });
      if (reapply.value && originalInvoiceNo.value) {
        common_vendor.index.showModal({
          title: "\u786E\u8BA4\u91CD\u65B0\u7533\u8BF7",
          content: `\u786E\u5B9A\u4F7F\u7528\u300C${header.headerType === "enterprise" ? header.companyName : header.customerName}\u300D\u4F5C\u4E3A\u53D1\u7968\u62AC\u5934\u91CD\u65B0\u7533\u8BF7\u5417\uFF1F`,
          success: (res) => {
            if (res.confirm) {
              reapplyInvoice(header.id);
            }
          }
        });
      } else {
        common_vendor.index.$emit("selectInvoiceHeader", header);
        common_vendor.index.navigateBack();
      }
    };
    const reapplyInvoice = (headerId) => {
      console.log("\u8C03\u7528\u91CD\u65B0\u7533\u8BF7\u63A5\u53E3", { originalInvoiceNo: originalInvoiceNo.value, headerId });
      common_vendor.index.showLoading({
        title: "\u63D0\u4EA4\u4E2D..."
      });
      components_js_request.request({
        url: "invoice/reapply",
        method: "POST",
        data: {
          originalInvoiceNo: originalInvoiceNo.value,
          headerId
        },
        success: (res) => {
          console.log("\u91CD\u65B0\u7533\u8BF7\u63A5\u53E3\u54CD\u5E94", res);
          common_vendor.index.hideLoading();
          if (res.data.code === 200) {
            common_vendor.index.showToast({
              title: "\u91CD\u65B0\u7533\u8BF7\u6210\u529F",
              icon: "success"
            });
            common_vendor.index.$emit("refreshInvoiceHistory");
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 1500);
          } else {
            common_vendor.index.showToast({
              title: res.data.msg || "\u91CD\u65B0\u7533\u8BF7\u5931\u8D25",
              icon: "none"
            });
          }
        },
        fail: (error) => {
          console.log("\u91CD\u65B0\u7533\u8BF7\u63A5\u53E3\u5931\u8D25", error);
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "\u91CD\u65B0\u7533\u8BF7\u5931\u8D25",
            icon: "none"
          });
        }
      });
    };
    const goToAddHeader = () => {
      common_vendor.index.navigateTo({
        url: "/pages/user/invoice-header-form?mode=add"
      });
    };
    const goToEditHeader = (header) => {
      const headerData = encodeURIComponent(JSON.stringify(header));
      common_vendor.index.navigateTo({
        url: `/pages/user/invoice-header-form?mode=edit&data=${headerData}`
      });
    };
    const setAsDefault = (headerId) => {
      common_vendor.index.showModal({
        title: "\u786E\u8BA4\u64CD\u4F5C",
        content: "\u786E\u5B9A\u8981\u5C06\u6B64\u53D1\u7968\u62AC\u5934\u8BBE\u4E3A\u9ED8\u8BA4\u5417\uFF1F",
        success: (res) => {
          if (res.confirm) {
            components_js_request.request({
              url: "invoice/header/setDefault",
              method: "POST",
              data: {
                headerId,
                userId: user.memberId
              },
              success: (res2) => {
                if (res2.data.code === 200) {
                  headerList.value.forEach((header) => {
                    header.isDefault = header.id === headerId;
                  });
                  common_vendor.index.showToast({
                    title: "\u8BBE\u7F6E\u6210\u529F"
                  });
                  loadHeaderList();
                } else {
                  common_vendor.index.showToast({
                    title: res2.data.msg || "\u8BBE\u7F6E\u5931\u8D25",
                    icon: "none"
                  });
                }
              },
              fail: (error) => {
                common_vendor.index.showToast({
                  title: "\u8BBE\u7F6E\u5931\u8D25",
                  icon: "none"
                });
              }
            });
          }
        }
      });
    };
    const deleteHeader = (headerId, index) => {
      common_vendor.index.showModal({
        title: "\u786E\u8BA4\u5220\u9664",
        content: "\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u4E2A\u53D1\u7968\u62AC\u5934\u5417\uFF1F\u5220\u9664\u540E\u65E0\u6CD5\u6062\u590D\u3002",
        success: (res) => {
          if (res.confirm) {
            components_js_request.request({
              url: "invoice/header/delete",
              method: "POST",
              data: {
                headerId,
                userId: user.memberId
              },
              success: (res2) => {
                if (res2.data.code === 200) {
                  common_vendor.index.showToast({
                    title: "\u5220\u9664\u6210\u529F"
                  });
                  headerList.value.splice(index, 1);
                } else {
                  common_vendor.index.showToast({
                    title: res2.data.msg || "\u5220\u9664\u5931\u8D25",
                    icon: "none"
                  });
                }
              },
              fail: (error) => {
                common_vendor.index.showToast({
                  title: "\u5220\u9664\u5931\u8D25",
                  icon: "none"
                });
              }
            });
          }
        }
      });
    };
    const loadHeaderList = () => {
      components_js_request.request({
        url: "invoice/header/list",
        method: "GET",
        data: {
          userId: user.memberId
        },
        success: (res) => {
          if (res.data.code === 200) {
            headerList.value = res.data.data || [];
          }
        },
        fail: (error) => {
          console.log("\u83B7\u53D6\u53D1\u7968\u62AC\u5934\u5217\u8868\u5931\u8D25");
        }
      });
    };
    common_vendor.onLoad((options) => {
      console.log("\u9875\u9762\u53C2\u6570", options);
      if (options.reapply) {
        reapply.value = options.reapply === "true";
        originalInvoiceNo.value = options.originalInvoiceNo || "";
        console.log("\u8BBE\u7F6E\u53C2\u6570", { reapply: reapply.value, originalInvoiceNo: originalInvoiceNo.value });
      }
    });
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
      loadHeaderList();
      common_vendor.index.$on("refreshHeaderList", () => {
        console.log("\u6536\u5230\u5237\u65B0\u5217\u8868\u4E8B\u4EF6");
        loadHeaderList();
      });
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: reapply.value ? "\u9009\u62E9\u53D1\u7968\u62AC\u5934" : "\u53D1\u7968\u62AC\u5934\u7BA1\u7406"
        }),
        b: !reapply.value
      }, !reapply.value ? {
        c: common_vendor.o(goToAddHeader)
      } : {}, {
        d: reapply.value
      }, reapply.value ? {} : {}, {
        e: headerList.value.length === 0
      }, headerList.value.length === 0 ? {
        f: common_vendor.p({
          description: "\u6682\u65E0\u53D1\u7968\u62AC\u5934"
        })
      } : {}, {
        g: common_vendor.f(headerList.value, (header, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(header.headerType === "enterprise" ? header.companyName : header.customerName),
            b: header.isDefault
          }, header.isDefault ? {} : {}, {
            c: common_vendor.t(header.headerType === "enterprise" ? "\u4F01\u4E1A\u5355\u4F4D" : "\u4E2A\u4EBA/\u975E\u4F01\u4E1A"),
            d: header.headerType === "enterprise"
          }, header.headerType === "enterprise" ? {
            e: common_vendor.t(header.taxNumber)
          } : {}, {
            f: common_vendor.t(header.invoiceType === "special" ? "\u589E\u503C\u7A0E\u4E13\u7528\u53D1\u7968" : "\u589E\u503C\u7A0E\u666E\u901A\u53D1\u7968"),
            g: common_vendor.t(header.email),
            h: header.contactPhone
          }, header.contactPhone ? {
            i: common_vendor.t(header.contactPhone)
          } : {}, {
            j: common_vendor.o(($event) => selectHeader(header))
          }, !reapply.value ? {
            k: common_vendor.o(($event) => showActionSheet(header, index))
          } : {}, {
            l: header.id
          });
        }),
        h: !reapply.value,
        i: common_vendor.o(onActionSelect),
        j: common_vendor.o(($event) => showActions.value = false),
        k: common_vendor.o(($event) => showActions.value = false),
        l: common_vendor.o(($event) => showActions.value = $event),
        m: common_vendor.p({
          actions: actionSheetActions.value,
          cancelText: "\u53D6\u6D88",
          closeOnClickOverlay: true,
          show: showActions.value
        })
      });
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-15616b73"], ["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/pages/user/invoice-header-list.vue"]]);
wx.createPage(MiniProgramPage);
