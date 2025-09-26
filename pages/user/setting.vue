<template>
	<view class='container'>
		<navbar title=''></navbar>
		
		<!-- 基本信息标题 -->
		<view class="section-title">基本信息</view>
		
		<!-- 头像设置 -->
		<view class="setting-item">
			<view class="item-left">
				<text class="item-label">头像</text>
			</view>
			<view class="item-right">
				<button 
					class="avatar-btn" 
					open-type="chooseAvatar" 
					@chooseavatar="onChooseAvatar"
				>
					<image 
						class="avatar" 
						:src="userInfo.avatar || '../../static/image/avatar.png'" 
						mode="aspectFill"
					></image>
				</button>
				<van-icon name="arrow" class="arrow-icon" />
			</view>
		</view>
		
		<!-- 昵称设置 -->
		<view class="setting-item" @tap="showNicknameDrawer">
			<view class="item-left">
				<text class="item-label">昵称</text>
			</view>
			<view class="item-right">
				<text class="item-value">{{ userInfo.nickname || '未设置' }}</text>
				<van-icon name="arrow" class="arrow-icon" />
			</view>
		</view>
		
		<!-- 隐藏的头像选择按钮 -->
		<!-- 不再需要隐藏按钮，直接使用visible按钮 -->
		
		<van-button type='default' class='logout f-db' v-on:click='logout'>退出登录</van-button>
		
		<!-- 昵称编辑抽屉 -->
		<van-popup 
			:show="showNickname" 
			@close="showNickname = false"
			position="bottom" 
			:style="{ height: '40%' }"
			round
		>
			<view class="drawer-content">
				<view class="drawer-header">
					<text class="drawer-title">编辑昵称</text>
					<van-icon name="cross" @click="showNickname = false" class="close-icon" />
				</view>
				<view class="drawer-body">
					<input 
						class="nickname-input"
						type="nickname" 
						v-model="tempNickname"
						@input="onNicknameInput"
						@confirm="onNicknameConfirm"
						placeholder="请输入昵称"
						:focus="showNickname"
						maxlength="20"
						confirm-type="done"
					/>
					<view class="input-tip">昵称长度不超过20个字符</view>
				</view>
				<view class="drawer-footer">
					<button 
						class="save-btn"
						@click="saveNickname"
						:disabled="!tempNickname || !tempNickname.trim()"
					>
						保存
					</button>
				</view>
			</view>
		</van-popup>
	</view>
</template>

<style scoped>
	.container{
		padding-top: 160rpx;
		background-color: #f7f8fa;
		min-height: 100vh;
	}
	
	.section-title {
		font-size: 26rpx;
		color: #969799;
		padding: 30rpx 32rpx 20rpx 32rpx;
		font-weight: 400;
	}
	
	.setting-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 32rpx;
		margin: 0 20rpx 2rpx 20rpx;
		background: transparent;
		transition: background-color 0.2s;
		position: relative;
	}
	
	.setting-item:first-of-type {
		border-radius: 16rpx 16rpx 0 0;
	}
	
	.setting-item:last-of-type {
		border-radius: 0 0 16rpx 16rpx;
		margin-bottom: 20rpx;
	}
	
	.setting-item:only-of-type {
		border-radius: 16rpx;
	}
	
	.setting-item:not(:last-of-type)::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 32rpx;
		right: 0;
		height: 1rpx;
		background: #ebedf0;
	}
	
	.setting-item:active {
		background-color: rgba(0, 0, 0, 0.05);
	}
	
	.item-left {
		flex-shrink: 0;
	}
	
	.item-label {
		font-size: 30rpx;
		color: #323233;
		font-weight: 400;
	}
	
	.item-right {
		display: flex;
		align-items: center;
		flex: 1;
		justify-content: flex-end;
	}
	
	.avatar-btn {
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		margin-right: 16rpx;
		display: flex;
		align-items: center;
		outline: none;
	}
	
	.avatar-btn::after {
		border: none;
	}
	
	.avatar {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		border: 2rpx solid #ebedf0;
		display: block;
	}
	
	.item-value {
		font-size: 28rpx;
		color: #646566;
		margin-right: 16rpx;
		max-width: 300rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.arrow-icon {
		color: #c8c9cc;
		font-size: 32rpx;
	}
	
	.drawer-content {
		height: 100%;
		background: #fff;
		display: flex;
		flex-direction: column;
		border-radius: 20rpx 20rpx 0 0;
	}
	
	.drawer-header {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40rpx 32rpx 20rpx 32rpx;
		border-bottom: 1rpx solid #ebedf0;
		position: relative;
	}
	
	.drawer-title {
		font-size: 34rpx;
		font-weight: 600;
		color: #323233;
		text-align: center;
	}
	
	.close-icon {
		position: absolute;
		right: 32rpx;
		color: #c8c9cc;
		font-size: 36rpx;
		padding: 8rpx;
		cursor: pointer;
		transition: color 0.2s;
	}
	
	.close-icon:active {
		color: #969799;
	}
	
	.drawer-body {
		flex: 1;
		padding: 40rpx 32rpx 20rpx 32rpx;
	}
	
	.nickname-input {
		width: 100%;
		height: 100rpx;
		border: 2rpx solid #ebedf0;
		border-radius: 12rpx;
		padding: 0 24rpx;
		font-size: 30rpx;
		box-sizing: border-box;
		background: #fafafa;
		transition: all 0.3s;
	}
	
	.nickname-input:focus {
		border-color: #5086F9;
		background: #fff;
		box-shadow: 0 0 0 4rpx rgba(80, 134, 249, 0.1);
	}
	
	.input-tip {
		font-size: 24rpx;
		color: #969799;
		margin-top: 16rpx;
		text-align: center;
	}
	
	.drawer-footer {
		padding: 20rpx 32rpx 40rpx 32rpx;
		border-top: 1rpx solid #ebedf0;
	}
	
	.save-btn {
		width: 100%;
		height: 88rpx;
		background: linear-gradient(135deg, #5086F9, #4C70E3);
		border-radius: 12rpx;
		border: none;
		color: white;
		font-size: 30rpx;
		font-weight: 500;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 8rpx 20rpx rgba(80, 134, 249, 0.3);
		transition: all 0.3s ease;
	}
	
	.save-btn:active {
		transform: scale(0.95);
		box-shadow: 0 4rpx 12rpx rgba(80, 134, 249, 0.4);
	}
	
	.save-btn[disabled] {
		background: #f7f8fa !important;
		color: #c8c9cc !important;
		cursor: not-allowed;
		box-shadow: none !important;
		transform: none !important;
	}
	
	.logout{
		width: calc(100% - 60rpx);
		margin: 40rpx auto 60rpx auto;
		border-radius: 12rpx;
		overflow: hidden;
	}
	
	.logout /deep/ .van-button{
		width: 100%;
		height: 88rpx;
		font-size: 30rpx;
		border-radius: 12rpx;
	}
</style>

<script setup>
	import { ref, onMounted } from 'vue'
	import navbar from '../../components/navbar/index.vue'
	import request from '../../components/js/request.js'
	import uploadFile from '../../components/js/uploadFile.js'
	
	const userInfo = ref({
		avatar: '',
		nickname: ''
	})
	
	const showNickname = ref(false)
	const tempNickname = ref('')
	
	onMounted(() => {
		loadUserInfo()
	})
	
	const loadUserInfo = () => {
		const user = uni.getStorageSync('user')
		if (user) {
			userInfo.value = {
				avatar: user.avatar || '',
				nickname: user.nickname || ''
			}
		}
	}
	
	const onChooseAvatar = async (e) => {
		const avatarUrl = e.detail.avatarUrl
		console.log('选择头像:', avatarUrl)
		
		try {
			uni.showLoading({ title: '上传中...' })
			
			uploadFile({
				url: '/me/avatar', // 头像上传接口
				filePath: avatarUrl,
				name: 'file',
				success: (res) => {
					try {
						const data = JSON.parse(res.data)
						if (data.code === 200) {
							// 更新用户信息，使用后端返回的头像URL
							if (data.data && data.data.avatar) {
								userInfo.value.avatar = data.data.avatar
								
								// 更新本地存储
								const currentUser = uni.getStorageSync('user') || {}
								uni.setStorageSync('user', { ...currentUser, avatar: data.data.avatar })
							}
							
							uni.hideLoading()
							uni.showToast({
								title: '头像更新成功',
								icon: 'success'
							})
						} else {
							throw new Error(data.message || '上传失败')
						}
					} catch (parseError) {
						uni.hideLoading()
						console.error('响应解析失败:', parseError)
						uni.showToast({
							title: '上传失败',
							icon: 'none'
						})
					}
				},
				fail: (error) => {
					uni.hideLoading()
					console.error('头像上传失败:', error)
					uni.showToast({
						title: '头像更新失败',
						icon: 'none'
					})
				}
			})
			
		} catch (error) {
			uni.hideLoading()
			console.error('头像上传异常:', error)
			uni.showToast({
				title: '头像更新失败',
				icon: 'none'
			})
		}
	}
	
	const showNicknameDrawer = () => {
		tempNickname.value = userInfo.value.nickname
		showNickname.value = true
	}
	
	const onNicknameInput = (e) => {
		// 处理输入事件，确保v-model正常工作
		tempNickname.value = e.detail.value
		console.log('昵称输入:', e.detail.value)
	}
	
	const onNicknameConfirm = (e) => {
		// 处理确认事件，当用户点击键盘的完成按钮时触发
		console.log('昵称确认:', e.detail.value)
		// 这里不需要额外处理，v-model已经更新了值
	}
	
	const saveNickname = async () => {
		if (!tempNickname.value.trim()) {
			uni.showToast({
				title: '请输入昵称',
				icon: 'none'
			})
			return
		}
		
		try {
			uni.showLoading({ title: '保存中...' })
			
			// 调用更新用户信息接口
			await updateUserProfile({
				nickname: tempNickname.value.trim()
			})
			
			userInfo.value.nickname = tempNickname.value.trim()
			
			// 更新本地存储
			const currentUser = uni.getStorageSync('user') || {}
			uni.setStorageSync('user', { ...currentUser, nickname: tempNickname.value.trim() })
			
			showNickname.value = false
			uni.hideLoading()
			uni.showToast({
				title: '昵称更新成功',
				icon: 'success'
			})
		} catch (error) {
			uni.hideLoading()
			uni.showToast({
				title: '昵称更新失败',
				icon: 'none'
			})
		}
	}
	
	// 调用后端接口更新用户信息
	const updateUserProfile = (data) => {
		return new Promise((resolve, reject) => {
			const token = uni.getStorageSync('token')
			
			request({
				url: '/me/profile', 
				method: 'PUT',
				data: data,
				success: (res) => {
					if (res.data.code === 200) {
						resolve(res.data)
					} else {
						reject(new Error(res.data.message || '请求失败'))
					}
				},
				fail: (error) => {
					reject(error)
				}
			})
		})
	}
	
	const logout = () => {
		uni.showModal({
			title: '确定退出?',
			showCancel: true,
			success: (res) => {
				if(res.confirm) {
					uni.removeStorageSync('token')
					uni.removeStorageSync('user')
					uni.showToast({
						title: '退出成功',
						icon: 'none'
					})
					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/user/index'
						})
					}, 1500)
				}
			}
		})	
	}
</script>
