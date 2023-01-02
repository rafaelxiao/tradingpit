const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        createProxyMiddleware('/api', {
            target: 'http://api.tushare.pro',
            // target: 'http://www.baidu.com',
            changeOrigin: true,
            pathRewrite: {
                '^/api': ''
            }
        })
    )
}