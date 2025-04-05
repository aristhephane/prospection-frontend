#!/bin/bash

# Script pour déployer l'application correctement

echo "Démarrage du déploiement de l'application..."

# Aller dans le répertoire du frontend
cd /var/www/html/prospection-frontend

# Nettoyer le cache
echo "Nettoyage du cache npm..."
npm cache clean --force

# Installer les dépendances
echo "Installation des dépendances..."
npm install

# Construire l'application
echo "Création du build de production..."
npm run build

# Corriger les chemins dans index.html
echo "Correction des chemins dans index.html..."
bash ./fix-index-paths.sh

# Configurer les permissions
echo "Configuration des permissions des fichiers..."
find ./build -type f -exec chmod 644 {} \;
find ./build -type d -exec chmod 755 {} \;

# Redémarrer Apache
echo "Redémarrage d'Apache..."
sudo systemctl restart apache2 || sudo systemctl restart httpd

echo "Déploiement terminé!"
echo "L'application devrait maintenant être accessible à https://upjv-prospection-vps.amourfoot.fr"
