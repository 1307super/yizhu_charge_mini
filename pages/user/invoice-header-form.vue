<template>
	<view class="container">
		<navbar class='navbar' :title='pageTitle'></navbar>
		
		<view class="form-container">
			<!-- 抬头类型选择 -->
			<view class="form-section">
				<text class="section-title">抬头类型</text>
				<view class="radio-group">
					<view 
						class="radio-item" 
						:class="{ active: formData.headerType === 'personal' }"
						@click="selectHeaderType('personal')"
					>
						<view class="radio-icon">
							<view v-if="formData.headerType === 'personal'" class="radio-checked"></view>
						</view>
						<text class="radio-text">个人/非企业单位</text>
					</view>
					<view 
						class="radio-item" 
						:class="{ active: formData.headerType === 'enterprise' }"
						@click="selectHeaderType('enterprise')"
					>
						<view class="radio-icon">
							<view v-if="formData.headerType === 'enterprise'" class="radio-checked"></view>
						</view>
						<text class="radio-text">企业单位</text>
					</view>
				</view>
			</view>
			
			<!-- 企业单位表单 -->
			<view v-if="formData.headerType === 'enterprise'" class="form-section">
				<text class="section-title">企业信息</text>
				
				<view class="form-item">
					<text class="label">公司名称 <text class="required">*</text></text>
					<input 
						class="input" 
						v-model="formData.companyName" 
						placeholder="请输入公司名称"
						:maxlength="100"
					/>
				</view>
				
				<view class="form-item">
					<text class="label">纳税人识别号 <text class="required">*</text></text>
					<input 
						class="input" 
						v-model="formData.taxNumber" 
						placeholder="请输入纳税人识别号"
						:maxlength="20"
					/>
				</view>
				
				<view class="form-item">
					<text class="label">发票类型 <text class="required">*</text></text>
					<view class="radio-group">
						<view 
							class="radio-item" 
							:class="{ active: formData.invoiceType === 'normal' }"
							@click="selectInvoiceType('normal')"
						>
							<view class="radio-icon">
								<view v-if="formData.invoiceType === 'normal'" class="radio-checked"></view>
							</view>
							<text class="radio-text">普票</text>
						</view>
						<view 
							class="radio-item" 
							:class="{ active: formData.invoiceType === 'special' }"
							@click="selectInvoiceType('special')"
						>
							<view class="radio-icon">
								<view v-if="formData.invoiceType === 'special'" class="radio-checked"></view>
							</view>
							<text class="radio-text">专票</text>
						</view>
					</view>
				</view>
				
				<!-- 专票额外字段 -->
				<template v-if="formData.invoiceType === 'special'">
					<view class="form-item">
						<text class="label">公司地址 <text class="required">*</text></text>
						<input 
							class="input" 
							v-model="formData.companyAddress" 
							placeholder="请输入公司地址"
							:maxlength="200"
						/>
					</view>
					
					<view class="form-item">
						<text class="label">公司电话 <text class="required">*</text></text>
						<input 
							class="input" 
							v-model="formData.companyPhone" 
							placeholder="请输入公司电话"
							type="number"
							:maxlength="20"
						/>
					</view>
					
					<view class="form-item">
						<text class="label">公司开户行 <text class="required">*</text></text>
						<input 
							class="input" 
							v-model="formData.bankName" 
							placeholder="请输入开户银行"
							:maxlength="100"
						/>
					</view>
					
					<view class="form-item">
						<text class="label">开户行账号 <text class="required">*</text></text>
						<input 
							class="input" 
							v-model="formData.bankAccount" 
							placeholder="请输入银行账户"
							type="number"
							:maxlength="30"
						/>
					</view>
				</template>
			</view>
			
			<!-- 个人/非企业表单 -->
			<view v-if="formData.headerType === 'personal'" class="form-section">
				<text class="section-title">个人信息</text>
				
				<view class="form-item">
					<text class="label">客户姓名 <text class="required">*</text></text>
					<input 
						class="input" 
						v-model="formData.customerName" 
						placeholder="请输入客户姓名"
						:maxlength="50"
					/>
				</view>
				
				<view class="form-item">
					<text class="label">发票类型</text>
					<view class="invoice-type-display">
						<text class="invoice-type-text">增值税普通发票</text>
					</view>
				</view>
			</view>
			
			<!-- 接收人信息 -->
			<view class="form-section">
				<text class="section-title">接收人信息</text>
				
				<view class="form-item">
					<text class="label">电子邮箱 <text class="required">*</text></text>
					<input 
						class="input" 
						v-model="formData.email" 
						placeholder="请输入电子邮箱"
						type="email"
						:maxlength="50"
					/>
				</view>
				
				<view class="form-item">
					<text class="label">联系电话</text>
					<input 
						class="input" 
						v-model="formData.contactPhone" 
						placeholder="请输入联系电话"
						type="number"
						:maxlength="20"
					/>
				</view>
			</view>
			
			<!-- 设为默认选项 -->
			<view class="form-section">
				<view class="default-option">
					<view class="checkbox-item" :class="{ checked: formData.isDefault }" @click="toggleDefault">
						<view class="checkbox-icon">
							<view v-if="formData.isDefault" class="checkbox-checked">✓</view>
						</view>
						<text class="checkbox-text">设为默认发票抬头</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 底部按钮 -->
		<view class="footer">
			<van-button 
				type="primary" 
				color="#2D55E8"
				:loading="saving"
				@click="saveInvoiceHeader"
				block
				class="save-btn"
				round
			>
				保存
			</van-button>
		</view>
	</view>
</template>

<style scoped>
.container {
	background-color: #f6f6f6;
	min-height: 100vh;
	padding-bottom: 120rpx;
	padding-top: 130rpx;
}

.form-container {
	padding: 30rpx;
}

.form-section {
	background-color: white;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 30rpx;
	display: block;
}

.form-item {
	margin-bottom: 40rpx;
}

.form-item:last-child {
	margin-bottom: 0;
}

.label {
	display: block;
	font-size: 30rpx;
	color: #333;
	margin-bottom: 20rpx;
}

.required {
	color: #ff4444;
}

.input {
	width: 100%;
	height: 88rpx;
	padding: 0 24rpx;
	border: 1rpx solid #E5E7EB;
	border-radius: 12rpx;
	font-size: 30rpx;
	background-color: #F9FAFB;
	box-sizing: border-box;
}

.input:focus {
	border-color: #2D55E8;
	background-color: white;
}

.default-option {
	padding: 20rpx 0;
}

.radio-group {
	display: flex;
	gap: 32rpx;
}

.radio-item {
	display: flex;
	align-items: center;
	padding: 16rpx;
	border-radius: 12rpx;
	cursor: pointer;
	transition: background-color 0.2s;
}

.radio-item.active {
	/* 移除背景色 */
}

.radio-icon {
	width: 36rpx;
	height: 36rpx;
	border: 2rpx solid #ddd;
	border-radius: 50%;
	margin-right: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.radio-item.active .radio-icon {
	border-color: #2D55E8;
}

.radio-checked {
	width: 20rpx;
	height: 20rpx;
	background-color: #2D55E8;
	border-radius: 50%;
}

.radio-text {
	font-size: 30rpx;
	color: #333;
}

.radio-item.active .radio-text {
	color: #2D55E8;
}

.checkbox-item {
	display: flex;
	align-items: center;
	padding: 16rpx;
	cursor: pointer;
}

.checkbox-icon {
	width: 36rpx;
	height: 36rpx;
	border: 2rpx solid #ddd;
	border-radius: 8rpx;
	margin-right: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: white;
}

.checkbox-checked {
	color: white;
	font-size: 24rpx;
	font-weight: bold;
}

.checkbox-item.checked .checkbox-icon {
	background-color: #2D55E8;
	border-color: #2D55E8;
}

.checkbox-text {
	font-size: 30rpx;
	color: #333;
}

.invoice-type-display {
	padding: 24rpx;
	background-color: #f5f5f5;
	border-radius: 12rpx;
	border: 1rpx solid #e5e5e5;
}

.invoice-type-text {
	font-size: 30rpx;
	color: #666;
}

.footer {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: white;
	padding: 20rpx 30rpx;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	border-top: 1rpx solid #eee;
	z-index: 999;
}

.save-btn {
	height: 88rpx;
	line-height: 88rpx;
	font-size: 32rpx;
	font-weight: 600;
	border-radius: 44rpx;
}
</style>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import navbar from '../../components/navbar/index.vue'
import request from '../../components/js/request.js'

const token = uni.getStorageSync('token')
const user = uni.getStorageSync('user')
const saving = ref(false)

// 页面参数
const mode = ref('add') // 'add' | 'edit'
const editData = ref(null)

// 页面标题
const pageTitle = computed(() => {
	return mode.value === 'edit' ? '编辑发票抬头' : '新增发票抬头'
})

// 表单数据
const formData = reactive({
	headerType: 'personal', // 默认选择个人/非企业
	companyName: '',
	taxNumber: '',
	invoiceType: 'normal', // 默认选择普票
	companyAddress: '',
	companyPhone: '',
	bankName: '',
	bankAccount: '',
	customerName: '',
	email: '',
	contactPhone: '',
	isDefault: false
})

// 监听抬头类型变化
watch(() => formData.headerType, (newType) => {
	// 切换到个人时，清空企业相关字段，并设置发票类型为普票
	if (newType === 'personal') {
		formData.companyName = ''
		formData.taxNumber = ''
		formData.invoiceType = 'normal'
		formData.companyAddress = ''
		formData.companyPhone = ''
		formData.bankName = ''
		formData.bankAccount = ''
	} else {
		// 切换到企业时，清空个人相关字段
		formData.customerName = ''
	}
})

// 监听发票类型变化
watch(() => formData.invoiceType, (newType) => {
	// 切换到普票时，清空专票相关字段
	if (newType === 'normal') {
		formData.companyAddress = ''
		formData.companyPhone = ''
		formData.bankName = ''
		formData.bankAccount = ''
	}
})

// 事件处理函数
const selectHeaderType = (type) => {
	console.log('选择抬头类型:', type)
	formData.headerType = type
}

const selectInvoiceType = (type) => {
	console.log('选择发票类型:', type)
	formData.invoiceType = type
}

const toggleDefault = () => {
	console.log('切换默认状态:', !formData.isDefault)
	formData.isDefault = !formData.isDefault
}

// 保持兼容性的事件处理函数
const onHeaderTypeChange = (event) => {
	const type = event.detail || event
	selectHeaderType(type)
}

const onInvoiceTypeChange = (event) => {
	const type = event.detail || event  
	selectInvoiceType(type)
}

const onDefaultChange = (event) => {
	const checked = event.detail || event
	formData.isDefault = checked
}

// 验证表单
const validateForm = () => {
	if (formData.headerType === 'enterprise') {
		if (!formData.companyName.trim()) {
			uni.showToast({
				title: '请输入公司名称',
				icon: 'none'
			})
			return false
		}
		
		if (!formData.taxNumber.trim()) {
			uni.showToast({
				title: '请输入纳税人识别号',
				icon: 'none'
			})
			return false
		}
		
		// 纳税人识别号格式验证
		const taxNumberRegex = /^[A-Z0-9]{15,20}$/
		if (!taxNumberRegex.test(formData.taxNumber.trim())) {
			uni.showToast({
				title: '纳税人识别号格式不正确',
				icon: 'none'
			})
			return false
		}
		
		// 专票额外验证
		if (formData.invoiceType === 'special') {
			if (!formData.companyAddress.trim()) {
				uni.showToast({
					title: '请输入公司地址',
					icon: 'none'
				})
				return false
			}
			
			if (!formData.companyPhone.trim()) {
				uni.showToast({
					title: '请输入公司电话',
					icon: 'none'
				})
				return false
			}
			
			if (!formData.bankName.trim()) {
				uni.showToast({
					title: '请输入开户银行',
					icon: 'none'
				})
				return false
			}
			
			if (!formData.bankAccount.trim()) {
				uni.showToast({
					title: '请输入银行账户',
					icon: 'none'
				})
				return false
			}
		}
	} else {
		if (!formData.customerName.trim()) {
			uni.showToast({
				title: '请输入客户姓名',
				icon: 'none'
			})
			return false
		}
	}
	
	// 邮箱验证
	if (!formData.email.trim()) {
		uni.showToast({
			title: '请输入电子邮箱',
			icon: 'none'
		})
		return false
	}
	
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!emailRegex.test(formData.email.trim())) {
		uni.showToast({
			title: '邮箱格式不正确',
			icon: 'none'
		})
		return false
	}
	
	// 联系电话验证（非必填，但如果填写需要格式正确）
	if (formData.contactPhone && formData.contactPhone.trim()) {
		const phoneRegex = /^1[3-9]\d{9}$/
		if (!phoneRegex.test(formData.contactPhone.trim())) {
			uni.showToast({
				title: '手机号格式不正确',
				icon: 'none'
			})
			return false
		}
	}
	
	return true
}

// 保存发票抬头
const saveInvoiceHeader = () => {
	if (!validateForm()) {
		return
	}
	
	saving.value = true
	
	const requestData = {
		...formData,
		userId: user.memberId
	}
	
	if (mode.value === 'edit' && editData.value) {
		requestData.id = editData.value.id
	}
	
	request({
		url: mode.value === 'edit' ? 'invoice/header/update' : 'invoice/header/create',
		method: 'POST',
		data: requestData,
		success: (res) => {
			saving.value = false
			if (res.data.code === 200) {
				uni.showToast({
					title: mode.value === 'edit' ? '修改成功' : '保存成功'
				})
				setTimeout(() => {
					// 通知列表页刷新数据
					uni.$emit('refreshHeaderList')
					uni.navigateBack()
				}, 1500)
			} else {
				uni.showToast({
					title: res.data.msg || '操作失败',
					icon: 'none'
				})
			}
		},
		fail: (error) => {
			saving.value = false
			uni.showToast({
				title: '操作失败',
				icon: 'none'
			})
		}
	})
}

onLoad((options) => {
	mode.value = options.mode || 'add'
	
	if (mode.value === 'edit' && options.data) {
		try {
			editData.value = JSON.parse(decodeURIComponent(options.data))
			Object.assign(formData, editData.value)
		} catch (e) {
			console.error('解析编辑数据失败:', e)
		}
	} else if (mode.value === 'add') {
		// 新增模式，确保默认值正确设置
		formData.headerType = 'personal'
		formData.invoiceType = 'normal'
		formData.isDefault = false
	}
})

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
	
	// 确保在新增模式下默认值正确
	if (mode.value === 'add') {
		console.log('设置默认值:', formData.headerType, formData.invoiceType)
		formData.headerType = 'personal'
		formData.invoiceType = 'normal'
		formData.isDefault = false
	}
})
</script>