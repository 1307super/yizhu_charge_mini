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
if (!Array) {
  const _component_van_button = common_vendor.resolveComponent("van-button");
  _component_van_button();
}
if (!Math) {
  navbar();
}
const navbar = () => "../../components/navbar/index.js";
const _sfc_main = {
  __name: "invoice-header-form",
  setup(__props) {
    const token = common_vendor.index.getStorageSync("token");
    const user = common_vendor.index.getStorageSync("user");
    const saving = common_vendor.ref(false);
    const mode = common_vendor.ref("add");
    const editData = common_vendor.ref(null);
    const pageTitle = common_vendor.computed$1(() => {
      return mode.value === "edit" ? "\u7F16\u8F91\u53D1\u7968\u62AC\u5934" : "\u65B0\u589E\u53D1\u7968\u62AC\u5934";
    });
    const formData = common_vendor.reactive({
      headerType: "personal",
      companyName: "",
      taxNumber: "",
      invoiceType: "normal",
      companyAddress: "",
      companyPhone: "",
      bankName: "",
      bankAccount: "",
      customerName: "",
      email: "",
      contactPhone: "",
      isDefault: false
    });
    common_vendor.watch(() => formData.headerType, (newType) => {
      if (newType === "personal") {
        formData.companyName = "";
        formData.taxNumber = "";
        formData.invoiceType = "normal";
        formData.companyAddress = "";
        formData.companyPhone = "";
        formData.bankName = "";
        formData.bankAccount = "";
      } else {
        formData.customerName = "";
      }
    });
    common_vendor.watch(() => formData.invoiceType, (newType) => {
      if (newType === "normal") {
        formData.companyAddress = "";
        formData.companyPhone = "";
        formData.bankName = "";
        formData.bankAccount = "";
      }
    });
    const selectHeaderType = (type) => {
      console.log("\u9009\u62E9\u62AC\u5934\u7C7B\u578B:", type);
      formData.headerType = type;
    };
    const selectInvoiceType = (type) => {
      console.log("\u9009\u62E9\u53D1\u7968\u7C7B\u578B:", type);
      formData.invoiceType = type;
    };
    const toggleDefault = () => {
      console.log("\u5207\u6362\u9ED8\u8BA4\u72B6\u6001:", !formData.isDefault);
      formData.isDefault = !formData.isDefault;
    };
    const validateForm = () => {
      if (formData.headerType === "enterprise") {
        if (!formData.companyName.trim()) {
          common_vendor.index.showToast({
            title: "\u8BF7\u8F93\u5165\u516C\u53F8\u540D\u79F0",
            icon: "none"
          });
          return false;
        }
        if (!formData.taxNumber.trim()) {
          common_vendor.index.showToast({
            title: "\u8BF7\u8F93\u5165\u7EB3\u7A0E\u4EBA\u8BC6\u522B\u53F7",
            icon: "none"
          });
          return false;
        }
        const taxNumberRegex = /^[A-Z0-9]{15,20}$/;
        if (!taxNumberRegex.test(formData.taxNumber.trim())) {
          common_vendor.index.showToast({
            title: "\u7EB3\u7A0E\u4EBA\u8BC6\u522B\u53F7\u683C\u5F0F\u4E0D\u6B63\u786E",
            icon: "none"
          });
          return false;
        }
        if (formData.invoiceType === "special") {
          if (!formData.companyAddress.trim()) {
            common_vendor.index.showToast({
              title: "\u8BF7\u8F93\u5165\u516C\u53F8\u5730\u5740",
              icon: "none"
            });
            return false;
          }
          if (!formData.companyPhone.trim()) {
            common_vendor.index.showToast({
              title: "\u8BF7\u8F93\u5165\u516C\u53F8\u7535\u8BDD",
              icon: "none"
            });
            return false;
          }
          if (!formData.bankName.trim()) {
            common_vendor.index.showToast({
              title: "\u8BF7\u8F93\u5165\u5F00\u6237\u94F6\u884C",
              icon: "none"
            });
            return false;
          }
          if (!formData.bankAccount.trim()) {
            common_vendor.index.showToast({
              title: "\u8BF7\u8F93\u5165\u94F6\u884C\u8D26\u6237",
              icon: "none"
            });
            return false;
          }
        }
      } else {
        if (!formData.customerName.trim()) {
          common_vendor.index.showToast({
            title: "\u8BF7\u8F93\u5165\u5BA2\u6237\u59D3\u540D",
            icon: "none"
          });
          return false;
        }
      }
      if (!formData.email.trim()) {
        common_vendor.index.showToast({
          title: "\u8BF7\u8F93\u5165\u7535\u5B50\u90AE\u7BB1",
          icon: "none"
        });
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        common_vendor.index.showToast({
          title: "\u90AE\u7BB1\u683C\u5F0F\u4E0D\u6B63\u786E",
          icon: "none"
        });
        return false;
      }
      if (formData.contactPhone && formData.contactPhone.trim()) {
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(formData.contactPhone.trim())) {
          common_vendor.index.showToast({
            title: "\u624B\u673A\u53F7\u683C\u5F0F\u4E0D\u6B63\u786E",
            icon: "none"
          });
          return false;
        }
      }
      return true;
    };
    const saveInvoiceHeader = () => {
      if (!validateForm()) {
        return;
      }
      saving.value = true;
      const requestData = __spreadProps(__spreadValues({}, formData), {
        userId: user.memberId
      });
      if (mode.value === "edit" && editData.value) {
        requestData.id = editData.value.id;
      }
      components_js_request.request({
        url: mode.value === "edit" ? "invoice/header/update" : "invoice/header/create",
        method: "POST",
        data: requestData,
        success: (res) => {
          saving.value = false;
          if (res.data.code === 200) {
            common_vendor.index.showToast({
              title: mode.value === "edit" ? "\u4FEE\u6539\u6210\u529F" : "\u4FDD\u5B58\u6210\u529F"
            });
            setTimeout(() => {
              common_vendor.index.$emit("refreshHeaderList");
              common_vendor.index.navigateBack();
            }, 1500);
          } else {
            common_vendor.index.showToast({
              title: res.data.msg || "\u64CD\u4F5C\u5931\u8D25",
              icon: "none"
            });
          }
        },
        fail: (error) => {
          saving.value = false;
          common_vendor.index.showToast({
            title: "\u64CD\u4F5C\u5931\u8D25",
            icon: "none"
          });
        }
      });
    };
    common_vendor.onLoad((options) => {
      mode.value = options.mode || "add";
      if (mode.value === "edit" && options.data) {
        try {
          editData.value = JSON.parse(decodeURIComponent(options.data));
          Object.assign(formData, editData.value);
        } catch (e) {
          console.error("\u89E3\u6790\u7F16\u8F91\u6570\u636E\u5931\u8D25:", e);
        }
      } else if (mode.value === "add") {
        formData.headerType = "personal";
        formData.invoiceType = "normal";
        formData.isDefault = false;
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
      if (mode.value === "add") {
        console.log("\u8BBE\u7F6E\u9ED8\u8BA4\u503C:", formData.headerType, formData.invoiceType);
        formData.headerType = "personal";
        formData.invoiceType = "normal";
        formData.isDefault = false;
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: common_vendor.unref(pageTitle)
        }),
        b: formData.headerType === "personal"
      }, formData.headerType === "personal" ? {} : {}, {
        c: formData.headerType === "personal" ? 1 : "",
        d: common_vendor.o(($event) => selectHeaderType("personal")),
        e: formData.headerType === "enterprise"
      }, formData.headerType === "enterprise" ? {} : {}, {
        f: formData.headerType === "enterprise" ? 1 : "",
        g: common_vendor.o(($event) => selectHeaderType("enterprise")),
        h: formData.headerType === "enterprise"
      }, formData.headerType === "enterprise" ? common_vendor.e({
        i: formData.companyName,
        j: common_vendor.o(($event) => formData.companyName = $event.detail.value),
        k: formData.taxNumber,
        l: common_vendor.o(($event) => formData.taxNumber = $event.detail.value),
        m: formData.invoiceType === "normal"
      }, formData.invoiceType === "normal" ? {} : {}, {
        n: formData.invoiceType === "normal" ? 1 : "",
        o: common_vendor.o(($event) => selectInvoiceType("normal")),
        p: formData.invoiceType === "special"
      }, formData.invoiceType === "special" ? {} : {}, {
        q: formData.invoiceType === "special" ? 1 : "",
        r: common_vendor.o(($event) => selectInvoiceType("special")),
        s: formData.invoiceType === "special"
      }, formData.invoiceType === "special" ? {
        t: formData.companyAddress,
        v: common_vendor.o(($event) => formData.companyAddress = $event.detail.value),
        w: formData.companyPhone,
        x: common_vendor.o(($event) => formData.companyPhone = $event.detail.value),
        y: formData.bankName,
        z: common_vendor.o(($event) => formData.bankName = $event.detail.value),
        A: formData.bankAccount,
        B: common_vendor.o(($event) => formData.bankAccount = $event.detail.value)
      } : {}) : {}, {
        C: formData.headerType === "personal"
      }, formData.headerType === "personal" ? {
        D: formData.customerName,
        E: common_vendor.o(($event) => formData.customerName = $event.detail.value)
      } : {}, {
        F: formData.email,
        G: common_vendor.o(($event) => formData.email = $event.detail.value),
        H: formData.contactPhone,
        I: common_vendor.o(($event) => formData.contactPhone = $event.detail.value),
        J: formData.isDefault
      }, formData.isDefault ? {} : {}, {
        K: formData.isDefault ? 1 : "",
        L: common_vendor.o(toggleDefault),
        M: common_vendor.o(saveInvoiceHeader),
        N: common_vendor.p({
          type: "primary",
          color: "#2D55E8",
          loading: saving.value,
          block: true,
          round: true
        })
      });
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3d2f76ce"], ["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/pages/user/invoice-header-form.vue"]]);
wx.createPage(MiniProgramPage);
