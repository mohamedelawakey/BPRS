#!/bin/bash

set -e

echo "Let's Start"
PROJECT_DIR="$PWD"

# 1. Initialize the virtual environment
if [ ! -d "venv" ]; then
    echo "Virtual environment not found. Creating one..."
    python3 -m venv venv || python -m venv venv
else
    echo "Virtual environment already exists. Skipping creation."
fi

# 2. Check System OS & activate venv based on OS
echo "Checking System OS and Activating VENV..."
case "$OSTYPE" in
  msys* | cygwin* | win32*) 
    echo "Windows detected."
    source venv/Scripts/activate || true
    BACKEND_CMD="cd /d \"$PROJECT_DIR\" && venv\\Scripts\\activate && python -m uvicorn backend.app.main:app --reload --port 8002"
    FRONTEND_CMD="cd /d \"$PROJECT_DIR\\frontend\" && npm install && npm run dev"
    ;;
  *) 
    echo "Unix-based OS (Linux/macOS) detected."
    source venv/bin/activate
    BACKEND_CMD="cd '$PROJECT_DIR' && source venv/bin/activate && python -m uvicorn backend.app.main:app --reload --port 8002"
    FRONTEND_CMD="cd '$PROJECT_DIR/frontend' && npm install && npm run dev"
    ;;
esac

echo "Virtual Environment is Active!"

# 3. Install dependencies
echo "Installing/Updating dependencies..."
pip install --upgrade pip
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
pip install -r ml/requirements.txt 
pip install -r backend/requirements.txt 

echo "Setup completed!"

# 4. Start the Frontend and Backend in separate windows
echo "Launching Backend and Frontend in separate windows..."

case "$OSTYPE" in
  msys* | cygwin* | win32*) 
    start cmd /k "$BACKEND_CMD"
    start cmd /k "$FRONTEND_CMD"
    ;;
  darwin*) 
    osascript -e "tell application \"Terminal\" to do script \"$BACKEND_CMD\""
    osascript -e "tell application \"Terminal\" to do script \"$FRONTEND_CMD\""
    ;;
  linux*)
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal --title="BACKEND" -- bash -c "$BACKEND_CMD; exec bash"
        gnome-terminal --title="FRONTEND" -- bash -c "$FRONTEND_CMD; exec bash"
    elif command -v xterm &> /dev/null; then
        xterm -title "BACKEND" -e "bash -c '$BACKEND_CMD; exec bash'" &
        xterm -title "FRONTEND" -e "bash -c '$FRONTEND_CMD; exec bash'" &
    else
        echo "No supported terminal emulator found. Falling back to concurrently..."
        npx concurrently "$BACKEND_CMD" "$FRONTEND_CMD"
    fi
    ;;
  *)
    npx concurrently "$BACKEND_CMD" "$FRONTEND_CMD"
    ;;
esac

echo "Done! Check your taskbar for the new windows."
