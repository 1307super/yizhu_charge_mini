"use strict";
var common_vendor = require("../../common/vendor.js");
var components_js_request = require("../../components/js/request.js");
if (!Array) {
  const _component_van_col = common_vendor.resolveComponent("van-col");
  const _component_van_row = common_vendor.resolveComponent("van-row");
  (_component_van_col + _component_van_row)();
}
if (!Math) {
  navbar();
}
const navbar = () => "../../components/navbar/index.js";
const _sfc_main = {
  __name: "order",
  setup(__props) {
    getApp();
    const query = common_vendor.reactive({
      orderStatus: "",
      pageNo: 1,
      pageSize: 5,
      userId: common_vendor.index.getStorageSync("user").memberId
    });
    const setactive = (i) => {
      query.orderStatus = i;
      orders.value = [];
      index(1);
    };
    const go = (url) => {
      common_vendor.index.navigateTo({
        url
      });
    };
    const show = (form) => {
      if (form.orderState == 1) {
        go(`/pages/station/powering?stationName=${form.stationName}&port=${form.portId}&pileId=${form.pileId}&portname=${form.portName}&orderNumber=${form.orderNumber}&hour=${form.hour}&delta=1`);
      } else if (form.orderState == 3) {
        go("/pages/user/orderdetail?orderNumber=" + form.orderNumber);
      }
    };
    const orders = common_vendor.ref([]);
    const loadall = common_vendor.ref(false);
    const moreText = common_vendor.ref("\u4E0A\u6ED1\u52A0\u8F7D\u66F4\u591A~");
    const index = (page) => {
      query.pageNo = page;
      moreText.value = "\u52A0\u8F7D\u4E2D...";
      components_js_request.request({
        url: "/order/queryOrderList",
        data: query,
        success: (res) => {
          orders.value = orders.value.concat(res.data.data.records);
          loadall.value == res.data.data.records.length == 0;
          moreText.value = loadall.value ? "\u6CA1\u6709\u66F4\u591A\u4E86~" : "\u4E0A\u6ED1\u52A0\u8F7D\u66F4\u591A~";
        }
      });
    };
    common_vendor.onMounted(() => {
      index(1);
    });
    common_vendor.onPullDownRefresh(() => {
      orders.value = [];
      index(1);
    });
    common_vendor.onReachBottom(() => {
      if (loadall.value)
        ;
      else {
        query.pageNo++;
        index(query.pageNo);
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "\u6211\u7684\u8BA2\u5355"
        }),
        b: common_vendor.n(query.orderStatus === "" ? "f-fwb" : "title-normal"),
        c: common_vendor.o(($event) => setactive("")),
        d: common_vendor.n(query.orderStatus === "" ? "line" : "unline"),
        e: common_vendor.p({
          span: 8
        }),
        f: common_vendor.n(query.orderStatus == 1 ? "f-fwb" : "title-normal"),
        g: common_vendor.o(($event) => setactive(1)),
        h: common_vendor.n(query.orderStatus == 1 ? "line" : "unline"),
        i: common_vendor.p({
          span: 8
        }),
        j: common_vendor.n(query.orderStatus == 3 ? "f-fwb" : "title-normal"),
        k: common_vendor.o(($event) => setactive(3)),
        l: common_vendor.n(query.orderStatus == 3 ? "line" : "unline"),
        m: common_vendor.p({
          span: 8
        }),
        n: common_vendor.f(orders.value, (item, index2, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.orderNumber),
            b: item.orderState == "3"
          }, item.orderState == "3" ? {} : {}, {
            c: item.orderState == "1"
          }, item.orderState == "1" ? {} : {}, {
            d: common_vendor.t(item.startTime),
            e: common_vendor.t(item.endTime),
            f: common_vendor.t(item.consumePower),
            g: common_vendor.t(item.hour),
            h: common_vendor.t(item.userName || ""),
            i: common_vendor.t(item.ordergold || 0),
            j: index2,
            k: common_vendor.o(($event) => show(item), index2)
          });
        }),
        o: common_vendor.t(moreText.value)
      };
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0f0c1843"], ["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/pages/user/order.vue"]]);
wx.createPage(MiniProgramPage);
