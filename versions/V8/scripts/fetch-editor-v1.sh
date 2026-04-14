#!/bin/bash

# Fetch from your InkLink repo's feature/editor-v1 branch
cd /vercel/share/v0-project

# Add your repo as remote if not already added
git remote add inklink https://github.com/siham-anwar/Senior-Project-InkLink.git 2>/dev/null || true

# Fetch the feature/editor-v1 branch
git fetch inklink feature/editor-v1

# Show what files are in that branch
echo "Files in feature/editor-v1 branch:"
git ls-tree -r inklink/feature/editor-v1 --name-only | head -20
