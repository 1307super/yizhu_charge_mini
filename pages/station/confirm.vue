<template>
    <view class="confirm-container">
        <!-- 顶部站点信息 -->
        <view class="station-info">
            <view class="station-name">{{ stationName }}</view>
            <view class="gun-info">
                <svg class="gun-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M864 320H640v-64c0-35.2-28.8-64-64-64H448c-35.2 0-64 28.8-64 64v64H160c-17.6 0-32 14.4-32 32v192c0 17.6 14.4 32 32 32h64v256c0 35.2 28.8 64 64 64h64c17.6 0 32-14.4 32-32V608h128v256c0 35.2 28.8 64 64 64h64c17.6 0 32-14.4 32-32V608h64c17.6 0 32-14.4 32-32V352c0-17.6-14.4-32-32-32zM448 256h128v64H448v-64z m128 576H448V608h128v224z m256-224H640V384h192v192z" fill="#2c2c2c"></path></svg>
                <text>充电枪: {{ gunNo }}</text>
            </view>
        </view>

        <!-- 充电价格 -->
        <view class="card price-card">
            <view class="price">{{ price }} <text class="unit">元/度</text></view>
            <view class="period">{{ pricePeriod }}</view>
        </view>

        <!-- 企业钱包 -->
        <view class="card enterprise-card" v-if="enterpriseWallet.balance > 0">
            <view class="card-title">企业卡</view>
            <view class="wallet-details">
                <view>余额: ¥{{ enterpriseWallet.balance }}</view>
                <view>授信金额: ¥{{ enterpriseWallet.creditAmount }}</view>
            </view>
        </view>

        <!-- 付款方式 -->
        <view class="card payment-card">
            <view class="card-title">选择付款方式</view>
            <view class="payment-options">
                <view class="option" :class="{ active: paymentMethod === 'enterprise' }" @click="paymentMethod = 'enterprise'" v-if="enterpriseWallet.balance > 0">
                    企业卡
                </view>
                <view class="option" :class="{ active: paymentMethod === 'prepay' }" @click="paymentMethod = 'prepay'">
                    预付费
                </view>
            </view>

            <!-- 企业卡充电设置 -->
            <view class="charge-setting" v-if="paymentMethod === 'enterprise'">
                <text>充电至: {{ chargeToPercent }}%</text>
                <slider :value="chargeToPercent" @changing="onSliderChange" min="10" max="100" step="5" />
            </view>

            <!-- 预付费金额 -->
            <view class="prepay-amounts" v-if="paymentMethod === 'prepay'">
                <view class="amount-grid">
                    <view class="amount-item" v-for="a in prepayOptions" :key="a" :class="{ active: prepayAmount === a }" @click="selectPrepayAmount(a)">{{ a }}元</view>
                    <view class="amount-item" :class="{ active: isCustomAmount }" @click="focusCustomAmount">自定义</view>
                </view>
                <input class="custom-amount-input" type="number" v-if="isCustomAmount" v-model="customPrepayAmount" @input="onCustomAmountInput" placeholder="金额须≥10元" :focus="customAmountFocused"/>
            </view>
        </view>

        <!-- 底部按钮 -->
        <view class="footer-button">
            <button class="charge-button" @click="startCharge">立即充电</button>
        </view>
    </view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

// --- state ---
const baseUrl = 'https://api.example.com'; // 请替换为您的真实API地址
const gunId = ref(null);
const stationName = ref('');
const gunNo = ref('');
const price = ref(0);
const pricePeriod = ref('');

const enterpriseWallet = reactive({
    balance: null,
    creditAmount: null
});

const paymentMethod = ref('prepay'); // 'prepay' | 'enterprise'
const chargeToPercent = ref(80);

const prepayOptions = [50, 100, 300, 500];
const prepayAmount = ref(50);
const isCustomAmount = ref(false);
const customPrepayAmount = ref(null);
const customAmountFocused = ref(false);

// --- methods ---
const fetchStationInfo = (id) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: `${baseUrl}/api/station/info`,
            method: 'GET',
            data: { gunId: id },
            success: (res) => {
                if (res.statusCode === 200 && res.data) {
                    stationName.value = res.data.stationName;
                    gunNo.value = res.data.gunNo;
                    price.value = res.data.price;
                    pricePeriod.value = res.data.pricePeriod;
                    resolve(res.data);
                } else {
                    reject({ errMsg: '获取站点信息失败' });
                }
            },
            fail: (err) => reject(err)
        });
    });
};

const fetchEnterpriseWallet = () => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: `${baseUrl}/api/user/enterprise/wallet`,
            method: 'GET',
            // header: { 'Authorization': `Bearer ${uni.getStorageSync('token')}` },
            success: (res) => {
                if (res.statusCode === 200 && res.data && res.data.balance != null) {
                    enterpriseWallet.balance = res.data.balance;
                    enterpriseWallet.creditAmount = res.data.creditAmount;
                    paymentMethod.value = 'enterprise';
                }
                resolve(res.data);
            },
            fail: (err) => reject(err)
        });
    });
};

const onSliderChange = (e) => {
    chargeToPercent.value = e.detail.value;
};

const selectPrepayAmount = (amount) => {
    isCustomAmount.value = false;
    prepayAmount.value = amount;
    customPrepayAmount.value = null;
};

const focusCustomAmount = () => {
    isCustomAmount.value = true;
    prepayAmount.value = 0;
    customAmountFocused.value = true;
};

const onCustomAmountInput = (e) => {
    customPrepayAmount.value = parseFloat(e.detail.value) || null;
};

const doPayment = (paymentParams, orderId) => {
    uni.requestPayment({
        ...paymentParams,
        success: () => {
            uni.showToast({ title: '支付成功', icon: 'success' });
            uni.redirectTo({ url: `/pages/station/powering?orderId=${orderId}` });
        },
        fail: () => {
            uni.showToast({ title: '支付已取消', icon: 'none' });
        },
        complete: () => uni.hideLoading()
    });
};

const handlePrepayCharge = () => {
    const amount = isCustomAmount.value ? customPrepayAmount.value : prepayAmount.value;
    if (!amount || amount < 10) {
        uni.showToast({ title: '金额必须大于等于10元', icon: 'none' });
        return;
    }

    uni.showLoading({ title: '正在创建订单...' });
    uni.request({
        url: `${baseUrl}/api/charge/prepay`,
        method: 'POST',
        data: {
            gunId: gunId.value,
            amount: amount
        },
        success: (res) => {
            if (res.statusCode === 200 && res.data.paymentParams) {
                doPayment(res.data.paymentParams, res.data.orderId);
            } else {
                uni.hideLoading();
                uni.showToast({ title: res.data.errMsg || '创建订单失败', icon: 'none' });
            }
        },
        fail: (err) => {
            uni.hideLoading();
            uni.showToast({ title: '请求失败', icon: 'none' });
        }
    });
};

const handleEnterpriseCharge = () => {
    uni.showLoading({ title: '正在启动...' });
    uni.request({
        url: `${baseUrl}/api/charge/start/enterprise`,
        method: 'POST',
        data: {
            gunId: gunId.value,
            chargeToPercent: chargeToPercent.value
        },
        success: (res) => {
            if (res.statusCode === 200 && res.data.orderId) {
                uni.showToast({ title: '充电已开始', icon: 'success' });
                uni.redirectTo({ url: `/pages/station/powering?orderId=${res.data.orderId}` });
            } else {
                uni.showToast({ title: res.data.errMsg || '启动失败', icon: 'none' });
            }
        },
        fail: (err) => {
            uni.showToast({ title: '请求失败', icon: 'none' });
        },
        complete: () => uni.hideLoading()
    });
};

const startCharge = () => {
    if (paymentMethod.value === 'enterprise') {
        handleEnterpriseCharge();
    } else {
        handlePrepayCharge();
    }
};

// --- lifecycle ---
onLoad((options) => {
    if (!options.gunId) {
        uni.showToast({ title: '缺少充电枪信息', icon: 'error' });
        uni.navigateBack();
        return;
    }
    gunId.value = options.gunId;

    uni.showLoading({ title: '加载中...' });
    Promise.all([
        fetchStationInfo(gunId.value),
        fetchEnterpriseWallet()
    ]).catch(err => {
        uni.showToast({ title: err.errMsg || '数据加载失败', icon: 'none' });
    }).finally(() => {
        uni.hideLoading();
    });
});

</script>

<style lang="scss">
.confirm-container {
    padding: 20rpx 30rpx;
    background-color: #f7f8fa;
    min-height: 100vh;
}

.station-info {
    text-align: center;
    padding: 20rpx 0;
    .station-name {
        font-size: 40rpx;
        font-weight: bold;
    }
    .gun-info {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28rpx;
        color: #666;
        margin-top: 10rpx;
        .gun-icon {
            width: 40rpx;
            height: 40rpx;
            margin-right: 10rpx;
        }
    }
}

.card {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 24rpx;
}

.price-card {
    text-align: center;
    .price {
        font-size: 48rpx;
        font-weight: bold;
        color: #fa5151;
        .unit {
            font-size: 28rpx;
            margin-left: 5rpx;
        }
    }
    .period {
        font-size: 24rpx;
        color: #999;
        margin-top: 10rpx;
    }
}

.card-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
}

.enterprise-card {
    .wallet-details {
        display: flex;
        justify-content: space-between;
        font-size: 28rpx;
        color: #333;
    }
}

.payment-card {
    .payment-options {
        display: flex;
        gap: 20rpx;
        margin-bottom: 30rpx;
        .option {
            flex: 1;
            text-align: center;
            padding: 20rpx 0;
            border: 1px solid #eee;
            border-radius: 10rpx;
            &.active {
                border-color: #1989fa;
                background-color: #e6f2ff;
                color: #1989fa;
                font-weight: bold;
            }
        }
    }

    .charge-setting {
        text-align: center;
        slider {
            margin-top: 20rpx;
        }
    }

    .prepay-amounts {
        .amount-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20rpx;
            .amount-item {
                text-align: center;
                padding: 20rpx 0;
                border: 1px solid #eee;
                border-radius: 10rpx;
                &.active {
                    border-color: #1989fa;
                    background-color: #e6f2ff;
                    color: #1989fa;
                    font-weight: bold;
                }
            }
        }
        .custom-amount-input {
            margin-top: 20rpx;
            padding: 20rpx;
            border: 1px solid #eee;
            border-radius: 10rpx;
            text-align: center;
            &:focus {
                border-color: #1989fa;
            }
        }
    }
}

.footer-button {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20rpx 30rpx;
    background-color: #fff;
    border-top: 1px solid #f1f1f1;
    .charge-button {
        background-color: #1989fa;
        color: #fff;
        border-radius: 50rpx;
        font-size: 32rpx;
        &:active {
            background-color: #1378d4;
        }
    }
}
</style>
