<template>
	<view class='container'>
		<navbar class='navbar' title=""></navbar>
		
		<!-- 顶部封面图 -->
		<image src='https://chargeyz.oss-cn-shanghai.aliyuncs.com/miniprogram/station.jpg' mode='widthFix' class='banner'></image>
		
		<!-- 充电站信息卡片 -->
		<view class='station-info-card'>
			<view class='station-name'>{{stationInfo.stationName}}</view>
			<view class='address-row'>
				<text class='station-address'>{{stationInfo.address}}</text>
				<view class='station-distance' v-on:click="navigateToStation">
					<image src='../../static/image/plane.png' mode='widthFix' class='nav-arrow' />
					<text>{{(stationInfo.distance / 1000).toFixed(1)}}km</text>
				</view>
			</view>
			
			<!-- 标签区域 -->
			<view class='tags-area'>
				<view class='tag' v-for='(tag, index) in stationInfo.tags' v-bind:key='index'>
					{{tag}}
				</view>
			</view>
		</view>
		
		<!-- 充电费卡片 -->
		<view class='charge-fee-card'>
			<view class='card-header'>
				<text class='card-title'>充电费</text>
				<text class='view-all' v-on:click='showPriceDetail = true'>全部时段 ></text>
			</view>
			<view class='current-period'>
				<view class='period-time'>当前时段：{{currentPeriod.startTime}} - {{currentPeriod.endTime}}</view>
				<view class='price-info'>
					<view class='price-item'>
						<text class='price-label'>充电单价</text>
						<text class='price-value'>{{currentPeriod.chargingPrice}}元/度</text>
					</view>
					<view class='price-item'>
						<text class='price-label'>电费</text>
						<text class='price-value'>{{currentPeriod.electricityFee}}元/度</text>
					</view>
					<view class='price-item'>
						<text class='price-label'>服务费</text>
						<text class='price-value'>{{currentPeriod.serviceFee}}元/度</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 停车费参考卡片 -->
		<view class='parking-fee-card'>
			<view class='card-header'>
				<text class='card-title'>停车费参考</text>
			</view>
			<view class='parking-content'>{{stationInfo.parkingInfo}}</view>
		</view>
		
		<!-- 充电枪信息卡片 -->
		<view class='charging-guns-card'>
			<view class='card-header'>
				<text class='card-title'>充电枪信息</text>
				<text class='view-all' v-on:click='showAllGuns = true'>查看全部 ></text>
			</view>
			<view class='guns-list'>
				<view class='gun-item' v-for='(gun, index) in chargingGuns.slice(0, 4)' v-bind:key='index'>
					<view class='gun-status'>
						<van-circle
							:value="getCircleRate(gun)"
							:color="getCircleColor(gun.status)"
							:layer-color="'#f0f2f5'"
							:stroke-width="4"
							:size="60"
						>
							<text class='status-text' :style="{ color: getCircleColor(gun.status) }">{{ getStatusText(gun.status) }}</text>
						</van-circle>
					</view>
					<view class='gun-info'>
						<view class='gun-number'>{{gun.gunNumber}}号枪</view>
						<view class='gun-power'>最大功率 {{gun.maxPower}}KW</view>
						<view v-if='gun.status === 3 && gun.remainingTime' class='gun-remaining'>剩余 {{gun.remainingTime}}分钟</view>
					</view>
					<view class='gun-type' v-bind:class='gun.type === 1 ? "megawatt-type" : "fast-type"'>
						{{gun.type === 1 ? '兆冲' : '快充'}}
					</view>
				</view>
			</view>
		</view>
		
		<!-- 周边服务卡片 -->
		<view class='nearby-services-card'>
			<view class='card-header'>
				<text class='card-title'>周边服务</text>
			</view>
			<view class='services-content'>
				<view class='service-item' v-for='(service, index) in stationInfo.services' v-bind:key='index'>
					<image v-bind:src='getServiceIcon(service)' class='service-icon' />
					<text class='service-text'>{{service}}</text>
				</view>
			</view>
		</view>
		
		<!-- 底部价格和按钮 -->
		<view class='footer'>
			<view class='footer-main'>
				<view class='price'>
					<text class='price-value'>{{currentPeriod.chargingPrice}}</text>
					<text class='price-unit'>元/度</text>
				</view>
				<view class='current-time-period'>当前时段 {{currentPeriod.startTime}} - {{currentPeriod.endTime}}</view>
			</view>
			<van-button round class='footer-button' color="linear-gradient(to right, #569AFF, #4A6EF3)" v-on:click="scan">扫码充电</van-button>
		</view>
		
		<!-- 价格详情弹窗 -->
		<van-popup 
			v-model:show="showPriceDetail" 
			position="bottom" 
			custom-style="height: 70%; border-radius: 20rpx 20rpx 0 0;"
			@opened="onPricePopupOpened"
			@closed="onPricePopupClosed"
		>
			<view class='price-detail-popup'>
				<view class='popup-header'>
					<text class='popup-title'>价格详情</text>
					<van-icon name="cross" size="20px" v-on:click='showPriceDetail = false' />
				</view>
                <van-tabs v-if="priceTabsVisible" v-model:active="activeTab" color="#2D55E8">
                    <van-tab title="兆瓦价格">
						<view class='price-periods'>
							<view class='period-card' v-for='(period, index) in megawattPrices' v-bind:key='index' v-bind:class='{current: period.isCurrent}'>
								<view class='period-badge' v-if='period.isCurrent'>当前时段价</view>
								<view class='period-time'>{{period.startTime}} - {{period.endTime}}</view>
								<view class='period-prices'>
									<view class='price-row'>
										<text class='label'>充电单价</text>
										<view class='price-values'>
											<text v-if='period.originalChargingPrice !== period.chargingPrice' class='original-price'>{{period.originalChargingPrice}}元/度</text>
											<text class='current-price'>{{period.chargingPrice}}元/度</text>
										</view>
									</view>
									<view class='price-row'>
										<text class='label'>电费</text>
										<view class='price-values'>
											<text v-if='period.originalElectricityFee !== period.electricityFee' class='original-price'>{{period.originalElectricityFee}}元/度</text>
											<text class='current-price'>{{period.electricityFee}}元/度</text>
										</view>
									</view>
									<view class='price-row'>
										<text class='label'>服务费</text>
										<view class='price-values'>
											<text v-if='period.originalServiceFee !== period.serviceFee' class='original-price'>{{period.originalServiceFee}}元/度</text>
											<text class='current-price'>{{period.serviceFee}}元/度</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</van-tab>
                    <van-tab title="超充价格">
						<view class='price-periods'>
							<view class='period-card' v-for='(period, index) in fastChargingPrices' v-bind:key='index' v-bind:class='{current: period.isCurrent}'>
								<view class='period-badge' v-if='period.isCurrent'>当前时段价</view>
								<view class='period-time'>{{period.startTime}} - {{period.endTime}}</view>
								<view class='period-prices'>
									<view class='price-row'>
										<text class='label'>充电单价</text>
										<view class='price-values'>
											<text v-if='period.originalChargingPrice !== period.chargingPrice' class='original-price'>{{period.originalChargingPrice}}元/度</text>
											<text class='current-price'>{{period.chargingPrice}}元/度</text>
										</view>
									</view>
									<view class='price-row'>
										<text class='label'>电费</text>
										<view class='price-values'>
											<text v-if='period.originalElectricityFee !== period.electricityFee' class='original-price'>{{period.originalElectricityFee}}元/度</text>
											<text class='current-price'>{{period.electricityFee}}元/度</text>
										</view>
									</view>
									<view class='price-row'>
										<text class='label'>服务费</text>
										<view class='price-values'>
											<text v-if='period.originalServiceFee !== period.serviceFee' class='original-price'>{{period.originalServiceFee}}元/度</text>
											<text class='current-price'>{{period.serviceFee}}元/度</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</van-tab>
				</van-tabs>
			</view>
		</van-popup>
		
		<!-- 全部充电枪弹窗 -->
		<van-popup v-model:show="showAllGuns" position="bottom" custom-style="height: 70%; border-radius: 20rpx 20rpx 0 0;">
			<view class='all-guns-popup'>
				<view class='popup-header'>
					<text class='popup-title'>全部充电枪</text>
					<van-icon name="cross" size="20px" v-on:click='showAllGuns = false' />
				</view>
				
				<!-- 状态筛选 -->
				<view class='status-filters'>
					<view class='filter-chip' v-bind:class='{active: gunStatusFilter === "all"}' v-on:click='gunStatusFilter = "all"'>
						<text>全部</text>
					</view>
					<view class='filter-chip' v-bind:class='{active: gunStatusFilter === "free"}' v-on:click='gunStatusFilter = "free"'>
						<text>空闲</text>
					</view>
					<view class='filter-chip' v-bind:class='{active: gunStatusFilter === "occupied"}' v-on:click='gunStatusFilter = "occupied"'>
						<text>占用</text>
					</view>
					<view class='filter-chip' v-bind:class='{active: gunStatusFilter === "offline"}' v-on:click='gunStatusFilter = "offline"'>
						<text>离线</text>
					</view>
					<view class='filter-chip' v-bind:class='{active: gunStatusFilter === "fault"}' v-on:click='gunStatusFilter = "fault"'>
						<text>故障</text>
					</view>
				</view>
				
				<view class='guns-grid'>
					<view class='gun-card' v-for='(gun, index) in filteredGuns' v-bind:key='index'>
						<view class='gun-status'>
							<van-circle
								:value="getCircleRate(gun)"
								:color="getCircleColor(gun.status)"
								:layer-color="'#f0f2f5'"
								:stroke-width="4"
								:size="60"
							>
								<text class='status-text' :style="{ color: getCircleColor(gun.status) }">{{ getStatusText(gun.status) }}</text>
							</van-circle>
						</view>
						<view class='gun-info'>
							<view class='gun-number'>{{gun.gunNumber}}号枪</view>
							<view class='gun-power'>最大功率 {{gun.maxPower}}KW</view>
							<view v-if='gun.status === 3 && gun.remainingTime' class='gun-remaining'>剩余 {{gun.remainingTime}}分钟</view>
						</view>
						<view class='gun-type' v-bind:class='gun.type === 1 ? "megawatt-type" : "fast-type"'>
							{{gun.type === 1 ? '兆冲' : '快充'}}
						</view>
					</view>
				</view>
			</view>
		</van-popup>
	</view>
</template>

<style scoped lang="stylus">
	.container
		background-color #f8f9fa
		padding-top 0
		padding-bottom 140rpx
		min-height 100vh
		
	.navbar
		position relative
		z-index 10
	
	.banner
		width 100%
		height 400rpx
		object-fit cover
	
	.station-info-card
		background white
		margin 20rpx
		padding 30rpx
		border-radius 20rpx
		margin-top -80rpx
		position relative
		z-index 10
		box-shadow 0 4rpx 20rpx rgba(0, 0, 0, 0.08)
		
		.station-name
			font-size 36rpx
			font-weight 700
			color #1a1a1a
			margin-bottom 16rpx
		
		.address-row
			display flex
			align-items flex-start
			gap 16rpx
			margin-bottom 24rpx
		
		.station-address
			flex 1
			color #666
			font-size 28rpx
			line-height 1.5
			word-break break-all
		
		.station-distance
			display flex
			align-items center
			gap 8rpx
			color #999
			font-size 24rpx
			cursor pointer
			flex-shrink 0
			padding 8rpx 12rpx
			background #f8f9fa
			border-radius 16rpx
			transition all 0.2s ease
			
			&:active
				background #e9ecef
				transform scale(0.95)
			
			.nav-arrow
				width 16rpx
				height 16rpx
		
		.tags-area
			display flex
			flex-wrap wrap
			gap 16rpx
			
			.tag
				background linear-gradient(135deg, #e8f0ff, #f0f4ff)
				color #2D55E8
				padding 8rpx 16rpx
				border-radius 20rpx
				font-size 22rpx
	
	.charge-fee-card, .parking-fee-card, .charging-guns-card, .nearby-services-card
		background white
		margin 20rpx
		padding 30rpx
		border-radius 20rpx
		box-shadow 0 4rpx 20rpx rgba(0, 0, 0, 0.05)
	
	.card-header
		display flex
		justify-content space-between
		align-items center
		margin-bottom 24rpx
		
		.card-title
			font-size 32rpx
			font-weight 600
			color #1a1a1a
		
		.view-all
			color #999
			font-size 24rpx
	
	.current-period
		.period-time
			color #2D55E8
			font-size 26rpx
			font-weight 500
			margin-bottom 16rpx
		
		.price-info
			.price-item
				display flex
				justify-content space-between
				margin-bottom 12rpx
				
				.price-label
					color #666
					font-size 26rpx
				
				.price-value
					color #1a1a1a
					font-size 26rpx
					font-weight 500
	
	.parking-content
		color #666
		font-size 28rpx
		line-height 1.6
	
	.guns-list
		.gun-item
			display flex
			align-items center
			margin-bottom 24rpx
			
			.gun-status
				margin-right 20rpx
				
				.status-text
					font-size 24rpx
					font-weight 600
				

			
			.gun-info
				flex 1
				
				.gun-number
					font-size 24rpx
					color #999
					margin-bottom 8rpx
				
				.gun-power
					font-size 24rpx
					color #999
					margin-bottom 4rpx

				.gun-remaining
					font-size 24rpx
					color #FFA500
					font-weight 500
			
			.gun-type
				padding 6rpx 16rpx
				border-radius 16rpx
				font-size 22rpx
				color white
				
				&.megawatt-type
					background #2D55E8
				
				&.fast-type
					background #52C41A
	
	.services-content
		display flex
		flex-wrap wrap
		gap 32rpx
		margin-top: 10rpx
		
		.service-item
			display flex
			flex-direction column
			align-items center
			gap 12rpx
			
			.service-icon
				width 48rpx
				height 48rpx
			
			.service-text
				color #666
				font-size 24rpx
				text-align center
	
	.footer
		position fixed
		bottom 0
		left 0
		right 0
		background white
		padding 20rpx 30rpx
		display flex
		align-items center
		box-shadow 0 -4rpx 20rpx rgba(0, 0, 0, 0.08)
		
		.footer-main
			flex 1
			
			.price
				display flex
				align-items baseline
				margin-bottom 8rpx
				
				.price-value
					color #2D55E8
					font-size 42rpx
					font-weight 800
				
				.price-unit
					color #2D55E8
					font-size 24rpx
					margin-left 4rpx
			
			.current-time-period
				color #999
				font-size 22rpx
		
		.footer-button
			width 200rpx
			height 80rpx
			line-height 80rpx
			font-size 28rpx
			font-weight 600
			margin-left 20rpx
			flex-shrink 0
	
	.price-detail-popup, .all-guns-popup
		padding 30rpx
		
		.popup-header
			display flex
			justify-content space-between
			align-items center
			margin-bottom 30rpx
			
			.popup-title
				font-size 32rpx
				font-weight 600
		
		// 移除手动修复，交由组件在可见时自适应计算
	
	.price-periods
		.period-card
			background #f8f9fa
			border-radius 16rpx
			padding 24rpx
			margin-bottom 20rpx
			position relative
			margin-top: 10rpx
			
			&.current
				background linear-gradient(135deg, #e8f0ff, #f0f4ff)
				border 2rpx solid #2D55E8
			
			.period-badge
				position absolute
				top -10rpx
				right 20rpx
				background #2D55E8
				color white
				padding 6rpx 12rpx
				border-radius 12rpx
				font-size 20rpx
			
			.period-time
				font-size 28rpx
				font-weight 600
				color #1a1a1a
				margin-bottom 16rpx
			
			.period-prices
				.price-row
					display flex
					justify-content space-between
					align-items center
					margin-bottom 12rpx
					
					.label
						color #666
						font-size 26rpx
					
					.price-values
						display flex
						align-items center
						gap 12rpx
						
						.original-price
							color #999
							font-size 24rpx
							text-decoration line-through
						
						.current-price
							color #1a1a1a
							font-size 26rpx
							font-weight 500
	
	.guns-grid
		display flex
		flex-direction column
		gap 16rpx
		
		.gun-card
			background white
			border-radius 16rpx
			padding 24rpx
			box-shadow 0 4rpx 16rpx rgba(0, 0, 0, 0.08)
			border 1rpx solid #f0f2f5
			display flex
			align-items center
			gap 20rpx
			
			.gun-status
				margin-right 20rpx
				.status-text
					font-size 24rpx
					font-weight 600
			
		.gun-info
			flex 1
			
			.gun-number
				font-size 24rpx
				color #999
				margin-bottom 8rpx
			
			.gun-power
				font-size 24rpx
				color #999
				margin-bottom 4rpx
				
			.gun-remaining
				font-size 24rpx
				color #FFA500
				font-weight 500
			
		.gun-type
			padding 6rpx 16rpx
			border-radius 16rpx
			font-size 22rpx
			color white
				
			&.megawatt-type
				background #2D55E8
			
			&.fast-type
				background #52C41A
	
	.status-filters
		display flex
		gap 16rpx
		margin-bottom 24rpx
		flex-wrap wrap
		
		.filter-chip
			padding 12rpx 20rpx
			background #f8f9fa
			border-radius 20rpx
			border 1rpx solid transparent
			transition all 0.2s ease
			
			text
				font-size 24rpx
				color #666
			
			&.active
				background #e8f0ff
				border-color #2D55E8
				
				text
					color #2D55E8
					font-weight 500
</style>

<script setup>
    import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
    import { onLoad, onShow, onHide, onUnload } from '@dcloudio/uni-app'
	import navbar from '../../components/navbar/index.vue'
	import request from '../../components/js/request.js'
	import { 
		formatPrice, 
		formatTime, 
		isCurrentPeriod, 
		getStatusText, 
		getServiceIcon, 
		filterGunsByStatus
	} from '../../components/js/stationUtils.js'

	// 圆环进度与颜色
	const getCircleRate = (gun) => {
		// 充电中按 SOC 百分比展示进度，否则 100%
		if (gun && gun.status === 3) {
			const soc = Number(gun.soc || 0)
			return Math.max(0, Math.min(100, isNaN(soc) ? 0 : soc))
		}
		return 100
	}

	const getCircleColor = (status) => {
		const map = {
			1: '#52C41A',     // 空闲
			2: '#FAAD14',     // 占用（未充电）
			3: '#FFA500',     // 充电中
			4: '#FAAD14',     // 预约锁定
			0: '#999999',     // 离网
			255: '#FF4D4F',   // 故障
			21501: '#722ED1', // 升级
			21502: '#1890FF', // 启动
			21503: '#8C8C8C'  // 禁用
		}
		return map[status] || '#FAAD14'
	}
	
	// 响应式数据
	const stationInfo = ref({
		stationName: '',
		address: '',
		distance: 0,
		tags: [],
		parkingInfo: '',
		services: []
	})
	
    const chargingGuns = ref([])
    const pricePeriods = ref([])
    const showPriceDetail = ref(false)
    const showAllGuns = ref(false)
    const activeTab = ref(0)
    const gunStatusFilter = ref('all')
    const refreshTimer = ref(null)
    const currentPlotId = ref(null)
    const priceTabsVisible = ref(false)

    const startAutoRefresh = () => {
        stopAutoRefresh()
        if (currentPlotId.value) {
            refreshTimer.value = setInterval(() => {
                loadStationDetail(currentPlotId.value)
            }, 30000)
        }
    }

    const stopAutoRefresh = () => {
        if (refreshTimer.value) {
            clearInterval(refreshTimer.value)
            refreshTimer.value = null
        }
    }

    const onPricePopupOpened = () => {
        // 渲染完成后再挂载 Tabs，避免初始化时下划线计算容器尺寸为 0
        nextTick(() => {
            priceTabsVisible.value = true
        })
    }

    const onPricePopupClosed = () => {
        priceTabsVisible.value = false
    }

    // 兜底：监听弹窗显隐，确保在某些端 opened/closed 不触发时也能正常显示
    watch(showPriceDetail, (val) => {
        if (val) {
            nextTick(() => {
                priceTabsVisible.value = true
            })
        } else {
            priceTabsVisible.value = false
        }
    })
	
	// 计算属性
	const megawattPrices = computed(() => {
		return pricePeriods.value
			.filter(period => period.chargeCategory === 1)
			.sort((a, b) => a.startTime.localeCompare(b.startTime))
			.map(period => {
				const formattedPeriod = {
					...period,
					startTime: formatTime(period.startTime),
					endTime: formatTime(period.endTime),
					chargingPrice: formatPrice(period.chargingPrice),
					originalChargingPrice: formatPrice(period.originalChargingPrice),
					electricityFee: formatPrice(period.electricityFee),
					originalElectricityFee: formatPrice(period.originalElectricityFee),
					serviceFee: formatPrice(period.serviceFee),
					originalServiceFee: formatPrice(period.originalServiceFee),
					isCurrent: isCurrentPeriod(period)
				}
				return formattedPeriod
			})
	})
	
	const fastChargingPrices = computed(() => {
		return pricePeriods.value
			.filter(period => period.chargeCategory === 2)
			.sort((a, b) => a.startTime.localeCompare(b.startTime))
			.map(period => {
				const formattedPeriod = {
					...period,
					startTime: formatTime(period.startTime),
					endTime: formatTime(period.endTime),
					chargingPrice: formatPrice(period.chargingPrice),
					originalChargingPrice: formatPrice(period.originalChargingPrice),
					electricityFee: formatPrice(period.electricityFee),
					originalElectricityFee: formatPrice(period.originalElectricityFee),
					serviceFee: formatPrice(period.serviceFee),
					originalServiceFee: formatPrice(period.originalServiceFee),
					isCurrent: isCurrentPeriod(period)
				}
				return formattedPeriod
			})
	})
	
	const currentPeriod = computed(() => {
		const now = new Date()
		const currentTime = now.getHours() * 100 + now.getMinutes()
		
		// 优先使用兆冲价格（chargeCategory=1）
		let targetPeriods = pricePeriods.value.filter(period => period.chargeCategory === 1)
		
		// 如果没有兆冲价格，使用快充价格（chargeCategory=2）
		if (targetPeriods.length === 0) {
			targetPeriods = pricePeriods.value.filter(period => period.chargeCategory === 2)
		}
		
		const current = targetPeriods.find(period => {
			const startTime = parseInt(period.startTime.replace(':', ''))
			const endTime = parseInt(period.endTime.replace(':', ''))
			return currentTime >= startTime && currentTime < endTime
		})
		
		if (current) {
			return {
				...current,
				startTime: formatTime(current.startTime),
				endTime: formatTime(current.endTime),
				chargingPrice: formatPrice(current.chargingPrice),
				electricityFee: formatPrice(current.electricityFee),
				serviceFee: formatPrice(current.serviceFee)
			}
		}
		
		return {
			startTime: '00:00',
			endTime: '23:59',
			chargingPrice: '0.0000',
			electricityFee: '0.0000',
			serviceFee: '0.0000'
		}
	})
	
	const filteredGuns = computed(() => {
		return filterGunsByStatus(chargingGuns.value, gunStatusFilter.value)
	})
	
	const navigateToStation = () => {
		uni.openLocation({
			latitude: stationInfo.value.lat || 39.9045035,
			longitude: stationInfo.value.lng || 116.408788,
			name: stationInfo.value.stationName,
			address: stationInfo.value.address || ''
		})
	}
	
	const scan = () => {
		uni.scanCode({
			success: function (res) {
				uni.navigateTo({
					url: `/pages/station/create?key=${res.result}`
				})
			}
		})
	}
	
	const loadStationDetail = (plotId) => {
		// 先获取用户位置
		uni.getLocation({
			type: "gcj02",
			success: (locationRes) => {
				request({
					url: 'charging/stationDetail',
					method: 'GET',
					data: { 
						plotId,
						lat: locationRes.latitude,
						lng: locationRes.longitude
					},
					success: (res) => {
						const data = res.data.data
						stationInfo.value = {
							stationName: data.stationName,
							address: data.address,
							distance: data.distance,
							tags: data.tags || [],
							parkingInfo: data.parkingInfo,
							services: data.services || []
						}
						
						chargingGuns.value = data.chargingGuns || []
						pricePeriods.value = data.pricePeriods || []
					}
				})
			},
			fail: () => {
				// 获取位置失败时使用默认位置（北京）
				request({
					url: 'charging/stationDetail',
					method: 'GET',
					data: { 
						plotId,
						lat: 39.9045035,
						lng: 116.408788
					},
					success: (res) => {
						const data = res.data.data
						stationInfo.value = {
							stationName: data.stationName,
							address: data.address,
							distance: data.distance,
							tags: data.tags || [],
							parkingInfo: data.parkingInfo,
							services: data.services || []
						}
						
						chargingGuns.value = data.chargingGuns || []
						pricePeriods.value = data.pricePeriods || []
					}
				})
			}
		})
	}
	
    onLoad((option) => {
        if (option.plotId) {
            currentPlotId.value = option.plotId
            loadStationDetail(option.plotId)
        }
    })

    onShow(() => {
        startAutoRefresh()
    })

    onHide(() => {
        stopAutoRefresh()
    })

    onUnload(() => {
        stopAutoRefresh()
    })
</script>
