"use strict";
const STATUS_MAP = {
  CLASS: {
    0: "status-offline",
    1: "status-free",
    2: "status-occupied",
    3: "status-charging",
    4: "status-occupied",
    255: "status-fault",
    21501: "status-upgrade",
    21502: "status-starting",
    21503: "status-disabled"
  },
  TEXT: {
    0: "\u79BB\u7F51",
    1: "\u7A7A\u95F2",
    2: "\u5360\u7528",
    3: "\u5145\u7535",
    4: "\u9884\u7EA6",
    255: "\u6545\u969C",
    21501: "\u5347\u7EA7",
    21502: "\u542F\u52A8",
    21503: "\u7981\u7528"
  },
  FILTER: {
    "free": [1],
    "occupied": [2, 3, 4],
    "offline": [0],
    "fault": [255, 21501, 21502, 21503]
  }
};
const SERVICE_ICONS = {
  "\u514D\u8D39WiFi": "../../static/image/wifi.png",
  "\u4FBF\u5229\u5E97": "../../static/image/store.png",
  "\u536B\u751F\u95F4": "../../static/image/wc.png",
  "\u6D17\u8F66": "../../static/image/wash.png",
  "\u4F11\u606F\u5BA4": "../../static/image/weekend.png",
  "\u4E13\u4EBA\u503C\u5B88": "../../static/image/manage_accounts.png"
};
const formatPrice = (price) => {
  if (!price && price !== 0)
    return "0.0000";
  return parseFloat(price).toFixed(4);
};
const formatTime = (timeString) => {
  if (timeString.includes(":"))
    return timeString;
  const hours = Math.floor(timeString / 100).toString().padStart(2, "0");
  const minutes = (timeString % 100).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};
const isCurrentPeriod = (period) => {
  const now = new Date();
  const currentTime = now.getHours() * 100 + now.getMinutes();
  const startTime = parseInt(period.startTime.replace(":", ""));
  const endTime = parseInt(period.endTime.replace(":", ""));
  return currentTime >= startTime && currentTime < endTime;
};
const getStatusText = (status) => {
  return STATUS_MAP.TEXT[status] || "\u5360\u7528";
};
const getServiceIcon = (service) => {
  return SERVICE_ICONS[service] || "../../static/image/service.png";
};
const filterGunsByStatus = (guns, filterType) => {
  if (filterType === "all") {
    return guns;
  }
  const targetStatuses = STATUS_MAP.FILTER[filterType] || [];
  return guns.filter((gun) => targetStatuses.includes(gun.status));
};
exports.filterGunsByStatus = filterGunsByStatus;
exports.formatPrice = formatPrice;
exports.formatTime = formatTime;
exports.getServiceIcon = getServiceIcon;
exports.getStatusText = getStatusText;
exports.isCurrentPeriod = isCurrentPeriod;
