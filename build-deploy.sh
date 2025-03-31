#!/bin/bash

# Check if running as root or with sufficient permissions
if [ "$(id -u)" -ne 0 ]; then
  echo "Ce script doit être exécuté avec des privilèges root"
  echo "Essayez: sudo $0"
  exit 1
fi

# Configuration paths
PUBLIC_DIR="/var/www/html/prospection-frontend/build"
BACKUP_DIR="/var/www/html/prospection-frontend/backups"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -ge "18" ]; then
  # Set NODE_OPTIONS to support legacy OpenSSL provider for Node.js v18+
  export NODE_OPTIONS=--openssl-legacy-provider
fi

# Check dependencies
echo "Vérification des dépendances..."
npm install
if [ $? -ne 0 ]; then
  echo "L'installation des dépendances a échoué!"
  exit 1
fi

# Create backup of current public directory if it exists
if [ -d "$PUBLIC_DIR" ]; then
  BACKUP_DATE=$(date +%Y%m%d%H%M%S)
  echo "Création d'une sauvegarde de la version actuelle..."
  tar -czf "$BACKUP_DIR/frontend-backup-$BACKUP_DATE.tar.gz" -C "$PUBLIC_DIR" .
  if [ $? -ne 0 ]; then
    echo "Avertissement: La sauvegarde a échoué. Continuation du déploiement..."
  else
    echo "Sauvegarde créée: $BACKUP_DIR/frontend-backup-$BACKUP_DATE.tar.gz"
  fi
fi

# Build the React application
echo "Compilation de l'application React..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "La compilation a échoué!"
  exit 1
fi

# Create the public directory if it doesn't exist
mkdir -p $PUBLIC_DIR

# Clear the current public directory
echo "Nettoyage du répertoire public..."
rm -rf $PUBLIC_DIR/*

# Copy the build to the public directory
echo "Copie des fichiers compilés vers le répertoire public..."
cp -r build/* $PUBLIC_DIR/

# Set appropriate permissions
echo "Configuration des permissions..."
chmod -R 755 $PUBLIC_DIR
chown -R apache:apache $PUBLIC_DIR

echo "Déploiement terminé avec succès!"
