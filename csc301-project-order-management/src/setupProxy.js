const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://127.0.0.1:14000', // Your API server URL without the endpoint
      changeOrigin: true,
      pathRewrite: (path) => {
        return path.replace(/^\/api/, '');
      },
    })
  );
};