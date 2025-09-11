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
var components_js_stationUtils = require("../../components/js/stationUtils.js");
if (!Array) {
  const _component_van_circle = common_vendor.resolveComponent("van-circle");
  const _component_van_button = common_vendor.resolveComponent("van-button");
  const _component_van_icon = common_vendor.resolveComponent("van-icon");
  const _component_van_tab = common_vendor.resolveComponent("van-tab");
  const _component_van_tabs = common_vendor.resolveComponent("van-tabs");
  const _component_van_popup = common_vendor.resolveComponent("van-popup");
  (_component_van_circle + _component_van_button + _component_van_icon + _component_van_tab + _component_van_tabs + _component_van_popup)();
}
if (!Math) {
  navbar();
}
const navbar = () => "../../components/navbar/index.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const getCircleRate = (gun) => {
      if (gun && gun.status === 3) {
        const soc = Number(gun.soc || 0);
        return Math.max(0, Math.min(100, isNaN(soc) ? 0 : soc));
      }
      return 100;
    };
    const getCircleColor = (status) => {
      const map = {
        1: "#52C41A",
        2: "#FAAD14",
        3: "#FFA500",
        4: "#FAAD14",
        0: "#999999",
        255: "#FF4D4F",
        21501: "#722ED1",
        21502: "#1890FF",
        21503: "#8C8C8C"
      };
      return map[status] || "#FAAD14";
    };
    const stationInfo = common_vendor.ref({
      stationName: "",
      address: "",
      distance: 0,
      tags: [],
      parkingInfo: "",
      services: []
    });
    const chargingGuns = common_vendor.ref([]);
    const pricePeriods = common_vendor.ref([]);
    const showPriceDetail = common_vendor.ref(false);
    const showAllGuns = common_vendor.ref(false);
    const activeTab = common_vendor.ref(0);
    const gunStatusFilter = common_vendor.ref("all");
    const refreshTimer = common_vendor.ref(null);
    const currentPlotId = common_vendor.ref(null);
    const priceTabsVisible = common_vendor.ref(false);
    const startAutoRefresh = () => {
      stopAutoRefresh();
      if (currentPlotId.value) {
        refreshTimer.value = setInterval(() => {
          loadStationDetail(currentPlotId.value);
        }, 3e4);
      }
    };
    const stopAutoRefresh = () => {
      if (refreshTimer.value) {
        clearInterval(refreshTimer.value);
        refreshTimer.value = null;
      }
    };
    const onPricePopupOpened = () => {
      common_vendor.nextTick(() => {
        priceTabsVisible.value = true;
      });
    };
    const onPricePopupClosed = () => {
      priceTabsVisible.value = false;
    };
    common_vendor.watch(showPriceDetail, (val) => {
      if (val) {
        common_vendor.nextTick(() => {
          priceTabsVisible.value = true;
        });
      } else {
        priceTabsVisible.value = false;
      }
    });
    const megawattPrices = common_vendor.computed$1(() => {
      return pricePeriods.value.filter((period) => period.chargeCategory === 1).sort((a, b) => a.startTime.localeCompare(b.startTime)).map((period) => {
        const formattedPeriod = __spreadProps(__spreadValues({}, period), {
          startTime: components_js_stationUtils.formatTime(period.startTime),
          endTime: components_js_stationUtils.formatTime(period.endTime),
          chargingPrice: components_js_stationUtils.formatPrice(period.chargingPrice),
          originalChargingPrice: components_js_stationUtils.formatPrice(period.originalChargingPrice),
          electricityFee: components_js_stationUtils.formatPrice(period.electricityFee),
          originalElectricityFee: components_js_stationUtils.formatPrice(period.originalElectricityFee),
          serviceFee: components_js_stationUtils.formatPrice(period.serviceFee),
          originalServiceFee: components_js_stationUtils.formatPrice(period.originalServiceFee),
          isCurrent: components_js_stationUtils.isCurrentPeriod(period)
        });
        return formattedPeriod;
      });
    });
    const fastChargingPrices = common_vendor.computed$1(() => {
      return pricePeriods.value.filter((period) => period.chargeCategory === 2).sort((a, b) => a.startTime.localeCompare(b.startTime)).map((period) => {
        const formattedPeriod = __spreadProps(__spreadValues({}, period), {
          startTime: components_js_stationUtils.formatTime(period.startTime),
          endTime: components_js_stationUtils.formatTime(period.endTime),
          chargingPrice: components_js_stationUtils.formatPrice(period.chargingPrice),
          originalChargingPrice: components_js_stationUtils.formatPrice(period.originalChargingPrice),
          electricityFee: components_js_stationUtils.formatPrice(period.electricityFee),
          originalElectricityFee: components_js_stationUtils.formatPrice(period.originalElectricityFee),
          serviceFee: components_js_stationUtils.formatPrice(period.serviceFee),
          originalServiceFee: components_js_stationUtils.formatPrice(period.originalServiceFee),
          isCurrent: components_js_stationUtils.isCurrentPeriod(period)
        });
        return formattedPeriod;
      });
    });
    const currentPeriod = common_vendor.computed$1(() => {
      const now = new Date();
      const currentTime = now.getHours() * 100 + now.getMinutes();
      let targetPeriods = pricePeriods.value.filter((period) => period.chargeCategory === 1);
      if (targetPeriods.length === 0) {
        targetPeriods = pricePeriods.value.filter((period) => period.chargeCategory === 2);
      }
      const current = targetPeriods.find((period) => {
        const startTime = parseInt(period.startTime.replace(":", ""));
        const endTime = parseInt(period.endTime.replace(":", ""));
        return currentTime >= startTime && currentTime < endTime;
      });
      if (current) {
        return __spreadProps(__spreadValues({}, current), {
          startTime: components_js_stationUtils.formatTime(current.startTime),
          endTime: components_js_stationUtils.formatTime(current.endTime),
          chargingPrice: components_js_stationUtils.formatPrice(current.chargingPrice),
          electricityFee: components_js_stationUtils.formatPrice(current.electricityFee),
          serviceFee: components_js_stationUtils.formatPrice(current.serviceFee)
        });
      }
      return {
        startTime: "00:00",
        endTime: "23:59",
        chargingPrice: "0.0000",
        electricityFee: "0.0000",
        serviceFee: "0.0000"
      };
    });
    const filteredGuns = common_vendor.computed$1(() => {
      return components_js_stationUtils.filterGunsByStatus(chargingGuns.value, gunStatusFilter.value);
    });
    const navigateToStation = () => {
      common_vendor.index.openLocation({
        latitude: stationInfo.value.lat || 39.9045035,
        longitude: stationInfo.value.lng || 116.408788,
        name: stationInfo.value.stationName,
        address: stationInfo.value.address || ""
      });
    };
    const scan = () => {
      common_vendor.index.scanCode({
        success: function(res) {
          common_vendor.index.navigateTo({
            url: `/pages/station/create?key=${res.result}`
          });
        }
      });
    };
    const loadStationDetail = (plotId) => {
      common_vendor.index.getLocation({
        type: "gcj02",
        success: (locationRes) => {
          components_js_request.request({
            url: "charging/stationDetail",
            method: "GET",
            data: {
              plotId,
              lat: locationRes.latitude,
              lng: locationRes.longitude
            },
            success: (res) => {
              const data = res.data.data;
              stationInfo.value = {
                stationName: data.stationName,
                address: data.address,
                distance: data.distance,
                tags: data.tags || [],
                parkingInfo: data.parkingInfo,
                services: data.services || []
              };
              chargingGuns.value = data.chargingGuns || [];
              pricePeriods.value = data.pricePeriods || [];
            }
          });
        },
        fail: () => {
          components_js_request.request({
            url: "charging/stationDetail",
            method: "GET",
            data: {
              plotId,
              lat: 39.9045035,
              lng: 116.408788
            },
            success: (res) => {
              const data = res.data.data;
              stationInfo.value = {
                stationName: data.stationName,
                address: data.address,
                distance: data.distance,
                tags: data.tags || [],
                parkingInfo: data.parkingInfo,
                services: data.services || []
              };
              chargingGuns.value = data.chargingGuns || [];
              pricePeriods.value = data.pricePeriods || [];
            }
          });
        }
      });
    };
    common_vendor.onLoad((option) => {
      if (option.plotId) {
        currentPlotId.value = option.plotId;
        loadStationDetail(option.plotId);
      }
    });
    common_vendor.onShow(() => {
      startAutoRefresh();
    });
    common_vendor.onHide(() => {
      stopAutoRefresh();
    });
    common_vendor.onUnload(() => {
      stopAutoRefresh();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "\u5145\u7535\u7AD9\u8BE6\u60C5"
        }),
        b: common_vendor.t(stationInfo.value.stationName),
        c: common_vendor.t(stationInfo.value.address),
        d: common_vendor.t((stationInfo.value.distance / 1e3).toFixed(1)),
        e: common_vendor.o(navigateToStation),
        f: common_vendor.f(stationInfo.value.tags, (tag, index, i0) => {
          return {
            a: common_vendor.t(tag),
            b: index
          };
        }),
        g: common_vendor.o(($event) => showPriceDetail.value = true),
        h: common_vendor.t(common_vendor.unref(currentPeriod).startTime),
        i: common_vendor.t(common_vendor.unref(currentPeriod).endTime),
        j: common_vendor.t(common_vendor.unref(currentPeriod).chargingPrice),
        k: common_vendor.t(common_vendor.unref(currentPeriod).electricityFee),
        l: common_vendor.t(common_vendor.unref(currentPeriod).serviceFee),
        m: common_vendor.t(stationInfo.value.parkingInfo),
        n: common_vendor.o(($event) => showAllGuns.value = true),
        o: common_vendor.f(chargingGuns.value.slice(0, 4), (gun, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(common_vendor.unref(components_js_stationUtils.getStatusText)(gun.status)),
            b: getCircleColor(gun.status),
            c: "e5c43de4-1-" + i0,
            d: common_vendor.p({
              value: getCircleRate(gun),
              color: getCircleColor(gun.status),
              layerColor: "#f0f2f5",
              strokeWidth: 4,
              size: 60
            }),
            e: common_vendor.t(gun.gunNumber),
            f: common_vendor.t(gun.maxPower),
            g: gun.status === 3 && gun.remainingTime
          }, gun.status === 3 && gun.remainingTime ? {
            h: common_vendor.t(gun.remainingTime)
          } : {}, {
            i: common_vendor.t(gun.type === 1 ? "\u5146\u51B2" : "\u5FEB\u5145"),
            j: common_vendor.n(gun.type === 1 ? "megawatt-type" : "fast-type"),
            k: index
          });
        }),
        p: common_vendor.f(stationInfo.value.services, (service, index, i0) => {
          return {
            a: common_vendor.unref(components_js_stationUtils.getServiceIcon)(service),
            b: common_vendor.t(service),
            c: index
          };
        }),
        q: common_vendor.t(common_vendor.unref(currentPeriod).chargingPrice),
        r: common_vendor.t(common_vendor.unref(currentPeriod).startTime),
        s: common_vendor.t(common_vendor.unref(currentPeriod).endTime),
        t: common_vendor.o(scan),
        v: common_vendor.p({
          round: true,
          color: "linear-gradient(to right, #569AFF, #4A6EF3)"
        }),
        w: common_vendor.o(($event) => showPriceDetail.value = false),
        x: common_vendor.p({
          name: "cross",
          size: "20px"
        }),
        y: priceTabsVisible.value
      }, priceTabsVisible.value ? {
        z: common_vendor.f(common_vendor.unref(megawattPrices), (period, index, i0) => {
          return common_vendor.e({
            a: period.isCurrent
          }, period.isCurrent ? {} : {}, {
            b: common_vendor.t(period.startTime),
            c: common_vendor.t(period.endTime),
            d: period.originalChargingPrice !== period.chargingPrice
          }, period.originalChargingPrice !== period.chargingPrice ? {
            e: common_vendor.t(period.originalChargingPrice)
          } : {}, {
            f: common_vendor.t(period.chargingPrice),
            g: period.originalElectricityFee !== period.electricityFee
          }, period.originalElectricityFee !== period.electricityFee ? {
            h: common_vendor.t(period.originalElectricityFee)
          } : {}, {
            i: common_vendor.t(period.electricityFee),
            j: period.originalServiceFee !== period.serviceFee
          }, period.originalServiceFee !== period.serviceFee ? {
            k: common_vendor.t(period.originalServiceFee)
          } : {}, {
            l: common_vendor.t(period.serviceFee),
            m: index,
            n: period.isCurrent ? 1 : ""
          });
        }),
        A: common_vendor.p({
          title: "\u5146\u74E6\u4EF7\u683C"
        }),
        B: common_vendor.f(common_vendor.unref(fastChargingPrices), (period, index, i0) => {
          return common_vendor.e({
            a: period.isCurrent
          }, period.isCurrent ? {} : {}, {
            b: common_vendor.t(period.startTime),
            c: common_vendor.t(period.endTime),
            d: period.originalChargingPrice !== period.chargingPrice
          }, period.originalChargingPrice !== period.chargingPrice ? {
            e: common_vendor.t(period.originalChargingPrice)
          } : {}, {
            f: common_vendor.t(period.chargingPrice),
            g: period.originalElectricityFee !== period.electricityFee
          }, period.originalElectricityFee !== period.electricityFee ? {
            h: common_vendor.t(period.originalElectricityFee)
          } : {}, {
            i: common_vendor.t(period.electricityFee),
            j: period.originalServiceFee !== period.serviceFee
          }, period.originalServiceFee !== period.serviceFee ? {
            k: common_vendor.t(period.originalServiceFee)
          } : {}, {
            l: common_vendor.t(period.serviceFee),
            m: index,
            n: period.isCurrent ? 1 : ""
          });
        }),
        C: common_vendor.p({
          title: "\u8D85\u5145\u4EF7\u683C"
        }),
        D: common_vendor.o(($event) => activeTab.value = $event),
        E: common_vendor.p({
          color: "#2D55E8",
          active: activeTab.value
        })
      } : {}, {
        F: common_vendor.o(onPricePopupOpened),
        G: common_vendor.o(onPricePopupClosed),
        H: common_vendor.o(($event) => showPriceDetail.value = $event),
        I: common_vendor.p({
          position: "bottom",
          customStyle: "height: 70%; border-radius: 20rpx 20rpx 0 0;",
          show: showPriceDetail.value
        }),
        J: common_vendor.o(($event) => showAllGuns.value = false),
        K: common_vendor.p({
          name: "cross",
          size: "20px"
        }),
        L: gunStatusFilter.value === "all" ? 1 : "",
        M: common_vendor.o(($event) => gunStatusFilter.value = "all"),
        N: gunStatusFilter.value === "free" ? 1 : "",
        O: common_vendor.o(($event) => gunStatusFilter.value = "free"),
        P: gunStatusFilter.value === "occupied" ? 1 : "",
        Q: common_vendor.o(($event) => gunStatusFilter.value = "occupied"),
        R: gunStatusFilter.value === "offline" ? 1 : "",
        S: common_vendor.o(($event) => gunStatusFilter.value = "offline"),
        T: gunStatusFilter.value === "fault" ? 1 : "",
        U: common_vendor.o(($event) => gunStatusFilter.value = "fault"),
        V: common_vendor.f(common_vendor.unref(filteredGuns), (gun, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(common_vendor.unref(components_js_stationUtils.getStatusText)(gun.status)),
            b: getCircleColor(gun.status),
            c: "e5c43de4-10-" + i0 + ",e5c43de4-8",
            d: common_vendor.p({
              value: getCircleRate(gun),
              color: getCircleColor(gun.status),
              layerColor: "#f0f2f5",
              strokeWidth: 4,
              size: 60
            }),
            e: common_vendor.t(gun.gunNumber),
            f: common_vendor.t(gun.maxPower),
            g: gun.status === 3 && gun.remainingTime
          }, gun.status === 3 && gun.remainingTime ? {
            h: common_vendor.t(gun.remainingTime)
          } : {}, {
            i: common_vendor.t(gun.type === 1 ? "\u5146\u51B2" : "\u5FEB\u5145"),
            j: common_vendor.n(gun.type === 1 ? "megawatt-type" : "fast-type"),
            k: index
          });
        }),
        W: common_vendor.o(($event) => showAllGuns.value = $event),
        X: common_vendor.p({
          position: "bottom",
          customStyle: "height: 70%; border-radius: 20rpx 20rpx 0 0;",
          show: showAllGuns.value
        })
      });
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e5c43de4"], ["__file", "/Users/a1307/project/javaworkspace/hxhh/HUIZHI-ChargeOS-mini/pages/station/index.vue"]]);
wx.createPage(MiniProgramPage);
