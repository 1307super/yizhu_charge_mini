<template>
	<view class="container">
		<navbar class='navbar' title='开票说明'></navbar>
		
		<view class="content">
			<view class="section">
				<text class="section-title">开票流程</text>
				<view class="step-list">
					<view class="step-item">
						<view class="step-number">1</view>
						<view class="step-content">
							<text class="step-title">添加发票抬头</text>
							<text class="step-desc">完善公司名称、纳税人识别号等发票信息</text>
						</view>
					</view>
					<view class="step-item">
						<view class="step-number">2</view>
						<view class="step-content">
							<text class="step-title">选择订单</text>
							<text class="step-desc">选择需要开票的充电订单，支持批量选择</text>
						</view>
					</view>
					<view class="step-item">
						<view class="step-number">3</view>
						<view class="step-content">
							<text class="step-title">提交申请</text>
							<text class="step-desc">确认订单信息和发票抬头，提交开票申请</text>
						</view>
					</view>
					<view class="step-item">
						<view class="step-number">4</view>
						<view class="step-content">
							<text class="step-title">等待开票</text>
							<text class="step-desc">我们将在1-3个工作日内完成开票</text>
						</view>
					</view>
					<view class="step-item">
						<view class="step-number">5</view>
						<view class="step-content">
							<text class="step-title">下载发票</text>
							<text class="step-desc">开票完成后，可在开票历史中下载PDF发票</text>
						</view>
					</view>
				</view>
			</view>
			
			<view class="section">
				<text class="section-title">开票要求</text>
				<view class="requirement-list">
					<view class="requirement-item">
						<text class="requirement-icon">•</text>
						<text class="requirement-text">发票抬头信息必须真实有效，请确保公司名称和纳税人识别号准确无误</text>
					</view>
					<view class="requirement-item">
						<text class="requirement-icon">•</text>
						<text class="requirement-text">只能对已完成的充电订单申请开票，未完成或已退款订单无法开票</text>
					</view>
					<view class="requirement-item">
						<text class="requirement-icon">•</text>
						<text class="requirement-text">每个订单只能开票一次，已开票订单无法重复申请</text>
					</view>
					<view class="requirement-item">
						<text class="requirement-icon">•</text>
						<text class="requirement-text">发票类型为增值税普通发票，开票内容为"充电服务费"</text>
					</view>
				</view>
			</view>
			
			<view class="section">
				<text class="section-title">开票时间</text>
				<view class="time-info">
					<view class="time-item">
						<text class="time-label">申请时间：</text>
						<text class="time-desc">7×24小时随时可申请</text>
					</view>
					<view class="time-item">
						<text class="time-label">开票时间：</text>
						<text class="time-desc">工作日1-3个工作日内完成</text>
					</view>
					<view class="time-item">
						<text class="time-label">节假日：</text>
						<text class="time-desc">节假日申请将顺延至工作日处理</text>
					</view>
				</view>
			</view>
			
			<view class="section">
				<text class="section-title">注意事项</text>
				<view class="notice-list">
					<view class="notice-item important">
						<text class="notice-icon">⚠️</text>
						<text class="notice-text">发票一经开出，不支持修改或重开，请确认信息无误后再提交申请</text>
					</view>
					<view class="notice-item">
						<text class="notice-icon">📧</text>
						<text class="notice-text">发票开出后，电子发票PDF将通过系统消息通知您下载</text>
					</view>
					<view class="notice-item">
						<text class="notice-icon">💾</text>
						<text class="notice-text">请及时下载并保存发票PDF文件，系统仅保存6个月</text>
					</view>
					<view class="notice-item">
						<text class="notice-icon">📞</text>
						<text class="notice-text">如有疑问，请联系客服：400-000-0000</text>
					</view>
				</view>
			</view>
			
			<view class="section">
				<text class="section-title">常见问题</text>
				<view class="faq-list">
					<view class="faq-item">
						<text class="faq-question">Q: 可以开具增值税专用发票吗？</text>
						<text class="faq-answer">A: 目前仅支持开具增值税普通发票，暂不支持专用发票。</text>
					</view>
					<view class="faq-item">
						<text class="faq-question">Q: 发票金额与实际支付金额不符怎么办？</text>
						<text class="faq-answer">A: 发票金额以实际充电消费金额为准，如有疑问请联系客服核实。</text>
					</view>
					<view class="faq-item">
						<text class="faq-question">Q: 可以修改已提交的发票抬头吗？</text>
						<text class="faq-answer">A: 申请提交后无法修改，如需修改请重新提交新的开票申请。</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<style scoped>
.container {
	background-color: #f6f6f6;
	min-height: 100vh;
	padding-top: 130rpx;
}

.content {
	padding: 30rpx;
}

.section {
	background-color: white;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.section-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 30rpx;
	display: block;
}

/* 步骤列表 */
.step-list {
	position: relative;
}

.step-item {
	display: flex;
	align-items: flex-start;
	margin-bottom: 40rpx;
	position: relative;
}

.step-item:last-child {
	margin-bottom: 0;
}

.step-item:not(:last-child)::after {
	content: '';
	position: absolute;
	left: 34rpx;
	top: 70rpx;
	width: 2rpx;
	height: 40rpx;
	background-color: #e5e5e5;
}

.step-number {
	width: 68rpx;
	height: 68rpx;
	border-radius: 50%;
	background-color: #2D55E8;
	color: white;
	font-size: 28rpx;
	font-weight: bold;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 24rpx;
	flex-shrink: 0;
}

.step-content {
	flex: 1;
	padding-top: 8rpx;
}

.step-title {
	display: block;
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 8rpx;
}

.step-desc {
	font-size: 26rpx;
	color: #666;
	line-height: 1.6;
}

/* 要求列表 */
.requirement-list {
	/* 内容样式 */
}

.requirement-item {
	display: flex;
	align-items: flex-start;
	margin-bottom: 24rpx;
}

.requirement-item:last-child {
	margin-bottom: 0;
}

.requirement-icon {
	color: #2D55E8;
	font-size: 28rpx;
	margin-right: 16rpx;
	line-height: 1.6;
}

.requirement-text {
	flex: 1;
	font-size: 28rpx;
	color: #333;
	line-height: 1.6;
}

/* 时间信息 */
.time-info {
	/* 内容样式 */
}

.time-item {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.time-item:last-child {
	margin-bottom: 0;
}

.time-label {
	font-size: 28rpx;
	color: #666;
	font-weight: bold;
	width: 160rpx;
}

.time-desc {
	flex: 1;
	font-size: 28rpx;
	color: #333;
}

/* 注意事项 */
.notice-list {
	/* 内容样式 */
}

.notice-item {
	display: flex;
	align-items: flex-start;
	margin-bottom: 24rpx;
	padding: 20rpx;
	background-color: #f8f9fa;
	border-radius: 12rpx;
}

.notice-item:last-child {
	margin-bottom: 0;
}

.notice-item.important {
	background-color: #fff7e6;
	border: 1rpx solid #ffd591;
}

.notice-icon {
	font-size: 28rpx;
	margin-right: 16rpx;
	line-height: 1.6;
}

.notice-text {
	flex: 1;
	font-size: 26rpx;
	color: #333;
	line-height: 1.6;
}

/* FAQ列表 */
.faq-list {
	/* 内容样式 */
}

.faq-item {
	margin-bottom: 30rpx;
	padding-bottom: 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.faq-item:last-child {
	margin-bottom: 0;
	padding-bottom: 0;
	border-bottom: none;
}

.faq-question {
	display: block;
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 12rpx;
}

.faq-answer {
	font-size: 26rpx;
	color: #666;
	line-height: 1.6;
}
</style>

<script setup>
import navbar from '../../components/navbar/index.vue'

// 此页面为纯展示页面，无需额外逻辑
</script>