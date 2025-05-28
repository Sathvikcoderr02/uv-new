#!/bin/bash

# This script tests different API endpoints to find the correct URL

# Your Render service URL
RENDER_URL="https://uv-new-1.onrender.com"

echo "Testing API endpoints at $RENDER_URL"
echo "-----------------------------------"

# Test root endpoint
echo "Testing root endpoint..."
curl -s "$RENDER_URL/"
echo -e "\n"

# Test health endpoint
echo "Testing health endpoint..."
curl -s "$RENDER_URL/health"
echo -e "\n"

# Test debug endpoint
echo "Testing debug endpoint..."
curl -s "$RENDER_URL/debug"
echo -e "\n"

# Test product endpoint
echo "Testing product endpoint..."
curl -s "$RENDER_URL/api/products/14"
echo -e "\n"

echo "Testing complete!"
