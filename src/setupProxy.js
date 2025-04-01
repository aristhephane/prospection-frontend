const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.upjv-prospection-vps.amourfoot.fr',
      changeOrigin: true,
      secure: true,
      onProxyReq: function (proxyReq, req, res) {
        // Log de la requête
        console.log('Requête proxy:', {
          method: proxyReq.method,
          path: proxyReq.path,
          headers: proxyReq.getHeaders()
        });

        // Préservation des cookies pour l'authentification
        if (req.headers.cookie) {
          proxyReq.setHeader('Cookie', req.headers.cookie);
        }

        // Ajout du header Authorization si présent
        if (req.headers.authorization) {
          proxyReq.setHeader('Authorization', req.headers.authorization);
        }
      },
      onProxyRes: function (proxyRes, req, res) {
        // Log de la réponse
        console.log('Réponse proxy:', {
          status: proxyRes.statusCode,
          path: req.path
        });

        // Conservation des cookies de session du backend
        const setCookieHeader = proxyRes.headers['set-cookie'];
        if (setCookieHeader) {
          console.log('Cookie reçu du backend:', setCookieHeader);
        }

        // Log détaillé des erreurs
        if (proxyRes.statusCode >= 400) {
          console.error('Erreur proxy:', {
            status: proxyRes.statusCode,
            path: req.path,
            message: proxyRes.statusMessage
          });
        }
      },
      // Ajout d'un timeout plus long pour les requêtes
      timeout: 30000,
      // Activation des logs détaillés
      logLevel: 'debug'
    })
  );
};
