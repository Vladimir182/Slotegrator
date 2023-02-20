const proxy = require('http-proxy-middleware');

module.exports = function (app) {
	app.use(proxy('/api', {
		target: 'https://dev.cash.paypro.pw:3000', "secure": false,
		// target: 'https://test.cash.paypro.pw:3000', "secure": false,
		//target: 'http://localhost:3000/', "secure": false,
		"changeOrigin": true
	}));
};
