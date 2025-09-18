<template>
	<view class='bar f-tac' :class="{ 'no-background': !title }" :style="navBarStyle">
		<view class='bar-main f-pr'>
			<van-icon name="arrow-left" size='20px' class='icon' v-if='showarrow' v-on:click='back(delta)'/>
			<text class='title'>{{title}}</text>
		</view>
	</view>
</template>

<style scoped>
	.bar{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		background-color: white;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.bar.no-background {
		background-color: transparent;
	}
	
	.bar-main {
		position: relative;
		width: 100%;
	}
	
	.icon{
		position: absolute;
		left: 20rpx;
		color: #212121;
	}
	
	.no-background .icon {
		color: #212121;
		top: 50rpx;
	}
	
	.title{
		color: #212121;
		font-size: 32rpx;
	}
</style>

<script setup>
	import { defineProps, onMounted, ref } from 'vue'
	
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
	
	const navBarStyle = ref({})
	
	onMounted(() => {
		const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
		navBarStyle.value = {
			paddingTop: `${menuButtonInfo.top + 4}px`,
			height: `${menuButtonInfo.height}px`,
		}
	})
	
	const back = (delta) => {
		uni.navigateBack({
			delta: delta
		})
	}
</script>

