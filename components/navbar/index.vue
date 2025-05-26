<template>
	<view class='bar f-tac'>
		<view class='bar-main f-pr'>
			<van-icon name="arrow-left" size='20px' class='icon' v-if='showarrow' v-on:click='back(delta)'/>
			<text class='title'>{{title}}</text>
		</view>
	</view>
</template>

<style scoped>
	.bar{
		position: fixed;
		top: 0rpx;
		padding-top: 110rpx;
		left: 0;
		width: 100%;
		background-color: white;
		z-index: 100;
		padding-bottom: 20rpx;
	}
	.icon{
		position: absolute;
		left: 20rpx;
		top: 4rpx;
	}
	.title{
		color: #212121;
		font-size: 32rpx;
	}
</style>

<script setup>
	import { defineProps } from 'vue'
	
	const props = defineProps({
	  title: String,
		showarrow: {
			type: Boolean,
			default: true
		},
		delta: {
			type: Number,
			default: 1
		}
	})
	
	const back = (delta) => {
		uni.navigateBack({
			delta: delta
		})
	}
</script>

