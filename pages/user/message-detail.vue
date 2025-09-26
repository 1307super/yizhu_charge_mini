<template>
	<view class="container">
		<navbar title="消息详情"></navbar>
		
		<view v-if="messageDetail" class="message-detail">
			<view class="message-header">
				<text class="message-title">{{ messageDetail.title }}</text>
				<view class="message-meta">
					<text class="message-type">{{ messageDetail.typeName }}</text>
					<text class="message-time">{{ formatTime(messageDetail.createTime) }}</text>
				</view>
			</view>
			
			<view class="message-content">
				<rich-text :nodes="messageDetail.content" class="rich-text"></rich-text>
			</view>
		</view>
		
		<view v-else-if="loading" class="loading">
			<text>加载中...</text>
		</view>
		
		<van-empty v-else description="消息不存在或已删除" />
	</view>
</template>

<style scoped>
.container {
	background-color: #f6f6f6;
	height: 100vh;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	padding-top: 180rpx;
	padding-bottom: 120rpx;
	box-sizing: border-box;
}

.message-detail {
	flex: 1;
	margin: 30rpx;
	background-color: white;
	border-radius: 25rpx;
	padding: 40rpx;
	overflow-y: auto;
	min-height: 0;
}

.message-header {
	border-bottom: 2rpx solid #f0f0f0;
	padding-bottom: 30rpx;
	margin-bottom: 30rpx;
}

.message-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	line-height: 1.4;
	display: block;
	margin-bottom: 20rpx;
}

.message-meta {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.message-type {
	background-color: #007aff;
	color: white;
	font-size: 24rpx;
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
}

.message-time {
	font-size: 26rpx;
	color: #999;
}

.message-content {
	line-height: 1.6;
}

.rich-text {
	font-size: 30rpx;
	color: #333;
	line-height: 1.6;
}

/* 富文本内容样式 */
.rich-text :deep(p) {
	margin-bottom: 20rpx;
}

.rich-text :deep(img) {
	max-width: 100%;
	height: auto;
	display: block;
	margin: 20rpx 0;
}

.rich-text :deep(h1),
.rich-text :deep(h2),
.rich-text :deep(h3),
.rich-text :deep(h4),
.rich-text :deep(h5),
.rich-text :deep(h6) {
	font-weight: bold;
	margin: 30rpx 0 20rpx 0;
}

.rich-text :deep(h1) { font-size: 40rpx; }
.rich-text :deep(h2) { font-size: 36rpx; }
.rich-text :deep(h3) { font-size: 32rpx; }

.rich-text :deep(ul),
.rich-text :deep(ol) {
	padding-left: 40rpx;
	margin-bottom: 20rpx;
}

.rich-text :deep(li) {
	margin-bottom: 10rpx;
}

.rich-text :deep(blockquote) {
	border-left: 8rpx solid #007aff;
	padding-left: 20rpx;
	margin: 20rpx 0;
	color: #666;
	font-style: italic;
}

.rich-text :deep(code) {
	background-color: #f5f5f5;
	padding: 4rpx 8rpx;
	border-radius: 6rpx;
	font-family: monospace;
}

.rich-text :deep(pre) {
	background-color: #f5f5f5;
	padding: 20rpx;
	border-radius: 10rpx;
	overflow-x: auto;
	margin: 20rpx 0;
}

.loading {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 400rpx;
	color: #666;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import navbar from '../../components/navbar/index.vue'
import request from '../../components/js/request.js'

const messageDetail = ref(null)
const loading = ref(false)

// 获取消息详情
const getMessageDetail = (messageId) => {
	loading.value = true
	
	request({
		url: `message/${messageId}`,
		method: 'GET',
		success: (res) => {
			if (res.data.code === 200) {
				messageDetail.value = res.data.data
			} else {
				uni.showToast({
					title: res.data.msg || '获取消息详情失败',
					icon: 'none'
				})
			}
		},
		fail: () => {
			uni.showToast({
				title: '网络异常，请重试',
				icon: 'none'
			})
		},
		complete: () => {
			loading.value = false
		}
	})
}

// 格式化时间
const formatTime = (timeStr) => {
	if (!timeStr) return ''
	
	const date = new Date(timeStr)
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')
	
	return `${year}-${month}-${day} ${hours}:${minutes}`
}

onMounted(() => {
	// 获取页面参数
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	const messageId = currentPage.options?.id
	
	if (messageId) {
		getMessageDetail(messageId)
	} else {
		uni.showToast({
			title: '参数错误',
			icon: 'none'
		})
		setTimeout(() => {
			uni.navigateBack()
		}, 1500)
	}
})
</script>