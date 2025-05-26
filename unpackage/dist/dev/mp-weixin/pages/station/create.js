"use strict";
const common_vendor = require("../../common/vendor.js");
const components_js_request = require("../../components/js/request.js");
if (!Array) {
  const _component_van_tag = common_vendor.resolveComponent("van-tag");
  const _component_van_button = common_vendor.resolveComponent("van-button");
  const _component_van_col = common_vendor.resolveComponent("van-col");
  const _component_van_row = common_vendor.resolveComponent("van-row");
  const _component_van_popup = common_vendor.resolveComponent("van-popup");
  (_component_van_tag + _component_van_button + _component_van_col + _component_van_row + _component_van_popup)();
}
if (!Math) {
  navbar();
}
const navbar = () => "../../components/navbar/index.js";
const _sfc_main = {
  __name: "create",
  setup(__props) {
    getApp();
    const selected = common_vendor.ref("");
    const setport = (index) => {
      selected.value = index;
    };
    const form = common_vendor.reactive({});
    const user = common_vendor.index.getStorageSync("user");
    const token = common_vendor.index.getStorageSync("token");
    const key = common_vendor.ref("");
    const show = (params) => {
      components_js_request.request({
        url: "/charging/getChargingPileData",
        data: params,
        success: (res) => {
          for (let key2 in res.data.data) {
            form[key2] = res.data.data[key2];
          }
        }
      });
    };
    const times = common_vendor.ref([
      "智能充满",
      "1",
      "2",
      "3"
    ]);
    const activetime = common_vendor.ref(0);
    const customtimeshow = common_vendor.ref(false);
    const customtime = common_vendor.ref("");
    const setime = (index) => {
      activetime.value = index;
    };
    const subtime = () => {
      if (customtime.value) {
        if (isNaN(customtime.value)) {
          common_vendor.index.showToast({
            title: "请输入数字",
            icon: "none"
          });
        } else {
          if (times.value.includes(customtime.value)) {
            setime(times.value.indexOf(customtime.value));
          } else {
            if (times.value.length == 4) {
              times.value.push(customtime.value);
            } else {
              times.value[times.value.length - 1] = customtime.value;
            }
            setime(times.value.length - 1);
          }
          customtimeshow.value = false;
        }
      } else {
        common_vendor.index.showToast({
          title: "请输入自定义时间",
          icon: "none"
        });
      }
    };
    const start = () => {
      if (token) {
        if (selected.value === "") {
          common_vendor.index.showToast({
            title: "请选择设备端口",
            icon: "none"
          });
        } else {
          components_js_request.request({
            url: "/order/saveOrder",
            data: {
              amount: 50,
              hour: times.value[activetime.value] == "智能充满" ? 12 : times.value[activetime.value],
              portId: form.list[selected.value].portId,
              userId: user.memberId
            },
            success: (res) => {
              if (res.data.code == 200) {
                common_vendor.index.showToast({
                  title: "成功开启充电"
                });
                setTimeout(() => {
                  go(`/pages/station/powering?stationName=${form.stationName}&port=${res.data.data.portId}&pileId=${res.data.data.pileId}&portname=${form.list[selected.value].name}&orderNumber=${res.data.data.orderNumber}&hour=${res.data.data.hour}&delta=3`);
                }, 1500);
              } else {
                common_vendor.index.showToast({
                  title: "开始充电失败",
                  icon: "none"
                });
              }
            }
          });
        }
      } else {
        common_vendor.index.setStorageSync("redirecturl", "/pages/station/create?key=" + key.value);
        go("/pages/user/login");
      }
    };
    const go = (url) => {
      common_vendor.index.navigateTo({
        url
      });
    };
    common_vendor.onLoad((option) => {
      key.value = option.key;
      show(option);
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "选择充电"
        }),
        b: common_vendor.t(form.stationName),
        c: common_vendor.t(form.address || "暂无"),
        d: common_vendor.t(form.pileId),
        e: common_vendor.t(form.pileType == 1 ? "快充" : "慢充"),
        f: common_vendor.p({
          color: "#E3E8FF",
          textColor: "#5F7DF9"
        }),
        g: common_vendor.f(form.list, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.state == "N" ? "空闲" : item.state == "Y" ? "使用中" : "故障"),
            c: common_vendor.n(item.state == "Y" ? "busy" : ""),
            d: common_vendor.n(selected.value === index ? "selected" : ""),
            e: common_vendor.o(($event) => setport(index), index),
            f: "b7ae42e0-4-" + i0 + "," + ("b7ae42e0-3-" + i0),
            g: common_vendor.p({
              plain: selected.value === index ? false : true,
              round: true,
              type: item.state == "Y" ? "default" : "primary",
              disabled: item.state == "Y" || item.state == "F"
            }),
            h: index,
            i: "b7ae42e0-3-" + i0 + ",b7ae42e0-2"
          };
        }),
        h: common_vendor.p({
          span: 12
        }),
        i: common_vendor.p({
          gutter: "20"
        }),
        j: common_vendor.f(times.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: common_vendor.t(item == "智能充满" ? "" : "小时"),
            c: common_vendor.n(activetime.value === index ? "active" : "default"),
            d: "b7ae42e0-7-" + i0 + "," + ("b7ae42e0-6-" + i0),
            e: common_vendor.p({
              color: activetime.value === index ? "#EEF1FF" : "white",
              textColor: activetime.value === index ? "#5F7DF9" : "#666"
            }),
            f: common_vendor.o(($event) => setime(index), index),
            g: index,
            h: "b7ae42e0-6-" + i0 + ",b7ae42e0-5"
          };
        }),
        k: common_vendor.p({
          span: 8
        }),
        l: common_vendor.p({
          color: "white",
          textColor: "#666"
        }),
        m: common_vendor.o(($event) => customtimeshow.value = true),
        n: common_vendor.p({
          span: 8
        }),
        o: common_vendor.p({
          gutter: "20"
        }),
        p: common_vendor.o(start),
        q: common_vendor.p({
          type: "primary"
        }),
        r: customtime.value,
        s: common_vendor.o(($event) => customtime.value = $event.detail.value),
        t: common_vendor.o(subtime),
        v: common_vendor.p({
          type: "primary",
          size: "small"
        }),
        w: common_vendor.p({
          span: 12
        }),
        x: common_vendor.o(($event) => customtimeshow.value = false),
        y: common_vendor.p({
          type: "default",
          size: "small"
        }),
        z: common_vendor.p({
          span: 12
        }),
        A: common_vendor.p({
          gutter: "20"
        }),
        B: common_vendor.o(($event) => customtimeshow.value = $event),
        C: common_vendor.p({
          position: "bottom",
          show: customtimeshow.value
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b7ae42e0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/station/create.js.map
