<template>
	<view class='container'>
		<navbar class='navbar' title='我的订单' v-bind:delta='1'></navbar>
		
		<!-- 顶部tab -->
		<view class='tabs-container'>
			<view class='tab-item' 
				v-for="(tab, index) in tabs" 
				:key="index"
				:class="{ active: currentTab === tab.value }"
				@click='setActiveTab(tab.value)'>
				<text class='tab-text'>{{ tab.label }}</text>
				<view class='tab-line' v-if="currentTab === tab.value"></view>
			</view>
		</view>
		
		<!-- 内容区域 -->
		<view class='content-container'>
			<!-- 订单数量统计 -->
			<view class='order-count-section'>
				<text class='count-text'>订单数量：{{ totalOrders }}个</text>
			</view>
			
			<!-- 订单列表 -->
			<scroll-view 
				class='order-list'
				scroll-y="true"
				@scrolltolower="onScrollToLower"
				v-if="orderList.length > 0"
			>
				<view class='order-card' 
					v-for="(order, index) in orderList" 
					:key="order.batchNo || index"
					@click='goToDetail(order)'>
					<!-- 卡片头部 -->
					<view class='card-header'>
						<text class='station-name'>{{ order.stationName || '充电站' }}</text>
						<view class='status-badge' :class="getStatusClass(order.batchStatus)">
							<text class='status-text'>{{ getStatusText(order.batchStatus) }}</text>
						</view>
					</view>
					
					<!-- 卡片内容 -->
					<view class='card-content'>
						<view class='info-row'>
							<view class='info-item'>
								<text class='info-label'>充电电量</text>
								<text class='info-value'>{{ order.chargePower || '0' }}度</text>
							</view>
							<view class='info-item'>
								<text class='info-label'>充电金额</text>
								<text class='info-value price'>¥{{ order.chargeAmount || '0' }}</text>
							</view>
							<view class='info-item'>
								<text class='info-label'>充电时长</text>
								<text class='info-value'>{{ order.chargeDuration || '00:00:00' }}</text>
							</view>
						</view>
					</view>
					
					<!-- 分割线 -->
					<view class='card-divider'></view>
					
					<!-- 底部时间 -->
					<view class='card-footer'>
						<text class='start-time'>{{ formatTime(order.startTime) }}</text>
					</view>
				</view>
				
				<!-- 加载更多 -->
				<view class='load-more'>
					<text class='load-text'>{{ loadingText }}</text>
				</view>
			</scroll-view>
			
			<!-- 空状态 -->
			<van-empty v-if="orderList.length === 0 && !isLoading" description="暂无订单记录" />
		</view>
	</view>
</template>

<style scoped>
	.container {
		background: linear-gradient(180deg, #F6F8FB 0%, #FFFFFF 100%);
		height: 100vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		padding-top: 180rpx;
		box-sizing: border-box;
	}
	
	/* 导航栏 */
	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
	}
	
	/* 顶部tab */
	.tabs-container {
		display: flex;
		background: #FFFFFF;
		padding: 20rpx 0;
		margin: 0 24rpx 20rpx;
		border-radius: 16rpx;
		box-shadow: 0 4rpx 20rpx rgba(45, 85, 232, 0.08);
		position: relative;
		flex-shrink: 0;
	}
	
	.tab-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20rpx 0;
		position: relative;
		cursor: pointer;
	}
	
	.tab-text {
		font-size: 28rpx;
		color: #666;
		font-weight: 500;
		transition: all 0.3s ease;
	}
	
	.tab-item.active .tab-text {
		color: #2D55E8;
		font-weight: 600;
	}
	
	.tab-line {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 60rpx;
		height: 6rpx;
		background: linear-gradient(90deg, #2D55E8 0%, #5B7BF7 100%);
		border-radius: 3rpx;
	}
	
	/* 内容区域 */
	.content-container {
		background: #FFFFFF;
		margin: 0 24rpx;
		border-radius: 20rpx 20rpx 0 0;
		padding: 32rpx 24rpx 0;
		box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
		flex: 1;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		min-height: 0;
	}
	
	/* 订单数量统计 */
	.order-count-section {
		margin-bottom: 32rpx;
		padding-bottom: 24rpx;
		border-bottom: 2rpx solid #F5F5F5;
		flex-shrink: 0;
	}
	
	.count-text {
		font-size: 26rpx;
		color: #666;
		font-weight: 500;
	}
	
	/* 订单列表 */
	.order-list {
		flex: 1;
		min-height: 0;
		/* padding: 0 24rpx 32rpx 24rpx; */
	}
	
	.order-card {
		background: linear-gradient(135deg, rgba(45, 85, 232, 0.02) 0%, rgba(255, 255, 255, 0.9) 100%);
		border-radius: 20rpx;
		padding: 28rpx;
		border: 2rpx solid rgba(45, 85, 232, 0.1);
		box-shadow: 0 8rpx 32rpx rgba(45, 85, 232, 0.08);
		position: relative;
		overflow: hidden;
		transition: all 0.3s ease;
		flex-shrink: 0;
		margin-bottom: 24rpx;
	}
	
	.order-card:active {
		transform: scale(0.98);
		box-shadow: 0 4rpx 16rpx rgba(45, 85, 232, 0.12);
	}
	
	.order-card::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		width: 160rpx;
		height: 30rpx;
		background: linear-gradient(45deg, transparent 30%, rgba(45, 85, 232, 0.08) 50%, transparent 70%);
		transform: skewX(-20deg);
	}
	
	/* 卡片头部 */
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24rpx;
	}
	
	.station-name {
		font-size: 32rpx;
		font-weight: 600;
		color: #1a1a1a;
		max-width: 400rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.status-badge {
		padding: 8rpx 20rpx;
		border-radius: 20rpx;
		background: rgba(45, 85, 232, 0.1);
	}
	
	.status-badge.status-ongoing {
		background: linear-gradient(45deg, rgba(68, 229, 144, 0.15), rgba(112, 202, 243, 0.15));
	}
	
	.status-badge.status-completed {
		background: linear-gradient(45deg, rgba(45, 85, 232, 0.15), rgba(91, 123, 247, 0.15));
	}
	
	.status-badge.status-closed {
		background: rgba(153, 153, 153, 0.15);
	}
	
	.status-text {
		font-size: 24rpx;
		font-weight: 500;
		color: #2D55E8;
	}
	
	.status-ongoing .status-text {
		color: #44E590;
	}
	
	.status-completed .status-text {
		color: #2D55E8;
	}
	
	.status-closed .status-text {
		color: #999;
	}
	
	/* 卡片内容 */
	.card-content {
		margin-bottom: 20rpx;
	}
	
	.info-row {
		display: flex;
		margin-bottom: 16rpx;
	}
	
	.info-row:last-child {
		margin-bottom: 0;
	}
	
	.info-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}
	
	
	.info-label {
		font-size: 24rpx;
		color: #666;
		margin-bottom: 8rpx;
		font-weight: 400;
	}
	
	.info-value {
		font-size: 28rpx;
		color: #1a1a1a;
		font-weight: 600;
	}
	
	.info-value.price {
		color: #2D55E8;
	}
	
	/* 分割线 */
	.card-divider {
		height: 2rpx;
		background: linear-gradient(90deg, transparent 0%, rgba(45, 85, 232, 0.2) 50%, transparent 100%);
		margin: 20rpx 0 16rpx;
	}
	
	/* 卡片底部 */
	.card-footer {
		display: flex;
		justify-content: flex-end;
	}
	
	.start-time {
		font-size: 22rpx;
		color: #999;
		font-weight: 400;
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
	
	/* 响应式适配 */
	@media (max-width: 375px) {
		.container {
			padding-bottom: 20rpx;
		}
		
		.tabs-container {
			margin: 0 16rpx 16rpx;
			padding: 16rpx 0;
		}
		
		.tab-text {
			font-size: 26rpx;
		}
		
		.content-container {
			margin: 0 16rpx;
			padding: 24rpx 20rpx;
		}
		
		.order-card {
			padding: 24rpx;
		}
		
		.station-name {
			font-size: 28rpx;
			max-width: 300rpx;
		}
		
		.info-value {
			font-size: 26rpx;
		}
		
		.info-label {
			font-size: 22rpx;
		}
	}
</style>

<script setup>
	import { ref, reactive, computed, onMounted } from 'vue'
	import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
	import navbar from '../../components/navbar/index.vue'
	import request from '../../components/js/request.js'
	
	const app = getApp()
	
	// tab配置
	const tabs = ref([
		{ label: '全部', value: '' },
		{ label: '进行中', value: '1' },
		{ label: '已完成', value: '2' }
	])
	
	// 当前选中的tab
	const currentTab = ref('')
	
	// 查询参数
	const query = reactive({
		orderState: '',
		pageNum: 1,
		pageSize: 10,
		userId: ''
	})
	
	// 订单列表
	const orderList = ref([])
	
	// 加载状态
	const isLoading = ref(false)
	const hasMore = ref(true)
	const loadingText = ref('上滑加载更多')
	
	// 总订单数
	const totalOrders = ref(0)
	
	// 设置活跃tab
	const setActiveTab = (value) => {
		currentTab.value = value
		query.orderState = value
		resetAndLoad()
	}
	
	// 重置并加载数据
	const resetAndLoad = () => {
		orderList.value = []
		query.pageNum = 1
		hasMore.value = true
		isLoading.value = false
		loadOrderList()
	}
	
	// 加载订单列表
	const loadOrderList = () => {
		if (isLoading.value || !hasMore.value) return
		
		console.log('开始加载订单列表，参数:', query)
		isLoading.value = true
		loadingText.value = '加载中...'
		
		request({
			url: 'order/queryOrderList',
			method: 'GET',
			data: query,
			success: (res) => {
				isLoading.value = false
				if (res.data.code === 200) {
					const newOrders = res.data.data.records || []
					
					if (query.pageNum === 1) {
						orderList.value = newOrders
					} else {
						orderList.value = orderList.value.concat(newOrders)
					}
					totalOrders.value = res.data.data.total
					// 判断是否还有更多数据
					if (res.data.data.pages <= res.data.data.current) {
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
	
	
	// 获取状态文本
	const getStatusText = (status) => {
		switch (status) {
			case 1: return '进行中'
			case 2: return '已完成'
			case 3: return '已关闭'
			case 4: return '退款失败'
			default: return '未知'
		}
	}
	
	// 获取状态样式类
	const getStatusClass = (status) => {
		switch (status) {
			case 1: return 'status-ongoing'
			case 2: return 'status-completed'
			case 3: return 'status-closed'
			case 4: return 'status-closed'
			default: return ''
		}
	}
	
	// 格式化时间
	const formatTime = (timeStr) => {
		if (!timeStr) return ''
		// 格式化显示时间 "2025-01-16 10:30:00" -> "2025年01月16日 10:30"
		try {
			const date = new Date(timeStr.replace(' ', 'T'))
			const year = date.getFullYear()
			const month = String(date.getMonth() + 1).padStart(2, '0')
			const day = String(date.getDate()).padStart(2, '0')
			const hour = String(date.getHours()).padStart(2, '0')
			const minute = String(date.getMinutes()).padStart(2, '0')
			return `${year}年${month}月${day}日 ${hour}:${minute}`
		} catch (e) {
			return timeStr
		}
	}
	
	// 跳转到详情页
	const goToDetail = (order) => {
		if (order.batchStatus === 1) {
			// 进行中的订单跳转到充电页面
			uni.navigateTo({
				url: `/pages/station/powering?batchNo=${order.batchNo}&stationName=${order.stationName}&licensePlate=${order.licensePlate || ''}`
			})
		} else {
			// 其他状态跳转到详情页
			uni.navigateTo({
				url: `/pages/user/orderdetail?batchNo=${order.batchNo}`
			})
		}
	}
	
	// scroll-view 滚动到底部触发
	const onScrollToLower = () => {
		if (hasMore.value && !isLoading.value) {
			query.pageNum++
			loadOrderList()
		}
	}
	
	// 页面加载时
	onLoad((options) => {
		// 获取用户信息
		const userInfo = uni.getStorageSync('user')
		if (userInfo && userInfo.memberId) {
			query.userId = userInfo.memberId
		}
		
		// 如果有传入的状态参数，设置对应的tab
		if (options.orderState) {
			currentTab.value = options.orderState
			query.orderState = options.orderState
		}
		
		// 加载数据
		loadOrderList()
	})
	
	// 下拉刷新
	onPullDownRefresh(() => {
		resetAndLoad()
	})
	
	// 页面挂载后
	onMounted(() => {
		// 可以在这里做一些初始化工作
	})
</script>