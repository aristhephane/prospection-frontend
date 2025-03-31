#!/bin/bash

# Vérification et activation des modules Apache nécessaires
MODULES=("rewrite" "ssl" "headers")

echo "Vérification des modules Apache..."

# Détecter le système
if [ -f "/etc/debian_version" ]; then
    # Debian/Ubuntu
    for MODULE in "${MODULES[@]}"; do
        if ! apache2ctl -M 2>/dev/null | grep -q "$MODULE"; then
            echo "Activation du module $MODULE..."
            sudo a2enmod $MODULE
            RESTART_NEEDED=true
        else
            echo "Module $MODULE est déjà activé."
        fi
    done
    
    if [ "$RESTART_NEEDED" = true ]; then
        echo "Redémarrage d'Apache..."
        sudo systemctl restart apache2
    fi
elif [ -f "/etc/redhat-release" ]; then
    # CentOS/RHEL
    for MODULE in "${MODULES[@]}"; do
        if ! httpd -M 2>/dev/null | grep -q "$MODULE"; then
            echo "Le module $MODULE n'est pas activé. Veuillez ajouter la ligne suivante dans /etc/httpd/conf.modules.d/00-base.conf:"
            echo "LoadModule ${MODULE}_module modules/mod_${MODULE}.so"
        else
            echo "Module $MODULE est activé."
        fi
    done
    
    echo "Si des modifications ont été apportées, redémarrez Apache avec: sudo systemctl restart httpd"
fi

echo "Vérification terminée!"
