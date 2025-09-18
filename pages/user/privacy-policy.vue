<template>
	<view class="container">
		<navbar class="navbar" title="隐私保护协议"></navbar>
		
		<view class="content">
			<view class="agreement-content">
				<text class="title">隐私保护协议</text>
				
				<view class="section">
					<text class="section-title">引言</text>
					<text class="section-content">
						吉运超充深知个人信息对您的重要性，并会尽全力保护您的个人信息安全可靠。我们致力于维持您对我们的信任，恪守以下原则，保护您的个人信息：权责一致原则、目的明确原则、选择同意原则、最少够用原则、确保安全原则、主体参与原则、公开透明原则等。
					</text>
				</view>
				
				<view class="section">
					<text class="section-title">1. 我们收集的信息</text>
					<text class="section-content">
						为了向您提供优质的充电服务，我们可能会收集以下信息：
						
						1.1 账户信息
						- 手机号码（用于注册和登录）
						- 微信授权信息（昵称、头像等）
						
						1.2 设备信息
						- 设备型号、操作系统版本
						- 网络信息、IP地址
						- 位置信息（用于充电站导航）
						
						1.3 使用信息
						- 充电记录、消费记录
						- 服务使用偏好
						- 客服沟通记录
					</text>
				</view>
				
				<view class="section">
					<text class="section-title">2. 信息使用目的</text>
					<text class="section-content">
						我们会基于以下目的使用您的个人信息：
						
						2.1 提供充电服务
						- 充电站查找和导航
						- 充电预约和管理
						- 费用结算和支付
						
						2.2 改善用户体验
						- 分析使用习惯，优化产品功能
						- 推荐合适的充电站和服务
						
						2.3 安全保障
						- 账户安全验证
						- 防范欺诈和滥用行为
						- 系统安全监控
					</text>
				</view>
				
				<view class="section">
					<text class="section-title">3. 信息共享与披露</text>
					<text class="section-content">
						我们不会向任何第三方出售您的个人信息。在以下情况下，我们可能会共享您的信息：
						
						3.1 经您明确同意
						3.2 为提供您所需的服务
						3.3 履行法律义务或配合政府监管
						3.4 维护公共安全或他人合法权益
						3.5 与我们的关联公司、服务提供商共享（仅限必要范围）
					</text>
				</view>
				
				<view class="section">
					<text class="section-title">4. 信息存储与保护</text>
					<text class="section-content">
						4.1 存储地点：您的信息将存储在中华人民共和国境内
						
						4.2 存储期限：除法律法规另有规定外，我们仅在为实现目的所必需的期间内保留您的个人信息
						
						4.3 安全措施：
						- 数据加密传输和存储
						- 访问权限控制
						- 定期安全审计
						- 员工保密培训
					</text>
				</view>
				
				<view class="section">
					<text class="section-title">5. 您的权利</text>
					<text class="section-content">
						您对自己的个人信息享有以下权利：
						
						5.1 知情权：了解我们收集、使用您个人信息的情况
						5.2 决定权：选择是否提供个人信息
						5.3 查询权：查询我们收集的您的个人信息
						5.4 更正权：更正不准确的个人信息
						5.5 删除权：要求删除您的个人信息
						5.6 投诉举报权：向监管部门投诉举报
					</text>
				</view>
				
				<view class="section">
					<text class="section-title">6. 未成年人保护</text>
					<text class="section-content">
						我们非常重视对未成年人个人信息的保护。若您是18周岁以下的未成年人，建议您请您的父母或监护人仔细阅读本隐私政策，并在征得您的父母或监护人同意后使用我们的服务或向我们提供信息。
					</text>
				</view>
				
				<view class="section">
					<text class="section-title">7. 联系我们</text>
					<text class="section-content">
						如您对本隐私政策有任何疑问、建议或投诉，请通过以下方式联系我们：
						
						客服电话：400-123-4567
						客服邮箱：service@jycc.com
						
						我们将在收到您的反馈后尽快回复您。
					</text>
				</view>
				
				<view class="section">
					<text class="section-title">8. 政策更新</text>
					<text class="section-content">
						我们可能会适时对本隐私政策进行修订。当隐私政策发生变更时，我们会在版本更新时以推送通知、弹窗的形式向您展示变更后的隐私政策，以便您及时了解本隐私政策的最新版本。
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