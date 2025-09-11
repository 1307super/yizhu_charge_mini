<template>
	<view class="container">
		<!-- 顶部区域 -->
		<view class='header'>
			<navbar class='navbar' title='吉运超充' v-bind:showarrow='false'></navbar>
			
			<!-- 省市选择和搜索区域 -->
			<view class="top-bar">
				<view class="location-selector" v-on:click="selectLocation">
					<text class="location-text">{{currentLocation}}</text>
					<van-icon name="arrow-down" size="14px" class="location-arrow" />
				</view>
				<view class="search-box" v-on:click="searchStation">
					<van-icon name="search" size="16px" class="search-icon" />
					<text class="search-text">搜索充电站</text>
				</view>
			</view>
			
			<!-- 功能区域 -->
			<view class="function-area">
				<view class="function-item" v-on:click="go('/pages/user/order')">
					<view class="function-icon order-icon">
						<van-icon name="orders-o" size="20px" color="#2D55E8" />
					</view>
					<text class="function-text">我的订单</text>
				</view>
				<view class="function-item" v-on:click="go('/pages/user/invoice')">
					<view class="function-icon invoice-icon">
						<van-icon name="bill-o" size="20px" color="#2D55E8" />
					</view>
					<text class="function-text">我要开票</text>
				</view>
				<view class="function-item" v-on:click="contactService">
					<view class="function-icon service-icon">
						<van-icon name="service-o" size="20px" color="#2D55E8" />
					</view>
					<text class="function-text">在线客服</text>
				</view>
			</view>
			
			<!-- 筛选区域 -->
			<view class="filter-bar">
				<view class="filter-item" v-bind:class="query.sortType == 1 ? 'active' : ''" v-on:click="setActive(1)">
					<text>距离较近</text>
				</view>
				<view class="filter-item" v-bind:class="query.sortType == 2 ? 'active' : ''" v-on:click="setActive(2)">
					<text>空闲较多</text>
				</view>
			</view>
		</view>
		
		<!-- 充电站列表 -->
		<view class='content'>
			<view class='station-card' v-for='(item, index) in stations' v-bind:key='index' v-on:click='go("/pages/station/index?plotId=" + item.stationId + "&deviceType=" + item.deviceType + "&distance=" + item.distance)'>
				<view class='content-area'>
					<view class='station-header'>
						<text class='station-title'>{{item.stationName}}</text>
					</view>
					
					<view class='charging-info'>
						<view class='charging-type'>
							<view class='type-item'>
								<view class='type-icon super-icon'>
									<text class='icon-text'>兆</text>
								</view>
								<text class='type-count'>闲<text class='count-num'>{{item.superToNoBusy}}</text><text class='count-total'>/{{item.superNum}}</text></text>
							</view>
							<view class='type-item'>
								<view class='type-icon fast-icon'>
									<text class='icon-text'>快</text>
								</view>
								<text class='type-count'>闲<text class='count-num'>{{item.fastToNoBusy}}</text><text class='count-total'>/{{item.fastNum}}</text></text>
							</view>
						</view>
						
						<view class="distance-info" v-on:click.stop="openMap(item)">
							<image src='../../static/image/plane.png' mode='widthFix' class='nav-icon' />
							<text class='distance-text'>{{(item.distance / 1000).toFixed(1)}}km</text>
						</view>
					</view>
					
					<view class='info-row'>
						<view class="parking-info">
							<view class='park-icon'>
								<text>P</text>
							</view>
							<text class='park-text'>{{item.parkCarInfo}}</text>
						</view>
					</view>
				</view>
				
				<view class='price-area'>
					<view class='price-info'>
						<text class='price-value'>{{item.price}}</text>
						<text class='price-unit'>元/度</text>
					</view>
				</view>
			</view>
			<text class='more f-tac f-db'>{{ moreText }}</text>
		</view>
	</view>
	<tabbar v-bind:active='0'></tabbar>
</template>

<style scoped lang="stylus">
	.container
		background-color #f8f9fa
		padding-bottom 120rpx
		padding-top 160rpx
		min-height 100vh
	
	.header
		background-color white
		padding 20rpx
		margin-bottom 20rpx
		
		.top-bar
			display flex
			align-items center
			margin-bottom 30rpx
			gap 20rpx
			
			.location-selector
				display flex
				align-items center
				padding 16rpx 24rpx
				background-color #f8f9fa
				border-radius 24rpx
				min-width 140rpx
				
				.location-text
					color #333
					font-size 28rpx
					font-weight 500
					margin-right 8rpx
				
				.location-arrow
					color #999
			
			.search-box
				flex 1
				display flex
				align-items center
				padding 16rpx 24rpx
				background-color #f8f9fa
				border-radius 24rpx
				
				.search-icon
					color #999
					margin-right 12rpx
				
				.search-text
					color #999
					font-size 28rpx
		
		.function-area
			display flex
			justify-content space-around
			margin-bottom 30rpx
			
			.function-item
				display flex
				flex-direction column
				align-items center
				
				.function-icon
					width 80rpx
					height 80rpx
					background-color #f0f4ff
					border-radius 16rpx
					display flex
					align-items center
					justify-content center
					margin-bottom 12rpx
				
				.function-text
					color #666
					font-size 24rpx
		
		.filter-bar
			display flex
			gap 40rpx
			
			.filter-item
				padding 16rpx 32rpx
				border-radius 24rpx
				background-color #f8f9fa
				
				text
					color #666
					font-size 28rpx
			
			.filter-item.active
				background-color #e8f0ff
				
				text
					color #2D55E8
					font-weight 500
	
	.content
		padding 0 20rpx
		
		.station-card
			background white
			border-radius 24rpx
			padding 0
			margin-bottom 24rpx
			box-shadow 0 8rpx 32rpx rgba(45, 85, 232, 0.08)
			border 1rpx solid rgba(45, 85, 232, 0.1)
			position relative
			overflow hidden
			transition all 0.3s ease
			
			&:active
				transform scale(0.98)
			
			.content-area
				background linear-gradient(135deg, #f8fafb 0%, #f1f3f5 100%)
				padding 0
				
				.station-header
					padding 32rpx 32rpx 24rpx 32rpx
					
					.station-title
						font-size 36rpx
						font-weight 700
						color #1a1a1a
						line-height 1.4
						letter-spacing 0.5rpx
				
				.charging-info
					padding 0 32rpx 20rpx 32rpx
					display flex
					justify-content space-between
					align-items center
					
					.charging-type
						display flex
						gap 32rpx
						
						.type-item
							display flex
							align-items center
							gap 12rpx
							
							.type-icon
								width 48rpx
								height 48rpx
								border-radius 12rpx
								display flex
								align-items center
								justify-content center
								box-shadow 0 2rpx 8rpx rgba(0, 0, 0, 0.15)
								
								.icon-text
									color white
									font-size 32rpx
									font-weight bold
									font-style italic
									// transform skewX(-1deg)
									letter-spacing 1rpx
							
							.super-icon
								background linear-gradient(180deg, #4A90E2 0%, #7BB3F0 100%)
							
							.fast-icon
								background linear-gradient(180deg, #52C41A 0%, #73D13D 100%)
							
							.type-count
								font-size 24rpx
								color #888
								font-weight 400
								
								.count-num
									font-size 28rpx
									color #2D55E8
									font-weight 600
									margin 0 4rpx
								
								.count-total
									font-size 24rpx
									color #999
									font-weight 400
					
					.distance-info
						display flex
						align-items center
						gap 6rpx
						padding 8rpx 14rpx
						background linear-gradient(135deg, #ffffff, #f8f9fa)
						border-radius 16rpx
						transition all 0.2s ease
						box-shadow 0 2rpx 8rpx rgba(0, 0, 0, 0.05)
						
						&:active
							background linear-gradient(135deg, #f8f9fa, #e9ecef)
							transform scale(0.95)
						
						.nav-icon
							width 20rpx
							height 20rpx
						
						.distance-text
							color #666
							font-size 22rpx
							font-weight 500
				
				.info-row
					padding 0 32rpx 24rpx 32rpx
					display flex
					justify-content flex-start
					align-items center
					
					.parking-info
						display flex
						align-items center
						
						.park-icon
							width 40rpx
							height 40rpx
							background linear-gradient(135deg, #e8f0ff, #f0f4ff)
							border 2rpx solid #e0ebff
							border-radius 8rpx
							display flex
							align-items center
							justify-content center
							margin-right 12rpx
							
							text
								color #2D55E8
								font-weight bold
								font-size 22rpx
						
						.park-text
							color #666
							font-size 24rpx
			
			.price-area
				background white
				padding 20rpx 32rpx
				display flex
				justify-content flex-end
				border-top 1rpx solid #f0f2f5
				
				.price-info
					display flex
					align-items center
					gap 8rpx
					
					.price-value
						color #2D55E8
						font-size 48rpx
						font-weight 800
						letter-spacing 1rpx
					
					.price-unit
						color #999
						font-size 24rpx
						font-weight 400
						line-height 48rpx
	
	.more
		margin-top 20rpx
		color #999
		font-size 28rpx
</style>

<script setup>
	import { ref, reactive, onMounted } from 'vue'
	import { onPullDownRefresh, onReachBottom, onLoad } from '@dcloudio/uni-app'
	import navbar from '../../components/navbar/index.vue'
	import tabbar from '../../components/tabbar/index.vue'
	import request from '../../components/js/request.js'
	
	const app = getApp()
	
	const go = (url) => {
		uni.navigateTo({
			url: url
		})
	}
	
	const setActive = (i) => {
		query.sortType = i
		stations.value = []
		loadall.value = false
		pager.pageNo = 1
		index(1)
	}
	
	const currentLocation = ref('北京市')
	
	const selectLocation = () => {
		uni.showActionSheet({
			itemList: ['北京市', '上海市', '广州市', '深圳市', '杭州市', '南京市'],
			success: (res) => {
				const cities = ['北京市', '上海市', '广州市', '深圳市', '杭州市', '南京市']
				currentLocation.value = cities[res.tapIndex]
			}
		})
	}
	
	const searchStation = () => {
		uni.navigateTo({
			url: '/pages/search/index'
		})
	}
	
	const contactService = () => {
		uni.showModal({
			title: '联系客服',
			content: '客服电话：400-123-4567',
			confirmText: '拨打',
			cancelText: '取消',
			success: (res) => {
				if (res.confirm) {
					uni.makePhoneCall({
						phoneNumber: '400-123-4567'
					})
				}
			}
		})
	}
	
	const openMap = (station) => {
		uni.openLocation({
			latitude: station.lat || query.lat,
			longitude: station.lng || query.lng,
			name: station.stationName,
			address: station.address || ''
		})
	}
	
	const query = reactive({
		deviceType: 4,
		lat: 39.9045035,
		lng: 116.408788,
		sortType: 1,
		distance: 100000000
	})
	
	const pager = reactive({
		pageNo: 1,
		pageSize: 5
	})
	
	const filtershow = ref(false)
	const showfilter = () => {
		filtershow.value = true
	}
	
	const stations = ref([])
	const loadall = ref(false)
	const moreText = ref('上滑加载更多~')
	
	const index = (page) => {
		pager.pageNo = page
		if (page === 1) {
			moreText.value = '加载中...'
			loadall.value = false
		}
		
		uni.getLocation({
			type: "gcj02",
			success: async (res) => {
				query.lat = res.latitude
				query.lng = res.longitude
			},
			complete: (res) => {
				request({
					url: 'charging/getPlotInfoPage',
					method: 'POST',
					data: Object.assign(pager, query),
					success: res => {
						if (res && res.data && res.data.data) {
							const newData = res.data.data.filter(item => item && item.stationName)
							
							if (page === 1) {
								stations.value = newData
							} else {
								stations.value = stations.value.concat(newData)
							}
							
							if (newData.length === 0 || newData.length < pager.pageSize) {
								loadall.value = true
								moreText.value = stations.value.length === 0 ? '暂无数据' : '没有更多数据了'
							} else {
								moreText.value = '上滑加载更多~'
							}
						} else {
							if (page === 1) {
								stations.value = []
								moreText.value = '暂无数据'
							} else {
								moreText.value = '加载失败，请重试'
							}
							loadall.value = true
						}
					},
					fail: (err) => {
						console.error('加载失败:', err)
						if (page === 1) {
							stations.value = []
							moreText.value = '加载失败，请重试'
						} else {
							moreText.value = '加载失败，请重试'
						}
						loadall.value = true
					}
				})
			}
		})
	}
	onPullDownRefresh(() => {
		stations.value = []
		loadall.value = false
		index(1)
		setTimeout(() => {
			uni.stopPullDownRefresh()
		}, 1000)
	})
	
	onReachBottom(() => {
		if (loadall.value) {
			return
		}
		
		if (moreText.value !== '加载中...') {
			moreText.value = '加载中...'
			setTimeout(() => {
				pager.pageNo++
				index(pager.pageNo)
			}, 300)
		}
	})
	
	onLoad(() => {
		index(1)
	})
</script>