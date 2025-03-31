const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://upjv-prospection-vps.amourfoot.fr',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/api': '/api'
      },
      onProxyReq: function (proxyReq, req, res) {
        // Log de la requête
        console.log('Requête proxy:', {
          method: proxyReq.method,
          path: proxyReq.path,
          headers: proxyReq.getHeaders()
        });

        // Gestion des cookies et authentification
        if (req.headers.cookie) {
          proxyReq.setHeader('Cookie', req.headers.cookie);
        }

        // Ajout des headers CORS
        proxyReq.setHeader('Origin', 'http://upjv-prospection-vps.amourfoot.fr');
      },
      onProxyRes: function (proxyRes, req, res) {
        // Log de la réponse
        console.log('Réponse proxy:', {
          status: proxyRes.statusCode,
          headers: proxyRes.headers,
          path: req.path
        });

        // Log des erreurs de proxy
        if (proxyRes.statusCode >= 400) {
          console.error('Erreur proxy:', {
            status: proxyRes.statusCode,
            headers: proxyRes.headers,
            path: req.path
          });
        }
      },
      logLevel: 'debug'
    })
  );
};
