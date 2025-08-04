const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL || 'http://localhost:4000',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // /api를 제거하고 백엔드로 전달
      },
    })
  );
}; 