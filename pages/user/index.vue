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
			<view class='charge'>
				<van-row class='f-tac'>
					<van-col :span='8'>
						<text class='charge-value f-db f-fwb'>{{balance}}</text>
						<text class='charge-label f-db'>余额</text>
					</van-col>
					<van-col :span='8'>
						<view class='cash-wrapper'>
							<text class='line f-ib'></text>
							<view class='cash f-ib'>
								<text class='charge-value f-db f-fwb'>0</text>
								<text class='charge-label f-db'>代金券</text>
							</view>
							<text class='line f-ib'></text>
						</view>
					</van-col>
					<van-col :span='8'>
						<text class='charge-value f-db f-fwb'>{{score}}</text>
						<text class='charge-label f-db'>积分</text>
					</van-col>
				</van-row>
			</view>
		</view>
		<view class='content'>
			<view class='order' v-on:click='goabort("/pages/user/order")'>
				<text class='order-label'>充电订单</text>
				<image src='../../static/image/arrow.png' mode="widthFix" class='arrow'></image>
			</view>
			<view class="power">
				<text class='power-title f-db'>您本月充电情况</text>
				<van-row class='f-tac'>
					<van-col :span='8'>
						<view class='power-hd'>
							<text class='power-value f-fwb'>{{month.chargeDegree || 0}}</text>度
						</view>
						<text class='power-label f-db'>充电度数</text>
					</van-col>
					<van-col :span='8'>
						<view class='cash-wrapper'>
							<text class='line f-ib'></text>
							<view class='cash f-ib'>
								<view class='power-hd'>
									<text class='power-value f-fwb'>{{month.chargeAmount || 0}}</text>元
								</view>
								<text class='power-label f-db'>充电金额</text>
							</view>
							<text class='line f-ib'></text>
						</view>
					</van-col>
					<van-col :span='8'>
						<view class='power-hd'>
							<text class='power-value f-fwb'>{{month.chargeTime || 0}}</text>小时
						</view>
						<text class='power-label f-db'>充电时长</text>
					</van-col>
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
		padding-top: 180rpx;
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
		padding-top: 40rpx;
		padding-bottom: 30rpx;
	}
	.charge-value{
		font-size: 36rpx;
		margin-bottom: 10rpx;
	}
	.cash-wrapper{
		display: flex;
	}
	.cash{
		flex: 1;
	}
	.line{
		background-color: #ddd;
		height: 40rpx;
		width: 2rpx;
		margin-top: 40rpx;
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
	.order-label{
		flex: 1;
		background: url('https://pic.abdl.eu.org/file/45323f1e74c9eccb77e37.png') left no-repeat;
		background-size: 45rpx 50rpx;
		padding-left: 60rpx;
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
	const score = ref(0)
	const getscore = () => {
		request({
			url: '/me/getUserCredit',
			data: {
				userId: user.memberId
			},
			success: res => {
				score.value = res.data.data.credit
			}
		})
	}
	
	const month = reactive({})
	const getmonth = () => {
		request({
			url: 'me/queryMonthTotalByUserId',
			data: {
				userId: user.memberId
			},
			success: res => {
				for(let key in res.data.data) {
					month[key] = res.data.data[key]
				}
			}
		})
	}
	
	const balance = ref(0)
	const getbalance = () => {
		request({
			url: '/me/getMemberBalanceByUserId',
			data: {
				userId: user.memberId
			},
			success: res => {
				balance.value = res.data.data.amount
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
				title: '您还未登录，请先登录',
				icon: 'none'
			})
		}
	}
	
	onMounted(() => {
		if(token) {
			getscore()
			getbalance()
			getmonth()
		}
	})
</script>
