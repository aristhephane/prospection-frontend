#!/bin/bash

# Script pour reconstruire le frontend après modification de la configuration API

echo "Nettoyage du cache npm..."
npm cache clean --force

echo "Installation des dépendances..."
npm install

echo "Création du build de production..."
npm run build

echo "Exécution du script de permissions..."
./build-with-permissions.sh

echo "Reconstruction terminée !"
echo "Le frontend est maintenant configuré pour utiliser l'API sur le sous-domaine."
echo "Vérifiez que l'entrée DNS pour api.upjv-prospection-vps.amourfoot.fr est correctement configurée." 