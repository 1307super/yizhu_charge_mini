<template>
	<view class="container">
		<navbar class='navbar' title='发票抬头管理'></navbar>
		
		<!-- 添加发票抬头按钮 -->
		<view class="add-header-btn" @click="goToAddHeader">
			<text class="add-icon">+</text>
			<text class="add-text">添加发票抬头</text>
		</view>
		
		<!-- 抬头列表 -->
		<view class="header-list">
			<view v-if="headerList.length === 0" class="empty-state">
				<text class="empty-text">暂无发票抬头</text>
				<text class="empty-tip">请先添加发票抬头信息</text>
			</view>
			
			<view v-for="(header, index) in headerList" :key="header.id" class="header-item">
				<view class="header-content" @click="selectHeader(header)">
					<view class="header-main">
						<view class="header-title">
							<text class="company-name">{{header.headerType === 'enterprise' ? header.companyName : header.customerName}}</text>
							<view v-if="header.isDefault" class="default-tag">
								<text>默认</text>
							</view>
						</view>
						<view class="header-details">
							<text class="header-type">{{header.headerType === 'enterprise' ? '企业单位' : '个人/非企业'}}</text>
							<text v-if="header.headerType === 'enterprise'" class="tax-number">税号: {{header.taxNumber}}</text>
							<text class="invoice-type">{{header.invoiceType === 'special' ? '增值税专用发票' : '增值税普通发票'}}</text>
						</view>
						<view class="contact-info">
							<text class="email">邮箱: {{header.email}}</text>
							<text v-if="header.contactPhone" class="phone">电话: {{header.contactPhone}}</text>
						</view>
					</view>
				</view>
				
				<view class="header-actions">
					<view class="more-btn" @click.stop="showActionSheet(header, index)">
						<text class="more-icon">⋯</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 操作菜单 -->
		<van-action-sheet 
			v-model:show="showActions" 
			:actions="actionSheetActions" 
			@select="onActionSelect"
			@close="showActions = false"
			@cancel="showActions = false"
			cancel-text="取消"
			close-on-click-overlay
		/>
	</view>
</template>

<style scoped>
.container {
	background-color: #f6f6f6;
	min-height: 100vh;
	padding-top: 130rpx;
}

.add-header-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: white;
	margin: 30rpx;
	padding: 40rpx;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
	border: 2rpx dashed #2D55E8;
}

.add-icon {
	font-size: 40rpx;
	color: #2D55E8;
	font-weight: bold;
	margin-right: 16rpx;
}

.add-text {
	font-size: 32rpx;
	color: #2D55E8;
	font-weight: 500;
}

.header-list {
	padding: 0 30rpx;
}

.empty-state {
	text-align: center;
	padding: 100rpx 0;
}

.empty-icon {
	width: 200rpx;
	height: 200rpx;
	margin-bottom: 30rpx;
}

.empty-text {
	display: block;
	font-size: 30rpx;
	color: #999;
	margin-bottom: 10rpx;
}

.empty-tip {
	font-size: 26rpx;
	color: #ccc;
}

.header-item {
	background-color: white;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
	overflow: hidden;
	display: flex;
	align-items: center;
}

.header-content {
	flex: 1;
	padding: 30rpx;
}

.header-main {
	width: 100%;
}

.header-title {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.company-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-right: 16rpx;
}

.default-tag {
	background-color: #2D55E8;
	color: white;
	padding: 4rpx 12rpx;
	border-radius: 12rpx;
	font-size: 22rpx;
}

.default-tag text {
	color: white;
}

.header-details {
	margin-bottom: 16rpx;
}

.header-details text {
	display: block;
	font-size: 26rpx;
	color: #666;
	margin-bottom: 8rpx;
}

.header-details text:last-child {
	margin-bottom: 0;
}

.header-type {
	color: #2D55E8 !important;
	font-weight: 500;
}

.contact-info text {
	display: block;
	font-size: 24rpx;
	color: #999;
	margin-bottom: 6rpx;
}

.contact-info text:last-child {
	margin-bottom: 0;
}

.header-actions {
	padding: 30rpx 20rpx;
}

.more-btn {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background-color: #f5f5f5;
}

.more-icon {
	font-size: 32rpx;
	color: #666;
	font-weight: bold;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import navbar from '../../components/navbar/index.vue'
import request from '../../components/js/request.js'

const token = uni.getStorageSync('token')
const user = uni.getStorageSync('user')

// 抬头列表
const headerList = ref([])

// 操作菜单相关
const showActions = ref(false)
const actionSheetActions = ref([])
const currentHeader = ref(null)
const currentIndex = ref(-1)

// 显示操作菜单
const showActionSheet = (header, index) => {
	currentHeader.value = header
	currentIndex.value = index
	
	const actions = [
		{ name: '编辑', color: '#333' }
	]
	
	if (!header.isDefault) {
		actions.push({ name: '设为默认', color: '#2D55E8' })
	}
	
	actions.push({ name: '删除', color: '#ff4444' })
	
	actionSheetActions.value = actions
	showActions.value = true
}

// 处理操作选择
const onActionSelect = (event) => {
	console.log('选择事件:', event)
	const selectedAction = event.detail
	console.log('选择的操作:', selectedAction)
	
	const header = currentHeader.value
	const headerIndex = currentIndex.value
	
	showActions.value = false
	
	if (!header) {
		console.log('未找到当前操作的抬头')
		return
	}
	
	if (!selectedAction || !selectedAction.name) {
		console.log('未找到操作名称')
		return
	}
	
	const actionName = selectedAction.name
	console.log('操作名称:', actionName)
	
	switch (actionName) {
		case '编辑':
			console.log('执行编辑操作')
			goToEditHeader(header)
			break
		case '设为默认':
			console.log('执行设为默认操作')
			setAsDefault(header.id)
			break
		case '删除':
			console.log('执行删除操作')
			deleteHeader(header.id, headerIndex)
			break
		default:
			console.log('未知操作:', actionName)
	}
}

// 选择抬头并返回开票页
const selectHeader = (header) => {
	// 通知开票页更新选中的抬头
	uni.$emit('selectInvoiceHeader', header)
	uni.navigateBack()
}

// 跳转到添加抬头页面
const goToAddHeader = () => {
	uni.navigateTo({
		url: '/pages/user/invoice-header-form?mode=add'
	})
}

// 跳转到编辑抬头页面
const goToEditHeader = (header) => {
	const headerData = encodeURIComponent(JSON.stringify(header))
	uni.navigateTo({
		url: `/pages/user/invoice-header-form?mode=edit&data=${headerData}`
	})
}

// 设为默认抬头
const setAsDefault = (headerId) => {
	uni.showModal({
		title: '确认操作',
		content: '确定要将此发票抬头设为默认吗？',
		success: (res) => {
			if (res.confirm) {
				request({
					url: 'invoice/header/setDefault',
					method: 'POST',
					data: {
						headerId: headerId,
						userId: user.memberId
					},
					success: (res) => {
						if (res.data.code === 200) {
							// 更新本地数据：将所有抬头设为非默认，然后将选中的设为默认
							headerList.value.forEach(header => {
								header.isDefault = header.id === headerId
							})
							uni.showToast({
								title: '设置成功'
							})
							// 重新加载列表确保数据同步
							loadHeaderList()
						} else {
							uni.showToast({
								title: res.data.msg || '设置失败',
								icon: 'none'
							})
						}
					},
					fail: (error) => {
						uni.showToast({
							title: '设置失败',
							icon: 'none'
						})
					}
				})
			}
		}
	})
}

// 删除抬头
const deleteHeader = (headerId, index) => {
	uni.showModal({
		title: '确认删除',
		content: '确定要删除这个发票抬头吗？删除后无法恢复。',
		success: (res) => {
			if (res.confirm) {
				request({
					url: 'invoice/header/delete',
					method: 'POST',
					data: {
						headerId: headerId,
						userId: user.memberId
					},
					success: (res) => {
						if (res.data.code === 200) {
							uni.showToast({
								title: '删除成功'
							})
							headerList.value.splice(index, 1)
						} else {
							uni.showToast({
								title: res.data.msg || '删除失败',
								icon: 'none'
							})
						}
					},
					fail: (error) => {
						uni.showToast({
							title: '删除失败',
							icon: 'none'
						})
					}
				})
			}
		}
	})
}

// 获取抬头列表
const loadHeaderList = () => {
	request({
		url: 'invoice/header/list',
		method: 'GET',
		data: {
			userId: user.memberId
		},
		success: (res) => {
			if (res.data.code === 200) {
				headerList.value = res.data.data || []
			}
		},
		fail: (error) => {
			console.log('获取发票抬头列表失败')
		}
	})
}

onMounted(() => {
	if (!token) {
		uni.showToast({
			title: '请先登录',
			icon: 'none'
		})
		setTimeout(() => {
			uni.navigateTo({
				url: '/pages/user/login'
			})
		}, 1500)
		return
	}
	
	loadHeaderList()
	
	// 监听表单页的刷新事件
	uni.$on('refreshHeaderList', () => {
		console.log('收到刷新列表事件')
		loadHeaderList()
	})
})
</script>