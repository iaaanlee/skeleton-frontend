const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL || 'http://localhost:4000',
      changeOrigin: true,
      pathRewrite: {
        '^/': '/', // 모든 경로를 그대로 유지
      },
    })
  );
}; 