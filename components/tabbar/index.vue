<template>
	<view class='tabbar'>
		<van-row>
			<van-col :span='1'>
				&nbsp;
			</van-col>
			<van-col :span='7' class='f-tac'>
				<view v-on:click='go("/pages/index/index")'>
					<image v-bind:src='active == 0 ? home.active : home.default' class='tabbar-icon'></image>
					<text class='f-db' v-bind:class='active == 0 ? "text-active" : "text-default"'>首页</text>
				</view>
			</van-col>
			<van-col :span='8' class='f-tac'>
				<view class='scan' v-on:click="scan">
					<image class='scan-pic' src='../../static/image/scan.png' mode='widthFix'></image>
				</view>
			</van-col>
			<van-col :span='7' class='f-tac'>
				<view v-on:click='go("/pages/user/index")'>
					<image v-bind:src="active == 1 ? user.active : user.default"  class='tabbar-icon'/>
					<text class='f-db' v-bind:class='active == 1 ? "text-active" : "text-default"'>我的</text>
				</view>
			</van-col>
			<van-col :span='1'>
				&nbsp;
			</van-col>
		</van-row>
	</view>
</template>

<style scoped>
	.tabbar{
		background: url('../../static/image/tabbar.png') no-repeat;
		background-size: 100%;
		position: fixed;
		left: -10rpx;
		bottom: -10rpx;
		z-index: 2;
		width: calc(100% + 20rpx);
		height: 160rpx;
		font-size: 24rpx;
	}
	.tabbar-icon{
		width: 40rpx;
		height: 42rpx;
		margin-top: 50rpx;
	}
	.text-active{
		color: #2455E1;
	}
	.text-default{
		color: #666;
	}
	.scan{
		background: url('../../static/image/circle.png') center bottom no-repeat;
		width: 125rpx;
		height: 106rpx;
		background-size: 100%;
		margin: 30rpx auto 0 auto;
		position: relative;
	}
	.scan-pic{
		width: 40rpx;
		position: absolute;
		top: 18rpx;
		left: 51.5%;
		transform: translateX(-50%);
	}
</style>

<script setup>
	import { ref } from 'vue'
	import { defineProps } from 'vue'
	
	const props = defineProps({
	  active: Number
	})
	const home = {
		active: '../../static/image/home-active.png',
		default: '../../static/image/home-default.png'
	}
	const user = {
		active: '../../static/image/user-active.png',
		default: '../../static/image/user-default.png'
	}
	
	const go = (url) => {
		uni.redirectTo({
			url: url
		})
	}
	const scan = () => {
		uni.scanCode({
			success: function (res) {
				go("/pages/station/create?key=" + res.result)
			}
		})
	}
</script>
