<template>
	<view class='container'>
		<navbar class='navbar' title='订单详情' v-bind:delta='1'></navbar>
		
		<!-- 顶部订单状态 -->
		<view class='status-header'>
			<view class='status-content'>
				<view class='status-icon' :class="getStatusIconClass(batchInfo.status)">
					<text class='status-icon-text'>{{ getStatusIcon(batchInfo.status) }}</text>
				</view>
				<text class='status-title'>{{ getStatusText(batchInfo.status) }}</text>
				<text class='status-subtitle'>{{ getStatusSubtitle(batchInfo.status) }}</text>
			</view>
		</view>
		
		<!-- 收银小票样式的价格详情 -->
		<view class='receipt-container'>
			<view class='receipt-header'>
				<text class='receipt-title'>价格详情</text>
				<view class='receipt-divider'></view>
			</view>
			
			<view class='receipt-content'>
				<!-- 电费 -->
				<view class='receipt-item'>
					<text class='receipt-label'>电费 ({{ batchInfo.totalPower || '0' }}度)</text>
					<text class='receipt-value'>¥{{ batchInfo.totalChargeFee || '0' }}</text>
				</view>
				
				<!-- 服务费 -->
				<view class='receipt-item'>
					<text class='receipt-label'>服务费 ({{ batchInfo.totalPower || '0' }}度)</text>
					<view class='receipt-price-group'>
						<text class='receipt-value current-price'>¥{{ batchInfo.totalServiceFee || '0' }}</text>
						<text class='receipt-value original-price' v-if="showOriginalPrice">¥{{ batchInfo.totalOriginalServiceFee || '0' }}</text>
					</view>
				</view>
				
				<!-- 分割线 -->
				<view class='receipt-separator'></view>
				
				<!-- 实付金额 -->
				<view class='receipt-total'>
					<text class='total-label'>实付金额</text>
					<text class='total-value'>¥{{ batchInfo.totalAmount || '0' }}</text>
				</view>
			</view>
		</view>
		
		<!-- 订单数据 -->
		<view class='order-data-container'>
			<view class='order-data-header'>
				<text class='station-title'>{{ batchInfo.stationName || '充电站' }}</text>
				<text class='batch-no'>批次号：{{ batchInfo.batchNo || '' }}</text>
			</view>
			
			<!-- 订单列表 -->
			<view class='order-list'>
				<view class='order-item' v-for="(order, index) in ordersList" :key="order.orderNumber || index">
					<view class='gun-header'>
						<view class='gun-info'>
							<view class='gun-icon'>
								<image src='../../static/image/port.png' class='gun-icon-img' mode='aspectFit'></image>
							</view>
							<text class='gun-text'>{{ order.gunNo }}号枪</text>
						</view>
					</view>
					
					<view class='order-details'>
						<!-- 电费信息 -->
						<view class='detail-row'>
							<text class='detail-label'>订单电费 ({{ order.power || '0' }}度)</text>
							<text class='detail-value'>¥{{ order.chargeFee || '0' }}</text>
						</view>
						
						<!-- 服务费信息 -->
						<view class='detail-row'>
							<text class='detail-label'>服务费 ({{ order.power || '0' }}度)</text>
							<view class='detail-price-group'>
								<text class='detail-value current-price'>¥{{ order.serviceFee || '0' }}</text>
								<text class='detail-value original-price' v-if="order.originalServiceFee && order.originalServiceFee !== order.serviceFee">¥{{ order.originalServiceFee }}</text>
							</view>
						</view>
						
						<!-- 实付金额 -->
						<view class='detail-row highlight'>
							<text class='detail-label strong'>实付金额</text>
							<text class='detail-value strong price'>¥{{ order.actualAmount || '0' }}</text>
						</view>
						
						<!-- 订单编号 -->
						<view class='detail-row'>
							<text class='detail-label'>订单编号</text>
							<text class='detail-value small'>{{ order.orderNumber || '' }}</text>
						</view>
						
						<!-- 时间信息 -->
						<view class='detail-row'>
							<text class='detail-label'>开始充电时间</text>
							<text class='detail-value small'>{{ formatDateTime(order.startTime) }}</text>
						</view>
						
						<view class='detail-row'>
							<text class='detail-label'>结束充电时间</text>
							<text class='detail-value small'>{{ formatDateTime(order.endTime) }}</text>
						</view>
						
						<!-- 充电时长 -->
						<view class='detail-row'>
							<text class='detail-label'>充电时长</text>
							<text class='detail-value'>{{ order.chargeDuration || '00:00:00' }}</text>
						</view>
					</view>
					
					<!-- 订单分割线 -->
					<view class='order-divider' v-if="index < ordersList.length - 1"></view>
				</view>
			</view>
		</view>
		
		<!-- 空状态 -->
		<view class='empty-state' v-if="ordersList.length === 0 && !isLoading">
			<text class='empty-text'>暂无订单数据</text>
		</view>
		
		<!-- 加载状态 -->
		<view class='loading-state' v-if="isLoading">
			<text class='loading-text'>加载中...</text>
		</view>
	</view>
</template>

<style scoped>
	.container {
		background: linear-gradient(180deg, #F6F8FB 0%, #FFFFFF 100%);
		min-height: 100vh;
		padding-top: 140rpx;
		padding-bottom: 40rpx;
	}
	
	/* 顶部订单状态 */
	.status-header {
		padding: 40rpx 24rpx;
		text-align: center;
	}
	
	.status-content {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.status-icon {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 24rpx;
		background: linear-gradient(45deg, #2D55E8, #5B7BF7);
		box-shadow: 0 8rpx 24rpx rgba(45, 85, 232, 0.3);
	}
	
	.status-icon.status-starting {
		background: linear-gradient(45deg, #FF9500, #FFAD33);
	}
	
	.status-icon.status-ongoing {
		background: linear-gradient(45deg, #44E590, #70CAF3);
	}
	
	.status-icon.status-stopping {
		background: linear-gradient(45deg, #FFA500, #FFB733);
	}
	
	.status-icon.status-completed {
		background: linear-gradient(45deg, #2D55E8, #5B7BF7);
	}
	
	.status-icon.status-unknown {
		background: linear-gradient(45deg, #888, #bbb);
	}
	
	.status-icon.status-closed {
		background: linear-gradient(45deg, #999, #ccc);
	}
	
	.status-icon-text {
		font-size: 48rpx;
		color: #FFFFFF;
		font-weight: 600;
	}
	
	.status-title {
		font-size: 36rpx;
		font-weight: 600;
		color: #1a1a1a;
		margin-bottom: 12rpx;
	}
	
	.status-subtitle {
		font-size: 26rpx;
		color: #666;
		font-weight: 400;
	}
	
	/* 收银小票样式 */
	.receipt-container {
		background: #FFFFFF;
		margin: 0 24rpx 24rpx;
		border-radius: 20rpx;
		padding: 32rpx;
		box-shadow: 0 8rpx 32rpx rgba(45, 85, 232, 0.08);
		position: relative;
		overflow: hidden;
	}
	
	.receipt-container::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 8rpx;
		background: linear-gradient(90deg, #2D55E8 0%, #5B7BF7 100%);
	}
	
	.receipt-header {
		margin-bottom: 32rpx;
		text-align: center;
	}
	
	.receipt-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #1a1a1a;
	}
	
	.receipt-divider {
		width: 80rpx;
		height: 4rpx;
		background: linear-gradient(90deg, #2D55E8 0%, #5B7BF7 100%);
		margin: 16rpx auto 0;
		border-radius: 2rpx;
	}
	
	.receipt-content {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
	}
	
	.receipt-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16rpx 0;
	}
	
	.receipt-label {
		font-size: 28rpx;
		color: #666;
		font-weight: 400;
	}
	
	.receipt-value {
		font-size: 28rpx;
		color: #1a1a1a;
		font-weight: 500;
	}
	
	.receipt-price-group {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}
	
	.current-price {
		color: #1a1a1a;
	}
	
	.original-price {
		color: #999;
		text-decoration: line-through;
		font-size: 24rpx !important;
	}
	
	.receipt-separator {
		height: 2rpx;
		background: repeating-linear-gradient(
			to right,
			#ddd 0,
			#ddd 8rpx,
			transparent 8rpx,
			transparent 16rpx
		);
		margin: 16rpx 0;
	}
	
	.receipt-total {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
		background: rgba(45, 85, 232, 0.05);
		border-radius: 12rpx;
		padding: 20rpx 24rpx;
	}
	
	.total-label {
		font-size: 32rpx;
		font-weight: 600;
		color: #1a1a1a;
	}
	
	.total-value {
		font-size: 36rpx;
		font-weight: 700;
		color: #2D55E8;
	}
	
	/* 订单数据容器 */
	.order-data-container {
		background: #FFFFFF;
		margin: 0 24rpx;
		border-radius: 20rpx;
		padding: 32rpx;
		box-shadow: 0 8rpx 32rpx rgba(45, 85, 232, 0.08);
	}
	
	.order-data-header {
		margin-bottom: 32rpx;
		text-align: center;
		padding-bottom: 24rpx;
		border-bottom: 2rpx solid #F5F5F5;
	}
	
	.station-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #1a1a1a;
		display: block;
		margin-bottom: 12rpx;
	}
	
	.batch-no {
		font-size: 26rpx;
		color: #666;
		font-weight: 400;
	}
	
	/* 订单列表 */
	.order-list {
		display: flex;
		flex-direction: column;
	}
	
	.order-item {
		padding: 24rpx 0;
	}
	
	.gun-header {
		margin-bottom: 24rpx;
	}
	
	.gun-info {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}
	
	.gun-icon {
		width: 48rpx;
		height: 48rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(45, 85, 232, 0.1);
		border-radius: 12rpx;
	}
	
	.gun-icon-img {
		width: 28rpx;
		height: 28rpx;
	}
	
	.gun-text {
		font-size: 32rpx;
		font-weight: 600;
		color: #1a1a1a;
	}
	
	/* 订单详情 */
	.order-details {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		padding-left: 64rpx;
	}
	
	.detail-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8rpx 0;
	}
	
	.detail-row.highlight {
		background: rgba(45, 85, 232, 0.05);
		border-radius: 8rpx;
		padding: 16rpx 20rpx;
		margin: 8rpx 0;
	}
	
	.detail-label {
		font-size: 26rpx;
		color: #666;
		font-weight: 400;
		flex-shrink: 0;
		min-width: 200rpx;
	}
	
	.detail-label.strong {
		font-weight: 600;
		color: #1a1a1a;
	}
	
	.detail-value {
		font-size: 26rpx;
		color: #1a1a1a;
		font-weight: 500;
		text-align: right;
		flex: 1;
	}
	
	.detail-value.strong {
		font-weight: 600;
		font-size: 28rpx;
	}
	
	.detail-value.price {
		color: #2D55E8;
	}
	
	.detail-value.small {
		font-size: 24rpx;
		color: #666;
	}
	
	.detail-price-group {
		display: flex;
		align-items: center;
		gap: 12rpx;
		justify-content: flex-end;
	}
	
	/* 订单分割线 */
	.order-divider {
		height: 2rpx;
		background: linear-gradient(90deg, transparent 0%, rgba(45, 85, 232, 0.2) 50%, transparent 100%);
		margin: 32rpx 0;
	}
	
	/* 空状态 */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 120rpx 0;
	}
	
	.empty-text {
		font-size: 28rpx;
		color: #999;
		font-weight: 400;
	}
	
	/* 加载状态 */
	.loading-state {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 80rpx 0;
	}
	
	.loading-text {
		font-size: 28rpx;
		color: #666;
	}
	
	/* 响应式适配 */
	@media (max-width: 375px) {
		.container {
			padding-bottom: 20rpx;
		}
		
		.status-header {
			padding: 32rpx 16rpx;
		}
		
		.status-icon {
			width: 100rpx;
			height: 100rpx;
			margin-bottom: 20rpx;
		}
		
		.status-icon-text {
			font-size: 40rpx;
		}
		
		.status-title {
			font-size: 32rpx;
		}
		
		.receipt-container,
		.order-data-container {
			margin: 0 16rpx 20rpx;
			padding: 24rpx;
		}
		
		.receipt-title {
			font-size: 28rpx;
		}
		
		.receipt-label,
		.receipt-value {
			font-size: 26rpx;
		}
		
		.station-title {
			font-size: 28rpx;
		}
		
		.gun-text {
			font-size: 28rpx;
		}
		
		.order-details {
			padding-left: 48rpx;
		}
		
		.detail-label,
		.detail-value {
			font-size: 24rpx;
		}
		
		.detail-label {
			min-width: 160rpx;
		}
	}
</style>

<script setup>
	import { ref, reactive, computed, onMounted } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import navbar from '../../components/navbar/index.vue'
	import request from '../../components/js/request.js'
	import { ORDER_STATUS_MAP } from '../../components/js/stationUtils.js'
	
	const app = getApp()
	
	// 批次信息
	const batchInfo = reactive({
		batchNo: '',
		stationName: '',
		licensePlate: '',
		vehicleVin: '',
		startTime: '',
		status: 0,
		totalChargeFee: '0',
		totalPower: '0',
		totalOriginalServiceFee: '0',
		totalServiceFee: '0',
		totalAmount: '0'
	})
	
	// 订单列表
	const ordersList = ref([])
	
	// 加载状态
	const isLoading = ref(false)
	
	// 是否显示原价
	const showOriginalPrice = computed(() => {
		return batchInfo.totalOriginalServiceFee && 
			   batchInfo.totalOriginalServiceFee !== batchInfo.totalServiceFee &&
			   parseFloat(batchInfo.totalOriginalServiceFee) > parseFloat(batchInfo.totalServiceFee)
	})
	
	// 获取批次详情
	const getBatchDetail = (batchNo) => {
		if (!batchNo) return
		
		isLoading.value = true
		
		request({
			url: '/order/getChargingOrderDetail',
			method: 'GET',
			data: { batchNo },
			success: (res) => {
				isLoading.value = false
				if (res.data.code === 200) {
					const data = res.data.data
					
					// 更新批次信息
					Object.assign(batchInfo, {
						batchNo: data.batchNo || '',
						stationName: data.stationName || '',
						licensePlate: data.licensePlate || '',
						vehicleVin: data.vehicleVin || '',
						startTime: data.startTime || '',
						status: data.status || 0,
						totalChargeFee: data.totalChargeFee || '0',
						totalPower: data.totalPower || '0',
						totalOriginalServiceFee: data.totalOriginalServiceFee || '0',
						totalServiceFee: data.totalServiceFee || '0',
						totalAmount: data.totalAmount || '0'
					})
					
					// 更新订单列表
					ordersList.value = data.orders || []
				} else {
					uni.showToast({
						title: res.data.msg || '获取详情失败',
						icon: 'none'
					})
				}
			},
			fail: (error) => {
				isLoading.value = false
				console.error('获取批次详情失败:', error)
				uni.showToast({
					title: '网络异常，请重试',
					icon: 'none'
				})
			},
			complete: () => {
				isLoading.value = false
			}
		})
	}
	
	// 获取状态文本
	const getStatusText = (status) => {
		return ORDER_STATUS_MAP.TEXT[status] || '未知状态'
	}
	
	// 获取状态副标题
	const getStatusSubtitle = (status) => {
		switch (status) {
			case 1: return '正在启动充电设备，请稍等'
			case 2: return '请耐心等待充电完成'
			case 3: return '正在停止充电'
			case 4: return '感谢使用吉运超充，欢迎下次再来！'
			case 5: return '状态异常，请联系客服'
			case -1: return '充电已关闭'
			case -2: return '退款处理失败，请联系客服'
			default: return ''
		}
	}
	
	// 获取状态图标
	const getStatusIcon = (status) => {
		switch (status) {
			case 1: return '🚀'  // 启动中
			case 2: return '⚡'  // 充电中
			case 3: return '⏸'  // 停止中
			case 4: return '✓'  // 已完成
			case 5: return '❓'  // 未知
			case -1: return '✕' // 已关闭
			case -2: return '⚠' // 退款失败
			default: return '?'
		}
	}
	
	// 获取状态图标样式类
	const getStatusIconClass = (status) => {
		switch (status) {
			case 1: return 'status-starting'    // 启动中
			case 2: return 'status-ongoing'     // 充电中
			case 3: return 'status-stopping'    // 停止中
			case 4: return 'status-completed'   // 已完成
			case 5: return 'status-unknown'     // 未知
			case -1: return 'status-closed'     // 已关闭
			case -2: return 'status-closed'     // 退款失败
			default: return 'status-unknown'
		}
	}
	
	// 格式化日期时间
	const formatDateTime = (timeStr) => {
		if (!timeStr) return ''
		// 格式化显示时间 "2025-01-16 10:30:00" -> "2025年01月16日 10:30:00"
		try {
			const date = new Date(timeStr.replace(' ', 'T'))
			const year = date.getFullYear()
			const month = String(date.getMonth() + 1).padStart(2, '0')
			const day = String(date.getDate()).padStart(2, '0')
			const hour = String(date.getHours()).padStart(2, '0')
			const minute = String(date.getMinutes()).padStart(2, '0')
			const second = String(date.getSeconds()).padStart(2, '0')
			return `${year}年${month}月${day}日 ${hour}:${minute}:${second}`
		} catch (e) {
			return timeStr
		}
	}
	
	// 页面加载时
	onLoad((options) => {
		if (options.batchNo) {
			getBatchDetail(options.batchNo)
		} else {
			uni.showToast({
				title: '参数错误',
				icon: 'none'
			})
			setTimeout(() => {
				uni.navigateBack()
			}, 1500)
		}
	})
	
	// 页面挂载后
	onMounted(() => {
		// 可以在这里做一些初始化工作
	})
</script>