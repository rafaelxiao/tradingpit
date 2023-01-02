const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        createProxyMiddleware('/api', {
            target: 'https://api.tushare.pro',
            // target: 'http://www.baidu.com',
            changeOrigin: true,
            pathRewrite: {
                '^/api': ''
            }
        })
    )
}