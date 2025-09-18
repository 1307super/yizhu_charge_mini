<template>
	<view class='container'>
		<!-- 全屏背景图 -->
		<image class='bg-image' src='../../static/image/login-bg.jpg' mode='aspectFill'></image>
		
		<navbar class='navbar' title='登录'></navbar>
		
		<view class='content'>
			<text class='subtitle f-db f-tac'>让充电更简单</text>
			
			<button 
				type='primary' 
				:open-type="agreed ? 'getPhoneNumber|agreePrivacyAuthorization' : ''" 
				@getphonenumber="getPhoneNumber"
				@click="handleLoginClick"
				class="login-button"
			>
				手机号快捷登录
			</button>
			
			<!-- 协议勾选 -->
			<view class='agreement-section' :class="{ 'shake': shouldShake }">
				<view class='agreement-checkbox' @click="toggleAgreement">
					<radio :checked="agreed" color="#5086F9" style="transform: scale(0.7);" />
					<text class='agreement-text'>
						我已阅读并同意
						<text class='link' @click.stop="viewUserAgreement">《用户协议》</text>
						与
						<text class='link' @click.stop="viewPrivacyPolicy">《隐私保护协议》</text>
					</text>
				</view>
			</view>
		</view>
	</view>
</template>

<style scoped>
	.container {
		position: relative;
		height: 100vh;
		overflow: hidden;
	}
	
	.bg-image {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 1;
	}
	
	.navbar {
		position: relative;
		z-index: 10;
	}
	
	.content {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 5;
		padding: 40rpx 60rpx 60rpx 60rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.subtitle {
		font-size: 28rpx;
		color: #666;
		margin-bottom: 80rpx;
	}
	
	.login-button {
		width: 100%;
		height: 96rpx;
		background: linear-gradient(135deg, #5086F9, #4C70E3);
		border-radius: 48rpx;
		border: none;
		color: white;
		font-size: 32rpx;
		font-weight: 500;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 40rpx;
		box-shadow: 0 8rpx 20rpx rgba(80, 134, 249, 0.3);
		transition: all 0.3s ease;
	}
	
	.login-button:active {
		transform: scale(0.95);
		box-shadow: 0 4rpx 12rpx rgba(80, 134, 249, 0.4);
	}
	
	.agreement-section {
		width: 100%;
		padding: 0 20rpx;
		transition: transform 0.1s ease;
	}
	
	.shake {
		animation: shake 0.5s ease-in-out;
	}
	
	@keyframes shake {
		0%, 100% { transform: translateX(0); }
		25% { transform: translateX(-10rpx); }
		75% { transform: translateX(10rpx); }
	}
	
	.agreement-checkbox {
		display: flex;
		align-items: center;
		gap: 12rpx;
		padding: 20rpx 0;
	}
	
	.agreement-text {
		font-size: 24rpx;
		color: #666;
		line-height: 1.5;
		flex: 1;
	}
	
	.link {
		color: #5086F9;
	}
</style>

<script setup>
	import { ref, onMounted } from 'vue'
	import navbar from '../../components/navbar/index.vue'
	
	const app = getApp()
	const agreed = ref(false)
	const shouldShake = ref(false)
	
	// 切换协议同意状态
	const toggleAgreement = () => {
		agreed.value = !agreed.value
	}
	
	// 查看用户协议
	const viewUserAgreement = () => {
		uni.navigateTo({
			url: '/pages/user/user-agreement'
		})
	}
	
	// 查看隐私保护协议
	const viewPrivacyPolicy = () => {
		uni.navigateTo({
			url: '/pages/user/privacy-policy'
		})
	}
	
	// 处理登录按钮点击
	const handleLoginClick = () => {
		// 如果未同意协议，显示提示并抖动
		if (!agreed.value) {
			uni.showToast({
				title: '请阅读并同意用户协议及隐私保护协议',
				icon: 'none',
				duration: 2000
			})
			triggerShake()
			return
		}
		// 如果已同意协议，open-type会自动触发授权
	}
	
	// 触发抖动动画
	const triggerShake = () => {
		shouldShake.value = true
		setTimeout(() => {
			shouldShake.value = false
		}, 500)
	}
	
	const getPhoneNumber = (e) => {
		// 此时用户已经同意协议并完成了手机号授权
		if (e.detail.code) {
			uni.login({
				provider: 'weixin',
				success: res => {
					const params = {}
					params.code = res.code
					uni.getUserInfo({
						provider: 'weixin', 
						success: (loginRes) => {
							if (loginRes && loginRes.errMsg == "getUserInfo:ok") {
								params.encryptedData = loginRes.encryptedData
								params.iv = loginRes.iv
								login(params, e)
							}
						},
						fail: function(err) {
						}
					})
				}
			})
		}
	}
	
	const redirecturl = uni.getStorageSync('redirecturl')
	const login = (params, e) => {
		uni.request({
			url: app.globalData.serverUrl + 'v1/auth/login',
			method: 'POST',
			header: {
			  'content-type': 'application/x-www-form-urlencoded'
			},
			data: {
				appid: app.globalData.appid,
				code: params.code
			},
			success: res => {
				if(res.data.code == 200) {
					uni.setStorageSync('token', res.data.data.token)
					uni.setStorageSync('user', res.data.data.member)
					uni.request({
						url: app.globalData.serverUrl + 'v1/auth/appletBindMobile',
						method: 'GET',
						data: {
							appid: app.globalData.appid,
							code: e.detail.code,
							openId: res.data.data.member.weixinOpenid
						},
						success: res1 => {
							uni.setStorageSync('phone', res1.data.data.mobile)
							uni.showToast({
								title: '登录成功'
							})
							setTimeout(() => {
								if(redirecturl) {
									uni.removeStorageSync('redirecturl')
									uni.redirectTo({
										url: redirecturl
									})
								}else{
									uni.redirectTo({
										url: '/pages/user/index'
									})
								}
							}, 1500)
						}
					})
				}
			}
		})
	}
	
	onMounted(() => {
	})
</script>
