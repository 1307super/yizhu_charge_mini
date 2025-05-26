"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const components_js_request = require("../../components/js/request.js");
if (!Array) {
  const _component_van_col = common_vendor.resolveComponent("van-col");
  const _component_van_row = common_vendor.resolveComponent("van-row");
  (_component_van_col + _component_van_row)();
}
if (!Math) {
  (navbar + tabbar)();
}
const navbar = () => "../../components/navbar/index.js";
const tabbar = () => "../../components/tabbar/index.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    getApp();
    const go = (url) => {
      common_vendor.index.navigateTo({
        url
      });
    };
    const setActive = (i) => {
      query.sortType = i;
      stations.value = [];
      index(1);
    };
    const query = common_vendor.reactive({
      deviceType: 4,
      lat: 39.9045035,
      lng: 116.408788,
      sortType: 1,
      distance: 1e8
    });
    const pager = common_vendor.reactive({
      pageNo: 1,
      pageSize: 5
    });
    common_vendor.ref(false);
    const stations = common_vendor.ref([]);
    const index = (page) => {
      pager.pageNo = page;
      moreText.value = "加载中...";
      common_vendor.index.getLocation({
        type: "gcj02",
        success: async (res) => {
          query.lat = res.latitude;
          query.lng = res.longitude;
        },
        complete: (res) => {
          components_js_request.request({
            url: "charging/getPlotInfoPage",
            method: "POST",
            data: Object.assign(pager, query),
            success: (res2) => {
              stations.value = stations.value.concat(res2.data.data.records);
              loadall.value == res2.data.data.records.length == 0;
            }
          });
        }
      });
    };
    const loadall = common_vendor.ref(false);
    const moreText = common_vendor.ref("上滑加载更多~");
    common_vendor.onPullDownRefresh(() => {
      stations.value = [];
      index(1);
    });
    common_vendor.onReachBottom(() => {
      if (loadall.value)
        ;
      else {
        setTimeout(() => {
          pager.pageNo++;
          index(pager.pageNo);
        }, 500);
      }
    });
    common_vendor.onLoad(() => {
      index(1);
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "慧知充电",
          showarrow: false
        }),
        b: common_assets._imports_0,
        c: common_vendor.o(($event) => setActive(1)),
        d: common_vendor.n(query.sortType == 1 ? "active" : "default"),
        e: common_vendor.p({
          span: 5
        }),
        f: common_vendor.o(($event) => setActive(2)),
        g: common_vendor.n(query.sortType == 2 ? "active" : "default"),
        h: common_vendor.p({
          span: 5
        }),
        i: common_vendor.o(($event) => setActive(3)),
        j: common_vendor.n(query.sortType == 3 ? "active" : "default"),
        k: common_vendor.p({
          span: 5
        }),
        l: common_vendor.p({
          span: 20
        }),
        m: common_vendor.f(stations.value, (item, index2, i0) => {
          return {
            a: common_vendor.t(item.stationName),
            b: common_vendor.t(item.distance / 1e3),
            c: common_vendor.t(item.fastToNoBusy),
            d: common_vendor.t(item.fastNum),
            e: common_vendor.t(item.slowToNoBusy),
            f: common_vendor.t(item.slowNum),
            g: common_vendor.t(item.price),
            h: common_vendor.t(item.parkCarInfo),
            i: index2,
            j: common_vendor.o(($event) => go("/pages/station/index?plotId=" + item.stationId + "&deviceType=" + item.deviceType + "&distance=" + item.distance), index2)
          };
        }),
        n: common_assets._imports_1,
        o: common_assets._imports_0$1,
        p: common_vendor.t(moreText.value),
        q: common_vendor.p({
          active: 0
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
