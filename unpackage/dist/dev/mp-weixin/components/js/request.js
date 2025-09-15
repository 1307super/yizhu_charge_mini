"use strict";
var common_vendor = require("../../common/vendor.js");
function request(options) {
  common_vendor.index.getStorageSync("token") || "";
  const defaultOptions = {
    url: getApp().globalData.serverUrl + options.url,
    header: {
      "content-type": "application/json",
      "Authorization": `Bearer ${common_vendor.index.getStorageSync("token")}`
    },
    method: options.method || "GET",
    data: options.data,
    success: options.success
  };
  common_vendor.index.request(defaultOptions);
}
exports.request = request;
