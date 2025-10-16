<style>
	/*每个页面公共css */
	@import 'wxcomponents/vant/common/index.wxss';
	@import 'static/css/common.css';
	@import 'static/css/function.css';
</style>

<script>
	// serverUrl: 'https://dev.echargeyz.com/prod-api/yzev-mp/'
	// serverUrl: 'http://127.0.0.1:38080/yzev-mp/'
	export default {
		globalData: {
			appid: 'wxbe36fe76127d185a',
			serverUrl: 'https://dev.echargeyz.com/prod-api/yzev-mp/'
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
