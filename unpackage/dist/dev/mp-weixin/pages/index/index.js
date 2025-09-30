"use strict";
var common_vendor = require("../../common/vendor.js");
var components_js_request = require("../../components/js/request.js");
var cityData = [
  "\u5317\u4EAC\u5E02",
  "\u5929\u6D25\u5E02",
  "\u6CB3\u5317\u7701",
  "\u5C71\u897F\u7701",
  "\u5185\u8499\u53E4\u81EA\u6CBB\u533A",
  "\u8FBD\u5B81\u7701",
  "\u5409\u6797\u7701",
  "\u9ED1\u9F99\u6C5F\u7701",
  "\u4E0A\u6D77\u5E02",
  "\u6C5F\u82CF\u7701",
  "\u6D59\u6C5F\u7701",
  "\u5B89\u5FBD\u7701",
  "\u798F\u5EFA\u7701",
  "\u6C5F\u897F\u7701",
  "\u5C71\u4E1C\u7701",
  "\u6CB3\u5357\u7701",
  "\u6E56\u5317\u7701",
  "\u6E56\u5357\u7701",
  "\u5E7F\u4E1C\u7701",
  "\u5E7F\u897F\u58EE\u65CF\u81EA\u6CBB\u533A",
  "\u6D77\u5357\u7701",
  "\u91CD\u5E86\u5E02",
  "\u56DB\u5DDD\u7701",
  "\u8D35\u5DDE\u7701",
  "\u4E91\u5357\u7701",
  "\u897F\u85CF\u81EA\u6CBB\u533A",
  "\u9655\u897F\u7701",
  "\u7518\u8083\u7701",
  "\u9752\u6D77\u7701",
  "\u5B81\u590F\u56DE\u65CF\u81EA\u6CBB\u533A",
  "\u65B0\u7586\u7EF4\u543E\u5C14\u81EA\u6CBB\u533A",
  "\u53F0\u6E7E\u7701",
  "\u9999\u6E2F\u7279\u522B\u884C\u653F\u533A",
  "\u6FB3\u95E8\u7279\u522B\u884C\u653F\u533A"
];
if (!Array) {
  const _component_van_icon = common_vendor.resolveComponent("van-icon");
  const _component_van_popup = common_vendor.resolveComponent("van-popup");
  (_component_van_icon + _component_van_popup)();
}
if (!Math) {
  tabbar();
}
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
    const checkLoginAndGo = (url) => {
      const token = common_vendor.index.getStorageSync("token");
      if (!token) {
        common_vendor.index.showToast({
          title: "\u8BF7\u5148\u767B\u5F55",
          icon: "none",
          duration: 2e3
        });
        setTimeout(() => {
          common_vendor.index.navigateTo({
            url: "/pages/user/login"
          });
        }, 1e3);
      } else {
        common_vendor.index.navigateTo({
          url
        });
      }
    };
    const setActive = (i) => {
      query.sortType = i;
      stations.value = [];
      loadall.value = false;
      pager.pageNum = 1;
      index(1);
    };
    const currentLocation = common_vendor.ref("\u5317\u4EAC\u5E02");
    const searchKeyword = common_vendor.ref("");
    const provinces = common_vendor.ref(cityData);
    const showProvincePopup = common_vendor.ref(false);
    common_vendor.ref(true);
    const statusBarHeight = common_vendor.ref(64);
    const selectLocation = () => {
      console.log("selectLocation clicked");
      showProvincePopup.value = true;
    };
    const onProvinceSelect = (province) => {
      console.log("selected province:", province);
      currentLocation.value = province;
      query.city = province;
      showProvincePopup.value = false;
      pager.pageNum = 1;
      loadall.value = false;
      stations.value = [];
      index(1);
    };
    const searchStation = () => {
      pager.pageNum = 1;
      loadall.value = false;
      index(1);
    };
    const onSearchConfirm = () => {
      searchStation();
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
    const reverseGeocoding = (lat, lng, callback = null) => {
      components_js_request.request({
        url: "charging/reverseGeocoding",
        method: "GET",
        data: {
          lat,
          lng
        },
        success: (result) => {
          console.log(result);
          if (result && result.data && result.data.code === 200) {
            const locationName = result.data.data;
            if (locationName && provinces.value.includes(locationName)) {
              currentLocation.value = locationName;
              query.city = locationName;
            }
          } else {
            console.warn("\u9006\u5730\u7406\u7F16\u7801\u5931\u8D25:", result);
          }
          if (callback && typeof callback === "function") {
            callback();
          }
        },
        fail: (error) => {
          console.error("\u9006\u5730\u7406\u7F16\u7801\u8BF7\u6C42\u5931\u8D25:", error);
          if (callback && typeof callback === "function") {
            callback();
          }
        }
      });
    };
    const query = common_vendor.reactive({
      deviceType: 4,
      lat: 39.9045035,
      lng: 116.408788,
      sortType: 1,
      distance: 1e8,
      city: "\u5317\u4EAC\u5E02"
    });
    const pager = common_vendor.reactive({
      pageNum: 1,
      pageSize: 5
    });
    common_vendor.ref(false);
    const stations = common_vendor.ref([]);
    const loadall = common_vendor.ref(false);
    const moreText = common_vendor.ref("\u4E0A\u6ED1\u52A0\u8F7D\u66F4\u591A~");
    const initLocationAndData = () => {
      console.log("\u5F00\u59CB\u521D\u59CB\u5316\u5B9A\u4F4D\u548C\u6570\u636E\u52A0\u8F7D");
      common_vendor.index.getLocation({
        type: "gcj02",
        success: (res) => {
          console.log("\u5B9A\u4F4D\u6210\u529F:", res);
          query.lat = res.latitude;
          query.lng = res.longitude;
          reverseGeocoding(res.latitude, res.longitude, () => {
            console.log("\u9006\u5730\u7406\u7F16\u7801\u5B8C\u6210\uFF0C\u5F00\u59CB\u52A0\u8F7D\u6570\u636E, city:", query.city);
            index(1);
          });
        },
        fail: (error) => {
          console.warn("\u5B9A\u4F4D\u5931\u8D25\uFF0C\u4F7F\u7528\u9ED8\u8BA4\u4F4D\u7F6E(\u5317\u4EAC):", error);
          query.city = "\u5317\u4EAC\u5E02";
          currentLocation.value = "\u5317\u4EAC\u5E02";
          index(1);
        }
      });
    };
    const index = (page) => {
      pager.pageNum = page;
      if (page === 1) {
        moreText.value = "\u52A0\u8F7D\u4E2D...";
        loadall.value = false;
      }
      const requestData = Object.assign({}, pager, query);
      if (searchKeyword.value && searchKeyword.value.trim()) {
        requestData.keyword = searchKeyword.value.trim();
      }
      console.log("\u53D1\u9001\u8BF7\u6C42\u53C2\u6570:", requestData);
      components_js_request.request({
        url: "charging/getPlotInfoPage",
        method: "POST",
        data: requestData,
        success: (res) => {
          if (res && res.data && res.data.data) {
            const newData = res.data.data.filter((item) => item && item.stationName);
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
          pager.pageNum++;
          index(pager.pageNum);
        }, 300);
      }
    });
    common_vendor.onLoad(() => {
      console.log("onLoad - cityData:", cityData);
      console.log("onLoad - provinces.value:", provinces.value);
      common_vendor.index.getSystemInfo({
        success: (res) => {
          statusBarHeight.value = res.statusBarHeight || 44;
          statusBarHeight.value = statusBarHeight.value + 30;
        },
        fail: () => {
          statusBarHeight.value = 74;
        }
      });
      initLocationAndData();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(currentLocation.value),
        b: common_vendor.p({
          name: "arrow-down",
          size: "14px"
        }),
        c: common_vendor.o(selectLocation),
        d: common_vendor.p({
          name: "search",
          size: "16px"
        }),
        e: common_vendor.o(onSearchConfirm),
        f: searchKeyword.value,
        g: common_vendor.o(($event) => searchKeyword.value = $event.detail.value),
        h: common_vendor.o(($event) => checkLoginAndGo("/pages/user/order")),
        i: common_vendor.o(($event) => checkLoginAndGo("/pages/user/invoice")),
        j: common_vendor.o(contactService),
        k: common_vendor.n(query.sortType == 1 ? "active" : ""),
        l: common_vendor.o(($event) => setActive(1)),
        m: common_vendor.n(query.sortType == 2 ? "active" : ""),
        n: common_vendor.o(($event) => setActive(2)),
        o: common_vendor.f(stations.value, (item, index2, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.stationName),
            b: item.tags && item.tags.length
          }, item.tags && item.tags.length ? {
            c: common_vendor.f(item.tags, (tag, tIdx, i1) => {
              return {
                a: common_vendor.t(tag),
                b: tIdx
              };
            })
          } : {}, {
            d: common_vendor.t(item.superToNoBusy),
            e: common_vendor.t(item.superNum),
            f: common_vendor.t(item.fastToNoBusy),
            g: common_vendor.t(item.fastNum),
            h: common_vendor.t((item.distance / 1e3).toFixed(1)),
            i: common_vendor.o(($event) => openMap(item)),
            j: common_vendor.t(item.parkCarInfo),
            k: common_vendor.t(item.price),
            l: index2,
            m: common_vendor.o(($event) => go("/pages/station/index?plotId=" + item.stationId + "&deviceType=" + item.deviceType + "&distance=" + item.distance), index2)
          });
        }),
        p: common_vendor.t(moreText.value),
        q: common_vendor.o(($event) => showProvincePopup.value = false),
        r: common_vendor.p({
          name: "cross",
          size: "18px"
        }),
        s: common_vendor.f(provinces.value, (province, index2, i0) => {
          return {
            a: common_vendor.t(province),
            b: index2,
            c: currentLocation.value === province ? 1 : "",
            d: common_vendor.o(($event) => onProvinceSelect(province), index2)
          };
        }),
        t: common_vendor.o(($event) => showProvincePopup.value = $event),
        v: common_vendor.p({
          position: "bottom",
          round: true,
          show: showProvincePopup.value
        }),
        w: common_vendor.p({
          active: 0
        })
      };
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-57280228"], ["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
