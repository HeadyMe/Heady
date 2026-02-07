#!/data/data/com.termux/files/usr/bin/bash
# ╔══════════════════════════════════════════════════════════════════╗
# ║  HEADY SYSTEMS — Phone SSH Setup                                 ║
# ║  Run this script inside Termux on your Android phone             ║
# ║  Usage: bash phone-ssh-setup.sh                                  ║
# ╚══════════════════════════════════════════════════════════════════╝

set -e

echo ""
echo "  ╔══════════════════════════════════════╗"
echo "  ║  HEADY SYSTEMS — Phone SSH Setup     ║"
echo "  ║  ∞ SACRED GEOMETRY ∞                 ║"
echo "  ╚══════════════════════════════════════╝"
echo ""

# ─── Step 1: Update and install packages ───────────────────────────
echo "[1/8] Updating packages..."
pkg update -y && pkg upgrade -y

echo "[2/8] Installing tools..."
pkg install -y openssh termux-services termux-auth rsync wget curl git python nodejs-lts nano

# ─── Step 2: Set password ──────────────────────────────────────────
echo ""
echo "[3/8] Set a strong password for SSH access:"
passwd

# ─── Step 3: Generate host keys ───────────────────────────────────
echo "[4/8] Generating SSH keys..."
mkdir -p ~/.ssh
chmod 700 ~/.ssh

if [ ! -f "$PREFIX/etc/ssh/ssh_host_ed25519_key" ]; then
    ssh-keygen -t ed25519 -f "$PREFIX/etc/ssh/ssh_host_ed25519_key" -N ""
fi
if [ ! -f "$PREFIX/etc/ssh/ssh_host_rsa_key" ]; then
    ssh-keygen -t rsa -b 4096 -f "$PREFIX/etc/ssh/ssh_host_rsa_key" -N ""
fi

# ─── Step 4: Configure sshd ───────────────────────────────────────
echo "[5/8] Configuring SSH server..."
cat > "$PREFIX/etc/ssh/sshd_config" << 'SSHD_CONF'
# Heady Phone SSH Configuration
# Port 8022 is Termux default (avoids needing root for port 22)
Port 8022
ListenAddress 0.0.0.0

# Authentication
PasswordAuthentication yes
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys

# Security
PermitEmptyPasswords no
MaxAuthTries 3
LoginGraceTime 30

# Features
PrintMotd yes
Subsystem sftp /data/data/com.termux/files/usr/libexec/sftp-server
SSHD_CONF

# ─── Step 5: Create MOTD ──────────────────────────────────────────
echo "[6/8] Setting up welcome message..."
cat > "$PREFIX/etc/motd" << 'MOTD'

  ╔══════════════════════════════════════════╗
  ║  HEADY SYSTEMS — Phone SSH Access        ║
  ║  ∞ SACRED GEOMETRY ∞                     ║
  ║                                          ║
  ║  Device: Android (OnePlus Open)          ║
  ║  Heady Buddy: Active                     ║
  ║                                          ║
  ║  Commands:                               ║
  ║    heady-status    System info            ║
  ║    heady-ssh-start Start SSH              ║
  ║    heady-ssh-stop  Stop SSH               ║
  ║    heady-buddy     Check Buddy status     ║
  ╚══════════════════════════════════════════╝

MOTD

# ─── Step 6: Create helper scripts ─────────────────────────────────
echo "[7/8] Creating helper scripts..."

# heady-status
cat > "$PREFIX/bin/heady-status" << 'STATUS'
#!/data/data/com.termux/files/usr/bin/bash
echo ""
echo "  ═══ Heady Phone Status ═══"
echo ""
echo "  Hostname:  $(hostname)"
echo "  User:      $(whoami)"
echo "  IP (WiFi): $(ifconfig wlan0 2>/dev/null | grep 'inet ' | awk '{print $2}' || echo 'N/A')"
echo "  SSH Port:  8022"
echo "  Uptime:    $(uptime -p 2>/dev/null || uptime)"
echo "  Storage:   $(df -h /data 2>/dev/null | tail -1 | awk '{print $3 "/" $2 " (" $5 " used)"}' || echo 'N/A')"
echo "  Node.js:   $(node --version 2>/dev/null || echo 'not installed')"
echo "  Python:    $(python --version 2>/dev/null || echo 'not installed')"
echo ""
echo "  SSH:       $(pgrep sshd >/dev/null 2>&1 && echo 'RUNNING' || echo 'STOPPED')"
echo "  Buddy API: $(curl -sf http://localhost:3301/buddy/status 2>/dev/null | head -c 50 || echo 'not running')"
echo ""
STATUS
chmod +x "$PREFIX/bin/heady-status"

# heady-ssh-start
cat > "$PREFIX/bin/heady-ssh-start" << 'SSHSTART'
#!/data/data/com.termux/files/usr/bin/bash
if pgrep sshd >/dev/null 2>&1; then
    echo "SSH server is already running"
else
    sshd
    echo "SSH server started"
fi
IP=$(ifconfig wlan0 2>/dev/null | grep 'inet ' | awk '{print $2}')
echo ""
echo "Connect from your computer:"
echo "  ssh $(whoami)@${IP:-PHONE_IP} -p 8022"
echo ""
SSHSTART
chmod +x "$PREFIX/bin/heady-ssh-start"

# heady-ssh-stop
cat > "$PREFIX/bin/heady-ssh-stop" << 'SSHSTOP'
#!/data/data/com.termux/files/usr/bin/bash
pkill sshd 2>/dev/null
echo "SSH server stopped"
SSHSTOP
chmod +x "$PREFIX/bin/heady-ssh-stop"

# heady-buddy (check buddy status)
cat > "$PREFIX/bin/heady-buddy" << 'BUDDY'
#!/data/data/com.termux/files/usr/bin/bash
echo ""
echo "  ═══ Heady Buddy Status ═══"
echo ""
BUDDY_STATUS=$(curl -sf http://localhost:3301/buddy/status 2>/dev/null)
if [ -n "$BUDDY_STATUS" ]; then
    echo "  Status: RUNNING"
    echo "  Response: $BUDDY_STATUS"
else
    echo "  Status: NOT RUNNING"
    echo ""
    echo "  To start Buddy backend:"
    echo "    cd ~/heady && node buddy-backend.js"
fi
echo ""
BUDDY
chmod +x "$PREFIX/bin/heady-buddy"

# ─── Step 7: Create Termux:Boot script ─────────────────────────────
mkdir -p ~/.termux/boot
cat > ~/.termux/boot/start-heady.sh << 'BOOTSCRIPT'
#!/data/data/com.termux/files/usr/bin/bash
# Start on boot: wake lock + SSH
termux-wake-lock
sshd
# Optional: start Buddy backend
# cd ~/heady && node buddy-backend.js &
BOOTSCRIPT
chmod +x ~/.termux/boot/start-heady.sh

# ─── Step 8: Start SSH now ─────────────────────────────────────────
echo "[8/8] Starting SSH server..."
sshd

IP=$(ifconfig wlan0 2>/dev/null | grep 'inet ' | awk '{print $2}')
USER=$(whoami)

echo ""
echo "  ╔══════════════════════════════════════════╗"
echo "  ║          SETUP COMPLETE                  ║"
echo "  ╠══════════════════════════════════════════╣"
echo "  ║  SSH is running on port 8022             ║"
echo "  ║                                          ║"
echo "  ║  From your Windows computer:             ║"
echo "  ║    ssh ${USER}@${IP:-PHONE_IP} -p 8022   "
echo "  ║                                          ║"
echo "  ║  From your Linux computer:               ║"
echo "  ║    ssh ${USER}@${IP:-PHONE_IP} -p 8022   "
echo "  ║                                          ║"
echo "  ╠══════════════════════════════════════════╣"
echo "  ║  Quick commands:                         ║"
echo "  ║    heady-status     Phone info           ║"
echo "  ║    heady-ssh-start  Start SSH            ║"
echo "  ║    heady-ssh-stop   Stop SSH             ║"
echo "  ║    heady-buddy      Buddy status         ║"
echo "  ╠══════════════════════════════════════════╣"
echo "  ║  To add SSH key (no password login):     ║"
echo "  ║  1. On PC: cat ~/.ssh/id_ed25519.pub     ║"
echo "  ║  2. Here:  echo 'KEY' >> ~/.ssh/auth...  ║"
echo "  ╠══════════════════════════════════════════╣"
echo "  ║  Auto-start on boot:                     ║"
echo "  ║  Install Termux:Boot from F-Droid        ║"
echo "  ║  Script already placed in:               ║"
echo "  ║    ~/.termux/boot/start-heady.sh         ║"
echo "  ╚══════════════════════════════════════════╝"
echo ""
echo "  IMPORTANT for OnePlus Open:"
echo "  Go to Settings → Battery → Battery Optimization"
echo "  Find Termux → Select 'Don't Optimize'"
echo "  Also: Settings → Apps → Termux → Allow background activity"
echo ""
