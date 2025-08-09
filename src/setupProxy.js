const { createProxyMiddleware } = require('http-proxy-middleware');

// 포트 상수 (CommonJS 환경이므로 직접 정의)
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || 4000;
const BACKEND_URL = process.env.REACT_APP_API_URL || `http://localhost:${BACKEND_PORT}`;

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: BACKEND_URL,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // /api를 제거하고 백엔드로 전달
      },
    })
  );
}; 