"use strict";
var common_vendor = require("../../common/vendor.js");
var components_js_request = require("../../components/js/request.js");
if (!Array) {
  const _component_van_icon = common_vendor.resolveComponent("van-icon");
  _component_van_icon();
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
      loadall.value = false;
      pager.pageNo = 1;
      index(1);
    };
    const currentLocation = common_vendor.ref("\u5317\u4EAC\u5E02");
    const selectLocation = () => {
      common_vendor.index.showActionSheet({
        itemList: ["\u5317\u4EAC\u5E02", "\u4E0A\u6D77\u5E02", "\u5E7F\u5DDE\u5E02", "\u6DF1\u5733\u5E02", "\u676D\u5DDE\u5E02", "\u5357\u4EAC\u5E02"],
        success: (res) => {
          const cities = ["\u5317\u4EAC\u5E02", "\u4E0A\u6D77\u5E02", "\u5E7F\u5DDE\u5E02", "\u6DF1\u5733\u5E02", "\u676D\u5DDE\u5E02", "\u5357\u4EAC\u5E02"];
          currentLocation.value = cities[res.tapIndex];
        }
      });
    };
    const searchStation = () => {
      common_vendor.index.navigateTo({
        url: "/pages/search/index"
      });
    };
    const contactService = () => {
      common_vendor.index.showModal({
        title: "\u8054\u7CFB\u5BA2\u670D",
        content: "\u5BA2\u670D\u7535\u8BDD\uFF1A400-123-4567",
        confirmText: "\u62E8\u6253",
        cancelText: "\u53D6\u6D88",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.makePhoneCall({
              phoneNumber: "400-123-4567"
            });
          }
        }
      });
    };
    const openMap = (station) => {
      common_vendor.index.openLocation({
        latitude: station.lat || query.lat,
        longitude: station.lng || query.lng,
        name: station.stationName,
        address: station.address || ""
      });
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
    const loadall = common_vendor.ref(false);
    const moreText = common_vendor.ref("\u4E0A\u6ED1\u52A0\u8F7D\u66F4\u591A~");
    const index = (page) => {
      pager.pageNo = page;
      if (page === 1) {
        moreText.value = "\u52A0\u8F7D\u4E2D...";
        loadall.value = false;
      }
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
              if (res2 && res2.data && res2.data.data) {
                const newData = res2.data.data.filter((item) => item && item.stationName);
                if (page === 1) {
                  stations.value = newData;
                } else {
                  stations.value = stations.value.concat(newData);
                }
                if (newData.length === 0 || newData.length < pager.pageSize) {
                  loadall.value = true;
                  moreText.value = stations.value.length === 0 ? "\u6682\u65E0\u6570\u636E" : "\u6CA1\u6709\u66F4\u591A\u6570\u636E\u4E86";
                } else {
                  moreText.value = "\u4E0A\u6ED1\u52A0\u8F7D\u66F4\u591A~";
                }
              } else {
                if (page === 1) {
                  stations.value = [];
                  moreText.value = "\u6682\u65E0\u6570\u636E";
                } else {
                  moreText.value = "\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5";
                }
                loadall.value = true;
              }
            },
            fail: (err) => {
              console.error("\u52A0\u8F7D\u5931\u8D25:", err);
              if (page === 1) {
                stations.value = [];
                moreText.value = "\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5";
              } else {
                moreText.value = "\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5";
              }
              loadall.value = true;
            }
          });
        }
      });
    };
    common_vendor.onPullDownRefresh(() => {
      stations.value = [];
      loadall.value = false;
      index(1);
      setTimeout(() => {
        common_vendor.index.stopPullDownRefresh();
      }, 1e3);
    });
    common_vendor.onReachBottom(() => {
      if (loadall.value) {
        return;
      }
      if (moreText.value !== "\u52A0\u8F7D\u4E2D...") {
        moreText.value = "\u52A0\u8F7D\u4E2D...";
        setTimeout(() => {
          pager.pageNo++;
          index(pager.pageNo);
        }, 300);
      }
    });
    common_vendor.onLoad(() => {
      index(1);
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "\u5409\u8FD0\u8D85\u5145",
          showarrow: false
        }),
        b: common_vendor.t(currentLocation.value),
        c: common_vendor.p({
          name: "arrow-down",
          size: "14px"
        }),
        d: common_vendor.o(selectLocation),
        e: common_vendor.p({
          name: "search",
          size: "16px"
        }),
        f: common_vendor.o(searchStation),
        g: common_vendor.p({
          name: "orders-o",
          size: "20px",
          color: "#2D55E8"
        }),
        h: common_vendor.o(($event) => go("/pages/user/order")),
        i: common_vendor.p({
          name: "bill-o",
          size: "20px",
          color: "#2D55E8"
        }),
        j: common_vendor.o(($event) => go("/pages/user/invoice")),
        k: common_vendor.p({
          name: "service-o",
          size: "20px",
          color: "#2D55E8"
        }),
        l: common_vendor.o(contactService),
        m: common_vendor.n(query.sortType == 1 ? "active" : ""),
        n: common_vendor.o(($event) => setActive(1)),
        o: common_vendor.n(query.sortType == 2 ? "active" : ""),
        p: common_vendor.o(($event) => setActive(2)),
        q: common_vendor.f(stations.value, (item, index2, i0) => {
          return {
            a: common_vendor.t(item.stationName),
            b: common_vendor.t(item.superToNoBusy),
            c: common_vendor.t(item.superNum),
            d: common_vendor.t(item.fastToNoBusy),
            e: common_vendor.t(item.fastNum),
            f: common_vendor.t((item.distance / 1e3).toFixed(1)),
            g: common_vendor.o(($event) => openMap(item)),
            h: common_vendor.t(item.parkCarInfo),
            i: common_vendor.t(item.price),
            j: index2,
            k: common_vendor.o(($event) => go("/pages/station/index?plotId=" + item.stationId + "&deviceType=" + item.deviceType + "&distance=" + item.distance), index2)
          };
        }),
        r: common_vendor.t(moreText.value),
        s: common_vendor.p({
          active: 0
        })
      };
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-57280228"], ["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
