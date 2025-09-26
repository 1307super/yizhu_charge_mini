function uploadFile(options) {
 	const token = uni.getStorageSync('token')
 	const defaultOptions = {
 	  url: getApp().globalData.serverUrl + options.url,
		name: options.name,
		filePath: options.filePath,
 	  header: {
 	    'content-type': 'application/json',
 	    'Authorization': `Bearer ${uni.getStorageSync('token')}`
 	  },
 		success: options.success
 	}
	uni.uploadFile(defaultOptions)
 }
 
export default uploadFile
