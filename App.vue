<style>
	/*每个页面公共css */
	@import 'wxcomponents/vant/common/index.wxss';
	@import 'static/css/common.css';
	@import 'static/css/function.css';
</style>

<script>
	export default {
		globalData: {
			appid: 'wxe36b893427127efd6c',
			serverUrl: 'http://127.0.0.1:38080/yzev-mp/',
			wsurl: 'ws://127.0.0.1/yzev-mp/websocket/charge/'
		},
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>
