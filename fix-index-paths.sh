#!/bin/bash

# Script pour corriger les chemins des assets dans le fichier index.html du build

INDEX_FILE="/var/www/html/prospection-frontend/build/index.html"

if [ -f "$INDEX_FILE" ]; then
    # Remplacer les chemins relatifs par des chemins absolus
    sed -i 's/href="\//href="\/\//g' "$INDEX_FILE"
    sed -i 's/src="\//src="\/\//g' "$INDEX_FILE"
    
    # Correction plus précise pour les ressources JavaScript et CSS
    sed -i 's/"\/static\//"\/static\//g' "$INDEX_FILE"
    
    echo "Chemins des assets dans index.html corrigés."
else
    echo "Fichier index.html non trouvé dans le build."
    exit 1
fi
