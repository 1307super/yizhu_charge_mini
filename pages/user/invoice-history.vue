<template>
	<view class="container">
		<navbar class='navbar' title='开票历史'></navbar>
		
		<!-- 顶部时间筛选 -->
		<view class="header-actions">
			<view class="time-filter" @click="openTimeFilter">
				<text class="filter-text">{{timeRangeText}}</text>
				<image src="../../static/image/arrow.png" class="filter-arrow" mode="widthFix"></image>
			</view>
		</view>
		
		<!-- 历史记录列表 -->
		<view class="history-list">
			<van-empty v-if="historyList.length === 0 && !isLoading" description="暂无开票记录" />
			
			<view v-for="(item, index) in historyList" :key="item.invoiceId" class="history-item">
				<view class="item-header">
					<view class="left-info">
						<text class="invoice-title">发票申请 #{{item.invoiceNo}}</text>
						<text class="apply-time">申请时间: {{formatDateTime(item.createTime)}}</text>
					</view>
					<view class="status-tag" :class="getStatusClass(item.status)">
						<text>{{getStatusText(item.status)}}</text>
					</view>
				</view>
				
				<view class="item-content">
					<view class="invoice-info">
						<text class="company-name">{{item.companyName || item.customerName}}</text>
						<!-- <text class="tax-number">税号: {{item.taxNumber}}</text> -->
					</view>
					
					<view class="order-summary">
						<text class="order-count"></text>
						<text class="total-amount">¥{{item.totalAmount.toFixed(2)}}</text>
					</view>
				</view>
				
				<!-- 已开票状态显示PDF链接 -->
				<view v-if="item.status === 'completed' && item.pdfUrl" class="pdf-section">
					<view class="pdf-link" @click="downloadPdf(item.pdfUrl, item.invoiceNo)">
						<image src="../../static/image/pdf.png" class="pdf-icon" mode="aspectFit"></image>
						<text class="pdf-text">查看发票PDF</text>
						<image src="../../static/image/download.png" class="download-icon" mode="aspectFit"></image>
					</view>
				</view>
				
				<!-- 被驳回状态显示驳回原因 -->
				<view v-if="item.status === 'rejected'" class="rejected-section">
					<view class="reject-reason">
						<text class="reason-title">驳回原因：</text>
						<text class="reason-text">{{item.rejectReason || '暂无驳回原因'}}</text>
					</view>
					<view class="reapply-action">
						<van-button 
							type="primary" 
							size="small"
							color="#2D55E8"
							@click="handleReapply(item)"
						>
							重新申请
						</van-button>
					</view>
				</view>
				
				<!-- 订单详情 -->
				<view class="order-details" v-if="expandedItems.includes(item.invoiceId)">
					<view class="details-header">
						<text>订单详情</text>
					</view>
					<view v-for="order in item.orders" :key="order.batchNo" class="order-item">
						<view class="order-info">
							<text class="station-name">{{order.stationName}}</text>
							<text class="order-time">{{formatDate(order.createTime)}}</text>
						</view>
						<view class="order-data">
							<text class="power">{{order.chargeDegree}}度</text>
							<text class="amount">¥{{order.chargeAmount}}</text>
						</view>
					</view>
				</view>
				
				<view class="item-footer">
					<text 
						class="toggle-details" 
						@click="toggleDetails(item.invoiceId)"
					>
						{{expandedItems.includes(item.invoiceId) ? '收起详情' : '查看详情'}}
					</text>
				</view>
			</view>
			
			<!-- 加载更多 -->
			<view class='load-more' v-if="historyList.length > 0">
				<text class='load-text'>{{ loadingText }}</text>
			</view>
		</view>
		
		<!-- 时间筛选抽屉 -->
		<van-popup v-model:show="showTimeDrawer" position="bottom" >
			<view class="time-drawer">
				<view class="drawer-header">
					<text class="drawer-title">选择时间范围</text>
					<text class="drawer-close" @click="closeTimeFilter">取消</text>
				</view>
				<view class="quick-options">
					<view 
						v-for="option in quickTimeOptions" 
						:key="option.key"
						class="option-item"
						:class="{ active: selectedTimeOption === option.key }"
						@click="selectQuickTime(option.key)"
					>
						<text>{{option.label}}</text>
					</view>
				</view>
				<view class="custom-time">
					<view class="time-row">
						<text class="time-label">开始时间</text>
						<picker mode="date" :value="startDate" @change="onStartDateChange">
							<text class="time-value">{{startDate || '请选择'}}</text>
						</picker>
					</view>
					<view class="time-row">
						<text class="time-label">结束时间</text>
						<picker mode="date" :value="endDate" @change="onEndDateChange">
							<text class="time-value">{{endDate || '请选择'}}</text>
						</picker>
					</view>
				</view>
				<view class="drawer-footer">
					<van-button 
						type="primary" 
						color="#2D55E8"
						@click="confirmTimeFilter"
						block
					>
						确定
					</van-button>
				</view>
			</view>
		</van-popup>
	</view>
</template>

<style scoped>
.container {
	background-color: #f6f6f6;
	height: 100vh;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	padding-top: 180rpx;
	box-sizing: border-box;
}

.header-actions {
	padding: 20rpx 30rpx;
	background-color: white;
	border-bottom: 1rpx solid #eee;
	flex-shrink: 0;
}

.time-filter {
	display: flex;
	align-items: center;
	padding: 16rpx 24rpx;
	background-color: #f5f5f5;
	border-radius: 20rpx;
	width: fit-content;
}

.filter-text {
	font-size: 28rpx;
	color: #333;
	margin-right: 10rpx;
}

.filter-arrow {
	width: 20rpx;
	transform: rotate(90deg);
}

.history-list {
	padding: 20rpx 30rpx;
	flex: 1;
	overflow-y: auto;
	min-height: 0;
}

.history-item {
	background-color: white;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.item-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 20rpx;
}

.left-info {
	flex: 1;
}

.invoice-title {
	display: block;
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.apply-time {
	font-size: 26rpx;
	color: #999;
}

.status-tag {
	padding: 8rpx 16rpx;
	border-radius: 16rpx;
	font-size: 24rpx;
}

.status-tag.pending {
	background-color: #fff7e6;
	color: #fa8c16;
}

.status-tag.processing {
	background-color: #e6f7ff;
	color: #1890ff;
}

.status-tag.completed {
	background-color: #f6ffed;
	color: #52c41a;
}

.status-tag.rejected {
	background-color: #fff2f0;
	color: #f5222d;
}

.item-content {
	margin-bottom: 20rpx;
}

.invoice-info {
	margin-bottom: 15rpx;
}

.company-name {
	display: block;
	font-size: 30rpx;
	color: #333;
	margin-bottom: 8rpx;
}

.tax-number {
	font-size: 26rpx;
	color: #666;
}

.order-summary {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.order-count {
	font-size: 28rpx;
	color: #666;
}

.total-amount {
	font-size: 32rpx;
	font-weight: bold;
	color: #2D55E8;
}

.pdf-section {
	margin-bottom: 20rpx;
	padding-top: 20rpx;
	border-top: 1rpx solid #eee;
}

.pdf-link {
	display: flex;
	align-items: center;
	padding: 20rpx;
	background-color: #f0f8ff;
	border-radius: 12rpx;
	border: 1rpx solid #d4edfc;
}

.pdf-icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 16rpx;
}

.pdf-text {
	flex: 1;
	font-size: 28rpx;
	color: #2D55E8;
}

.download-icon {
	width: 32rpx;
	height: 32rpx;
}

.order-details {
	margin-bottom: 20rpx;
	padding-top: 20rpx;
	border-top: 1rpx solid #eee;
}

.details-header {
	margin-bottom: 20rpx;
}

.details-header text {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

.order-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
}

.order-item:last-child {
	border-bottom: none;
}

.order-info {
	flex: 1;
}

.station-name {
	display: block;
	font-size: 28rpx;
	color: #333;
	margin-bottom: 8rpx;
}

.order-time {
	font-size: 24rpx;
	color: #999;
}

.order-data {
	text-align: right;
}

.power {
	display: block;
	font-size: 26rpx;
	color: #666;
	margin-bottom: 8rpx;
}

.amount {
	font-size: 28rpx;
	font-weight: bold;
	color: #2D55E8;
}

.item-footer {
	text-align: center;
}

.toggle-details {
	font-size: 28rpx;
	color: #2D55E8;
	padding: 16rpx;
}

/* 时间筛选抽屉样式 */
.time-drawer {
	padding: 30rpx;
}

.drawer-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.drawer-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.drawer-close {
	font-size: 32rpx;
	color: #999;
}

.quick-options {
	margin-bottom: 40rpx;
}

.option-item {
	padding: 24rpx;
	margin-bottom: 20rpx;
	background-color: #f5f5f5;
	border-radius: 12rpx;
	text-align: center;
}

.option-item.active {
	background-color: #2D55E8;
	color: white;
}

.option-item text {
	font-size: 30rpx;
}

.option-item.active text {
	color: white;
}

.custom-time {
	margin-bottom: 40rpx;
}

.time-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24rpx 0;
	border-bottom: 1rpx solid #eee;
}

.time-label {
	font-size: 30rpx;
	color: #333;
}

.time-value {
	font-size: 30rpx;
	color: #2D55E8;
}

.drawer-footer {
	margin-top: 40rpx;
}

/* 被驳回状态样式 */
.rejected-section {
	margin-bottom: 20rpx;
	padding-top: 20rpx;
	border-top: 1rpx solid #eee;
}

.reject-reason {
	margin-bottom: 20rpx;
	padding: 20rpx;
	background-color: #fff2f0;
	border-radius: 12rpx;
	border-left: 4rpx solid #f5222d;
}

.reason-title {
	font-size: 26rpx;
	font-weight: bold;
	color: #f5222d;
	margin-bottom: 8rpx;
	display: block;
}

.reason-text {
	font-size: 28rpx;
	color: #333;
	line-height: 1.5;
}

.reapply-action {
	text-align: center;
}

/* 加载更多 */
.load-more {
	text-align: center;
	padding: 40rpx 0;
}

.load-text {
	font-size: 24rpx;
	color: #999;
}
</style>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import navbar from '../../components/navbar/index.vue'
import request from '../../components/js/request.js'

const token = uni.getStorageSync('token')
const user = uni.getStorageSync('user')

// 时间筛选相关
const showTimeDrawer = ref(false)
const selectedTimeOption = ref('halfYear')
const startDate = ref('')
const endDate = ref('')

const quickTimeOptions = [
	{ key: 'halfYear', label: '近半年' },
	{ key: 'oneYear', label: '近一年' },
	{ key: 'custom', label: '自定义时间' }
]

// 历史记录列表
const historyList = ref([])
const expandedItems = ref([])

// 分页相关
const query = reactive({
	startDate: '',
	endDate: '',
	userId: '',
	pageNum: 1,
	pageSize: 10
})

// 加载状态
const isLoading = ref(false)
const hasMore = ref(true)
const loadingText = ref('上滑加载更多')
const isInitialized = ref(false)

// 计算属性
const timeRangeText = computed(() => {
	const option = quickTimeOptions.find(opt => opt.key === selectedTimeOption.value)
	if (selectedTimeOption.value === 'custom' && startDate.value && endDate.value) {
		return `${startDate.value} 至 ${endDate.value}`
	}
	return option?.label || '近半年'
})

// 方法
const openTimeFilter = () => {
	showTimeDrawer.value = true
}

const closeTimeFilter = () => {
	showTimeDrawer.value = false
}

const selectQuickTime = (key) => {
	selectedTimeOption.value = key
	if (key === 'halfYear') {
		const now = new Date()
		const halfYearAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
		startDate.value = formatDateForPicker(halfYearAgo)
		endDate.value = formatDateForPicker(now)
		query.startDate = startDate.value
		query.endDate = endDate.value
	} else if (key === 'oneYear') {
		const now = new Date()
		const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
		startDate.value = formatDateForPicker(oneYearAgo)
		endDate.value = formatDateForPicker(now)
		query.startDate = startDate.value
		query.endDate = endDate.value
	}
}

const onStartDateChange = (e) => {
	startDate.value = e.detail.value
	query.startDate = e.detail.value
	selectedTimeOption.value = 'custom'
}

const onEndDateChange = (e) => {
	const selectedEndDate = e.detail.value
	if (startDate.value && selectedEndDate < startDate.value) {
		uni.showToast({
			title: '结束时间不能小于开始时间',
			icon: 'none'
		})
		return
	}
	endDate.value = selectedEndDate
	query.endDate = selectedEndDate
	selectedTimeOption.value = 'custom'
}

const confirmTimeFilter = () => {
	if (!startDate.value || !endDate.value) {
		uni.showToast({
			title: '请选择完整的时间范围',
			icon: 'none'
		})
		return
	}
	showTimeDrawer.value = false
	resetAndLoad()
}

const formatDateForPicker = (date) => {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}

const formatDate = (dateStr) => {
	if (!dateStr) return ''
	const date = new Date(dateStr)
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `${month}-${day}`
}

const formatDateTime = (dateStr) => {
	if (!dateStr) return ''
	const date = new Date(dateStr)
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	const hour = String(date.getHours()).padStart(2, '0')
	const minute = String(date.getMinutes()).padStart(2, '0')
	return `${year}-${month}-${day} ${hour}:${minute}`
}

const getStatusText = (status) => {
	const statusMap = {
		pending: '申请中',
		processing: '开票中',
		completed: '已开票',
		rejected: '已拒绝'
	}
	return statusMap[status] || '未知状态'
}

const getStatusClass = (status) => {
	return status
}

const toggleDetails = (invoiceId) => {
	const index = expandedItems.value.indexOf(invoiceId)
	if (index > -1) {
		expandedItems.value.splice(index, 1)
	} else {
		// 查找对应的发票记录
		const invoice = historyList.value.find(item => item.invoiceId === invoiceId)
		if (invoice && !invoice.orders) {
			// 如果还没有加载详情，则调用API获取
			loadInvoiceDetail(invoice.invoiceNo, invoiceId)
		} else {
			// 已有详情数据，直接展开
			expandedItems.value.push(invoiceId)
		}
	}
}

// 获取发票详情
const loadInvoiceDetail = (invoiceNo, invoiceId) => {
	uni.showLoading({
		title: '加载详情中...'
	})
	
	request({
		url: `invoice/detail/${invoiceId}`,
		method: 'GET',
		success: (res) => {
			uni.hideLoading()
			if (res.data.code === 200) {
				// 找到对应的发票记录并更新其详情
				const invoiceIndex = historyList.value.findIndex(item => item.invoiceId === invoiceId)
				if (invoiceIndex > -1) {
					historyList.value[invoiceIndex].orders = res.data.data.batches || []
					expandedItems.value.push(invoiceId)
				}
			} else {
				uni.showToast({
					title: res.data.msg || '获取详情失败',
					icon: 'none'
				})
			}
		},
		fail: (error) => {
			uni.hideLoading()
			uni.showToast({
				title: '获取详情失败',
				icon: 'none'
			})
		}
	})
}

const downloadPdf = (pdfUrl, invoiceNo) => {
	if (!pdfUrl) {
		uni.showToast({
			title: 'PDF文件不存在',
			icon: 'none'
		})
		return
	}
	
	// 复制链接到剪贴板
	uni.setClipboardData({
		data: pdfUrl,
		success: () => {
			uni.showToast({
				title: 'PDF链接已复制'
			})
		}
	})
	
	// 也可以尝试直接打开
	// #ifdef H5
	window.open(pdfUrl, '_blank')
	// #endif
	
	// #ifdef MP-WEIXIN
	uni.downloadFile({
		url: pdfUrl,
		success: (res) => {
			if (res.statusCode === 200) {
				uni.openDocument({
					filePath: res.tempFilePath,
					success: () => {
						console.log('打开PDF成功')
					},
					fail: (err) => {
						console.log('打开PDF失败', err)
						uni.showToast({
							title: '无法打开PDF文件',
							icon: 'none'
						})
					}
				})
			}
		},
		fail: (err) => {
			console.log('下载PDF失败', err)
			uni.showToast({
				title: '下载PDF失败',
				icon: 'none'
			})
		}
	})
	// #endif
}

// 处理重新申请
const handleReapply = (item) => {
	// 跳转到发票抬头选择页面，并传递原发票编号
	uni.navigateTo({
		url: `/pages/user/invoice-header-list?reapply=true&originalInvoiceNo=${item.invoiceNo}`
	})
}

// 重置并加载数据
const resetAndLoad = () => {
	historyList.value = []
	expandedItems.value = []
	query.pageNum = 1
	hasMore.value = true
	isLoading.value = false
	loadHistoryList()
}

// 获取开票历史列表
const loadHistoryList = () => {
	if (isLoading.value || !hasMore.value) return
	
	console.log('开始加载历史列表，参数:', query)
	isLoading.value = true
	loadingText.value = '加载中...'
	
	request({
		url: 'invoice/history',
		method: 'GET',
		data: query,
		success: (res) => {
			isLoading.value = false
			if (res.data.code === 200) {
				const newHistory = res.data.data || []
				
				if (query.pageNum === 1) {
					historyList.value = newHistory
				} else {
					historyList.value = historyList.value.concat(newHistory)
				}
				
				// 判断是否还有更多数据
				const total = res.data.total || 0
				const currentCount = historyList.value.length
				if (currentCount >= total) {
					hasMore.value = false
					loadingText.value = '没有更多了'
				} else {
					loadingText.value = '上滑加载更多'
				}
			}
		},
		fail: (error) => {
			isLoading.value = false
			console.error('加载历史失败:', error)
			uni.showToast({
				title: '加载失败，请重试',
				icon: 'none'
			})
			loadingText.value = '加载失败，点击重试'
		},
		complete: () => {
			isLoading.value = false
			uni.stopPullDownRefresh()
		}
	})
}

onMounted(() => {
	if (!token) {
		uni.showToast({
			title: '请先登录',
			icon: 'none'
		})
		setTimeout(() => {
			uni.navigateTo({
				url: '/pages/user/login'
			})
		}, 1500)
		return
	}
	
	// 设置用户ID
	query.userId = user.memberId
	
	// 初始化时间范围
	selectQuickTime('halfYear')
	
	// 获取数据
	resetAndLoad()
	
	// 标记已初始化
	isInitialized.value = true
	
	// 监听重新申请成功的刷新事件
	uni.$on('refreshInvoiceHistory', () => {
		console.log('收到刷新发票历史事件')
		resetAndLoad()
	})
})

// 下拉刷新
onPullDownRefresh(() => {
	resetAndLoad()
})

// 上拉加载更多
onReachBottom(() => {
	if (hasMore.value && !isLoading.value) {
		query.pageNum++
		loadHistoryList()
	}
})

// 页面显示时刷新数据
onShow(() => {
	// 只有在页面已经初始化完成后，才在显示时刷新数据
	if (isInitialized.value && historyList.value.length > 0) {
		console.log('页面显示，刷新发票历史数据')
		resetAndLoad()
	}
})
</script>