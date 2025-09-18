<template>
	<view class="container">
		<view class='header'>
			<navbar class='navbar' title='我的' v-bind:showarrow='false'></navbar>
			<view class='user'>
				<view class='user-main'>
					<image src='../../static/image/avatar.png' mode='widthFix' class='avatar f-ib'></image>
					<text v-if='token' class='phone f-fwb f-ib f-vat'>{{phone}}</text>
					<text v-else class='phone f-fwb f-ib f-vat' v-on:click='go("/pages/user/login")'>请登录</text>
				</view>
				<image v-on:click='goabort("/pages/user/setting")' src='../../static/image/setting.png' mode='widthFix' class='setting'></image>
			</view>
			<view v-if='enterpriseWallet.walletBalance !== null' class='charge'>
				<view class='enterprise-wallet'>
					<text class='wallet-title'>企业钱包</text>
					<view class='wallet-info'>
						<view class='wallet-balance'>
							<text class='balance-amount'>¥{{enterpriseWallet.walletBalance.toFixed(2)}}</text>
							<text class='balance-label'>可用余额</text>
						</view>
						<view class='wallet-accounting'>
							<text class='accounting-amount'>¥{{((enterpriseWallet.accountingAmount || 0) - (enterpriseWallet.consumedAmount || 0)).toFixed(2)}}</text>
							<text class='accounting-label'>记账余额</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class='content'>
			<view class='order' v-on:click='goabort("/pages/user/order")'>
				<image src='../../static/image/订单-1.png' mode="widthFix" class='order-icon'></image>
				<text class='order-label'>充电订单</text>
				<image src='../../static/image/arrow.png' mode="widthFix" class='arrow'></image>
			</view>
			
			<view class='order' v-on:click='goabort("/pages/user/invoice")'>
				<image src='../../static/image/发票抬头.png' mode="widthFix" class='order-icon'></image>
				<text class='order-label'>开票管理</text>
				<image src='../../static/image/arrow.png' mode="widthFix" class='arrow'></image>
			</view>
			
			<view class="power">
				<text class='power-title f-db'>您本月充电情况</text>
				<van-row class='f-tac'>
					<van-col :span='12'>
						<view class='power-hd'>
							<text class='power-value f-fwb'>{{month.totalChargeDegree || 0}}</text>度
						</view>
						<text class='power-label f-db'>充电度数</text>
					</van-col>
					<van-col :span='12'>
						<view class='cash-wrapper'>
							<text class='line f-ib'></text>
							<view class='cash f-ib'>
								<view class='power-hd'>
									<text class='power-value f-fwb'>{{month.totalChargeAmount || 0}}</text>元
								</view>
								<text class='power-label f-db'>充电金额</text>
							</view>
							<text class='line f-ib'></text>
						</view>
					</van-col>
					<!-- <van-col :span='8'>
						<view class='power-hd'>
							<text class='power-value f-fwb'>{{month.chargeTime || 0}}</text>小时
						</view>
						<text class='power-label f-db'>充电时长</text>
					</van-col> -->
				</van-row>
			</view>
		</view>
	</view>
	<tabbar v-bind:active='1'></tabbar>
</template>

<style scoped>
	.container{
		background-color: #f6f6f6;
		min-height: 100vh;
	}
	.header{
		background: linear-gradient(-36deg, #E3E8FF, #FFF7F7);
		padding-left: 30rpx;
		padding-right: 30rpx;
		padding-top: 140rpx;
	}
	.user{
		display: flex;
	}
	.user-main{
		flex: 1;
	}
	.avatar{
		width: 120rpx;
		margin-right: 30rpx;
	}
	.phone{
		line-height: 120rpx;
	}
	.setting{
		width: 40rpx;
		margin-top: 40rpx;
	}
	.charge{
		background: linear-gradient(264deg, #5086F9, #5278FC, #5470FE, #5569FF);
		border-radius: 20rpx 20rpx 0px 0px;
		color: white;
		margin-top: 30rpx;
		padding: 40rpx 30rpx 30rpx;
	}
	.enterprise-wallet{
		width: 100%;
	}
	.wallet-title{
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 30rpx;
		display: block;
		text-align: center;
	}
	.wallet-info{
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	.wallet-balance, .wallet-accounting{
		text-align: center;
		flex: 1;
	}
	.balance-amount, .accounting-amount{
		display: block;
		font-size: 36rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}
	.balance-label, .accounting-label{
		font-size: 26rpx;
		opacity: 0.9;
	}
	.content{
		padding-left: 30rpx;
		padding-right: 30rpx;
	}
	.order{
		background-color: white;
		border-radius: 25rpx;
		display: flex;
		padding: 30rpx;
		margin-top: 30rpx;
	}
	.order-icon{
		width: 45rpx;
		height: 50rpx;
		margin-right: 15rpx;
	}
	.order-label{
		flex: 1;
		height: 50rpx;
		line-height: 50rpx;
	}
	.arrow{
		width: 20rpx;
		margin-top: 4rpx;
	}
	.power{
		background-color: white;
		padding: 30rpx;
		border-radius: 25rpx;
		margin-top: 30rpx;
	}
	.power-title{
		margin-bottom: 30rpx;
	}
	.power-value{
		font-size: 36rpx;
	}
	.power-label{
		color: #888;
		margin-top: 20rpx;
	}
</style>

<script setup>
	import { ref, onMounted, reactive } from 'vue'
	import navbar from '../../components/navbar/index.vue'
	import tabbar from '../../components/tabbar/index.vue'
	import request from '../../components/js/request.js'
	
	const app = getApp()
	const token = uni.getStorageSync('token')
	const user = uni.getStorageSync('user')
	const phone = uni.getStorageSync('phone')
	
	const month = reactive({})
	const getmonth = () => {
		request({
			url: 'me/monthlyChargeStats',
			method: 'GET',
			success: res => {
				for(let key in res.data.data) {
					month[key] = res.data.data[key]
				}
			}
		})
	}
	
	// 企业钱包信息
	const enterpriseWallet = reactive({
		enterpriseName: null,
		walletBalance: null,
		accountingAmount: null,
		consumedAmount: null,
		minLimit: null
	})
	
	// 获取企业钱包信息
	const getEnterpriseWallet = () => {
		request({
			url: 'me/getEnterpriseWallet',
			method: 'GET',
			success: (res) => {
				if (res.data.code === 200 && res.data.data) {
					Object.assign(enterpriseWallet, res.data.data)
				}
			},
			fail: (error) => {
				console.log('企业钱包信息获取失败')
			}
		})
	}
	
	const go = (url) => {
		uni.navigateTo({
			url: url
		})
	}
	const goabort = (url) => {
		if(token) {
			go(url)
		}else{
			uni.showToast({
				title: '请先登录',
				icon: 'none',
				duration: 2000
			})
			setTimeout(() => {
				uni.navigateTo({
					url: '/pages/user/login'
				})
			}, 1000)
		}
	}
	
	onMounted(() => {
		if(token) {
			getmonth()
			getEnterpriseWallet()
		}
	})
</script>
