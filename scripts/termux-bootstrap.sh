#!/data/data/com.termux/files/usr/bin/bash
# ╔══════════════════════════════════════════════════════════╗
# ║  Heady Termux Bootstrap v1.0.0                           ║
# ║  Sets up Android phone as a Heady server node            ║
# ║  SSH + Node.js + heady-manager + auto-start              ║
# ╚══════════════════════════════════════════════════════════╝
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/HeadySystems/Heady/main/scripts/termux-bootstrap.sh | bash
#   OR
#   bash termux-bootstrap.sh
#
# Prerequisites:
#   - Termux installed from F-Droid (NOT Play Store)
#   - Termux:Boot installed from F-Droid
#   - Termux:API installed from F-Droid (optional but recommended)

set -euo pipefail

HEADY_HOME="$HOME/heady"
HEADY_REPO="https://github.com/HeadySystems/Heady.git"
LOG_FILE="$HOME/heady-bootstrap.log"

# ── Colors ──────────────────────────────────────────────────
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
MAGENTA='\033[0;35m'
NC='\033[0m'

log() { echo -e "${CYAN}[HEADY]${NC} $1" | tee -a "$LOG_FILE"; }
ok()  { echo -e "${GREEN}  ✓${NC} $1" | tee -a "$LOG_FILE"; }
warn(){ echo -e "${YELLOW}  ⚠${NC} $1" | tee -a "$LOG_FILE"; }
err() { echo -e "${RED}  ✗${NC} $1" | tee -a "$LOG_FILE"; }

banner() {
  echo -e "${MAGENTA}"
  echo "╔══════════════════════════════════════╗"
  echo "║  ██╗  ██╗███████╗ █████╗ ██████╗ ██╗   ██╗  ║"
  echo "║  ██║  ██║██╔════╝██╔══██╗██╔══██╗╚██╗ ██╔╝  ║"
  echo "║  ███████║█████╗  ███████║██║  ██║ ╚████╔╝   ║"
  echo "║  ██╔══██║██╔══╝  ██╔══██║██║  ██║  ╚██╔╝    ║"
  echo "║  ██║  ██║███████╗██║  ██║██████╔╝   ██║     ║"
  echo "║  ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝    ╚═╝     ║"
  echo "║                                              ║"
  echo "║  Termux Bootstrap v1.0.0                     ║"
  echo "║  Phone → Heady Server Node                   ║"
  echo "╚══════════════════════════════════════╝"
  echo -e "${NC}"
}

# ── Step 1: Update packages ─────────────────────────────────
step_update() {
  log "Step 1/7: Updating Termux packages..."
  pkg update -y 2>&1 | tail -1 | tee -a "$LOG_FILE"
  pkg upgrade -y 2>&1 | tail -1 | tee -a "$LOG_FILE"
  ok "Packages updated"
}

# ── Step 2: Install core tools ──────────────────────────────
step_install() {
  log "Step 2/7: Installing core packages..."

  local packages=(
    openssh
    git
    nodejs-lts
    python
    wget
    curl
    jq
    nmap
    net-tools
    build-essential
  )

  # Optional: termux-api (may not be available if Termux:API not installed)
  if pkg list-installed 2>/dev/null | grep -q termux-api; then
    ok "termux-api already installed"
  else
    packages+=(termux-api)
  fi

  for pkg_name in "${packages[@]}"; do
    if command -v "$pkg_name" &>/dev/null || pkg list-installed 2>/dev/null | grep -q "^$pkg_name/"; then
      ok "$pkg_name (already installed)"
    else
      log "  Installing $pkg_name..."
      pkg install -y "$pkg_name" 2>&1 | tail -1 | tee -a "$LOG_FILE"
      ok "$pkg_name installed"
    fi
  done
}

# ── Step 3: Setup SSH ────────────────────────────────────────
step_ssh() {
  log "Step 3/7: Configuring SSH server..."

  mkdir -p ~/.ssh
  chmod 700 ~/.ssh

  # Generate host keys if needed
  if [ ! -f "$PREFIX/etc/ssh/ssh_host_ed25519_key" ]; then
    ssh-keygen -A 2>&1 | tee -a "$LOG_FILE"
    ok "SSH host keys generated"
  else
    ok "SSH host keys already exist"
  fi

  # Create authorized_keys if not exists
  touch ~/.ssh/authorized_keys
  chmod 600 ~/.ssh/authorized_keys

  # Set password
  echo ""
  echo -e "${YELLOW}Set your SSH password (used for initial login):${NC}"
  passwd

  # Start SSH server
  if pgrep -x sshd > /dev/null; then
    ok "SSH server already running"
  else
    sshd
    ok "SSH server started on port 8022"
  fi

  # Show connection info
  local ip
  ip=$(ifconfig wlan0 2>/dev/null | grep 'inet ' | awk '{print $2}' || echo "<phone-ip>")
  local user
  user=$(whoami)

  echo ""
  echo -e "${GREEN}╔══════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║  SSH Connection Info                          ║${NC}"
  echo -e "${GREEN}╠══════════════════════════════════════════════╣${NC}"
  echo -e "${GREEN}║  From your PC run:                            ║${NC}"
  echo -e "${GREEN}║  ssh ${user}@${ip} -p 8022            ║${NC}"
  echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
}

# ── Step 4: Setup Heady workspace ────────────────────────────
step_workspace() {
  log "Step 4/7: Setting up Heady workspace..."

  mkdir -p "$HEADY_HOME"

  if [ -d "$HEADY_HOME/Heady/.git" ]; then
    log "  Heady repo exists, pulling latest..."
    cd "$HEADY_HOME/Heady"
    git pull --rebase 2>&1 | tail -3 | tee -a "$LOG_FILE"
    ok "Heady repo updated"
  else
    log "  Cloning Heady repository..."
    git clone "$HEADY_REPO" "$HEADY_HOME/Heady" 2>&1 | tail -3 | tee -a "$LOG_FILE" || {
      warn "Git clone failed (may need SSH key or token). Skipping repo clone."
      warn "You can clone manually later: git clone $HEADY_REPO $HEADY_HOME/Heady"
    }
  fi

  # Install Node dependencies if repo exists
  if [ -d "$HEADY_HOME/Heady/node_modules" ]; then
    ok "Node modules already installed"
  elif [ -f "$HEADY_HOME/Heady/package.json" ]; then
    log "  Installing Node.js dependencies..."
    cd "$HEADY_HOME/Heady"
    npm install --production 2>&1 | tail -3 | tee -a "$LOG_FILE"
    ok "Node modules installed"
  fi
}

# ── Step 5: Setup auto-start (Termux:Boot) ──────────────────
step_autostart() {
  log "Step 5/7: Configuring auto-start on boot..."

  mkdir -p ~/.termux/boot

  cat > ~/.termux/boot/start-heady.sh << 'BOOTSCRIPT'
#!/data/data/com.termux/files/usr/bin/bash
# ── Heady Auto-Start (Termux:Boot) ──
# Runs on device boot to start SSH + HeadyManager

# Acquire wake lock to prevent CPU sleep
termux-wake-lock

# Wait for network
sleep 5

# Start SSH server
sshd

# Start HeadyManager if repo exists
HEADY_DIR="$HOME/heady/Heady"
if [ -f "$HEADY_DIR/heady-manager.js" ]; then
  cd "$HEADY_DIR"
  NODE_ENV=production node heady-manager.js >> "$HOME/heady/manager.log" 2>&1 &
fi

# Start watchdog
if [ -f "$HOME/heady/watchdog.sh" ]; then
  bash "$HOME/heady/watchdog.sh" >> "$HOME/heady/watchdog.log" 2>&1 &
fi
BOOTSCRIPT

  chmod +x ~/.termux/boot/start-heady.sh
  ok "Boot script created at ~/.termux/boot/start-heady.sh"
}

# ── Step 6: Create watchdog ──────────────────────────────────
step_watchdog() {
  log "Step 6/7: Creating service watchdog..."

  cat > "$HEADY_HOME/watchdog.sh" << 'WATCHDOG'
#!/data/data/com.termux/files/usr/bin/bash
# ── Heady Service Watchdog ──
# Checks every 5 minutes that SSH and HeadyManager are running

HEADY_DIR="$HOME/heady/Heady"
LOG="$HOME/heady/watchdog.log"

while true; do
  # Check SSH
  if ! pgrep -x sshd > /dev/null; then
    sshd
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Restarted sshd" >> "$LOG"
  fi

  # Check HeadyManager
  if [ -f "$HEADY_DIR/heady-manager.js" ]; then
    if ! pgrep -f "heady-manager" > /dev/null; then
      cd "$HEADY_DIR"
      NODE_ENV=production node heady-manager.js >> "$HOME/heady/manager.log" 2>&1 &
      echo "[$(date '+%Y-%m-%d %H:%M:%S')] Restarted heady-manager" >> "$LOG"
    fi
  fi

  sleep 300
done
WATCHDOG

  chmod +x "$HEADY_HOME/watchdog.sh"
  ok "Watchdog created at $HEADY_HOME/watchdog.sh"
}

# ── Step 7: Setup storage access ─────────────────────────────
step_storage() {
  log "Step 7/7: Setting up storage access..."

  if [ -d ~/storage ]; then
    ok "Storage already linked"
  else
    log "  Requesting storage permission..."
    termux-setup-storage
    ok "Storage access configured (check ~/storage/)"
  fi
}

# ── Summary ──────────────────────────────────────────────────
summary() {
  local ip
  ip=$(ifconfig wlan0 2>/dev/null | grep 'inet ' | awk '{print $2}' || echo "<phone-ip>")
  local user
  user=$(whoami)

  echo ""
  echo -e "${MAGENTA}╔══════════════════════════════════════════════════════╗${NC}"
  echo -e "${MAGENTA}║  Heady Termux Bootstrap — Complete!                  ║${NC}"
  echo -e "${MAGENTA}╠══════════════════════════════════════════════════════╣${NC}"
  echo -e "${MAGENTA}║                                                      ║${NC}"
  echo -e "${MAGENTA}║  SSH:              port 8022                         ║${NC}"
  echo -e "${MAGENTA}║  HeadyManager:     port 3300 (after start)           ║${NC}"
  echo -e "${MAGENTA}║  Auto-start:       ENABLED (Termux:Boot)             ║${NC}"
  echo -e "${MAGENTA}║  Watchdog:         ENABLED (5 min interval)          ║${NC}"
  echo -e "${MAGENTA}║                                                      ║${NC}"
  echo -e "${MAGENTA}║  Connect from PC:                                    ║${NC}"
  echo -e "${MAGENTA}║    ssh ${user}@${ip} -p 8022                 ║${NC}"
  echo -e "${MAGENTA}║                                                      ║${NC}"
  echo -e "${MAGENTA}║  Start HeadyManager manually:                        ║${NC}"
  echo -e "${MAGENTA}║    cd ~/heady/Heady && node heady-manager.js         ║${NC}"
  echo -e "${MAGENTA}║                                                      ║${NC}"
  echo -e "${MAGENTA}║  Next steps:                                         ║${NC}"
  echo -e "${MAGENTA}║    1. Copy SSH public key from PC for key auth       ║${NC}"
  echo -e "${MAGENTA}║    2. Disable battery optimization for Termux        ║${NC}"
  echo -e "${MAGENTA}║    3. Lock Termux in Recent Apps                     ║${NC}"
  echo -e "${MAGENTA}║    4. Install HeadyBuddy + HeadyBrowser APKs        ║${NC}"
  echo -e "${MAGENTA}║                                                      ║${NC}"
  echo -e "${MAGENTA}╚══════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "${CYAN}Log saved to: $LOG_FILE${NC}"
}

# ── Main ─────────────────────────────────────────────────────
main() {
  banner
  echo "$(date '+%Y-%m-%d %H:%M:%S') — Heady Termux Bootstrap started" > "$LOG_FILE"

  step_update
  step_install
  step_ssh
  step_workspace
  step_autostart
  step_watchdog
  step_storage
  summary
}

main "$@"
