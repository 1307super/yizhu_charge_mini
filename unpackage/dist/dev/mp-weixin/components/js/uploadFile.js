"use strict";
var common_vendor = require("../../common/vendor.js");
function uploadFile(options) {
  common_vendor.index.getStorageSync("token");
  const defaultOptions = {
    url: getApp().globalData.serverUrl + options.url,
    name: options.name,
    filePath: options.filePath,
    header: {
      "content-type": "application/json",
      "Authorization": `Bearer ${common_vendor.index.getStorageSync("token")}`
    },
    success: options.success
  };
  common_vendor.index.uploadFile(defaultOptions);
}
exports.uploadFile = uploadFile;
