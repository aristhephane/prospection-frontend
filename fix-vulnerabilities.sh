#!/bin/bash

set -e  # Exit on error
trap 'echo "An error occurred. Exiting..."; exit 1' ERR

echo "Starting vulnerability remediation process..."

# Create a resolutions.json file if it doesn't exist
if [ ! -f "resolutions.json" ]; then
  echo "Creating resolutions.json file..."
  cat > resolutions.json << EOL
{
  "resolutions": {
    "//": "Add manual resolutions for problematic dependencies here",
    "example-package": "2.0.1"
  }
}
EOL
  echo "Created resolutions.json. Please edit it to add specific package versions if needed."
else
  echo "Using existing resolutions.json file for dependency resolution."
fi

# Backup the original package files
if [ -f "package.json" ]; then
  echo "Backing up package.json..."
  cp package.json package.json.backup
fi

if [ -f "package-lock.json" ]; then
  echo "Backing up package-lock.json..."
  cp package-lock.json package-lock.json.backup
fi

# Clean project dependencies
echo "Cleaning project dependencies..."
rm -rf node_modules package-lock.json

# Apply manual resolutions to package.json if needed
if [ -f "resolutions.json" ]; then
  echo "Applying manual resolutions to package.json..."
  jq -s '.[0] * .[1]' package.json.backup resolutions.json > package.json
fi

# Try a standard npm audit fix first (less aggressive)
echo "Attempting standard vulnerability fixes..."
npm audit fix || echo "Standard fixes incomplete, continuing with more aggressive fixes..."

# Install dependencies with legacy peer deps to avoid peer dependency issues
echo "Reinstalling dependencies..."
npm install --legacy-peer-deps || echo "Installation with legacy-peer-deps failed, continuing..."

# Try with force flag for more aggressive fixes
echo "Attempting more aggressive vulnerability fixes..."
npm audit fix --force || echo "Force fix encountered issues, trying alternative approach..."

# If force fix fails, try manual approach
if [ $? -ne 0 ]; then
  echo "Using alternative approach for fixing vulnerabilities..."
  
  # Update the package.json directly for react-scripts if that's an issue
  if grep -q "react-scripts" package.json; then
    echo "Updating react-scripts in package.json..."
    sed -i 's/"react-scripts": "[^"]*"/"react-scripts": "5.0.1"/g' package.json
  fi
  
  # Reinstall dependencies
  echo "Reinstalling dependencies after manual fixes..."
  npm install --legacy-peer-deps
fi

# Final vulnerability check
echo "Checking remaining vulnerabilities..."
npm audit || true  # Don't fail if vulnerabilities remain

echo "Vulnerability remediation process complete!"
echo "A backup of your original package files has been saved as package.json.backup and package-lock.json.backup"
echo "You may need to update your code if there are breaking changes in the updated packages."