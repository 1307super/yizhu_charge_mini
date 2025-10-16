<template>
	<view class="container">
		<!-- 顶部区域 -->
		<view class='header'>
			
			
			<!-- 省市选择和搜索区域 -->
			<view class="top-bar">
				<view class="location-container">
					<view class="location-selector" v-on:click="selectLocation">
						<text class="location-text">{{currentLocation}}</text>
						<van-icon name="arrow-down" size="14px" class="location-arrow" />
					</view>
				<!-- 	<view class="location-btn" v-on:click="getCurrentLocation">
						<van-icon name="location-o" size="16px" class="location-icon" />
					</view> -->
				</view>
				<view class="search-box">
					<van-icon name="search" size="16px" class="search-icon" />
					<input class="search-input" placeholder="搜索充电站" v-model="searchKeyword" @confirm="onSearchConfirm" />
				</view>
			</view>
			
			<!-- 功能区域 -->
            <view class="function-area">
                <view class="function-item" v-on:click="checkLoginAndGo('/pages/user/order')">
                    <image class="function-image" src="../../static/image/order.png" mode="widthFix" />
                    <text class="function-text">我的订单</text>
                </view>
                <view class="function-item" v-on:click="checkLoginAndGo('/pages/user/invoice')">
                    <image class="function-image" src="../../static/image/invoices.png" mode="widthFix" />
                    <text class="function-text">我要开票</text>
                </view>
                <view class="function-item" v-on:click="contactService">
                    <image class="function-image" src="../../static/image/customer.png" mode="widthFix" />
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
						<view class='title-row'>
							<text class='station-title'>{{item.stationName}}</text>
							<view
								v-if="shouldShowStatus(item.stationStatus)"
								class='status-badge'
								:style="getStatusBadgeStyle(item.stationStatus)"
							>
								<view class='status-dot' :style="{ backgroundColor: getStatusTheme(item.stationStatus).dot }"></view>
								<text class='status-text'>{{ getStatusText(item.stationStatus) }}</text>
							</view>
						</view>
						<view class="tag-list" v-if="item.tags && item.tags.length">
							<view class="tag-chip" v-for="(tag, tIdx) in item.tags" :key="tIdx">{{ tag }}</view>
						</view>
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
	
	<!-- 省份选择弹窗 -->
	<van-popup v-model:show="showProvincePopup" position="bottom" round>
		<view class="province-popup">
			<view class="popup-header">
				<text class="popup-title">选择省份</text>
				<van-icon name="cross" size="18px" class="close-btn" @click="showProvincePopup = false" />
			</view>
			<view class="province-grid">
				<view 
					v-for="(province, index) in provinces" 
					:key="index" 
					class="province-item" 
					:class="{active: currentLocation === province}"
					@click="onProvinceSelect(province)"
				>
					<text class="province-name">{{province}}</text>
				</view>
			</view>
		</view>
	</van-popup>
	
	<tabbar v-bind:active='0'></tabbar>
</template>

<style scoped lang="stylus">
	.container
		background \
			radial-gradient(ellipse 600px 400px at 0% 50%, rgba(80, 134, 249, 0.08) 0%, transparent 70%), \
			radial-gradient(ellipse 800px 500px at 100% 30%, rgba(45, 85, 232, 0.06) 0%, transparent 60%), \
			linear-gradient(90deg, #f0f6ff 0%, #e8f2ff 25%, #dff0ff 50%, #d6edff 75%, #ceebff 100%)
		padding-bottom 120rpx
		padding-top 160rpx
		min-height 100vh
	
	.header
		background-color transparent
		padding 20rpx
		margin-bottom 20rpx
		
		.top-bar
			display flex
			align-items center
			margin-bottom 30rpx
			gap 20rpx
			
			.location-container
				display flex
				align-items center
				gap 12rpx
				
				.location-selector
					display flex
					align-items center
					padding 16rpx 24rpx
					background-color #ffffff
					border 1rpx solid #e5eaf6
					border-radius 24rpx
					min-width 140rpx
					
					.location-text
						color #333
						font-size 28rpx
						font-weight 500
						margin-right 8rpx
					
					.location-arrow
						color #999
				
				.location-btn
					display flex
					align-items center
					justify-content center
					width 80rpx
					height 56rpx
					background-color #ffffff
					border 1rpx solid #e5eaf6
					border-radius 24rpx
					transition background-color 0.2s ease
					
					&:active
						background-color #f5f7fa
						transform scale(0.95)
					
					.location-icon
						color #5086F9
			
			.search-box
				flex 1
				display flex
				align-items center
				padding 16rpx 20rpx
				background-color #ffffff
				border 1rpx solid #e5eaf6
				border-radius 24rpx
				
				.search-icon
					margin-right 12rpx
					color #ccc
				
				.search-input
					flex 1
					font-size 28rpx
					color #333
					background transparent
					border none
					outline none
					
					&::placeholder
						color #999
						font-size 28rpx
		
	.function-area
		display flex
		justify-content space-around
		align-items center
		margin-bottom 30rpx
			
        .function-item
					display flex
					flex-direction column
					align-items center
					justify-content center

					.function-image
						width 80rpx
						height auto
						display block
						margin-bottom 30rpx
				
				.function-text
					color #666
					font-size 24rpx
					text-align center
					line-height 1.2
		
		.filter-bar
			display flex
			gap 20rpx
			
			.filter-item
				padding 16rpx 28rpx
				border-radius 24rpx
				background-color #ffffff
				border 1rpx solid #e5eaf6
				
				text
					color #666
					font-size 28rpx
			
			.filter-item.active
				background-color #5086F9
				border-color #5086F9
				
				text
					color #ffffff
					font-weight 500
	
	.content
		padding 0 20rpx
		
		.station-card
			background #fff
			border-radius 40rpx
			padding 0
			margin-bottom 20rpx
			box-shadow 0 4rpx 12rpx rgba(0, 0, 0, 0.04)
			border 1rpx solid #f0f2f5
			position relative
			overflow hidden
			transition box-shadow 0.2s ease, transform 0.2s ease
			
			&:active
				transform scale(0.98)
				box-shadow 0 2rpx 8rpx rgba(0, 0, 0, 0.06)
			
			.content-area
				background-image url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXAAAACeCAYAAAArIFF5AAAAAXNSR0IArs4c6QAAIABJREFUeF7EvYmW5LiVLAiSvsaSWZtKrf7/D5p+/QvTmpZKqsolFl/JOWZ2L3ABp0d4pjRnop9eRXo4SRCLXYPdBd1///Y6TV1KfepSmlLCf/xnmqbUdV3Cf8uPfyF+Zn/FjbrLz/ExPu3xC3+mNOKZM7cID+Kz40/djvAXvy+/Ptfm6jb1P660OV37PFw9pi716DJrZuwv9VvuydKnuS+qN+U9/P2m1KUp9GPbT7Ffqj7x59Xd9sbLa1w45lM19Pmay/EP8yM8Z2bYq+fG8R7xyBH9pvmSpwWHDx0xXow9mxnnw2Rt1xu8845qaHflu96HeAcOe9dxGk/pnLo0cICn6cz/qs1lrfRdl9Z9l05Tl47nc1grbbum1PFFMbbe3/gOOr4vk4itHNN61adl16URnTWNCXPtNI7pPKKNehO0G/9ddSkthz4dTuc04uYj1oD+xof1XRqGLg09Htzzv7gD/rc/jel0Vlt9jDiPuWDLAPd9l7arLm37Ln3dHxNe8teHTdqfU/rn8ZC685DG6ci+7zs8xVAD7Ur2XmxewSafp0M/pEXfG5bpu9VysMk22l8W6ZR+uN/wXdBv+3NaLbVfR9QpgqiYy61vlV5QGFJ7rkKTZ6shvR2Wry+cu9RdrlI6TVNKZ6wzJnN/983yOcufjJrK7LLZt2sFpjm5h/5/fvVjmrrUpZTqcZkmw3pLc7UEILudnEqbY8U5bnUELwkHlLEqV0nFOkNzxpAMnpzTu9TqNj9m9P8TANO4DzYjrnNGh7w+9LkVNJqYQTYMVfb81u1jq9B5rGp02JjqfavzI8bkWKo7j4ksEqFE3MQhfI5xKj03Lk6+q2xh6l7E3jHQNvDwNgtdO+vK6dZK1wdS3k5dU+dmnS8wJTNTpVe8dPqyNqhOUHYhjv4xgNNatdJy+7OdqZfLgLXhMnY9YPPJVCRqXOSe2HKN1X7DkKz0B75h6JHNs1PQOX0BfMTCGxL10K8XEBQASGl0K5m9/EvCTDpxrwwdJHQ7mO8JYPdoNk3Cf8HaP06nvV/jJdG5CrIDxMJovqLGpI6dIDW2pTqW9X1yPqmtjh0/t90YTzMq/fH5b6DvxZ2N+LHEHi8wYs8b8cVdfbNJ0qJ4MqIyP2lB0LBXDEn5HoGMl2VNhSrF4l9QZ8w+fzHvVm1qDfqAXqAjg3vrmxZ6lsLuDBqJ5kL20MdLzrj4W7tC4vFxHaYAU+5QRqGLQrvQQNZaGXMo2xJDwQHoQPx5lclpnUrfXFEF6e1LJH2JdJQxzR+Iu5YbrxIjKN7hV2dBkd5OoH+TpPgM3RGC7n5WJU8R6iAg2ZVkqC+ZYKdJt0TvHdBqp9Lv3s2+UmdZQPvxfwGzOQqO8FQGYaEXdm9LnUANBRIYdObBQJ1aOgYf6M0mPQAl8hzIkbGMIq8iMqkmyGUfG8zSjGJJXCQFnBYKhcgvXq2E3Hn9I2V1e0fJXGR/zEKDW3j5GEFx6U7Hxp79hKSMRc0LfFdXMXrUJNRHIslnyF0lPrCTGfGM3WPHkOH1NXMAF1wKBt6s2cRk7VmGBr6dDMO8wDGnNGFHvWN4gW9kzn4CcCjC8WMWtdQZgqtfXhSdEvhqsb55t9VGi/A71fZnz9nG8xJr7n9SbfKeMKw8vNrPLxEe5bkmjRkpFfWkq8fJ/w7VheCrWqwQyH7vYNBdGi3xMr4rJkGMpyg4dTmlFNu5m8uw6g0+gf8D9FW9v/6+aPvSn+J7mJMcF7N9rBHKmkb7a+u8uM6LOY+6pGXH+lPD7nEPR6tP21/2Aob92yW3OT5v2Mq8KPfYd1mWZmr1Wje7F7/3w7b0cXlQRuq+DGqUBzpBsOLLF8f3RgKBKNJwAKIRRsw9s1wCQzpYm8zJUbY/2b3QBdSyDZNe+dXgfK6Yff1c5mFp6Sn7c7UlOVH2PU8dAHMTHqrXhJtOFLb7YNpvnHxtQiemxd84iMLRcfI/8X7cQ9/MWb5YFPwGzLgGONgn7Sj9oGe3wO1+n+8GpDXqfNkNjdwjjqOq1lWDXzM3P6/MJMgN18L3aXNEO9KCR+Vg4xCn7aD3jl1aVfVsKYNOG2H0zNF2tOiB9dTkFJ7qDOPfUTjtKs9YGNKc3zEf8vP9LBq4f/dkbGjQ8b5ySdLqoNDOSvvzjPy7Jm9zfnMNwgAgI9rjddlPnkiSUfyBLEjVnpn3A5C5g6d0b0vSgmQeM7yQacUttLGZPAAgvPwLQ7Yf7Dz8EyJKjJCYAHQKCGvLKqO5aTQJHuYa5u+Swd4ViQGDYR+2nAA4G9gJCAHSd9w5xUFnhMFrqyP5jCzQiI5vfgBzPM5oZBWjwjOPNz0x0Q1ov8xCsVs0a7gZB5nB5XVGU6l/eDBN5N+nH6s9L8n95RLb8NaJXqcMC/8LCiK5PgL+Y3GFKiUBGXdOYEMLF3J4LGFvOJmFYs9tIJOJWwOxjvNKPKdLRLLN6FKwOaEjjHKJNqYPR4bnLYWXFJ06dHR7XBAJGYjJD7kzAfUmMGWLysFWdajq7GdlCjxg6WJmRQJj+hn/Ah8H3T6eEfXdqcPryYBwIH1qBMRFNhBIYA4Tn8k8VGFp/cP7e9l+3HXFqsYA/vBFaT58MhE0gnXKJLAFE9RRXa4gVlLLXPy+QbCJdYNlPjE+7dR9Omd3rP6YZbQTkL8HdG0F/F3QEzJa5ZLUxOCLAHfhNWrA8K+TdrLBPmFAYLNM3rKn5NCNsxbDcGBUQ6Yk9GBvJTbBZxbQHLnJ8Dt87P1p0vCCw+pYt98/GGvBqNOZ0GvHlPArLwIdD5Jcq56rV3g7GpkuH87TKZkTR6fYJQ4+Uv/zfxs65nX2dq8G6+rnSz5uFrv5vHMrBuKQaJJf2gHoU3t8EBNGp6H/3nWJGsQ/ZAyL9W5xKzjqP6t30vXMOWK2RCMx6QGDLfHs+zbzgsBULGsNMpBJgBkx6Ey5YQDNwQ8z7U3RkOGKj7O/K9yK9+u4FLHCOxBBrGPr8WvXe8drSbPJlVV3YYvt8mKGVhBNdQYuFKC9nKOh8b1AkZB9N7U+WNkO+Cc8x1jtF9KS6XCvhB+wg5DKwPH+Wr32yyfQgcfvAD4BwfPJgfRNdYhb7j5Cj4qBFWe0l0qVB5nf8nh18PZGc/R7mRVHiucUj2qyMD+TZEQKn2XjTzp3B4KEUdmrgtAklGFgMx5mF4S5hE9a0TaM9gvdh9nE8Y7kBN/1XVoojrYD15iN9FKsU8QNOtNEJGACNK+IQFP1l8OV6KlO5TQCwAUO/xb+zCqHh7HY4lc6Q4vAfqP9yONEoHOKMYwSKWj/mjsz2T6+8s3Y4OqNneFN9xnBkFArNKyeVbQ7LV7mF3R+/O6cRLQFi3GGsD3t5nT4Bv/mAO8vz+U6rYxnVVjmS7e1M8Q9a3O/2JqSRdcyQxlLFKh3jT5utOxMAgk6jO1iGqOwNOKTY7fgM8dEE23MpfrQIqOQs1aGHYNPmdlBpJOlvmGNZSa8EoKhKOEyQsUa7s8TqjmPpMnKz9L4F+8ZxHx6YYdnOYnHRJk5rGhb8xHqcjvI7d6QN/FjWttutxJCqEzgYbW5JfPGrjT/5lCPZttrO2NKD+mOa9z12Rtz9pIE0jocLPb9AvvLqc5O4u0ltmL1dvgJpRd87rS3+xMLgY/HvYJKDCYJkqyIhf3Nk3X7kGTNPT/tMn/TK5Pv77HM+VtYKc5v2DzlNB3Pg6+dGFV+J/e9vZJyLx4V8qR3T5KzK5/vf/j4DuBq3BoJvIWIa05+1pT2Gqhz4l6XNJ5xZx6jmPm0Zx7x6KpTjTWzJPCGNDAYPCMg9SaK5Nkv1oMHFgJfLPNQFTu3TbgP8y8I9XGc6LWLJ7Ug7EpLSdwwIBkIGckzTzlj4/HLuB4bFyK8oGPHKGYe0lOYzYYgNnLpP6bQ6r5CShMsJUFfpTGZhkKHDwCeHb3kPVvR0gqoQ9xI9FhwgBPWxsO6YmcmJGNMm4+QbKgLdAgf0nEDDLOQaKlZyDsksYCT8XDPFB6yxKO5uIHE14r6DXJvdmJn7c7W5C+YV6jv8qCCk0NCBZovQJDr5fR+F5G4I0WM9G0tTIZZSN9H2lw5nYJQP0IA7LM4iw78EllE6+kkwNGQ0m6zRQi6/Vv9PzMRTQFDLi8h9aLTLW6jNmyOD1nKY8EzPEMLgUFYZrlG3Ku/wZH1lNGDIDq2+1FIDd6E1yoOGJYI5tQgjBr9sJPyGmY0kxD/5FxlLzJNIBaBCNBDGBTMwOMxBEJhJjnwJ+v1m/3POggvmTUo6Z7MFEqn4Y6u+hOBnDf3yXBe6aIU4H3qMGlCWUoqd3tVLxN4xYjvWc8Z/HCDkA1kUOZHrBKIZZL9C6s0k/JfWCIXfMKKYsJe4sQdKJmNk6xKOdDNa3+MFHmNYcG3xXLy3uR5Gzl7C9cM8nG9O4A4zCdxzjvdxJR4NE1Nja9R0xCICAkj9PZbKvyGK1dZhnyGaYK0LXN2WE5vbP7X3u9J6EiVNK+7MkNJL6mDuO1ub69eNZ0Rf4bz5cNPJyWfKg6TyJyTmKmZgIBR2xdTWVa45PYCZhJNxF/4z9k3mG8w7uZWJBHAkBOxhKzHHd6d9XOHZ+gFB8Tz5v1Jl7LsQJGVYlSIQQJvBcZt8RnBnmGjbROsqbCPeeDSzYGhXEJ9SfxYWvQYLjPCr2V1hnTf5e7OUJpfHJxvRIbNa7vksOhg28V8LUmrPp1KqPe2uKx1jvdmJwdmz6pKHnJ79T3BZlQokyNsXTEtW8eQ2OMJE5jCOOiTROeBT6o7ot9ZYmvgOlz3wPh8z7SL8jbYOKyHfuTlI/bLsOI2hZKKbUrwz38/N3M7SnKuPdCBJhyfSvA6r3DqPmVg9bvL3UU2/6aO4Q8tzFSFmWJwUTdQjmfRXLNuoSoiNOz8vBTIH4FD24aR0MzBJQAjAw6MQOYDKtdN6Jm6CjnfVqy1DpQWJ34Gn4DYxHKnHmL+YJQPZaRyOE9Ix1HpCYe2aUlMRXNUZ8VJ75pCHGu7sJ6m5jSGqjqp8ViI5fjT8GZtUdKMJxs+Jx9jnNYVa0z9SyEfVwYhVH9k7J5yl2VDbJNVCOxYzgPjdcUfxKUu4vLgZRWAZEXJp5n1zhw3z4vWRRwWqyXKY8e1BAAeKsH8lEZjWPpNAM4aqlBUqp9YdEy6NQ8MHEy8PELKJkMYHHHeDzJhSWBNaHiAkGdyVF86jNYdVRMLgNHk9HIdYzAsBv0Q3dYdJSfnGHNuaKNpMF/b8YKwO2WDdAjPJGjuwzUQj8n0o5oNKKtvYHJE9Ax7JvBL8hKZa8kP5LkrTkQgBAo/WQwq6rQFI6bMN1s26u2lODYH+I+dIK/0vz9vZ7b1UrJT9tXNXZBXkN4sTIgsNhKOFVUKZ+BfJpEbkOoJq1zOLHDVMKyVYPnTdgFQBVKZLT2GXaOGIYFv6sOqn6Z9zt7UYUb59q0X9hGdp7z7iY/7c0N8LTEB6JDm76VXQF9SxcdM7U1GRlttGCJK4uoHm/HgOmn9lFFPW42hkqYcMJ3Aa/qgxpLlHqQPdSUHfRXttv8TLHGB3A7jDWsHlktILnGhBKzQQgE7xnJ4VtglkCCMOCnZNF3cFsNNd3ZVk6e6xBEgpFcbPzJjCgOJ9XGGsL8J6Qj1Fq7DBqGECRQVDq6nddN5EgE57I55j5wGp3Nxbu9Cl3Odr+t8J7wKPUPhCovmvKCHyHBkVJLfPFX3FJDxhI8c7rEhzJYCpYZ+I/aElKNKQaHxEVD89LNPjvYCbUgjyJY9y7JY4Nd5YMf/B1OBHP0Rj4W65PJrZpq7W3K3sKrpZCAF4aSzQfgMSjIdZSjdL4u+sU2V3LQBvA6eFdFEOOE73lvyYsYUdvkTGY/1a8u6Ty2xY7qTmVNzF+xIIKCBmI2Zc/uTGTyRZiYMqgTqzb6UVSMdrGJDyC1YV1pQBtpZfZSO4kBFzPOE7c57GzxZHnRLwHgr6vvMhpBm/5Y5klGlCL0vdAKKWdj3hpwwxoFNOe2u9A1cEMU3c3J4KoOAixnxRvGmtE0H7DzEXZRVOHT2iAJQqOzj2W1bbYJVH1jVdQVeqKZJLBG5nxbVPQTSdHa6BvtQYcO5W3YkPFrNGIhOOkcCJw9JXbxP6//8/8HLrpHfm3/1c5zXj9Oa0fX5uFTDHIgHpSZGnQCHdyJ8N8gcq9l4F7jXS5etyHVIVoD/HhfG7GNJ6rP7a8fAYOBwFwSd5ZKCUbTSvFoJ3o5vH/9eezk++VNHhg4fEhF60sA7EsZKu4y9/fxOYEZo5TM1x7YU1h7GRqNZiY0VuMLQ1a1YLzPKOYF6xvkY2nK7OOY8aIvJE0Jk9lKvQUgHK9Gy3VUKq5ELdrHZWjPe8zGsGR1L66+7MIoFo7QGAU3MU6aDZVPqM8aMLBJQGKe30eV0c/5wlQdCo2/Hs9qoN4+r3gRr4MwD5/E8O1PJBVNM1nXTvwcD5jUa9iVJVlvUdxGa9qOm9IfEg0pOVMQT6Og3U7cNM+3z0Lp7Yj8xD39nT4sNgrnrWr+dZfROFWJvQKWJo9S6LXYQnZlVgbJrctDlUn1UtdaGnpFEZeZe8VJG7g1AhzMwkYGDXSx/JsG95sRAHKoXdPkN/Z7wPmPLrRnAFYhKlCXTQvEj9gLQM4XJlNRn9Kf9kcI6/0jh/dKqKcCnpg9N3zbMlCvZzJNGacgYQJUdvJZ5cLtPPMROjPg3L0PH50hhTejKfEokrJ9Ry8VdHhHiMjv/Y7K5Iiq8YFZyJMIWu9xkxExu4FzY5RtxYm7MZkjE6xL6hEGKNMCeEZL57QGD1bZdEgNhpbRUFBYzpNGbAqZQqcFxTqz8VIZQhvSHMH5b2jgmDvdG3Yh8Z9bOgYgpxm8dYN4VZyy8UKwI4JZVKmhB0ZA6nN1nDNnhNjYzQh9Xf0sYi4KYoOdRg5gqUJYlMtTG4n7GNL6aUjqJXY1ppKVD1DGgZoZtDAyKxJZVFNNi/djfMD7Y1wMFBMQG5HvKKGXQdjZ2zt8cEtOGsKqB4P6vBMAhFJ2mPGbsONGX1TmYDKYj6P6bOi8djGJE+GdgL7P1i4PeQw4Qu20EvS4MqL2+NiG5Eu5FAR7vK3BH9TYZ1NV6m3oo4KYXgWD8+D+D3WPQQNYlOBsZaJLhm1jbxZDfhK7sWFMNjmozLNqgdMg++0PYxdM8HGJHoKWrOdDIMEjh0Dn4z9JqNV4D8VfL8nP1l3RH9dEA8vEKVdgRwCCKKgCqgIxlw/Hw2R9HMcEiY9khJEqGLg4VdKG9PGjEwR71JZdEJhAF4tD6b9sSfqDSUjBUOF6+E9Y+qk8yxrW8tgZePmAz7+jTfI+C6ALh6F8F7JgR+bOcCtGWB8zJw3nG8lPLk+hgx+zGozX7O0kNL/5p2JJqQ/HFZ4ZGZMJvLPdZe7gf7cHB3oEfqWz+Xj/fh5n5KNHrNzrjX4gQALz6Y6J43DnJFKNhKGGdBFGCb6iBJO2jfNlJnf3JJW8Y1Y6P4QkJ5xPBiOCTpKJAz1oQNJNOyLEYTiOSrjdGjjRCMiRo0V2aI6KDXrZc5MKqGVKEg7mUhJD9TlZKo0fJsXZsYlwPJNNF1HT7tnOGwbYGpB2eKiJaP9Q4qQ8SYS7CKA8cVUV4Q+/3A6DfKFDfIgLwl/jGsUFSzSr1hl8oCcROJN3hwLY7KOzF4O0ghhwmvccS4YCdG30q8Zd6CJo5+PzMm08e7RboHpvGT7sTJSoKj8ePPZcOxI5jG2fZhC2a4mPb7PdYUd5vC/pJT3mQF6fPrmAAq3MeWQMZcBmacztHFY8mO5SfW4d2O6fd4AKNHsRa5NVOh9+5DdgZ0/rL7sQ9GZV0U5zx3p6IlF6qBJ5bKXvKwNyJrg19OaDX62E9lBK06tgYF2GGy+J0q6HgKI3aKo2kKnMqOW4f2PJWLS8YH7fDMt2tFum/fl6nb8czr5VXE6H3Uj+F5bFm5o4IFLhWIEzJJtGSC9LKJDzTcDR6D2QHcgXzpKcaG/BYb6eeBwRcAlz4D4aFhYTYJwVh7t8/4HpFAkN5SHQ1Zk+zCW3Eo9v8RdU8qAUCUzJ4mZ7PGaO87A/pZXdKu+MZlxMSNVwuWD4CWcOv5zO/gzcbdoxC2M1ZdBkV4mWnzDVdOOBYlRz6ZaIbF7+5CZP4VzMwf7Awr7Bzy4IaQBk8Z+P2L97W8MqZwSP8HMJF6W4gkGlgO4IjJH3bKdnkiuZEk+zDW6HWB9YOzzXqgn92tCqC8P68Y8TKUXbzjCc+PiOZCo+AkyBOT+3nEZ+Qz8iUU6bm3WatKJ4FZr8kLEYk5YzQa7+ik2rRBrKQvGj13VaKhPOk9XL4aNLaMlj+mGDfKWXPYgKOKKDLfO6wFWjwi1R5FT6nw9EB4+KaVKx6sEKZmE7MhA+Fzvu6MYkM1+fLGc8m2uBuLOLpNTSmMnMCXJP3mR8Kz8tD9c8NAfLdALWm05/Jk6JjfL5/FI0MfM5n89nek1RSlbAjjqjyY7VIQBj/z3o3F6u/pbnZ7p5sjy9t+TJeKlJXg74nrUd3b4AcG4dRa3Qpx8zxhkqz3CPAcRnKIZtGU2aGh4aIqS5pCfV2vR7qw4TajjRAB/BKgJxmv5OaXoLZC5JvpLDXJJ3/gKgyI8nYY4x79+fEK+XYSMofA8gDDHvBhUX9xEp3Zt3xpgFO8KPVklv5YUhYkYJJHMFgOB8WImNDjj1/t8e86TlbDnMn5Nzn/O8jMcLzllYCrBYV4I7bh6fqNz1ZlgHHYRCm+qd6LGJB8A3wDdO6gOCjH0P6v/8fHN7K+cNOcE2qTCojLg2yAKI6XJnOdwCj3xM84vFjpjdTJhAmMVMc1jz4tOq2O6o9QdjI8Nh6vVkGabyKKiJJaM4e0n2+W2b4hfTmeUOlvbL5m0PFPqKD9kpB8kZ16jvk2H/2W0sNgWKYiR6RCOvHw/7Bh1iocgMfXPVJPJkHcHOVGj8b0+3tCTkzAOF/fM3PFyYnKHrPEA7C4/KwIbOL8JpX1T8BGWGriwBznQKlg7tLd+vKPxjtTplzP+kIAZdLN3hUa2cE4XFhW8EpJDzfxS7kz9++vp1wOzBMGD+mmdKP6zXxoHhTU4cYo5sNKHjgKrBLlCK1+GsPm8Y9vgfj+t0j3pLVwGc9WkSlP+mBYacQMaUzN3AhBm/1CJpEP5n26XQc6c+/ef7YT/i4XfQrOzWwH7PmxX3LiKgpfrvQI2wQJLn7vp/SeRkQS/8j7YG1qGqoKVd+2P6sKF8xeTn7c7vdJzP3CGw1tqccepUfRvyzbkfA7MlKHLcIo6HcEYkOAYKm+e3lxcOB5+OZ8x1l9JAJyrkF9RdTWiboIo+SXOjI7PBDE4OgVvJG5MgFXKJz5zt5jTy8eBJdOE+4d7w2wBY4zPdjuPW3+Gsu+K1D7/+H8kBCFJiU6KMqd8ZxzBe8rYqOEfnIBB1mMZdhjzkKQDw3WFk8zFofJX8pXfBIBFo8g3wLwABIuFOPkxYe7KLvUhCSkKHg5RPFNPC6FTkNEsWu5MkVKfJ/Q7ZCm+MXVf7qxwFAu7X/+Gx6e6WLQC8aeE0b7gRfHlpFLdZmjhUKBLWfL5LWKpZTOozKkFCUVIxe0/0IqYN4i4OIJ8QqhMGrKfP4jGzBz0k6YUKCsQ5RCUl/uy7t2TIYyRb31lRZxR+oo8TzOQc/vAFRqFE6/9X/gy2X8YN68QYS8u3oE2i5aJwFUdvn75LhE4JfKh5wpFpRKKaVgtKr6xCNBJaGZA3hLrn5tR5sB7TqHPhQKgIKD1t1bBZuSj8yJpQzwFm82DJjK4Ksb/yz/fzPUXgz5T6rCU8qSJKjOJg68Ym3LRJnOzVuBUOWsQBNT26YiX5Vy2zP8b0IqJcQlbfzfNfYYdHmxAqYfWLLmMfKPe3e4Xj2Xqf6J6vBSO8K8MuwFjgOPwFpKUZSRfYd0Jrp+m6V5zkLKOQZp7ypg6nBDYfmgxjR9Q2FUFYpE88+EXJwvaBRr32+MU05BClkFBjLjJT5Lf3rrVYJbGqOt9pKvhNQALlYBEWdCyO6Q1HVnYhNzw8LWdJzHt8iqvvL7Fj8eiLJVj9Jgvj5j4vE34HDwozjF+WNHl5AoYBGhYy3JJUJl5wh2FcKKsZ9wK8VK7RzHjOJxdnC+AeWjfOEBPL4EqC4YsRzWGcK6CyoE32c6tWPOJTy8vNLrmCDl4Wgvl6F/b1YDrfS4+lUjRuEQKZ7tYo4rV7bT/frdLdGgQH4Uy/+Hk6C7kE82bFzaP6mwJdG9L0K5WR9jfF9ZZeI0s4HdJnb1YrYa/9dLdIH7ar8B0/pKjZTn6MYuTaRnBSJXOqm1JHbV7JdFhPVIlsqKq0SyVzVnEF0xdlnwgLCJZfLZhHhNFnrh2yz8PYkLHjyFH3cVPmXtOi8f6opQ2YSe3XcKOiCk6oiqzNiJjpf03CRVW0bL8c3DKTyN/KJD0z24pJxQ3VqjPgMjWWEfPyTAeQMBxKsO5HZ9+tHyG4PzYN6W6FwznFJcT1iFdZLu6HRVqvrDwhPvPGiMdBqr8Q7cFQCOhvhfm6B/W59+jM0L9qEb4Y+8mLuCHPf2sEilFQN6w9UZvKK7mh9LL2M7F4LT2XEoQ5Q7FiZEXy0uj6U8Tt8iyCuzETPzl6nRd7Af+9+x/CjQJtGZLAmMIg5FdJyh9K0wkGlMSsqCt7Y4sQWNXPGMdQy2dJVPbJKXYRXFOsZOgqFQNVaZdnG7JdcxQ7OJq3F+HgO7PqQ7Yk9YPlMRiX2LcjjcUNNRBOccfz7F6vvGzRUfF8IKhBBUOI6wCGb70Y7F9VjP6l4KzDmNHdDZ8q8wMWuVNzJxdNaAMOL2WY0xV4PtC1ZQIAYJ4cEpPbP8VrttTe3wnPjYnj83fdKJKaefSqGv5+fdsQ1z8lm9GdNiMwPzUUG4a1JBUOiUoI5T2qPq5W5/SFXMlJEqDq1bPYtDgZDj5SLtDyueQZqNJ9rOQ6dIWo2zG9Y2jt4Z0xsrDzKgHJODYydEgKgSHdz13LMECpQjOgcJbKzAhzDGWu+I7rz/kMPM82bZbj17KKLH2Cq+RcFqoA9e74vhjh9THMVYJ9nApBXJMN1a6e9Fl4H7MmPO1KYAZYvJCv1c5aZzOwWyOW7YXIDvKuSfmAX2DYU8fOSKP2jJVgdpnk4mvfUGdPNM2/lYnlnLNxv7IiBBxJ6N+tFPLJsFwXKLkMoKKJJVnFO+W0+P68Uw0PeXzcUEJ4c7o4fmwz2VD7KrfaBKHmMRa4PqDITwq5OhLDOdkJrJjEh6RjRNdGK7pJ+pY9pWuB7dCj2zyBhKO4zbWK7INnCONv4j3P1iQyepVJ5QGN8IlJeBqFwp6+xIc6gJsU8T4mw4uQ7K4o+3MsNEzHq97gC7QUgc7fFx0G/3yNUkbNYI+TRzKpFmkZ7C/cG16JGh1VhFUAa7xaJ9Oz1yJNR7TJl7Hgj6nJxDjmgZsO5pF3B4uCa9g3/u9ZtSfEDI7VrmgxCEsWoE6kCfg7kFKaUqhFoQmzjvBuYBl6MWfEeVpMxMbGbhK6/Vg/pIiglsJHs4FpFwEsIHE0TrHvQZ88lNKy4PqHgm5vRN7iEcgcfPJQO7jA1oDQK3+e/Oe9DF4uI7cN7vEcAEVD3GS0ij1C1jUl6XDfOhsZ93oW4INDGFrqC6nFVkzW5fDI0x5v9zQ0GbO8r8jzTOwF6X6GSpVQqYacgfkNXQOAWKj4FJI9o5O8I8uJYKmOJN+zrBJCqPGm32Ck5bBiL5qyRvZwKF1hEBe7PqMq8CJvCGwU6NdGaXUiYaOIV+nzfAcz3i1+fD2c9/vvmhNTu6OuMc5Pu1wD+7nj/R4TnL9gCJz4ZmFOuZhPNn9J2ZpqyJj4MJjCdGpJYjBk8rMZgHHsz6+/Vr5l+VvGPMnfI/8m4jJcYd3Gg7HlhKfzOdRRmFG5OPlkrNhNzZzWvRpQWKhBjL7z5YEw5KwIGO0bO3HqRDe8LCwKIgjY6XmB0kAiEIVmjQX4cHlM0n+z+4nRKPIlZdTZZ4sIYA2P/kEeQJZlqgBxh2HKlkD1x9+NE4Xfh55qN3OJO8l5bXCtHJOLglBv/j/Ej/eKKgxnZCtCMw1zs1bKEO4s6EWjjSrhAqVQFUMkDLhRAd64SdDEjNMnmxRVCIb1DkPnzCVQ+k+GDcfZQ0YFDnV8qhVdBkzlMj14HvFzx8nsBCyOXiTxK0EI+bHrLLo3l6fK2EjK7Yp2Q4cPO2TfLw2nV3zn4Bq4ug9O5jUL8XA6i8ZQXE7dKHdq/PJh2Ie4r7O/7xaI+FGvLx5oKCJjpO5y3d+eSyKKh0Ge0s+YpO0E+8vdmFJxzYUY8cjKVfLfTzrmqDzgqr5MIv8ZKXhqcLs/FjJ/SZBC8YNJiNYIGrNPJyCy9X5rPRq8eKPUJMdYe3KrNUBKxfJqDQTR4V6aTZkEH0aKVGKZLWuE7LMSN/WXgkZSsJ9oOdZt83V5o+rn2xUAT0Bh8MJ4rjD7tJUAYsP8SgGWDmJmKkF8sN5UeEPZQM7QAkJYvckJI2aXcnfYH4QGv8wr7C6kL6mGE8L5/jF6K8oXmJe8+WgI8ypjqybyNVe2OPjBX8X3C/ZW9BuXOi28c4PIh4Tj+KeIjVrIHKyQb8K6d5xRmgTzPHb49u9+jXOK8n9W+wGGOyHUCmYQSzc3kMgaAR9x7vEhLFYHsEMaBOW55zGa7m3o6n02VRLk7N1FEgRJEMmxr5KKjb9HUHKZG3/P4WOuVNVrjqxRiFTvb5KpQhTMqGIHKJE/1ktB4rSTgXJgQ7I+3RQCpPTsxd3/0tA5VjHvHgtk1rHm94v9AtzJc6FoJFU+F6BRhLmB3OPa5Qnz+P6KBG/qxjKiDa6jyIBGw0HLJhMvAY0HQsN/yj3rn3tAJEhPGfmkh95k2wf6o/b7/5kHJEY8l3hWJfqpHcAA4lJQYMJp/iBnPe3RX2v8KRK8oqhZBkvFfh/PNZylv1PmTRaIwRpIyZRjRH8WJpCrz5X2j6Yc1jwj3BPZJvSKP3fAn+MZS/Kzn3IgZ9zw9hOXb9+z0Xz+iO/pNnxE3y1kGK7aKe5/nfzgZoYyVY6MK/JEj2cCq/UyfZ7uj4nk3wWk8nFOHyT+5lAW6s5T/PVpCEE6m8KRU34F4HhImjUZPCyfkM8aYgMRAo3NWMtO4fDlsYKLQCVpk8RG2gE3FNd6LxnY8Bv2wY0WnRWo4GfnfWi7EYRGNGb8q5nQ9CqtBM1DhNV2A3aSjMlZKfqyOA1iGa0VoaxLsjMGLDXqJWLMYsm7VqKGd7cH5ByaZILtczXppEHhqJaHoGTz4JTLojLvl9lDfCqEYVmYkxWLwUgZhXLzSIu1FGfklzJAYTMOyLqNdxD6CHsOA4vrKKKgN8BKGrIMYN4RJRP+VtJk9ufGqfG9Q8Y4YgFPH29XPyNEWUBZl5wlVWFGC39DqGTxPJwD5Aj8RgQKXSDOMqvh50QPQrOLUvZBcLsKdj9xvp3OLqzEDYjhiEQDIXzlqAGOzSVhXMUzP6kGOWJO9xYXvTWLYxUvCyJLDBWCNkz7d9M/WD/oRNFPqPHj8b+9SQKxxs6Y1OJ9TLr5dEd1rSGT6vXQTUgHsQGhK9Pu7fkRIWJhVMJMVhrzBqTjZ0fmLBtxlW/a7lOTJKw9Y6b8jHG+2pYbhOL6dJQ8L+7hWbLHqc16u9fnAHKRvkmxnXfk6tz7v9C1aVjmOjjIy9cALEP5lTTjxnv+7d2HmJvXJKp0WODzM+Dq9k1VlvdyN2lW+Hp9U+O7iiPa9Tsp1ZRYrR7fJOvNF8jPCJEYN3xG3hkOoT/2iN0VdZCuRQYjjnFPgzf5KtX4/5kvjNTvgVwuTwAJJ+uLZdW9DFwATU9k7tLjZiGBhf6S8hUNmMfJNJRvIGvKKnJGiG1wGuwjCXgzF6qONHLaKlmppNMLxJK/7E6+EvEqkRrBZ0VHwKO6t2m6+Lm4LYzX7R6t8Pq6+/KoC9QKjxUc8n02gPNE+8pT9D2Yho2SWgOGp3K4gp+K4Z/+/VwNNI5PGj5F1i1Y+5Br7wkHGxNZZ14/jDvdGV+PjLYLbX0u0m4/M+ZZRo3rqGnTpEQxGJh/PuwsaTOdJZuWGdgHYcvjwHh9LFr8J9RyUGlZ18P4fO+lzJi6jFE0tOQXaODxNVB7n8P5Ahs3X/MxYTGYdPnjtTl5gDbz9b4A5uo0fT55B1yCq9aKB9LLdgNjrGAw7cF7EJIDwMKCqg60TIKqo6t5CVc6WdOm6nYcUaY1onK1BVWbMBjdUDQcRfBbXBAQu6IjT2vMCYEvJABhb8VANsVOLFjE3ZpJGZ4CXX3tFJBJb6LQhx14Ah8m3/HkcqFjxYVOJJPIKC47bLlPUoK4B9Mm8CDaWbVEWYh8JCznkGGNWnHFl6RJCJlWJUdm8o0rIzJwYXnzLsT3SfcsOJKLwHjJyxZFUkTf8RoKU6/GqSQx77RYyBb32xaQ1QT2kgDtZm7fKAzpD5tFpvlJ2dCJJXOKyqUJdRZ/vJvXO5W8iMk3nkiCuYQrZqCFjfp/WCxqwM2wjEj6jdYr/hcfwI9gxLZOoTdOSkHK5LKi7hxUdJ6pYQZP77WdEJGh3YIjj8EQBh8YmzM6WmGhj+HWrQ6sGiLx5Hd/LrlGsJA1SLa3BBp8l0gCJCMwLXqzKQo4Yk9KYjKdWpAm6oP6NtwC7EcN7uXo7q8vAyj8RjRDXV9sEY/KhSKxZKN0SjLsNEyNfAMKkJN9VcgMnKE1YGE6vFtLNf0rqTVyPz8S5nA7owYKRB6ZXh3ZQMoFFmJRLgGgz3Kpce+HN6vPJaZBCYjEkcpA1RJrqnBTM0/jy6lVowdfNy4l8z1GQb8QW/XRG/iW3SiJ7V5rWU9f5DOAcpKhbxJ2kNnjQhfJJl1yt5MfK32xjQbvvD2fOkgq6iiVUJV2+SN/Bv2g3Oyu3TpFFjMhYqH/2TYL+xOzFe1Kv8SoA57ZKfYj9VKm5v6HvOgvRl7Ow3H6L4z7vWiZQ+gWfuD6RJnKYqyQ7I0S8dUJNp3BmUabsapWUqRJ1bHa5dZAQ5oNcpNcq6pzCU/HcxLRnZKgLb+x8DfuIc7b4fWVhyRB0z/LKJbPCKPZw4GDUxRpOxCMgqADx3w+WUgNnNI3JJO4nHqUPt0B+cVQhyKBUYPCQkjKRkRdZs4yKmBdG8MKOWnO1gn7SvWiN6vJwO45vhbYdrpfrlO7VIZzFfmVxKYUTiZXIUvNH3zHeDf8hl5hgxaI6cjLJMPgIwLpNkMNd3/yS8vFmO6U8PLz8Ff8VEcksH4xhWInJkz8/gC4z4LaNs48fNjlFwOmcdRvJRjggOOm83Vhsqq4yJKlgCQ7+OE2wFOuJoIgKpEOHTaWCcB3QjOcv6nB8zW9nfLFSxhowM6mYwFQqIQmzE7jvMZHMzWAC5JKUP2zXcnMEhE2U7ZgAzUSTRnhUMH5cKLJtL35JQmyJMGLxKd9qf8YD+xSJONNj9Gq5EXI8EajPIYGMjvF9+/J6YWVpYPQ8xfF9L6r78zhlOt6tl2vgBz2wf6sTdjvkG0oi7Z7lBLfvUo1Y5G5qFl/w+h2d9C8D5vmJAuSCTrPX/58W+8b8Dc7N9RX1zbrbatdmzjpFTq4yOJMNGJFOhA7YyZz2cnYxQKDO7Bj7L5CtLOHCnP8pBmJmYGn6JaTmNTDhNZoJDyuVdZkqovpwdGYNgdYWOvr4+e2+LgJXP6w21p5bW1O4aZxQ7L56ZJ76yUzuTEgsgYQmvOyMI5HGMl4Y8YPPWQKfK7+pPg7lAQNBZqOcP1+vNkl22J6XGhOGG8NbNAjgHjmJrr35M3pGNzD3c4j27/l5Rax7n8S1mT3ZO0bF/QhzqZVrxP2mPMkxd6gMYZFHgcKaXY+z4vLjfuTxnLr0cUJ8IFBTNPXsZczgzFkfRcNyoIoAjjvP/8/LJ8mJJMfG5iRtgbgZ8uIKg0Ng7nCsGGAjCwUr7YN4bEevCl9J4NUCNzSPsFkXkJDOBBY6iNTfQzKWFdwxgVmRVVQMX7cKdG4YPz7kxhU+qD9x05XFdtM5lOPqPzaY5lGEQYMvjmFCWwxYpCTDYzUfxrQd7UWbOu5x2mP6fdcLZJq2tGrJNxvn5w4q/x+y8NajGmWD3LVwkiL2A5QzTNWHKxC5OGEofjAZKaLRWFbf2sKGVKCHE0vfqn93fIWxYXYlF7o1/JxOJ0WjRo73V8+1+Vxhyh0wPLYiZTAZLDO/0y6xvC5M5LkeDrGZKOFWn/W+7M7nwZABpZtNu+mQWJsslGMQ5KKGagD9GVNY5WvHJVh2yPCJBKMUq8jLsLNE4JdM34VqAfzYE8yN+xvvlYcnMUjBZ4YlGJhY+PagDY6w6wpNxHDejcJl4MjjGgtOZFoT8vP2+Xmg9NLvJ5vKrVUqDJqFLaDgzWKyVhxE6NQNX6tZcY/XdJ5TlTe5l0l5CxIJO5YsIfM7a9JStaK+tHqOGO8kAXEq3T5cWJ5KlKCccddoMwt3X4xEMbfCYPqoVJH1CvG8HNqMIrBz/P20t0wHEGZBIGHV8tKyJsLbUr5Rz3K/TqiEWWXPe1ZmWZGHcZUzjsVLfLZbFAhKiUP6o1H4w5wJHEbTmKw1/e9KJhNJVfLMZ1a2yqIOvI8KGAV8TH9KF+Dj5f+3H7TCPaqy2YjyKKmYVs1WKT1v/Rpr6/uu5ieLLJQ3jvqEQkxOz6P6tRz2xbNJyfJJbzOYP5mswmzM7vv7U9B7PwjkRmZBWoGsX2s8e8ckz+qyZ3Fv8HGG7fPucN3sWAMZwV8fy+BL3fKLYa6kJcG6V8hPALn9ruwO5R2dkEwfmJw4uM2h9zCtdY9JTu9LxLDtE3q97aJIW+4aHKNs9aJQEVZHEJBSEIzKtczQ8eaR2BHgwCQAp7n9mP/jJH1Jvs8vEcAZJnZHvOv7G0s1M3qB1IEX5KLu/2e7t/YPQgpRIxSQRLSkKm8e+K+pHBWN2mEPqZ5vSqy64YGEKBvP7Bf70YBODTrEGUNATDEvfgNOtGqRzLHUe80zC1QgHUgzSF3fhfv9XSCS5u7nnHLb9b/6x++VDkQY1M+e9t/1FZz9EQGSPt3K8ZUg6WGgNwGTLDtfW3EO0YAr2uDvFOm3Jbfxbq79R51d5V8TQbOdvSzOVbjcqBfEfY8UpYyBJf4YCIkEP2jHE6+9rZe+JQoL5gE/pMhWd7s3F1KkGCEn9J/NjZCRJdQCBLvhCjOBJtQMD9LvBmhFMKpI9fGlWmnc9yVGqAjgdIsBYLR7Fg2W5W6v19K4M0vFCswGBb1gnLI2y55a+P5TMzWlUYGT5CJzqVNNJcr9CQu+5KBDHZQqx8p9FaA4qyaYW6/rppz+lxdXUJAJv7kQzfHJO6gZ5BSGlgVzJOQ7oJzJHZMhz4v3tCBcgwJqHhLnKuFYt3t3xyU/p5twu9fJ5r8x96Y+g2fJH+8X1Y4A9HKRg4Lnmv6qPyajQhQ7UfJD9wD7E+PNNcF9dGtE0N+mAKg2mYpgGfaL8w3RyJ/c/JC8sCa+p8d+jGqhI9WJH3o9YNaXf99M7s3j2n4W8N4jdPy8wIwFDU2GyYs4ItMQ8Fp+FVOFf6HHfS8vYr/Z1PtPLX5F/uh1zZFOj7kfchL0P7Kfgd8lAVxGpWjzxD2HTMOe6kNyAJoAvXpU5FQKXYJYAkKSyASf+bAbKHTcVODPBe2Wdf2GDmVl8jzNGXPXiGHFWLc5X1VePkT5I/6xT+iT+3JOz6nVbhRxfnq+yUelj4/8/8z2fwzLzfhpxLBhbtjCPdBjEO1lBNOZKWtQ7iWf0zb8RGgzDJlg+b8fOPJGUG6+3Yn9n6vC4yCrOhZsF5K+QSMO+mWmYBfJMmAmnbCQFNggKwZFKc5uM2J0VgxVlH9nZdfhbGDgLfSMGEi8EQP1qKGDRhmnNOdVH9NhMh79ggEn6sIJnp2/XHFO/eE8CJuxtZJ3VmZFLrCWgQCWDe2YGdYM9VBz/kzxf77DH7SLv3ydQZkOFuLZHGGbzQ1/qC/2jf8j2KdUFy+qXfTJtxH4YYdPfZ7SdJLcZFOqMdg/+5v8lLxUiycJpn5Q8ZDTEO8zWQqFNO6mCjvKIGBTqz8VRj6QZwg6TcrnZQZJJa45v8mPGSMw5QzIJOhN8hK8e8P1dj3LhYcpbM8q7+gg+4LKF+VhwXzAiNaBKAz6N0e8JDGi4HQ6LYlQJfNtQgRBfgGEJ3+a6HKO5v0TzqWe4dxNjZxb1Ey3PQ4v5EXJxTOwcV0tEZZLvqBsAZqOUBvCBBmYq2jyNqh4RIhbhqxHbFvvFHmXfIvFLb4ky+8i+s7XGTbJ5n4fUd2Rg9OBpNH2y/Jl8N2r2TY3VgM+6xz+G9aw+GFV8+Z8vz0o48RYvCUo8ywfG/CaPP8zbZdDOmCQEQmqQ/57/MwrJGfJVfWMVa7SJj3NLX7U7YJdWMQP/B7I0VZwwcMQN5vdMl8gFSYiJBIwHZL6O9kd+85ub1dT4E8W8qDGa6VTSNmfQ==')
				background-size cover
				background-position center
				background-repeat no-repeat
				padding 0
				position relative
				z-index 1
				
				.station-header
					padding 32rpx 32rpx 24rpx 32rpx
					display flex
					flex-direction column
					gap 14rpx
					
					.title-row
						display flex
						align-items center
						justify-content space-between
						gap 24rpx
					
					.station-title
						font-size 34rpx
						font-weight 600
						color #1a1a1a
						line-height 1.3
						letter-spacing 0.2rpx

					.tag-list
						display flex
						flex-wrap wrap
						gap 10rpx
						margin-top 14rpx

						.tag-chip
							padding 8rpx 14rpx
							border-radius 14rpx
							background #EAF1FF
							color #2D55E8
							font-size 20rpx
							line-height 1

					.status-badge
						display inline-flex
						align-items center
						gap 12rpx
						padding 10rpx 22rpx
						border-radius 999rpx
						font-size 24rpx
						font-weight 600
						border 1rpx solid transparent
						line-height 1
						box-shadow 0 6rpx 12rpx rgba(45, 85, 232, 0.08)
						transition transform 0.2s ease, box-shadow 0.2s ease
						
						.status-dot
							width 14rpx
							height 14rpx
							border-radius 50%
							background-color currentColor
							opacity 0.88
						
						.status-text
							line-height 1
							letter-spacing 1rpx
				
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
								width 40rpx
								height 40rpx
								border-radius 10rpx
								display flex
								align-items center
								justify-content center
								background #f5f7fa
								
							.icon-text
								color #ffffff
								font-size 28rpx
								font-weight 600
								letter-spacing 0.5rpx
							
							.super-icon
								background #2D55E8
							
							.fast-icon
								background #52C41A
							
							.type-count
								font-size 24rpx
								color #666
								font-weight 400
								
								.count-num
									font-size 28rpx
									color #2D55E8
									font-weight 600
									margin 0 4rpx
								
								.count-total
									font-size 22rpx
									color #9aa0a6
									font-weight 400
					
					.distance-info
						display flex
						align-items center
						gap 6rpx
						padding 8rpx 12rpx
						background #f7f8fa
						border-radius 14rpx
						transition background 0.2s ease
						
						&:active
							background #eff1f3
							transform scale(0.96)
						
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

// 省份选择弹窗样式
.province-popup
	background #fff
	border-radius 24rpx 24rpx 0 0
	padding 0 0 60rpx 0
	max-height 80vh
	
	.popup-header
		display flex
		justify-content space-between
		align-items center
		padding 32rpx 32rpx 24rpx 32rpx
		border-bottom 1rpx solid #f0f2f5
		
		.popup-title
			font-size 32rpx
			font-weight 600
			color #333
		
		.close-btn
			color #999
			padding 8rpx
	
	.province-grid
		display grid
		grid-template-columns repeat(3, 1fr)
		gap 16rpx
		padding 32rpx
		max-height 60vh
		overflow-y auto
		
		.province-item
			display flex
			align-items center
			justify-content center
			padding 24rpx 16rpx
			background #f8f9fa
			border-radius 16rpx
			border 2rpx solid transparent
			transition all 0.2s ease
			
			&:active
				transform scale(0.95)
				background #f0f2f5
			
			&.active
				background #e8f2ff
				border-color #5086F9
				
				.province-name
					color #5086F9
					font-weight 600
			
			.province-name
				font-size 28rpx
				color #333
				text-align center
				line-height 1.2
</style>

<script setup>
	import { ref, reactive, onMounted } from 'vue'
	import { onPullDownRefresh, onReachBottom, onLoad } from '@dcloudio/uni-app'
	import navbar from '../../components/navbar/index.vue'
	import tabbar from '../../components/tabbar/index.vue'
	import request from '../../components/js/request.js'
	import { getStationStatusText, getStationStatusColor, isStationAvailable } from '../../components/js/stationUtils.js'
	import cityData from '../../static/city.json'
	
	const app = getApp()
	
	const go = (url) => {
		uni.navigateTo({
			url: url
		})
	}
	
	// 检查登录状态并跳转
	const checkLoginAndGo = (url) => {
		const token = uni.getStorageSync('token')
		if (!token) {
			uni.showToast({
				title: '请先登录',
				icon: 'none',
				duration: 2000
			})
			setTimeout(() => {
				uni.navigateTo({
					url: '/pages/user/login'
				})
			}, 1000)
		} else {
			uni.navigateTo({
				url: url
			})
		}
	}
	
	const setActive = (i) => {
		query.sortType = i
		stations.value = []
		loadall.value = false
		pager.pageNum = 1
		index(1)
	}
	
	const currentLocation = ref('北京市')
	const searchKeyword = ref('')
	const provinces = ref(cityData)
	const showProvincePopup = ref(false)
	const isReverseGeocodingEnabled = ref(true)
	const statusBarHeight = ref(64) // 默认值44px
	
	const selectLocation = () => {
		console.log('selectLocation clicked')
		showProvincePopup.value = true
	}
	
	const onProvinceSelect = (province) => {
		console.log('selected province:', province)
		currentLocation.value = province
		query.city = province  // 更新query中的省份参数
		showProvincePopup.value = false
		
		// 选择省份后重新加载数据
		pager.pageNum = 1
		loadall.value = false
		stations.value = []
		index(1)
	}
	
	const searchStation = () => {
		// 重置分页
		pager.pageNum = 1
		loadall.value = false
		// 调用查询接口
		index(1)
	}
	
	const onSearchConfirm = () => {
		searchStation()
	}
	
	// 获取当前位置
	const getCurrentLocation = () => {
		uni.showLoading({
			title: '定位中...'
		})
		
		uni.getLocation({
			type: 'gcj02',
			success: (res) => {
				query.lat = res.latitude
				query.lng = res.longitude
				
				reverseGeocoding(res.latitude, res.longitude)
				
				// 重新加载数据
				pager.pageNum = 1
				loadall.value = false
				stations.value = []
				index(1)
				
				uni.hideLoading()
				uni.showToast({
					title: '定位成功',
					icon: 'success'
				})
			},
			fail: (error) => {
				uni.hideLoading()
				uni.showToast({
					title: '定位失败',
					icon: 'none'
				})
				console.error('定位失败:', error)
			}
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

	// 站点状态主题与展示
	const getStatusTheme = (status) => {
		const theme = getStationStatusColor(status)
		return {
			bg: theme.bg,
			text: theme.text,
			border: theme.border || 'transparent',
			dot: theme.dot || theme.text,
			shadow: theme.shadow || 'none'
		}
	}

	const getStatusBadgeStyle = (status) => {
		const theme = getStatusTheme(status)
		return {
			background: theme.bg,
			color: theme.text,
			borderColor: theme.border,
			boxShadow: theme.shadow
		}
	}

	const getStatusText = (status) => {
		return getStationStatusText(status)
	}

	const shouldShowStatus = (status) => {
		return !isStationAvailable(status)
	}
	
	const openMap = (station) => {
		uni.openLocation({
			latitude: station.latitude || query.lat,
			longitude: station.longitude || query.lng,
			name: station.stationName,
			address: station.address || ''
		})
	}
	
	// 逆地理编码获取当前位置
	const reverseGeocoding = (lat, lng, callback = null) => {
		request({
			url: 'charging/reverseGeocoding',
			method: 'GET',
			data: {
				lat: lat,
				lng: lng
			},
			success: (result) => {
				console.log(result)
				if (result && result.data && result.data.code === 200) {
					const locationName = result.data.data
					
					if (locationName && provinces.value.includes(locationName)) {
						currentLocation.value = locationName
						query.city = locationName  // 更新query中的省份参数
					}
				} else {
					console.warn('逆地理编码失败:', result)
				}
				
				// 执行回调（用于首次加载完成后加载数据）
				if (callback && typeof callback === 'function') {
					callback()
				}
			},
			fail: (error) => {
				console.error('逆地理编码请求失败:', error)
				
				// 逆地理编码失败也要执行回调
				if (callback && typeof callback === 'function') {
					callback()
				}
			}
		})
	}
	
	const query = reactive({
		deviceType: 4,
		lat: 39.9045035,
		lng: 116.408788,
		sortType: 1,
		distance: 100000000,
		city: '北京市'  // 新增省份参数
	})
	
	const pager = reactive({
		pageNum: 1,
		pageSize: 5
	})
	
	const filtershow = ref(false)
	const showfilter = () => {
		filtershow.value = true
	}
	
	const stations = ref([])
	const loadall = ref(false)
	const moreText = ref('上滑加载更多~')
	
	// 初始化定位和数据加载
	const initLocationAndData = () => {
		console.log('开始初始化定位和数据加载')
		
		uni.getLocation({
			type: "gcj02",
			success: (res) => {
				console.log('定位成功:', res)
				query.lat = res.latitude
				query.lng = res.longitude
				
				// 获取定位成功后，进行逆地理编码并加载数据
				reverseGeocoding(res.latitude, res.longitude, () => {
					console.log('逆地理编码完成，开始加载数据, city:', query.city)
					index(1)
				})
			},
			fail: (error) => {
				console.warn('定位失败，使用默认位置(北京):', error)
				// 定位失败，使用默认的北京位置
				query.city = '北京市'
				currentLocation.value = '北京市'
				// 仍然需要加载数据
				index(1)
			}
		})
	}
	
	const index = (page) => {
		pager.pageNum = page
		if (page === 1) {
			moreText.value = '加载中...'
			loadall.value = false
		}
		
		const requestData = Object.assign({}, pager, query)
		// 如果有搜索关键词，添加到请求参数
		if (searchKeyword.value && searchKeyword.value.trim()) {
			requestData.keyword = searchKeyword.value.trim()
		}
		
		console.log('发送请求参数:', requestData)
		
		request({
			url: 'charging/getPlotInfoPage',
			method: 'POST',
			data: requestData,
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
				pager.pageNum++
				index(pager.pageNum)
			}, 300)
		}
	})
	
	onLoad(() => {
		console.log('onLoad - cityData:', cityData)
		console.log('onLoad - provinces.value:', provinces.value)
		
		// 获取状态栏高度
		uni.getSystemInfo({
			success: (res) => {
				// 状态栏高度，单位px
				statusBarHeight.value = res.statusBarHeight || 44
				statusBarHeight.value = statusBarHeight.value + 30
			},
			fail: () => {
				// 获取失败时使用默认值
				statusBarHeight.value = 74
			}
		})
		
		// 使用新的初始化方法，先获取位置再加载数据
		initLocationAndData()
	})
</script>
