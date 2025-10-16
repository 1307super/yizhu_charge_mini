<template>
	<view class='container'>
		<!-- <navbar class='navbar' title='费用确认'></navbar> -->
		

		<!-- 顶部视觉区（背景图 + 渐变 + 站点信息融合） -->
		<view class='hero'>
			<image src='https://chargeyz.oss-cn-shanghai.aliyuncs.com/miniprogram/create-bg.jpg' mode='aspectFill' class='banner' />
			<view class='banner-mask'></view>
			<!-- 顶部站点信息（叠加在背景上） -->
			<view class='header'>
				<text class='station-name f-db'>{{stationInfo.stationName}}</text>
				<view class='gun-info'>
					<view class='gun-tag'>
						<text class='gun-text'>{{stationInfo.gunNo}}号枪</text>
					</view>
					<view v-if='gunStatusText' class='gun-status' :class='getStatusClass()'>{{gunStatusText}}</view>
					<view v-if='showStationStatus' class='station-status' :style='stationStatusStyle'>
						<view class='status-dot' :style="{ backgroundColor: stationStatusTheme.dot }"></view>
						<text class='status-text'>{{stationStatusText}}</text>
					</view>
				</view>
			</view>
		</view>

		<view class='main'>
			<!-- 充电价格卡片 -->
			<view class='price-card'>
				<text class='price-main'>{{stationInfo.price}} 元/度</text>
				<text class='price-period'>{{stationInfo.pricePeriod}}</text>
			</view>

			<!-- 企业钱包卡片 (条件渲染) -->
			<view v-if='enterpriseWallet.walletBalance !== null' class='enterprise-wallet-card'>
				<view class='card-header'>
					<text class='card-title'>企业钱包</text>
				</view>
				<view class='wallet-content'>
					<view class='enterprise-name'>企业名称: {{enterpriseWallet.enterpriseName || '暂无'}}</view>
					<view class='wallet-info'>
						<view class='wallet-item'>
							<text class='wallet-label'>可用余额</text>
							<text class='wallet-value primary'>¥{{enterpriseWallet.walletBalance.toFixed(2)}}</text>
						</view>
						<view class='wallet-item'>
							<text class='wallet-label'>可用记账金额</text>
							<text class='wallet-value'>¥{{((enterpriseWallet.accountingAmount || 0) - (enterpriseWallet.consumedAmount || 0)).toFixed(2)}}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 付款方式选择卡片 -->
			<view class='payment-card'>
				<view class='card-header'>
					<text class='card-title'>选择付款方式</text>
				</view>
				
				<!-- 企业卡选项 (条件渲染) -->
				<view v-if='enterpriseWallet.walletBalance !== null' class='payment-option' :class='{"selected": paymentMethod === "enterprise"}' @click='selectPaymentMethod("enterprise")'>
					<view class='option-content'>
						<image class='option-icon' src='../../static/image/manage_accounts.png' mode='aspectFit' />
						<text class='option-text'>企业卡</text>
					</view>
					<!-- <van-radio :checked='paymentMethod === "enterprise"' checked-color="#2D55E8"></van-radio> -->
				</view>
				
				<!-- 预付费选项 -->
				<view class='payment-option' :class='{"selected": paymentMethod === "prepay"}' @click='selectPaymentMethod("prepay")'>
					<view class='option-content'>
						<image class='option-icon' src='../../static/image/invoices.png' mode='aspectFit' />
						<text class='option-text'>预付费</text>
						<text class='option-tip'>余额原路退回</text>
					</view>
					<!-- <van-radio :checked='paymentMethod === "prepay"' checked-color="#2D55E8"></van-radio> -->
				</view>

				<!-- 预付费关联操作 - 金额选择 -->
				<view v-if='paymentMethod === "prepay"' class='payment-detail'>
					<!-- 预设金额 -->
					<view class='preset-amounts'>
						<van-button 
							v-for='amount in presetAmounts' 
							:key='amount'
							size='small'
							:type='selectedAmount === amount ? "primary" : "default"'
							:color='selectedAmount === amount ? "#2D55E8" : ""'
							@click='selectAmount(amount)'
							class='amount-btn'
							round
						>
							{{amount}}元
						</van-button>
					</view>
					
					<!-- 自定义金额 -->
					<view class='custom-amount'>
						<input 
							class='amount-input' 
							v-model="customAmount" 
							type="digit" 
							placeholder='自定义金额(最低10元)' 
							@input='onCustomAmountInput'
						/>
					</view>
				</view>
			</view>

			<!-- 充电管理卡片 (企业卡时显示) -->
			<view v-if='paymentMethod === "enterprise"' class='charge-management-card'>
				<view class='card-header'>
					<text class='card-title'>充电管理</text>
				</view>
				<view class='charge-content'>
					<view class='charge-label'>充电量达到电池电量</view>
					<view class='percentage-display'>{{chargePercentage}}%</view>
					<view class='progress-container'>
						<van-slider 
							:value="chargePercentage" 
							@change="onChargePercentageChange"
							@drag="onChargePercentageChange"
							:min="0" 
							:max="100" 
							active-color="#2D55E8"
							inactive-color="#f0f2f5"
							:bar-height="8"
							:button-size="20"
						/>
					</view>
					<view class='charge-tip'>充电不超过90%, 更利于电池健康,将有效缩短充电时长。</view>
				</view>
			</view>
		</view>

		<!-- 底部悬浮按钮 -->
		<view class='footer'>
			<view v-if='buttonInfo.tip && buttonInfo.disabled' class='status-tip'>
				<text class='tip-text'>{{buttonInfo.tip}}</text>
			</view>
			<van-button
				round
				block
				:color='buttonInfo.disabled ? "#d9d9d9" : "#2D55E8"'
				:disabled='buttonInfo.disabled'
				@click='startCharging'
				class='footer-button'
			>
				{{buttonInfo.text}}
			</van-button>
		</view>

		<!-- 停止码弹窗 -->
		<view v-if='showStopCodeModal' class='stop-code-modal-overlay'>
			<view class='stop-code-modal'>
				<!-- 关闭按钮 -->
				<view class='modal-close' @click='closeStopCodeModal'>
					<text class='close-icon'>✕</text>
				</view>

				<!-- 标题 -->
				<view class='modal-header'>
					<text class='modal-title'>{{stationInfo.chargingData?.plateNo || ''}} 充电订单信息</text>
				</view>

				<!-- 内容 -->
				<view class='modal-content'>
					<!-- 枪号 -->
					<view class='gun-number'>{{stationInfo.gunNo}}号枪</view>

					<!-- 进度条 -->
					<view class='charging-progress'>
						<view class='progress-bar-container'>
							<view class='progress-bar-bg'>
								<view class='progress-bar-fill' :style='{width: (stationInfo.chargingData?.soc || 0) + "%"}'></view>
							</view>
						</view>
						<text class='progress-text'>充电中 已完成{{stationInfo.chargingData?.soc || 0}}%</text>
					</view>

					<!-- 充电信息 -->
					<view class='charging-info'>
						<view class='info-item'>
							<text class='info-label'>充电功率</text>
							<text class='info-value'>{{stationInfo.chargingData?.power || 0}} KW</text>
						</view>
						<view class='info-item'>
							<text class='info-label'>剩余充电时长</text>
							<text class='info-value'>{{stationInfo.chargingData?.remainingTime + '分钟' || '计算中'}}</text>
						</view>
					</view>

					<!-- 停止码输入 -->
					<view class='stop-code-input-section'>
						<text class='input-label'>请输入车队停止码</text>
						<input
							class='stop-code-input'
							v-model='stopCode'
							type='number'
							placeholder='请输入4位停止码'
							maxlength='4'
						/>
					</view>

					<!-- 结束充电按钮 -->
					<van-button
						round
						block
						:color='stopCode.length === 4 ? "#2D55E8" : "#d9d9d9"'
						:disabled='stopCode.length !== 4'
						@click='stopChargeByStopCode'
						class='stop-button'
					>
						结束充电
					</van-button>
				</view>
			</view>
		</view>
	</view>
</template>


<style scoped>
.container{
    background-color: #F6F7F9;
    min-height: 100vh;
    padding-bottom: 240rpx;
}

	/* 顶部视觉区 */
	.hero{
		position: relative;
		height: 360rpx;
		overflow: hidden;
	}
	.banner{
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
		transform: scale(1.01);
	}
	/* 底部向内容区的柔和过渡 */
	.banner-mask{
		position: absolute;
		left: 0; right: 0; bottom: 0;
		height: 60rpx;
		background: linear-gradient(to bottom, rgba(246,247,249,0) 0%, rgba(246,247,249,0.8) 60%, #F6F7F9 100%);
		pointer-events: none;
	}

	/* 叠加的站点信息卡，半透明扁平化 */
.header{
	position: absolute;
	left: 24rpx;
	right: 24rpx;
	bottom: 25rpx;
	padding: 28rpx;
	background: rgba(255,255,255,0.72);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	border-radius: 16rpx;
	border: 1rpx solid rgba(255,255,255,0.6);
	text-align: left;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.03);
}

	.main{
		margin: 20rpx;
	}
	.station-name{
		font-family: Microsoft YaHei;
		font-weight: 700;
		font-size: 36rpx;
		color: #1a1a1a;
		line-height: 60rpx;
		margin-bottom: 20rpx;
	}
	.gun-info{
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 12rpx;
		flex-wrap: wrap;
	}
	.gun-tag{
		display: flex;
		align-items: center;
		gap: 8rpx;
		background-color: #F3F4F6;
		padding: 8rpx 12rpx;
		border-radius: 16rpx;
		border: 1rpx solid #E5E7EB;
	}
	.gun-icon{
		width: 32rpx;
		height: 32rpx;
		flex-shrink: 0;
	}
	.gun-text{
		font-size: 26rpx;
		color: #6B7280;
		font-weight: 500;
		line-height: 1;
	}
	.gun-status{
		font-size: 24rpx;
		padding: 6rpx 12rpx;
		border-radius: 12rpx;
		font-weight: 500;
	}
	.gun-status.status-free{
		background-color: #e8f5e8;
		color: #52c41a;
	}
	.gun-status.status-occupied{
		background-color: #fff7e6;
		color: #fa8c16;
	}
	.gun-status.status-charging{
		background-color: #e6f7ff;
		color: #1890ff;
	}
	.gun-status.status-fault{
		background-color: #fff2f0;
		color: #f5222d;
	}
	.gun-status.status-offline{
		background-color: #f5f5f5;
		color: #8c8c8c;
	}
	.station-status{
		display: inline-flex;
		align-items: center;
		gap: 10rpx;
		padding: 8rpx 20rpx;
		border-radius: 999rpx;
		font-size: 24rpx;
		font-weight: 600;
		border: 1rpx solid transparent;
		line-height: 1;
		box-shadow: 0 6rpx 12rpx rgba(45,85,232,0.08);
	}
	.station-status .status-dot{
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%;
		background-color: currentColor;
		opacity: 0.88;
	}
	.station-status .status-text{
		line-height: 1;
		letter-spacing: 1rpx;
	}

	/* 价格卡片 */
	.price-card{
		background-color: #fff;
		padding: 28rpx;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		text-align: center;
		border: 1rpx solid #EEF0F3;
		box-shadow: none;
	}
.price-main{
    display: block;
    font-size: 36rpx;
    font-weight: 600;
    color: #FF8C00;
    margin-bottom: 8rpx;
}
.price-period{
    font-size: 24rpx;
    color: #666;
    font-weight: 400;
}

	/* 企业钱包卡片 */
	.enterprise-wallet-card{
		background-color: #fff;
		padding: 28rpx;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		border: 1rpx solid #EEF0F3;
		box-shadow: none;
	}
	.card-header{
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24rpx;
	}
	.card-title{
		font-size: 32rpx;
		font-weight: 600;
		color: #1a1a1a;
	}
	.wallet-content .enterprise-name{
		font-size: 28rpx;
		color: #666;
		margin-bottom: 20rpx;
	}
	.wallet-info{
		display: flex;
		flex-direction: column;
		gap: 16rpx;
	}
	.wallet-item{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.wallet-label{
		font-size: 28rpx;
		color: #666;
	}
	.wallet-value{
		font-size: 28rpx;
		font-weight: 600;
		color: #1a1a1a;
	}
	.wallet-value.primary{
		color: #2D55E8;
		font-size: 32rpx;
		font-weight: 700;
	}

	/* 付款方式卡片 */
	.payment-card{
		background-color: #fff;
		padding: 28rpx;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		border: 1rpx solid #EEF0F3;
		box-shadow: none;
	}
	.payment-option{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx 0;
		transition: all 0.2s ease;
	}
	.payment-option:not(:last-child){
		border-bottom: 1rpx solid #f0f2f5;
	}
	.payment-option.selected{
		background-color: #F0F4FF;
		border-radius: 12rpx;
		padding: 24rpx 16rpx;
		margin: 0 -16rpx;
		border-left: 4rpx solid #2D55E8;
		padding-left: 20rpx;
	}
	.payment-option.selected .option-text{
		color: #2D55E8;
		font-weight: 600;
	}
	.option-content{
		display: flex;
		align-items: center;
		flex: 1;
		gap: 16rpx;
	}
.option-icon{
    width: 40rpx;
    height: 40rpx;
    flex-shrink: 0;
    display: block;
    border-radius: 8rpx;
}
	.option-text{
		font-size: 28rpx;
		color: #1a1a1a;
		font-weight: 500;
	}
	.option-tip{
		font-size: 22rpx;
		color: #999;
		margin-left: 8rpx;
	}
	
	/* 充电管理卡片 */
	.charge-management-card{
		background-color: #fff;
		padding: 28rpx;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		border: 1rpx solid #EEF0F3;
		box-shadow: none;
	}
.charge-content{
    text-align: left;
}
	.charge-label{
		font-size: 28rpx;
		color: #666;
		margin-bottom: 16rpx;
	}
.percentage-display{
    font-size: 36rpx;
    font-weight: 600;
    color: #2D55E8;
    margin-bottom: 16rpx;
    text-align: left;
}
	.progress-container{
		margin: 0 20rpx 24rpx;
	}
	.charge-tip{
		font-size: 24rpx;
		color: #9A6B00;
		line-height: 1.5;
		background-color: #FFF8E8;
		padding: 12rpx 16rpx;
		border-radius: 10rpx;
		border: 1rpx solid #F5E2BD;
	}
	
	/* 支付详情 */
	.payment-detail{
		margin-top: 24rpx;
		padding-top: 24rpx;
		border-top: 1rpx solid #f0f2f5;
	}
	.detail-header{
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}
	.detail-title{
		font-size: 28rpx;
		color: #1a1a1a;
		font-weight: 500;
	}
	.percentage-text{
		font-size: 28rpx;
		color: #2D55E8;
		font-weight: 600;
	}

	/* 预设金额 */
	.preset-amounts{
		display: flex;
		gap: 16rpx;
		margin-bottom: 20rpx;
		flex-wrap: wrap;
	}
	.amount-btn{
		flex: 1;
		min-width: 140rpx;
		height: 64rpx;
	}

	/* 自定义金额 */
	.custom-amount{
		margin-top: 20rpx;
	}
	.amount-input{
		width: 100%;
		height: 88rpx;
		padding: 0 24rpx;
		border: 1rpx solid #E5E7EB;
		border-radius: 14rpx;
		font-size: 28rpx;
		box-sizing: border-box;
		background-color: #F7F9FC;
		transition: border-color 0.18s ease;
	}
	.amount-input:focus{
		border-color: #2D55E8;
		background-color: #fff;
		box-shadow: none;
	}

	/* 底部按钮 */
.footer{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    padding: 10rpx 0rpx calc(20rpx + env(safe-area-inset-bottom));
    border-top: 1rpx solid #EEF0F3;
    box-shadow: none;
}
	.status-tip{
		text-align: center;
		margin-bottom: 16rpx;
	}
	.tip-text{
		font-size: 26rpx;
		color: #A8071A;
		background-color: #FFF1F0;
		padding: 8rpx 16rpx;
		border-radius: 12rpx;
		display: inline-block;
		border: 1rpx solid #FFD7D7;
	}
.footer-button{
    width: 60%;
    max-width: 690rpx;
    box-sizing: border-box;
    height: 88rpx;
    line-height: 88rpx;
    font-size: 32rpx;
    font-weight: 600;
    margin: 0 auto;
    display: block;
    border: none;
		z-idnex: 100;
}

	/* 停止码弹窗样式 */
	.stop-code-modal-overlay{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40rpx;
	}
	.stop-code-modal{
		position: relative;
		width: 100%;
		max-width: 600rpx;
		background-color: #fff;
		border-radius: 24rpx;
		overflow: hidden;
		box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.2);
	}
	.modal-close{
		position: absolute;
		top: 24rpx;
		right: 24rpx;
		width: 56rpx;
		height: 56rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(0, 0, 0, 0.05);
		border-radius: 50%;
		z-index: 10;
		cursor: pointer;
		transition: background-color 0.2s;
	}
	.modal-close:active{
		background-color: rgba(0, 0, 0, 0.1);
	}
	.close-icon{
		font-size: 36rpx;
		color: #666;
		font-weight: 300;
	}
	.modal-header{
		padding: 32rpx 32rpx 24rpx;
		border-bottom: 1rpx solid #f0f0f0;
		text-align: center;
	}
	.modal-title{
		font-size: 32rpx;
		font-weight: 600;
		color: #1a1a1a;
	}
	.modal-content{
		padding: 32rpx;
	}
	.gun-number{
		text-align: center;
		font-size: 48rpx;
		font-weight: 700;
		color: #2D55E8;
		margin-bottom: 32rpx;
	}
	.charging-progress{
		margin-bottom: 32rpx;
	}
	.progress-bar-container{
		margin-bottom: 16rpx;
	}
	.progress-bar-bg{
		width: 100%;
		height: 20rpx;
		background-color: #f0f0f0;
		border-radius: 10rpx;
		overflow: hidden;
	}
	.progress-bar-fill{
		height: 100%;
		background: linear-gradient(90deg, #2D55E8 0%, #5B8EFF 100%);
		border-radius: 10rpx;
		transition: width 0.3s ease;
	}
	.progress-text{
		display: block;
		text-align: center;
		font-size: 28rpx;
		color: #666;
		font-weight: 500;
	}
	.charging-info{
		display: flex;
		justify-content: space-between;
		gap: 24rpx;
		margin-bottom: 32rpx;
		padding: 24rpx;
		background-color: #F6F7F9;
		border-radius: 16rpx;
	}
	.info-item{
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8rpx;
	}
	.info-label{
		font-size: 24rpx;
		color: #999;
	}
	.info-value{
		font-size: 28rpx;
		font-weight: 600;
		color: #1a1a1a;
	}
	.stop-code-input-section{
		margin-bottom: 32rpx;
	}
	.input-label{
		display: block;
		font-size: 28rpx;
		color: #1a1a1a;
		margin-bottom: 16rpx;
		font-weight: 500;
	}
	.stop-code-input{
		width: 100%;
		height: 88rpx;
		padding: 0 24rpx;
		border: 1rpx solid #E5E7EB;
		border-radius: 14rpx;
		font-size: 28rpx;
		box-sizing: border-box;
		background-color: #F7F9FC;
		transition: border-color 0.18s ease;
	}
	.stop-code-input:focus{
		border-color: #2D55E8;
		background-color: #fff;
	}
	.stop-button{
		height: 88rpx;
		line-height: 88rpx;
		font-size: 32rpx;
		font-weight: 600;
	}

</style>

<script setup>
	import { ref, reactive, computed, onUnmounted } from 'vue'
	import { onLoad, onShow, onHide } from '@dcloudio/uni-app'
	import navbar from '../../components/navbar/index.vue'
	import request from '../../components/js/request.js'
	import {
		getStatusText,
		getStatusClass as getStationStatusClass,
		getStationStatusText,
		getStationStatusColor,
		isStationAvailable
	} from '../../components/js/stationUtils.js'
	
	const app = getApp()
	const user = uni.getStorageSync('user')
	const token = uni.getStorageSync('token')
	
	// 页面参数
	const stationId = ref('')
	const gunNumber = ref('')
	
	// 定时器
	const refreshTimer = ref(null)
	
	// 站点信息
	const stationInfo = reactive({
		stationName: '',
		gunNo: '',
		price: 0,
		pricePeriod: '',
		status: null,
		stationStatus: null,  // 站点状态
		allowStopCode: false,
		chargingData: null
	})
	
	// 企业钱包初始状态
	const initialWalletState = {
		enterpriseName: null,
		walletBalance: null,
		accountingAmount: null,
		consumedAmount: null,
		minLimit: null
	}

	// 企业钱包信息
	const enterpriseWallet = reactive({
		...initialWalletState
	})

	const resetEnterpriseWallet = () => {
		Object.assign(enterpriseWallet, initialWalletState)
	}
	
	// 付款方式相关
	const paymentMethod = ref('prepay') // 'enterprise' | 'prepay'
	
	// 企业卡相关 - 充电百分比
	const chargePercentage = ref(80)
	
	// 预付费相关
	const presetAmounts = ref([50, 100, 300, 500])
	const selectedAmount = ref(50)
	const customAmount = ref('')

	// 停止码弹窗相关
	const showStopCodeModal = ref(false)
	const stopCode = ref('')
	
	// 获取最终支付金额
	const finalAmount = computed(() => {
		if (customAmount.value) {
			return parseFloat(customAmount.value)
		}
		return selectedAmount.value
	})
	
	// 获取充电枪状态文字
	const gunStatusText = computed(() => {
		if (stationInfo.status === null) return ''
		return getStatusText(stationInfo.status)
	})

	// 获取站点状态展示主题
	const stationStatusText = computed(() => {
		const status = stationInfo.stationStatus
		if (status === null || status === undefined || status === '') return ''
		return getStationStatusText(status)
	})

	const stationStatusTheme = computed(() => {
		const theme = getStationStatusColor(stationInfo.stationStatus)
		return {
			bg: theme.bg,
			text: theme.text,
			border: theme.border || 'transparent',
			dot: theme.dot || theme.text,
			shadow: theme.shadow || 'none'
		}
	})

	const stationStatusStyle = computed(() => {
		if (!stationStatusText.value) return {}
		const theme = stationStatusTheme.value
		return {
			background: theme.bg,
			color: theme.text,
			borderColor: theme.border,
			boxShadow: theme.shadow
		}
	})

	const showStationStatus = computed(() => {
		return !!stationStatusText.value && !isStationAvailable(stationInfo.stationStatus)
	})
	
	// 判断是否可以充电
	const canCharge = computed(() => {
		// 站点状态必须为50（正常使用），且充电枪状态为2（占用未充电）时才可以充电
		const stationOk = isStationAvailable(stationInfo.stationStatus)
		const gunOk = stationInfo.status === 2
		return stationOk && gunOk
	})
	
	// 计算企业钱包可用余额
	const availableBalance = computed(() => {
		if (enterpriseWallet.walletBalance === null || enterpriseWallet.accountingAmount === null || enterpriseWallet.consumedAmount === null) {
			return 0
		}
		return enterpriseWallet.walletBalance + enterpriseWallet.accountingAmount - enterpriseWallet.consumedAmount
	})
	
	// 检查企业钱包余额是否充足
	const isEnterpriseBalanceSufficient = computed(() => {
		if (enterpriseWallet.minLimit === null) return true
		return availableBalance.value >= enterpriseWallet.minLimit
	})
	
	// 获取按钮文字和提示信息
	const buttonInfo = computed(() => {
		if (stationInfo.status === null) {
			return { text: '立即充电', disabled: true, tip: '加载中...' }
		}
console.log(111)
		// 优先检查站点状态
		if (!isStationAvailable(stationInfo.stationStatus)) {
			const statusText = getStationStatusText(stationInfo.stationStatus)
			return {
				text: `站点${statusText}`,
				disabled: true,
				tip: `当前站点处于${statusText}状态，暂时无法充电`
			}
		}

		// 然后检查充电枪状态
		switch (stationInfo.status) {
			case 1: // 空闲
				return { text: '立即充电', disabled: true, tip: '请先插枪后充电' }
			case 2: // 占用未充电
				return { text: '立即充电', disabled: false, tip: '' }
			case 3: // 充电中
				return { text: '充电中', disabled: true, tip: '该枪正在充电中' }
			case 4: // 预约锁定
				return { text: '已预约', disabled: true, tip: '该枪已被预约锁定' }
			case 0: // 离网
				return { text: '设备离网', disabled: true, tip: '设备处于离网状态' }
			case 255: // 故障
				return { text: '设备故障', disabled: true, tip: '设备出现故障，无法使用' }
			case 21501: // 升级中
				return { text: '设备升级', disabled: true, tip: '设备正在升级中' }
			case 21502: // 启动中
				return { text: '启动中', disabled: true, tip: '充电启动中，请稍候' }
			case 21503: // 禁用
				return { text: '设备禁用', disabled: true, tip: '设备已被禁用' }
			default:
				return { text: '立即充电', disabled: true, tip: '设备状态异常' }
		}
	})
	
	// 获取站点信息和价格
	const getStationInfo = () => {
		request({
			url: 'charging/port/info',
			data: { stationId: stationId.value, gunNumber: gunNumber.value },
			method: 'GET',
			success: (res) => {
				if (res.data.code === 200) {
					const data = res.data.data || {}
					const { wallet, stationStatus, status, ...stationData } = data
					Object.assign(stationInfo, stationData)
					stationInfo.status = status ?? stationInfo.status
					stationInfo.stationStatus = stationStatus ?? stationInfo.stationStatus ??  0

					// 更新企业钱包信息
					if (wallet) {
						resetEnterpriseWallet()
						Object.assign(enterpriseWallet, wallet)
						if (wallet.walletBalance !== null && wallet.walletBalance !== undefined) {
							paymentMethod.value = 'enterprise'
						} else {
							paymentMethod.value = 'prepay'
						}
					} else {
						resetEnterpriseWallet()
						paymentMethod.value = 'prepay'
					}

					// 检查是否允许使用停止码停止充电
					if (stationInfo.allowStopCode && stationInfo.chargingData) {
						showStopCodeModal.value = true
					}
				}
			},
			fail: (error) => {
				console.error('获取站点信息失败:', error)
			}
		})
	}
	
	// 选择付款方式
	const selectPaymentMethod = (method) => {
		paymentMethod.value = method
		// 切换支付方式时清空自定义金额
		if (method === 'prepay') {
			customAmount.value = ''
			selectedAmount.value = 50
		}
	}
	
	// 充电百分比变化
	const onChargePercentageChange = (e) => {
		const val = (e && e.detail && (e.detail.value ?? e.detail)) ?? e
		const percentage = Number(val)
		// 确保不低于80%
		chargePercentage.value = Math.max(80, Math.min(100, percentage))
	}
	
	// 进度条点击事件 (暂不实现交互，仅显示)
	const onProgressClick = () => {
		// 进度条点击暂不实现交互功能
	}
	
	// 选择预设金额
	const selectAmount = (amount) => {
		selectedAmount.value = amount
		customAmount.value = ''
	}
	
	// 自定义金额输入
	const onCustomAmountInput = () => {
		if (customAmount.value) {
			selectedAmount.value = null
		}
	}
	
	// 获取状态样式类
	const getStatusClass = () => {
		if (stationInfo.status === null) return ''
		return getStationStatusClass(stationInfo.status)
	}
	
	// 获取充电枪状态
	const getGunStatus = () => {
		request({
			url: 'charging/port/status',
			data: { stationId: stationId.value, gunNumber: gunNumber.value },
			method: 'GET',
			success: (res) => {
				if (res.data.code === 200) {
					// 如果状态为null则当作0(离线)处理
					stationInfo.status = res.data.data === null ? 0 : res.data.data
				}
			},
			fail: (error) => {
				console.error('获取充电枪状态失败:', error)
			}
		})
	}
	
	// 启动定时刷新 - 改为请求状态接口
	const startAutoRefresh = () => {
		stopAutoRefresh()
		refreshTimer.value = setInterval(() => {
			getGunStatus()
		}, 5000) // 每5秒刷新一次状态
	}
	
	// 停止定时刷新
	const stopAutoRefresh = () => {
		if (refreshTimer.value) {
			clearInterval(refreshTimer.value)
			refreshTimer.value = null
		}
	}
	
	// 订阅模板消息
	const subscribeMessage = () => {
		return new Promise((resolve) => {
			uni.requestSubscribeMessage({
				tmplIds: ['uxfRzq-jozvWu3dpxUPwr_Zo05LbB_U3TugCjOpmwTo'],
				success: (res) => {
					console.log('订阅消息成功:', res)
					resolve(true)
				},
				fail: (err) => {
					console.log('订阅消息失败:', err)
					resolve(false) // 不管成功失败都继续执行
				}
			})
		})
	}

	// 开始充电
	const startCharging = async () => {
		// 检查充电枪状态
		if (!canCharge.value) {
			uni.showToast({
				title: buttonInfo.value.tip || '当前状态不允许充电',
				icon: 'none'
			})
			return
		}
		
		// 检查企业钱包余额
		if (paymentMethod.value === 'enterprise' && !isEnterpriseBalanceSufficient.value) {
			uni.showToast({
				title: '企业钱包余额不足, 最少需要:' + enterpriseWallet.minLimit + '元',
				icon: 'none'
			})
			return
		}
		
		if (!token) {
			uni.setStorageSync('redirecturl', `/pages/station/create?stationId=${stationId.value}&gunNumber=${gunNumber.value}`)
			uni.navigateTo({
				url: '/pages/user/login'
			})
			return
		}
		
		// 校验
		if (paymentMethod.value === 'prepay') {
			const amount = finalAmount.value
			if (!amount || amount < 1) {
				uni.showToast({
					title: '自定义金额不能少于10元',
					icon: 'none'
				})
				return
			}
		}
		
		// 先订阅模板消息，不管成功失败都继续执行
		await subscribeMessage()
		
		if (paymentMethod.value === 'enterprise') {
			startEnterpriseCharging()
		} else {
			startPrepayCharging()
		}
	}
	
	// 企业卡充电
	const startEnterpriseCharging = () => {
		uni.showLoading({
			title: '启动中'
		})
		
		request({
			url: 'charging/start/enterprise',
			method: 'POST',
			data: {
				stationId: stationId.value,
				gunNumber: gunNumber.value,
				soc: chargePercentage.value
			},
			success: (res) => {
				if (res.data.code === 200) {
					uni.showToast({
						title: '成功开启充电'
					})
					setTimeout(() => {
						uni.navigateTo({
							url: `/pages/station/powering?batchNo=${res.data.data}&stationName=${stationInfo.stationName}&gunNo=${stationInfo.gunNo}`
						})
					}, 200)
				} else {
					uni.showToast({
						title: res.data.msg || '充电启动失败',
						icon: 'none'
					})
				}
			},
			fail: (error) => {
				console.error('充电启动失败:', error)
				uni.showToast({
					title: '充电启动失败',
					icon: 'none'
				})
			},
			complete: () => {
				uni.hideLoading()
			}
		})
	}
	
	// 检查支付状态
	const checkPayStatus = (outTradeNo) => {
		return new Promise((resolve, reject) => {
			request({
				url: 'pay/checkPayStatus',
				method: 'GET',
				data: { outTradeNo: outTradeNo },
				success: (res) => {
					if (res.data.code === 200) {
						resolve(res.data.data) // 返回批次号
					} else {
						reject(new Error(res.data.msg || '检查支付状态失败'))
					}
				},
				fail: (error) => {
					reject(error)
				}
			})
		})
	}

	// 轮询检查支付状态
	const pollPayStatus = async (outTradeNo) => {
		let attempts = 0
		const maxAttempts = 60 // 最多检查60次，即60秒
		
		const checkStatus = async () => {
			try {
				attempts++
				const batchNo = await checkPayStatus(outTradeNo)
				
				if (batchNo && batchNo !== "0") {
					// 支付成功且有批次号，跳转到充电页面
					uni.hideLoading()
					uni.showToast({
						title: '启动成功'
					})
					setTimeout(() => {
						uni.navigateTo({
							url: `/pages/station/powering?batchNo=${batchNo}&stationName=${stationInfo.stationName}&gunNo=${stationInfo.gunNo}`
						})
					}, 200)
				} else {
					// 批次号为0，说明还未支付成功，继续轮询
					if (attempts < maxAttempts) {
						setTimeout(checkStatus, 1000) // 1秒后再次检查
					} else {
						// 超时处理
						uni.hideLoading()
						uni.showToast({
							title: '支付状态检查超时，请稍后重试',
							icon: 'none'
						})
					}
				}
			} catch (error) {
				console.error('检查支付状态失败:', error)
				if (attempts < maxAttempts) {
					setTimeout(checkStatus, 1000) // 出错也继续重试
				} else {
					uni.hideLoading()
					uni.showToast({
						title: '支付状态检查失败，请稍后重试',
						icon: 'none'
					})
				}
			}
		}
		
		checkStatus()
	}

	// 关闭停止码弹窗
	const closeStopCodeModal = () => {
		showStopCodeModal.value = false
		stopCode.value = ''
	}

	// 停止码停止充电
	const stopChargeByStopCode = () => {
		if (!stopCode.value) {
			uni.showToast({
				title: '请输入停止码',
				icon: 'none'
			})
			return
		}

		uni.showLoading({
			title: '正在停止...'
		})

		request({
			url: 'charging/stop/byStopCode',
			method: 'POST',
			data: {
				stationId: stationId.value,
				gunNumber: gunNumber.value,
				stopCode: stopCode.value
			},
			success: (res) => {
				uni.hideLoading()
				if (res.data.code === 200) {
					uni.showToast({
						title: res.data.msg || '充电已停止',
						icon: 'success'
					})
					closeStopCodeModal()
					// 刷新站点信息
					getStationInfo()
				} else {
					uni.showToast({
						title: res.data.msg || '停止失败',
						icon: 'none'
					})
				}
			},
			fail: (error) => {
				uni.hideLoading()
				console.error('停止充电失败:', error)
				uni.showToast({
					title: '停止充电失败',
					icon: 'none'
				})
			}
		})
	}

	// 预付费充电
	const startPrepayCharging = () => {
		request({
			url: 'pay/wxpay/prepay',
			method: 'POST',
			data: {
				stationId: stationId.value,
				gunNumber: gunNumber.value,
				amount: finalAmount.value
			},
			success: (res) => {
				if (res.data.code === 200) {
					const { outTradeNo, paymentParams } = res.data.data
					
					// 调起微信支付
					uni.requestPayment({
						provider: 'wxpay',
						...paymentParams,
						success: (payRes) => {
							// 支付成功后开始轮询检查支付状态
							uni.showLoading({
								title: '启动中'
							})
							pollPayStatus(outTradeNo)
						},
						fail: (payErr) => {
							console.error('支付失败:', payErr)
							uni.showToast({
								title: '支付失败',
								icon: 'none'
							})
						}
					})
				} else {
					uni.showToast({
						title: res.data.msg || '预付费订单创建失败',
						icon: 'none'
					})
				}
			},
			fail: (error) => {
				console.error('预付费订单创建失败:', error)
				uni.showToast({
					title: '充电启动失败',
					icon: 'none'
				})
			}
		})
	}
	const qrcodeContent = ref('')
	onLoad(option => {
		let url = option.key || decodeURIComponent(option.q)
		wx.setNavigationBarTitle({
				title: '费用确认'
		});

		// 如果通过key参数传入，解析URL获取stationId和gunNumber
		if (url) {
			try {
				// URL格式: https://dev.echargeyz.com/qrcode/code/295|1
				// 提取 /code/ 后面的内容
				const match = url.match(/\/code\/(.+)/)
				if (match && match[1]) {
					const params = match[1].split('|')
					if (params.length === 2) {
						stationId.value = params[0]
						gunNumber.value = params[1]
					}
				}
			} catch (error) {
				console.error('解析key参数失败:', error)
			}
		}

		// 兼容直接传参的方式
		if (option.stationId) {
			stationId.value = option.stationId
		}
		if (option.gunNumber) {
			gunNumber.value = option.gunNumber
		}
		if (!stationId.value || !gunNumber.value) {
			uni.showToast({
				title: '不支持的二维码',
				icon: 'none'
			})
			return
		}

		// 获取数据
		getStationInfo()
	})
	
	onShow(() => {
		// 页面显示时启动定时刷新
		startAutoRefresh()
	})
	
	onHide(() => {
		// 页面隐藏时停止定时刷新
		stopAutoRefresh()
	})
	
	onUnmounted(() => {
		// 组件卸载时停止定时刷新
		stopAutoRefresh()
	})
</script>
