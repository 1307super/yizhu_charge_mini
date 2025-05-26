<template>
	<view class='container'>
		<navbar class='navbar' title='登录'></navbar>
		<text class='title f-db f-tac'>欢迎回来</text>
		<swiper class="swiper" circular indicator-dots autoplay :interval="5000" indicator-active-color="#4C70E3" indicator-color="#EAEAEA" height='200'>
			<swiper-item>
				<text class='f-db f-tac'>让充电更简单</text>
			</swiper-item>
			<swiper-item>
				<text class='f-db f-tac'>充电情况实时掌握</text>
			</swiper-item>
		</swiper>
		<button type='primary' open-type="getPhoneNumber|agreePrivacyAuthorization" @getphonenumber="getPhoneNumber" class="button">手机号快捷登录</button>
	</view>
</template>

<style scoped>
	.container{
		background-color: #f6f6f6;
		padding-top: 150rpx;
		height: 100vh;
	}
	.title{
		font-size: 36rpx;
		margin-top: 100rpx;
	}
	.swiper{
		color: #999;
		margin-top: 40rpx;
		height: 120rpx;
	}
	.button{
		width: 90%;
		margin: 60rpx auto;
	}
</style>

<script setup>
	import { onMounted } from 'vue'
	import navbar from '../../components/navbar/index.vue'
	const app = getApp()
	
	const getPhoneNumber = (e) => {
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
