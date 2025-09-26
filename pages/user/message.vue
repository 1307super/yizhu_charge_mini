<template>
	<view class="container">
		<navbar title="消息列表"></navbar>
		
		<view class="message-list" v-if="messageList.length > 0">
			<view 
				v-for="message in messageList" 
				:key="message.messageId" 
				class="message-item"
				@click="goToDetail(message.messageId)"
			>
				<view class="message-content">
					<view class="message-header">
						<view v-if="!message.isRead" class="unread-dot"></view>
						<text class="message-title">{{ message.title }}</text>
					</view>
					<view class="message-summary" v-if="message.summary">{{ message.summary }}</view>
					<view class="message-summary" v-else-if="message.content">{{ getContentSummary(message.content) }}</view>
					<view class="message-summary no-summary" v-else>暂无内容摘要</view>
					<view class="message-time">{{ formatTime(message.createTime) }}</view>
				</view>
				<image src="../../static/image/arrow.png" mode="widthFix" class="arrow"></image>
			</view>
		</view>
		
		<van-empty v-else-if="!loading && messageList.length === 0" description="暂无消息" />
		
		<view v-if="loading" class="loading">
			<text>加载中...</text>
		</view>
		
		<!-- 下拉刷新和上拉加载更多 -->
		<view v-if="hasMore && !loading" class="load-more" @click="loadMore">
			<text>点击加载更多</text>
		</view>
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

.message-list {
	flex: 1;
	padding: 0 30rpx;
	overflow-y: auto;
	min-height: 0;
}

.message-item {
	background-color: white;
	border-radius: 25rpx;
	padding: 30rpx;
	margin-top: 30rpx;
	display: flex;
	align-items: center;
}

.message-content {
	flex: 1;
}

.message-header {
	display: flex;
	align-items: center;
	margin-bottom: 15rpx;
}

.message-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	flex: 1;
}

.unread-dot {
	width: 12rpx;
	height: 12rpx;
	background-color: #ff4757;
	border-radius: 50%;
	margin-right: 10rpx;
	flex-shrink: 0;
}

.message-summary {
	font-size: 28rpx;
	color: #666;
	line-height: 1.4;
	margin-bottom: 15rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.no-summary {
	color: #999;
	font-style: italic;
}

.message-time {
	font-size: 24rpx;
	color: #999;
}

.arrow {
	width: 20rpx;
	margin-left: 20rpx;
}

.loading {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100rpx;
	color: #666;
}

.load-more {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 80rpx;
	color: #007aff;
	font-size: 28rpx;
	margin: 30rpx 0;
}
</style>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import navbar from '../../components/navbar/index.vue'
import request from '../../components/js/request.js'

const messageList = ref([])
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = 10

// 获取消息列表
const getMessageList = (page = 1, isLoadMore = false) => {
	loading.value = true
	
	request({
		url: 'message/list',
		method: 'GET',
		data: {
			pageNum: page,
			pageSize: pageSize
		},
		success: (res) => {
			loading.value = false
			if (res.data.code === 200) {
				const newMessages = res.data.data.records || []
				const total = res.data.data.total || 0
				if (isLoadMore) {
					messageList.value = [...messageList.value, ...newMessages]
				} else {
					messageList.value = newMessages
				}
				// 判断是否还有更多数据：当前已加载的数量 < 总数量
				hasMore.value = messageList.value.length < total
				currentPage.value = page
			} else {
				uni.showToast({
					title: res.data.msg || '获取消息列表失败',
					icon: 'none'
				})
			}
		},
		fail: () => {
			loading.value = false
			uni.showToast({
				title: '网络异常，请重试',
				icon: 'none'
			})
		}
	})
}

// 加载更多
const loadMore = () => {
	if (loading.value || !hasMore.value) return
	getMessageList(currentPage.value + 1, true)
}

// 跳转到消息详情
const goToDetail = (messageId) => {
	uni.navigateTo({
		url: `/pages/user/message-detail?id=${messageId}`
	})
}

// 获取内容摘要
const getContentSummary = (content) => {
	if (!content) return ''
	
	// 移除富文本标签
	const plainText = content.replace(/<[^>]*>/g, '')
	
	// 限制长度，超出显示省略号
	if (plainText.length > 50) {
		return plainText.substring(0, 50) + '...'
	}
	return plainText
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
	getMessageList()
})

// 下拉刷新
const onPullDownRefresh = () => {
	getMessageList()
	uni.stopPullDownRefresh()
}
</script>