#!/bin/bash

# Generate detailed audit report in JSON format
echo "Generating detailed npm audit report..."
npm audit --json > npm-audit.json

# Display summary in more readable format
echo "Summary of vulnerabilities:"
npm audit

echo "Detailed report saved to npm-audit.json"
