<template>
	<view class='container'>
		<view class='header'>
			<navbar class='navbar' title='正在充电' v-bind:delta='form.delta'></navbar>
			
			<view class='header-content'>
				<text class='port-title f-db'>{{form.portname}} — {{form.stationName}}</text>
				<view class='device'>
					<view class='fast f-tac f-ib'>
						<image src='../../static/image/slow.png' mode='widthFix'></image>
					</view>
					<text>桩编号：{{form.pileId}}</text>
				</view>
				<view class='power f-tac'>
					<text class='power-per f-ib f-tac'>{{wsform.soc}}</text>%
				</view>
				<view class='time f-tac'>
					<text>剩余时间：</text>
					<van-count-down :time="time" class='f-ib'></van-count-down>
				</view>
			</view>
		</view>
		<view style="margin-top: 200rpx;">
			<view :span='24' class='power-item f-tac'>
				<view class='power-info'>
					<text class='power-value f-fwb'>{{wsform.hasChargePower? parseFloat(wsform.totalFee).toFixed(2) : 0}}</text>度
				</view>
				<text class='power-label f-db'>已充电量</text>
			</view>
		</view>
		<view class='footer'>
			<van-button type='primary' v-on:click='finish'>结束充电</van-button>
		</view>	
	</view>
</template>

<style scoped>
	.container{
		background-color: #ffffff;
		padding-bottom: 200rpx;
		padding-top: 120rpx;
	}
	.header{
		background: url('https://pic.abdl.eu.org/file/fd0527a5bf376971459e5.png') no-repeat;
		background-size: cover;
		padding: 50rpx 0rpx;
	}
	.header-content{
		padding-left: 40rpx;
		padding-right: 40rpx;
	}
	.fast{
		width: 44rpx;
		height: 44rpx;
		line-height: 44rpx;
		background: linear-gradient(96deg, #569AFF, #4A6EF3);
		border-radius: 10rpx;
		margin-right: 14rpx;
	}
	.fast image{
		width: 28rpx;
	}	
	.port-title{
		font-size: 32rpx;
		margin-top: 30rpx;
		margin-bottom: 20rpx;
	}
	.device{
		color: #666;
	}
	.power{
		font-size: 68rpx;
		margin-top: 50rpx;
		margin-bottom: 20rpx;
	}
	.power-per{
		font-size: 120rpx;
	}
	.time{
		font-size: 32rpx;
	}
	.time /deep/ .van-count-down{
		font-size: 32rpx
	}
	.car{
		width: 100%;
	}
	.park{
		background-color: #E2E9F7;
		height: 76rpx;
		line-height: 76rpx;
		border-radius: 38rpx;
		width: calc(90% - 40rpx);
		margin: 0 auto 60rpx auto;
		padding-left: 20rpx;
		padding-right: 20rpx;
	}
	.park-sign{
		height: 46rpx;
		width: 46rpx;
		line-height: 36rpx;
		color: white;
		background-color: #337CEE;
		border-radius: 10rpx;
		margin-right: 20rpx;
		position: relative;
		top: -4rpx;
	}
	.park-label{
		color: #444;
	}
	.power-item{
		line-height: 48rpx;
	}
	.power-value{
		font-size: 40rpx;
	}
	.power-label{
		margin-bottom: 40rpx;
	}
	.footer{
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		background-color: white;
		padding: 20rpx;
	}
	.footer /deep/ .van-button--primary {
		border: 2rpx solid #5F7DF9;
		color: white;
		background: linear-gradient(96deg, #569AFF, #4A6EF3);
		width: calc(100% - 40rpx);
		border-radius: 80rpx;
	}
</style>

<script setup>
	import { ref, reactive } from 'vue'
	import { onLoad, onUnload } from '@dcloudio/uni-app'
	import moment from 'moment'
	import navbar from '../../components/navbar/index.vue'
	import request from '../../components/js/request.js'
	
	const app = getApp()
	const time = ref(0)
	const form = reactive({
	})
	const wsform = reactive({
	})
	const hours = ref(0)
	const minutes = ref(0)
	const socketTask = ref(null)
	
	const wsurl = app.globalData.wsurl
	
	const initsocket = (order) => {
		socketTask.value = uni.connectSocket({
			url: wsurl + order,
			complete: ()=> {}
		})
		uni.onSocketOpen(function (res) {
		  console.log('WebSocket连接已打开！', res)
		})
		uni.onSocketMessage(function (res) {
			const result = JSON.parse(res.data)
			for(let key in result) {
				wsform[key] = result[key]
			}
			time.value = (parseInt(form.hour) * 3600 - wsform.realTimePower) * 1000
			const duration = moment.duration(wsform.realTimePower, 'seconds')
			hours.value = duration.hours()
			minutes.value = duration.minutes()
		})
	}
	
	const finish = () => {
		uni.showModal({
			title: '确定结束充电?',
			showCancel: true,
			success: (res) => {
				if(res.confirm) {
					request({
						url: '/order/endCharge',
						data: form,
						success: res => {
							if(res.data.code == 200) {
								uni.showToast({
									title: '结束成功'
								})
								setTimeout(() => {
									uni.redirectTo({
										url: '/pages/user/order'
									})
								}, 1500)
							}else{
								uni.showToast({
									title: '结束失败',
									icon: 'none'
								})
							}
						}
					})
				}
			}
		})
	}
	
	onLoad((option) => {
		for(let key in option) {
			form[key] = option[key]
		}
		form.delta = parseInt(form.delta)
		initsocket(form.orderNumber)
	})
	onUnload(() => {
		socketTask.value.close({
			success: () => {
				console.log('关闭成功')
			}
		})
	})
</script>
