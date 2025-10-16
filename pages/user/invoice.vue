<template>
	<view class="container">
		<navbar class='navbar' title='开票管理'></navbar>
		
		<!-- 顶部操作栏 -->
		<view class="header-actions">
			<view class="time-filter" @click="openTimeFilter">
				<text class="filter-text">{{timeRangeText}}</text>
				<image src="../../static/image/arrow.png" class="filter-arrow" mode="widthFix"></image>
			</view>
			<view class="history-btn" @click="goToHistory">
				<text>开票历史</text>
			</view>
		</view>
		
		<!-- 发票抬头卡片 -->
		<view class="invoice-header-card" @click="goToInvoiceHeader">
			<view class="card-icon">
				<text v-if="!invoiceHeader.id" class="add-icon">+</text>
				<image v-else src="../../static/image/发票抬头.png" class="header-icon" mode="aspectFit"></image>
			</view>
			<view class="card-content">
				<text v-if="!invoiceHeader.id" class="add-text">添加发票抬头</text>
				<view v-else class="header-info">
					<text class="company-name">{{invoiceHeader.headerType === 'enterprise' ? invoiceHeader.companyName : invoiceHeader.customerName}}</text>
					<text class="invoice-type">{{invoiceHeader.invoiceType === 'special' ? '增值税专用发票' : '增值税普通发票'}}</text>
				</view>
			</view>
			<image src="../../static/image/arrow.png" class="card-arrow" mode="widthFix"></image>
		</view>
		
		<!-- 订单列表 -->
		<view class="order-list">
			<view v-if="orderList.length > 0">
				<view v-for="(order, index) in orderList" :key="order.batchNo" class="order-item">
					<van-checkbox 
						:value="selectedOrders.includes(order.batchNo)"
						@change="toggleOrderSelection(order.batchNo)"
						class="order-checkbox"
					></van-checkbox>
					<view class="order-content">
						<view class="order-info">
							<text class="station-name">{{order.stationName}}</text>
							<text class="order-time">{{formatDate(order.createTime)}}</text>
						</view>
						<view class="order-details">
							<text class="power">充电量: {{order.chargeDegree}}度</text>
							<text class="amount">¥{{order.chargeAmount}}</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 加载更多 -->
			<view class='load-more' v-if="orderList.length > 0">
				<text class='load-text'>{{ loadingText }}</text>
			</view>
			
			<van-empty v-if="orderList.length === 0 && !isLoading" description="暂无可开票订单" />
		</view>
		
		<!-- 底部操作栏 -->
		<view class="footer-actions">
			<view class="left-section">
				<van-checkbox 
					:value="isAllSelected"
					@change="toggleSelectAll"
					class="select-all-checkbox"
				>
					全选
				</van-checkbox>
				<view class="selection-info">
					<text class="selection-count">已选择{{selectedOrders.length}}个订单</text>
					<text class="selection-amount">共计¥{{totalAmount.toFixed(2)}}</text>
				</view>
			</view>
			<view class="right-section">
				<view class="help-icon" @click="showHelp">
					<text class="help-text">?</text>
				</view>
				<van-button 
					type="primary" 
					color="#2D55E8"
					:disabled="selectedOrders.length === 0"
					@click="submitInvoiceRequest"
					class="submit-btn"
					round
				>
					申请开票
				</van-button>
			</view>
		</view>
		
		<!-- 时间筛选抽屉 -->
		<van-popup v-model:show="showTimeDrawer" position="bottom">
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
	padding-bottom: 120rpx;
	box-sizing: border-box;
}

.header-actions {
	display: flex;
	justify-content: space-between;
	align-items: center;
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

.history-btn {
	padding: 16rpx 24rpx;
	background-color: #2D55E8;
	border-radius: 20rpx;
}

.history-btn text {
	color: white;
	font-size: 28rpx;
}

.invoice-header-card {
	display: flex;
	align-items: center;
	background-color: white;
	margin: 20rpx 30rpx;
	padding: 30rpx;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
	flex-shrink: 0;
}

.card-icon {
	width: 80rpx;
	height: 80rpx;
	margin-right: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.add-icon {
	font-size: 40rpx;
	color: #2D55E8;
	font-weight: bold;
	border: 2rpx dashed #2D55E8;
	border-radius: 50%;
	width: 60rpx;
	height: 60rpx;
	line-height: 56rpx;
	text-align: center;
}

.header-icon {
	width: 60rpx;
	height: 60rpx;
}

.card-content {
	flex: 1;
}

.add-text {
	font-size: 32rpx;
	color: #2D55E8;
}

.header-info .company-name {
	display: block;
	font-size: 32rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 10rpx;
}

.header-info .invoice-type {
	font-size: 26rpx;
	color: #2D55E8;
	font-weight: 500;
}

.card-arrow {
	width: 20rpx;
}

.order-list {
	padding: 0 30rpx;
	height: calc(100vh - 400rpx);
	overflow-y: auto;
	min-height: 0;
}

.order-item {
	display: flex;
	align-items: center;
	background-color: white;
	margin-bottom: 20rpx;
	padding: 30rpx 20rpx;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.order-checkbox {
	margin-right: 20rpx;
}

.order-content {
	flex: 1;
}

.order-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10rpx;
}

.station-name {
	font-size: 32rpx;
	color: #333;
	font-weight: bold;
}

.order-time {
	font-size: 26rpx;
	color: #999;
}

.order-details {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.power {
	font-size: 28rpx;
	color: #666;
}

.amount {
	font-size: 32rpx;
	color: #2D55E8;
	font-weight: bold;
}

.footer-actions {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: white;
	padding: 20rpx 30rpx;
	border-top: 1rpx solid #eee;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.left-section {
	display: flex;
	align-items: center;
	flex: 1;
}

.select-all-checkbox {
	margin-right: 20rpx;
}

.selection-info {
	display: flex;
	flex-direction: column;
	margin-left: 20rpx;
}

.selection-count {
	font-size: 24rpx;
	color: #666;
	line-height: 1.4;
}

.selection-amount {
	font-size: 24rpx;
	color: #666;
	line-height: 1.4;
}

.right-section {
	display: flex;
	align-items: center;
}

.help-icon {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	background-color: #f0f0f0;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
}

.help-text {
	font-size: 28rpx;
	color: #999;
}

.submit-btn {
	padding: 0 40rpx;
	height: 70rpx;
	line-height: 70rpx;
	border-radius: 35rpx;
}

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
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
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

// 发票抬头信息
const invoiceHeader = reactive({
	id: null,
	headerType: null,
	companyName: '',
	customerName: '',
	taxNumber: '',
	invoiceType: null,
	email: '',
	contactPhone: ''
})

// 订单列表
const orderList = ref([])
const selectedOrders = ref([])

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

// 计算属性
const timeRangeText = computed(() => {
	const option = quickTimeOptions.find(opt => opt.key === selectedTimeOption.value)
	if (selectedTimeOption.value === 'custom' && startDate.value && endDate.value) {
		return `${startDate.value} 至 ${endDate.value}`
	}
	return option?.label || '近半年'
})

const isAllSelected = computed(() => {
	return orderList.value.length > 0 && selectedOrders.value.length === orderList.value.length
})

const totalAmount = computed(() => {
	return orderList.value
		.filter(order => selectedOrders.value.includes(order.batchNo))
		.reduce((sum, order) => sum + parseFloat(order.chargeAmount || 0), 0)
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

const toggleOrderSelection = (batchNo) => {
	const index = selectedOrders.value.indexOf(batchNo)
	if (index > -1) {
		selectedOrders.value.splice(index, 1)
	} else {
		selectedOrders.value.push(batchNo)
	}
}

const toggleSelectAll = () => {
	if (isAllSelected.value) {
		selectedOrders.value = []
	} else {
		selectedOrders.value = orderList.value.map(order => order.batchNo)
	}
}

const goToHistory = () => {
	uni.navigateTo({
		url: '/pages/user/invoice-history'
	})
}

const goToInvoiceHeader = () => {
	uni.navigateTo({
		url: '/pages/user/invoice-header-list'
	})
}

const showHelp = () => {
	uni.navigateTo({
		url: '/pages/user/invoice-help'
	})
}

const submitInvoiceRequest = () => {
	if (selectedOrders.value.length === 0) {
		uni.showToast({
			title: '请选择要开票的订单',
			icon: 'none'
		})
		return
	}
	
	if (!invoiceHeader.id) {
		uni.showToast({
			title: '请先添加发票抬头',
			icon: 'none'
		})
		return
	}
	
	request({
		url: 'invoice/apply',
		method: 'POST',
		data: {
			batchIds: selectedOrders.value,
			headerType: invoiceHeader.headerType,
			headerId: invoiceHeader.id
		},
		success: (res) => {
			if (res.data.code === 200) {
				uni.showToast({
					title: '开票申请提交成功'
				})
				selectedOrders.value = []
				loadOrderList(true)
			} else {
				uni.showToast({
					title: res.data.msg || '申请失败',
					icon: 'none'
				})
			}
		},
		fail: (error) => {
			uni.showToast({
				title: '申请失败',
				icon: 'none'
			})
		}
	})
}

// 获取发票抬头信息
const getInvoiceHeader = () => {
	request({
		url: 'invoice/header/default',
		method: 'GET',
		data: {
			userId: user.memberId
		},
		success: (res) => {
			if (res.data.code === 200 && res.data.data) {
				Object.assign(invoiceHeader, res.data.data)
			}
		},
		fail: (error) => {
			console.log('获取发票抬头失败')
		}
	})
}

// 重置并加载数据
const resetAndLoad = () => {
	orderList.value = []
	selectedOrders.value = []
	query.pageNum = 1
	hasMore.value = true
	isLoading.value = false
	loadOrderList(true)
}

// 获取订单列表
const loadOrderList = (force) => {
	if (!force && (isLoading.value || !hasMore.value)) return
	
	console.log('开始加载订单列表，参数:', query)
	isLoading.value = true
	loadingText.value = '加载中...'
	
	request({
		url: 'invoice/orders',
		method: 'GET',
		data: query,
		success: (res) => {
			isLoading.value = false
			if (res.data.code === 200) {
				const newOrders = res.data.data || []
				
				if (query.pageNum === 1) {
					orderList.value = newOrders
				} else {
					orderList.value = orderList.value.concat(newOrders)
				}
				
				// 判断是否还有更多数据
				const total = res.data.total || 0
				const currentCount = orderList.value.length
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
			console.error('加载订单失败:', error)
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
	getInvoiceHeader()
	resetAndLoad()
	
	// 监听抬头选择事件
	uni.$on('selectInvoiceHeader', (header) => {
		console.log('收到选中的抬头:', header)
		Object.assign(invoiceHeader, header)
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
		loadOrderList()
	}
})
</script>