#!/bin/bash

set -e

echo "Let's Start"

# initialize the virtual environment
if [ ! -d "venv" ]; then
    echo "Virtual environment not found. Creating one..."
    python -m venv venv
else
    echo "Virtual environment already exists. Skipping creation."
fi

# activate the virtual environment
echo "Checking System OS..."
case "$OSTYPE" in
  msys* | cygwin* | win32*) 
    echo "Windows detected."
    source venv/Scripts/activate
    ;;
  darwin*) 
    echo "macOS detected."
    source venv/bin/activate
    ;;
  linux*) 
    echo "Linux detected."
    source venv/bin/activate
    ;;
  *) 
    echo "Unknown OS: $OSTYPE. Trying default Unix path..."
    source venv/bin/activate
    ;;
esac

echo "Virtual Environment is Active!"

# install dependencies
pip install --upgrade pip
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
pip install -r ml/requirements.txt 
pip install -r backend/requirements.txt 

echo "setup completed"
