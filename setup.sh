#!/bin/bash

# Exit on any error
set -e

# Install NPM packages
echo "Installing NPM packages..."
npm install

# Install Python dependencies
echo "Installing Python dependencies..."
cd backend/python
pip install -r requirements.txt
cd ../..

# Install Go dependencies
echo "Installing Go dependencies..."
cd backend/go
go mod download
cd ../..

# Check and prompt for environment variables
echo "Checking for required environment variables..."

if [ -z "$AWS_ACCESS_KEY_ID" ]; then
  read -p "AWS_ACCESS_KEY_ID is not set. Please enter it: " AWS_ACCESS_KEY_ID
  export AWS_ACCESS_KEY_ID
fi

if [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
  read -p "AWS_SECRET_ACCESS_KEY is not set. Please enter it: " AWS_SECRET_ACCESS_KEY
  export AWS_SECRET_ACCESS_KEY
fi

if [ -z "$DIGITALOCEAN_TOKEN" ]; then
  read -p "DIGITALOCEAN_TOKEN is not set. Please enter it: " DIGITALOCEAN_TOKEN
  export DIGITALOCEAN_TOKEN
fi

echo "Setup complete!"
echo "Initializing Terraform..."

cd infrastructure/
terraform init
