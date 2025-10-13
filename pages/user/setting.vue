<template>
	<view class='container'>
		<navbar title=''></navbar>
		
		<view class="section-title">基本信息</view>
		
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
						:src="form.avatar || '../../static/image/avatar.png'" 
						mode="aspectFill"
					></image>
				</button>
				<van-icon name="arrow" class="arrow-icon" />
			</view>
		</view>
		
		<view class="setting-item">
			<view class="item-left">
				<text class="item-label">昵称</text>
			</view>
			<view class="item-right field-right nickname-right">
				<input
					class="inline-input"
					type="nickname"
					v-model="form.nickname"
					maxlength="20"
					confirm-type="done"
					@blur="onFieldBlur('nickname', $event)"
				/>
				<van-icon name="arrow" class="arrow-icon" />
			</view>
		</view>
		
		<view class="setting-item">
			<view class="item-left">
				<text class="item-label">姓名</text>
			</view>
			<view class="item-right field-right">
				<input
					class="inline-input"
					type="text"
					v-model="form.realName"
					maxlength="20"
					confirm-type="done"
					@blur="onFieldBlur('realName', $event)"
				/>
				<van-icon name="arrow" class="arrow-icon" />
			</view>
		</view>
		
		<view class="setting-item">
			<view class="item-left">
				<text class="item-label">性别</text>
			</view>
			<picker class="picker" mode="selector" :value="sexIndex" :range="sexOptions" range-key="label" @change="onSexChange">
				<view class="item-right picker-right">
					<text class="picker-value">{{ sexText }}</text>
					<van-icon name="arrow" class="arrow-icon" />
				</view>
			</picker>
		</view>
		
		<view class="setting-item">
			<view class="item-left">
				<text class="item-label">身份证</text>
			</view>
			<view class="item-right field-right">
				<input
					class="inline-input"
					type="idcard"
					v-model="form.idcardNumber"
					maxlength="18"
					confirm-type="done"
					@blur="onFieldBlur('idcardNumber', $event)"
				/>
				<van-icon name="arrow" class="arrow-icon" />
			</view>
		</view>
		
		<van-button type='default' class='logout f-db' v-on:click='logout'>退出登录</van-button>
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

	.arrow-icon {
		color: #c8c9cc;
		font-size: 32rpx;
		flex-shrink: 0;
	}

	.field-right {
		gap: 16rpx;
	}

	.nickname-right {
		gap: 20rpx;
	}

	.inline-input {
		flex: 1;
		height: 84rpx;
		padding: 0;
		font-size: 30rpx;
		color: #323233;
		background: transparent;
		box-sizing: border-box;
		transition: all 0.2s ease;
		border: none;
		text-align: right;
	}

	.inline-input:focus {
		background: transparent;
	}

	.wechat-btn {
		height: 84rpx;
		padding: 0 36rpx;
		border-radius: 12rpx;
		border: none;
		font-size: 28rpx;
		color: #5086F9;
		background: transparent;
		flex-shrink: 0;
	}

	.wechat-btn:active {
		background: rgba(80, 134, 249, 0.08);
	}

	.picker {
		flex: 1;
		display: flex;
		justify-content: flex-end;
	}

	.picker-right {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 16rpx;
	}

	.picker-value {
		font-size: 30rpx;
		color: #323233;
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
	import { reactive, onMounted, computed } from 'vue'
	import navbar from '../../components/navbar/index.vue'
	import request from '../../components/js/request.js'
	import uploadFile from '../../components/js/uploadFile.js'

	const form = reactive({
		avatar: '',
		nickname: '',
		realName: '',
		sex: '',
		idcardNumber: ''
	})

	const lastSaved = reactive({
		nickname: '',
		realName: '',
		sex: '',
		idcardNumber: ''
	})

	const sexOptions = [
		{ label: '请选择', value: 0 },	
		{ label: '男', value: 1 },
		{ label: '女', value: 2 }
	]

	const sexIndex = computed(() => {
		return sexOptions.findIndex(option => option.value === form.sex)
	})

	const sexText = computed(() => {
		const option = sexOptions.find(item => item.value === form.sex)
		return option ? option.label : ''
	})

	onMounted(() => {
		loadUserInfo()
	})

	const loadUserInfo = () => {
		const user = uni.getStorageSync('user')
		if (user) {
			form.avatar = user.avatar || ''
			form.nickname = user.nickname || ''
			form.realName = user.realName || ''
			form.sex = user.sex === undefined || user.sex === null || user.sex === '' ? '' : Number(user.sex)
			form.idcardNumber = user.idcardNumber || ''
			lastSaved.nickname = form.nickname
			lastSaved.realName = form.realName
			lastSaved.sex = form.sex
			lastSaved.idcardNumber = form.idcardNumber
		}
	}

	const onChooseAvatar = async (e) => {
		const avatarUrl = e.detail.avatarUrl
		console.log('选择头像:', avatarUrl)
		
		try {
			uni.showLoading({ title: '上传中...' })
			
			uploadFile({
				url: '/me/avatar',
				filePath: avatarUrl,
				name: 'file',
				success: (res) => {
					try {
						const data = JSON.parse(res.data)
						if (data.code === 200) {
							if (data.data && data.data.avatar) {
								form.avatar = data.data.avatar
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

	const useWechatNickname = () => {
		const handleSuccess = (res) => {
			const nickname = res.userInfo?.nickName || res.userInfo?.nickname
			if (nickname) {
				form.nickname = nickname
				onFieldBlur('nickname')
			}
		}

		const handleFail = () => {
			uni.showToast({
				title: '获取微信昵称失败',
				icon: 'none'
			})
		}

		if (typeof uni.getUserProfile === 'function') {
			uni.getUserProfile({
				desc: '用于完善个人资料',
				success: handleSuccess,
				fail: handleFail
			})
		} else {
			uni.getUserInfo({
				success: handleSuccess,
				fail: handleFail
			})
		}
	}

	const updateUserProfile = (data) => {
		return new Promise((resolve, reject) => {
			request({
				url: '/me/profile',
				method: 'PUT',
				data,
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

	const onFieldBlur = async (field, event) => {
		if (event && event.detail && typeof event.detail.value !== 'undefined') {
			form[field] = event.detail.value
		}

		let value = form[field]
		if (field !== 'sex' && typeof value === 'string') {
			value = value.trim()
			form[field] = value
		}

		if (lastSaved[field] === value) {
			return
		}

		const payload = { [field]: value }
		try {
			// uni.showLoading({ title: '保存中...' })
			await updateUserProfile(payload)
			lastSaved[field] = value
			const currentUser = uni.getStorageSync('user') || {}
			uni.setStorageSync('user', { ...currentUser, ...payload })
			// uni.hideLoading()
			// uni.showToast({
			// 	title: '已保存',
			// 	icon: 'success'
			// })
		} catch (error) {
			// uni.hideLoading()
			uni.showToast({
				title: '保存失败',
				icon: 'none'
			})
			form[field] = lastSaved[field]
		}
	}

	const onSexChange = (event) => {
		const index = Number(event.detail.value)
		const option = sexOptions[index]
		if (!option) {
			return
		}
		form.sex = option.value
		onFieldBlur('sex')
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
