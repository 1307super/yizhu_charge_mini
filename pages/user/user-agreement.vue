<template>
	<view class="container">
		<navbar class="navbar" title="用户协议"></navbar>
		
		<view class="content">
			<view class="agreement-content">
				<text class="title">用户协议</text>
				
				<view class="section">
					<text class="section-title">1. 服务条款的确认和接纳</text>
					<text class="section-content">
						欢迎使用吉运超充服务！本协议是您与吉运超充之间关于您使用吉运超充服务所订立的协议。请您仔细阅读本协议，您点击"同意"按钮后，本协议即构成对双方有约束力的法律文件。
					</text>
				</view>
				
				<view class="section">
					<text class="section-title">2. 服务说明</text>
					<text class="section-content">
						吉运超充为用户提供电动汽车充电服务，包括但不限于：
						- 充电站位置查询和导航
						- 在线充电预约和支付
						- 充电过程监控和管理
						- 充电历史记录查询
						- 客户服务支持
					</text>
				</view>
				
				<view class="section">
					<text class="section-title">3. 用户注册</text>
					<text class="section-content">
						为了能够使用本服务，您需要注册成为吉运超充的用户。您应当提供真实、准确、完整的个人信息，并及时更新注册信息。您应当妥善保管您的账户信息，对于因您的疏忽导致的账户信息泄露，吉运超充不承担责任。
					</text>
				</view>
				
				<view class="section">
					<text class="section-title">4. 服务使用规范</text>
					<text class="section-content">
						您在使用吉运超充服务时，应当：
						- 遵守相关法律法规
						- 不损害吉运超充及其他用户的合法权益
						- 不传播违法、有害信息
						- 正确使用充电设备，确保安全
						- 按时支付相关费用
					</text>
				</view>
				
				<view class="section">
					<text class="section-title">5. 隐私保护</text>
					<text class="section-content">
						我们高度重视您的隐私保护，会按照相关法律法规和本公司隐私政策处理您的个人信息。具体内容请参阅《隐私保护协议》。
					</text>
				</view>
				
				<view class="section">
					<text class="section-title">6. 免责声明</text>
					<text class="section-content">
						在法律允许的范围内，因以下原因造成的服务中断或其他缺陷，吉运超充不承担责任：
						- 系统停机维护
						- 电信设备出现故障
						- 因台风、地震、海啸、洪水、停电、战争、恐怖袭击等不可抗力因素
						- 病毒、木马、恶意程序攻击、网络拥堵、系统不稳定等
					</text>
				</view>
				
				<view class="section">
					<text class="section-title">7. 协议修改</text>
					<text class="section-content">
						吉运超充有权根据需要不时地制订、修改本协议及相关规则。如本协议有任何变更，我们会在服务平台上公布修改内容。如果您不同意相关变更，应当停止使用吉运超充服务。
					</text>
				</view>
				
				<view class="section">
					<text class="section-title">8. 其他</text>
					<text class="section-content">
						本协议的订立、执行和解释及争议的解决均应适用中华人民共和国法律。如双方就本协议内容或其执行发生任何争议，双方应尽量友好协商解决；协商不成时，任何一方均可向有管辖权的人民法院提起诉讼。
					</text>
				</view>
			</view>
		</view>
	</view>
</template>

<style scoped>
	.container {
		background-color: #f6f6f6;
		min-height: 100vh;
		padding-top: 140rpx;
	}
	
	.content {
		padding: 40rpx 30rpx;
	}
	
	.agreement-content {
		background: white;
		border-radius: 20rpx;
		padding: 40rpx 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}
	
	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		text-align: center;
		display: block;
		margin-bottom: 40rpx;
	}
	
	.section {
		margin-bottom: 30rpx;
	}
	
	.section-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #333;
		display: block;
		margin-bottom: 15rpx;
		line-height: 1.4;
	}
	
	.section-content {
		font-size: 26rpx;
		color: #666;
		line-height: 1.6;
		display: block;
		text-indent: 0;
		white-space: pre-line;
	}
</style>

<script setup>
	import navbar from '../../components/navbar/index.vue'
</script>