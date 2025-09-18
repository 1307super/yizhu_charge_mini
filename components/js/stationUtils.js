// 充电站相关工具函数

// 充电枪状态映射
export const GUN_STATUS_MAP = {
	CLASS: {
		0: 'status-offline',        // 离网
		1: 'status-free',          // 空闲
		2: 'status-occupied',      // 占用（未充电）
		3: 'status-charging',      // 占用（充电中）
		4: 'status-occupied',      // 占用（预约锁定）
		255: 'status-fault',       // 充电枪故障
		21501: 'status-upgrade',   // 设备升级中
		21502: 'status-starting',  // 充电启动中
		21503: 'status-disabled'   // 设备禁用
	},
	TEXT: {
		0: '离网',
		1: '空闲',
		2: '占用',
		3: '充电',
		4: '预约',
		255: '故障',
		21501: '升级',
		21502: '启动',
		21503: '禁用'
	},
	FILTER: {
		'free': [1],                    // 空闲
		'occupied': [2, 3, 4],          // 占用（包括未充电、充电中、预约锁定）
		'offline': [0],                 // 离网
		'fault': [255, 21501, 21502, 21503]  // 故障（包括故障、升级、启动、禁用）
	}
}

// 充电订单状态映射
export const ORDER_STATUS_MAP = {
	TEXT: {
		1: '启动中',
		2: '充电中',
		3: '停止中',
		4: '已完成',
		5: '未知',
		'-1': '已关闭',
		'-2': '退款失败'
	},
	CLASS: {
		1: 'status-starting',
		2: 'status-charging', 
		3: 'status-stopping',
		4: 'status-completed',
		5: 'status-unknown',
		'-1': 'status-closed',
		'-2': 'status-refund-failed'
	}
}

// 为了向后兼容，保留原有的STATUS_MAP
export const STATUS_MAP = GUN_STATUS_MAP

// 服务图标映射
export const SERVICE_ICONS = {
	'免费WiFi': '../../static/image/wifi.png',
	'便利店': '../../static/image/store.png',
	'卫生间': '../../static/image/wc.png',
	'洗车': '../../static/image/wash.png',
	'休息室': '../../static/image/weekend.png',
	'专人值守': '../../static/image/manage_accounts.png'
}

// 格式化价格为4位小数
export const formatPrice = (price) => {
	if (!price && price !== 0) return '0.0000'
	return parseFloat(price).toFixed(4)
}

// 格式化时间字符串
export const formatTime = (timeString) => {
	if (timeString.includes(':')) return timeString
	const hours = Math.floor(timeString / 100).toString().padStart(2, '0')
	const minutes = (timeString % 100).toString().padStart(2, '0')
	return `${hours}:${minutes}`
}

// 判断是否为当前时间段
export const isCurrentPeriod = (period) => {
	const now = new Date()
	const currentTime = now.getHours() * 100 + now.getMinutes()
	const startTime = parseInt(period.startTime.replace(':', ''))
	const endTime = parseInt(period.endTime.replace(':', ''))
	return currentTime >= startTime && currentTime < endTime
}

// 获取状态样式类
export const getStatusClass = (status) => {
	return STATUS_MAP.CLASS[status] || 'status-occupied'
}

// 获取状态文字
export const getStatusText = (status) => {
	return STATUS_MAP.TEXT[status] || '占用'
}

// 获取服务图标
export const getServiceIcon = (service) => {
	return SERVICE_ICONS[service] || '../../static/image/service.png'
}

// 获取SOC进度样式
export const getProgressStyle = (soc) => {
	if (!soc && soc !== 0) return { display: 'none' }
	
	// SOC为电量百分比，直接使用
	const progress = Math.max(0, Math.min(100, soc))
	
	return {
		display: 'block',
		borderImage: `conic-gradient(#FFA500 ${progress * 3.6}deg, #f0f0f0 ${progress * 3.6}deg) 1`
	}
}

// 筛选充电枪
export const filterGunsByStatus = (guns, filterType) => {
	if (filterType === 'all') {
		return guns
	}
	
	const targetStatuses = STATUS_MAP.FILTER[filterType] || []
	return guns.filter(gun => targetStatuses.includes(gun.status))
}

// 获取订单状态文本
export const getOrderStatusText = (status) => {
	return ORDER_STATUS_MAP.TEXT[status] || '未知'
}

// 获取订单状态样式类
export const getOrderStatusClass = (status) => {
	return ORDER_STATUS_MAP.CLASS[status] || 'status-unknown'
}

// 判断订单是否在充电中
export const isOrderCharging = (status) => {
	return status === 1 || status === 2 // 启动中或充电中
}