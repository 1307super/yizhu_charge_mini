<template>
	<view class="container">
		<navbar class='navbar' title='开票说明'></navbar>
		
		<view class="content">
			<view class="section">
				<view class="greeting-text">
					<text class="greeting">尊敬的客户，您好！</text>
					<text class="intro">很高兴为您提供开票服务。请您仔细阅读以下事项：</text>
				</view>
				<view class="notice-list">
					<view class="notice-item">
						<text class="notice-number">1.</text>
						<text class="notice-text">充电订单的开票金额仅支持近12个月内的实际支付金额，不包含优惠抵扣及折扣部分。</text>
					</view>
					<view class="notice-item">
						<text class="notice-number">2.</text>
						<text class="notice-text">开票页面仅展示通过微信支付的订单，您可在"开票历史"中查看已开票记录。物流企业账户的充电订单需由对应公司申请开票。</text>
					</view>
					<view class="notice-item">
						<text class="notice-number">3.</text>
						<text class="notice-text">订单支持开具增值税专用发票和普通发票，均为电子发票。电子发票一经开出，无法更换为纸质发票。</text>
					</view>
					<view class="notice-item">
						<text class="notice-number">4.</text>
						<text class="notice-text">提交开票申请后，我们将在7个工作日内完成开具。</text>
					</view>
				</view>
				<view class="closing-text">
					<text class="closing">如您有任何疑问，欢迎随时咨询，我们将竭诚为您服务！</text>
				</view>
			</view>
		</view>
	</view>
</template>

<style scoped>
.container {
	background-color: #f6f6f6;
	min-height: 100vh;
	padding-top: 180rpx;
}

.content {
	padding: 30rpx;
}

.section {
	background-color: white;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

/* 问候语 */
.greeting-text {
	margin-bottom: 30rpx;
}

.greeting {
	display: block;
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 16rpx;
}

.intro {
	display: block;
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
	margin-bottom: 30rpx;
}

/* 编号列表 */
.notice-list {
	margin-bottom: 30rpx;
}

.notice-item {
	display: flex;
	align-items: flex-start;
	margin-bottom: 24rpx;
}

.notice-item:last-child {
	margin-bottom: 0;
}

.notice-number {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	margin-right: 16rpx;
	line-height: 1.6;
	flex-shrink: 0;
}

.notice-text {
	flex: 1;
	font-size: 28rpx;
	color: #333;
	line-height: 1.6;
}

/* 结语 */
.closing-text {
	padding: 20rpx 0;
}

.closing {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
}
</style>

<script setup>
import navbar from '../../components/navbar/index.vue'

// 此页面为纯展示页面，无需额外逻辑
</script>