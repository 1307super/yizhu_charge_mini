<template>
	<view class='container'>
		<navbar class='navbar' title='' v-bind:delta='form.delta'></navbar>
		
		<!-- 顶部信息栏 -->
		<view class='top-info'>
			<text class='station-name'>{{form.stationName || '充电站名称'}}</text>
			<text class='license-plate'>{{form.licensePlate || '车牌号/车架号'}}</text>
		</view>
		
	
		<!-- 充电枪卡片列表 -->
		<view class='guns-container'>
			<view class='gun-card' v-for="(order, index) in ordersList" :key="order.orderId">
				<view class='gun-header'>
					<view class='gun-title'>
						<!-- 充电枪图标 -->
						<view class='gun-icon'>
							<image src='../../static/image/port.png' class='gun-icon-img' mode='aspectFit'></image>
						</view>
						<text class='gun-text'>{{order.gunNo}}号充电枪</text>
					</view>
					<text class='estimate-time'>预计还需{{order.estimatedTime}}分钟</text>
				</view>
				
				<view class='gun-content'>
					<!-- 左侧圆环进度条 -->
					<view class='progress-container'>
						<view class='circular-progress' :style="{background: `conic-gradient(#2D55E8 0deg ${order.soc * 3.6}deg, #f0f2f5 ${order.soc * 3.6}deg 360deg)`}">
							<view class='progress-inner'>
								<text class='soc-value'>{{order.soc}}</text>
								<text class='soc-unit'>%</text>
							</view>
						</view>
					</view>
					
					<!-- 右侧数据显示 -->
					<view class='data-container'>
						<!-- 第一行：充电费用和已充电量 -->
						<view class='data-row-main'>
							<view class='data-item'>
								<text class='data-value'>{{order.actualAmount}}</text>
								<text class='data-label'>充电费用(元)</text>
							</view>
							<view class='data-item'>
								<text class='data-value'>{{order.power.toFixed(2)}}</text>
								<text class='data-label'>已充电量(度)</text>
							</view>
						</view>
						
						<!-- 第二行：功率、电流、电压 -->
						<view class='data-row-detail'>
							<view class='data-item-small'>
								<text class='data-value-small'>{{(order.current * order.voltage / 100).toFixed(2)}}</text>
								<text class='data-label-small'>功率(KW)</text>
							</view>
							<view class='data-item-small'>
								<text class='data-value-small'>{{order.current}}</text>
								<text class='data-label-small'>电流(A)</text>
							</view>
							<view class='data-item-small'>
								<text class='data-value-small'>{{order.voltage}}</text>
								<text class='data-label-small'>电压(V)</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 底部总计和操作区 -->
		<view class='footer-container'>
			<view class='total-info'>
				<view class='total-item'>
					<text class='total-value'>¥{{totalChargeFee.toFixed(2)}}</text>
					<text class='total-label'>总充电费用</text>
				</view>
				<view class='total-item'>
					<text class='total-value'>{{totalChargedAmount.toFixed(2)}}度</text>
					<text class='total-label'>总充电量</text>
				</view>
			</view>
			
			<van-button 
				type='primary' 
				:disabled='!canEndCharge || isStoppingCharge'
				:color='canEndCharge && !isStoppingCharge ? "#2D55E8" : "#d9d9d9"'
				@click='finish'
				class='end-button'
				round
				block
			>
				{{isStoppingCharge ? '正在结束充电...' : (canEndCharge ? '结束充电' : `请等待 ${remainingWaitTime}s`)}}
			</van-button>
			
			<text class='footer-tip'>费用总计为预估金额，以实际发生为准</text>
			<view class='safe-area'></view>
		</view>
	</view>
</template>

<style scoped>
	.container {
		background: linear-gradient(180deg, #F6F8FB 0%, #FFFFFF 100%);
		min-height: 100vh;
		padding-top: 140rpx;
		padding-bottom: 220rpx;
		position: relative;
	}
	
	/* 顶部信息栏 */
	.top-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 24rpx;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
	}
	
	.station-name {
		font-size: 26rpx;
		color: #666;
		font-weight: 400;
	}
	
	.license-plate {
		font-size: 26rpx;
		color: #666;
		font-weight: 400;
	}
	
	/* 背景装饰图 */
	.bg-decoration {
		position: absolute;
		top: 200rpx;
		right: -50rpx;
		width: 350rpx;
		height: 250rpx;
		opacity: 0.08;
		z-index: 1;
		pointer-events: none;
	}
	
	.bg-image {
		width: 100%;
		height: 100%;
	}
	
	/* 充电枪卡片容器 */
	.guns-container {
		padding: 0 24rpx;
		z-index: 2;
		position: relative;
	}
	
	.gun-card {
		background: linear-gradient(135deg, rgba(45, 85, 232, 0.02) 0%, rgba(255, 255, 255, 0.9) 100%);
		backdrop-filter: blur(10px);
		border-radius: 20rpx;
		padding: 28rpx;
		margin-bottom: 24rpx;
		border: 1rpx solid rgba(45, 85, 232, 0.1);
		box-shadow: 0 8rpx 32rpx rgba(45, 85, 232, 0.08);
		position: relative;
		overflow: hidden;
	}
	
	.gun-card::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		width: 200rpx;
		height: 40rpx;
		background: linear-gradient(45deg, transparent 30%, rgba(45, 85, 232, 0.1) 50%, transparent 70%);
		transform: skewX(-20deg);
	}
	
	/* 充电枪卡片头部 */
	.gun-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32rpx;
	}
	
	.gun-title {
		display: flex;
		align-items: center;
		gap: 12rpx;
	}
	
	.gun-icon {
		width: 40rpx;
		height: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(45, 85, 232, 0.1);
		border-radius: 10rpx;
	}
	
	.gun-icon-img {
		width: 24rpx;
		height: 24rpx;
	}
	
	.gun-text {
		font-size: 32rpx;
		font-weight: 600;
		color: #1a1a1a;
	}
	
	.estimate-time {
		font-size: 26rpx;
		color: #2D55E8;
		font-weight: 500;
		background: rgba(45, 85, 232, 0.1);
		padding: 6rpx 16rpx;
		border-radius: 20rpx;
	}
	
	/* 充电枪卡片内容 */
	.gun-content {
		display: flex;
		align-items: center;
		gap: 40rpx;
	}
	
	/* 圆环进度条 */
	.progress-container {
		flex-shrink: 0;
	}
	
	.circular-progress {
		width: 160rpx;
		height: 160rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	
	.progress-inner {
		width: 120rpx;
		height: 120rpx;
		background: #fff;
		border-radius: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	}
	
	.soc-value {
		font-size: 36rpx;
		font-weight: 700;
		color: #2D55E8;
		line-height: 1;
	}
	
	.soc-unit {
		font-size: 20rpx;
		color: #666;
		margin-top: 4rpx;
	}
	
	/* 数据显示区域 */
	.data-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 24rpx;
	}
	
	.data-row-main {
		display: flex;
		gap: 32rpx;
	}
	
	.data-item {
		flex: 1;
		text-align: center;
	}
	
	.data-value {
		display: block;
		font-size: 32rpx;
		font-weight: 700;
		color: #1a1a1a;
		margin-bottom: 8rpx;
	}
	
	.data-label {
		font-size: 24rpx;
		color: #666;
		font-weight: 400;
	}
	
	.data-row-detail {
		display: flex;
		gap: 8rpx;
	}
	
	.data-item-small {
		flex: 1;
		text-align: center;
		background: rgba(45, 85, 232, 0.05);
		padding: 20rpx 50rpx;
		border-radius: 12rpx;
		min-width: 0;
	}
	
	.data-value-small {
		display: block;
		font-size: 28rpx;
		font-weight: 600;
		color: #2D55E8;
		margin-bottom: 6rpx;
	}
	
	.data-label-small {
		font-size: 20rpx;
		color: #666;
		font-weight: 400;
		white-space: nowrap;
	}
	
	/* 底部容器 */
	.footer-container {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, #FFFFFF 100%);
		backdrop-filter: blur(20px);
		border-top: 1rpx solid rgba(45, 85, 232, 0.1);
		border-top-left-radius: 48rpx;
		border-top-right-radius: 48rpx;
		padding: 16rpx 20rpx;
		z-index: 10;
		box-sizing: border-box;
	}
	
	.total-info {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
		padding: 16rpx 20rpx;
		background: rgba(45, 85, 232, 0.05);
		border-radius: 12rpx;
		box-sizing: border-box;
	}
	
	.total-item {
		text-align: center;
		flex: 1;
	}
	
	.total-value {
		display: block;
		font-size: 28rpx;
		font-weight: 700;
		color: #2D55E8;
		margin-bottom: 6rpx;
	}
	
	.total-label {
		font-size: 22rpx;
		color: #666;
		font-weight: 400;
	}
	
	.end-button {
		height: 72rpx;
		border-radius: 36rpx;
		font-size: 28rpx;
		font-weight: 600;
		margin-bottom: 12rpx;
		border: none;
		box-shadow: 0 4rpx 16rpx rgba(45, 85, 232, 0.3);
		width: 100%;
		box-sizing: border-box;
	}
	
	.footer-tip {
		display: block;
		text-align: center;
		font-size: 20rpx;
		color: #999;
		line-height: 1.4;
		margin-bottom: 6rpx;
	}
	
	.safe-area {
		height: env(safe-area-inset-bottom);
	}
	
	/* 响应式适配 */
	@media (max-width: 375px) {
		.container {
			padding-bottom: 200rpx;
		}
		
		.gun-content {
			flex-direction: column;
			gap: 20rpx;
		}
		
		.data-row-main {
			justify-content: center;
		}
		
		.footer-container {
			padding: 12rpx 16rpx;
		}
		
		.total-info {
			padding: 12rpx 16rpx;
			margin-bottom: 16rpx;
		}
		
		.total-value {
			font-size: 24rpx;
			margin-bottom: 4rpx;
		}
		
		.total-label {
			font-size: 20rpx;
		}
		
		.end-button {
			height: 64rpx;
			font-size: 26rpx;
		}
		
		.bg-decoration {
			width: 280rpx;
			height: 200rpx;
			top: 180rpx;
		}
	}
</style>

<script setup>
	import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
	import { onLoad, onUnload, onShow, onHide } from '@dcloudio/uni-app'
	import navbar from '../../components/navbar/index.vue'
	import request from '../../components/js/request.js'
	import { getOrderStatusText, getOrderStatusClass, isOrderCharging } from '../../components/js/stationUtils.js'
	
	const app = getApp()
	
	// 页面参数
	const form = reactive({
		batchNo: '',
		stationName: '',
		licensePlate: '',
		delta: 1
	})
	
	// 充电订单列表（一个批次可能有多个订单，每个订单一个枪）
	const ordersList = ref([])
	
	// 充电开始时间（用于计算90秒限制）
	const chargeStartTime = ref(Date.now())
	
	// 定时器
	const countdownTimer = ref(null)
	const dataRefreshTimer = ref(null)
	const stopStatusTimer = ref(null)
	
	// 剩余等待时间（90秒限制）
	const remainingWaitTime = ref(90)
	
	// 停止充电状态
	const isStoppingCharge = ref(false)
	
	// 计算总充电费用
	const totalChargeFee = computed(() => {
		return ordersList.value.reduce((total, order) => total + (parseFloat(order.actualAmount) || 0), 0)
	})
	
	// 计算总充电量
	const totalChargedAmount = computed(() => {
		return ordersList.value.reduce((total, order) => total + (order.power || 0), 0)
	})
	
	// 是否可以结束充电（90秒后）
	const canEndCharge = computed(() => {
		return remainingWaitTime.value <= 0
	})
	
	// 获取充电批次详情
	const getChargingBatchDetail = () => {
		request({
			url: 'order/getChargingOrderDetail',
			method: 'GET',
			data: { batchNo: form.batchNo },
			success: (res) => {
				if (res.data.code === 200) {
					const batchData = res.data.data
					
					// 检查充电状态，如果不为2说明充电已结束
					if (batchData.status !== 2) {
						// 清理所有定时器
						clearTimers()
						
						// 提示充电已结束
						uni.showToast({
							title: '充电已结束',
							icon: 'success'
						})
						
						// 跳转到订单列表页
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/user/order'
							})
						}, 1500)
						return
					}
					
					// 更新基本信息
					form.stationName = batchData.stationName || '充电站名称'
					form.licensePlate = batchData.licensePlate || '车牌号/车架号'
					
					// 更新充电订单数据
					ordersList.value = batchData.orders || []
					
					// 设置充电开始时间 (格式: "2025-01-15 10:30:00")
					if (batchData.startTime) {
						chargeStartTime.value = new Date(batchData.startTime.replace(' ', 'T')).getTime()
					}
				}
			},
			fail: (error) => {
				console.error('获取批次详情失败:', error)
				uni.showToast({
					title: '获取充电信息失败',
					icon: 'none'
				})
			}
		})
	}
	
	// 启动倒计时
	const startCountdown = () => {
		countdownTimer.value = setInterval(() => {
			const elapsed = Math.floor((Date.now() - chargeStartTime.value) / 1000)
			remainingWaitTime.value = Math.max(0, 90 - elapsed)
			
			if (remainingWaitTime.value <= 0) {
				clearInterval(countdownTimer.value)
			}
		}, 1000)
	}
	
	// 启动数据刷新定时器
	const startDataRefresh = () => {
		dataRefreshTimer.value = setInterval(() => {
			getChargingBatchDetail()
		}, 15000) // 每15秒刷新一次
	}
	
	// 检查停止充电状态
	const checkStopChargeStatus = () => {
		request({
			url: 'order/checkStopChargeStatus',
			method: 'GET',
			data: { batchNo: form.batchNo },
			success: (res) => {
				if (res.data.code === 200) {
					const status = res.data.data
					// 1-进行中，2-已完成，3-已关闭，4-退款失败
					if (status !== 1) {
						// 停止充电已完成，停止轮询并跳转
						stopCheckingStatus()
						uni.hideLoading()
						
						uni.showToast({
							title: status === 2 ? '充电已完成' : status === 3 ? '充电已关闭' : '退款失败',
							icon: status === 2 ? 'success' : 'none'
						})
						
						setTimeout(() => {
							uni.redirectTo({
								url: `/pages/user/order?batchNo=${form.batchNo}`
							})
						}, 1500)
					}
				}
			},
			fail: (error) => {
				console.error('检查停止状态失败:', error)
				// 继续检查，不中断流程
			}
		})
	}
	
	// 开始检查停止状态（每秒一次）
	const startCheckingStatus = () => {
		stopStatusTimer.value = setInterval(() => {
			checkStopChargeStatus()
		}, 1000)
	}
	
	// 停止检查停止状态
	const stopCheckingStatus = () => {
		if (stopStatusTimer.value) {
			clearInterval(stopStatusTimer.value)
			stopStatusTimer.value = null
		}
		isStoppingCharge.value = false
	}
	
	// 结束充电
	const finish = () => {
		if (!canEndCharge.value) {
			uni.showToast({
				title: `请等待${remainingWaitTime.value}秒后再结束充电`,
				icon: 'none'
			})
			return
		}
		
		uni.showModal({
			title: '确定结束充电？',
			content: '结束充电后将生成充电账单',
			showCancel: true,
			confirmText: '确定结束',
			cancelText: '继续充电',
			success: (res) => {
				if (res.confirm) {
					endCharging()
				}
			}
		})
	}
	
	// 调用结束充电接口
	const endCharging = () => {
		isStoppingCharge.value = true
		
		uni.showLoading({
			title: '正在结束充电...',
			mask: true // 防止用户操作
		})
		
		request({
			url: 'order/endCharging?batchNo='+form.batchNo,
			method: 'POST',
			success: (res) => {
				if (res.data.code === 200) {
					// 调用成功后，开始轮询检查停止状态
					startCheckingStatus()
				} else {
					uni.hideLoading()
					isStoppingCharge.value = false
					uni.showToast({
						title: res.data.msg || '结束充电失败',
						icon: 'none'
					})
				}
			},
			fail: (error) => {
				uni.hideLoading()
				isStoppingCharge.value = false
				console.error('结束充电失败:', error)
				uni.showToast({
					title: '结束充电失败',
					icon: 'none'
				})
			}
		})
	}
	
	// 清理定时器
	const clearTimers = () => {
		if (countdownTimer.value) {
			clearInterval(countdownTimer.value)
			countdownTimer.value = null
		}
		if (dataRefreshTimer.value) {
			clearInterval(dataRefreshTimer.value)
			dataRefreshTimer.value = null
		}
		if (stopStatusTimer.value) {
			clearInterval(stopStatusTimer.value)
			stopStatusTimer.value = null
		}
		isStoppingCharge.value = false
	}
	
	onLoad((options) => {
		// 接收页面参数
		Object.assign(form, options)
		
		// 获取批次详情
		getChargingBatchDetail()
		
		// 启动倒计时
		startCountdown()
		
		// 启动数据刷新轮询
		startDataRefresh()
	})
	
	onShow(() => {
		// 页面显示时重新启动轮询（如果已停止）
		if (!dataRefreshTimer.value && form.batchNo) {
			startDataRefresh()
		}
	})
	
	onHide(() => {
		// 页面隐藏时停止数据轮询以节省资源，但保持停止状态检查
		if (dataRefreshTimer.value) {
			clearInterval(dataRefreshTimer.value)
			dataRefreshTimer.value = null
		}
		// 如果正在停止充电，继续保持状态检查
	})
	
	onUnload(() => {
		// 页面卸载时清理资源
		clearTimers()
	})
	
	onUnmounted(() => {
		// 组件卸载时清理资源
		clearTimers()
	})
</script>
