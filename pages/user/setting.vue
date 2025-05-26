<template>
	<view class='container'>
		<navbar title='设置'></navbar>
		<!--<van-cell-group class='cells f-db'>
			<van-cell title='隐私协议' is-link></van-cell>
			<van-cell title='用户政策' is-link></van-cell>
		</van-cell-group>-->
		<van-button type='default' class='logout f-db' v-on:click='logout'>退出登录</van-button>
	</view>
</template>

<style scoped>
	.container{
		padding-top: 160rpx;
	}
	.cells{
		margin-top: 20rpx;
	}
	.logout{
		width: calc(100% - 60rpx);
		margin: 40rpx auto 0 auto;
	}
	.logout /deep/ .van-button{
		width: 100%;
	}
</style>

<script setup>
	import navbar from '../../components/navbar/index.vue'
	
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
