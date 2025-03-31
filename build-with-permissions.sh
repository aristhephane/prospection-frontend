#!/bin/bash

# Définir les chemins
BUILD_DIR="/var/www/html/prospection-frontend/build"
STATIC_DIR="$BUILD_DIR/static"

# Nettoyer d'abord le répertoire build avec les bonnes permissions
echo "Nettoyage du répertoire build..."
if [ -d "$BUILD_DIR" ]; then
    sudo rm -rf "$BUILD_DIR"
fi

# Créer un nouveau répertoire build avec les bonnes permissions
echo "Création d'un nouveau répertoire build..."
mkdir -p "$BUILD_DIR"
sudo chown $(whoami):$(whoami) "$BUILD_DIR"

# Lancer la construction
echo "Construction de l'application..."
npm run build

# Correction des permissions pour Apache après le build
echo "Correction des permissions pour Apache..."
sudo chown -R apache:apache "$BUILD_DIR"
sudo chmod -R 755 "$BUILD_DIR"

echo "Build terminé avec les permissions correctes!"
