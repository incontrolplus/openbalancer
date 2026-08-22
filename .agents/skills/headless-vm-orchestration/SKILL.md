---
name: headless-vm-orchestration
description: >-
  Orchestrate headless QEMU virtual machines, perform resilient large-file (.qcow2)
  mesh transfers with auto-resume, bypass SSH multiplexer stalls on external drives,
  inspect live framebuffer boot states via QMP/screendump, and manage noVNC web gateways.
---

# Headless VM Orchestration, Resilient Disk Transfers & Framebuffer Telemetry

## Diagnostic & Orchestration Protocol

### 1. Resilient Large Disk (.qcow2) Mesh Transfers
When transferring multi-gigabyte VM disks between nodes over Tailscale:
1. Use `caffeinate -dimsu` on the sender to prevent system sleep during long-running streaming.
2. Implement byte-offset handshakes to resume interrupted streams without re-sending completed chunks.
3. Verify destination byte size exactly matches the source before triggering VM launch scripts.

### 2. Preventing SSH Multiplexer Lockups on Remote Drives
When querying remote nodes with external NTFS/NFS storage (e.g. `/Volumes/PHILIPS_SSD`):
- Never rely on default `ControlMaster` sockets which can hang indefinitely on slow disk I/O.
- Always execute remote commands with isolated sockets and timeouts:
  ```bash
  ssh -o ControlPath=none -o ConnectTimeout=5 -o BatchMode=yes -i ~/.ssh/id_ed25519 user@<host> "<command>"
  ```

### 3. Headless QEMU VM Execution on Apple Silicon (ARM64 host -> x86_64 guest)
Launch QEMU with proper TCG acceleration, Q35 architecture, AHCI storage, and user-mode port forwardings:
```bash
nohup qemu-system-x86_64 \
    -name "OpenBalancer-Windows11" \
    -machine q35 \
    -cpu max \
    -accel tcg,tb-size=512 \
    -m 4096 -smp 4 \
    -device ahci,id=ahci0 \
    -drive "file=$VM_IMG,format=qcow2,if=none,id=hd0,file.locking=off" \
    -device "ide-hd,drive=hd0,bus=ahci0.0,bootindex=0" \
    -netdev user,id=net0,hostfwd=tcp:0.0.0.0:3389-:3389,hostfwd=tcp:0.0.0.0:5678-:5678 \
    -device virtio-net-pci,netdev=net0 \
    -vga std -usb -device usb-tablet -device usb-kbd \
    -display none \
    -vnc 127.0.0.1:1 \
    -monitor "unix:/tmp/qemu-monitor.sock,server,nowait" > /tmp/qemu.log 2>&1 &
```

### 4. Headless Framebuffer Screendump & Visual Inspection
To capture and inspect the guest OS screen in a headless terminal session without GUI access:
```bash
# 1. Trigger screendump via QEMU monitor socket
echo 'screendump /tmp/vm_screen.ppm' | nc -U /tmp/qemu-monitor.sock

# 2. Convert PPM to PNG using macOS built-in sips (no PIL dependency required)
sips -s format png /tmp/vm_screen.ppm --out /tmp/vm_screen.png

# 3. Pull locally or inspect via view_file
```

### 5. Web VNC Gateway via WebSockify & noVNC
Bridge QEMU VNC to browser-accessible WebSockets:
```bash
nohup /usr/bin/python3 -m websockify --web /path/to/novnc 0.0.0.0:8006 127.0.0.1:5901 > /tmp/websockify.log 2>&1 &
```
- Local URL: `http://<node-ip>:8006/vnc.html?autoconnect=true`
- Ingress Portal: `https://win.openbalancer.com/vnc.html?autoconnect=true`

### 6. Display Wakeup & Rapid Screendump Telemetry
If the QEMU guest screen enters sleep or low-power state:
```bash
# Send wakeup keystroke to guest and capture immediate frame
echo 'sendkey space' | nc -U /tmp/qemu-monitor.sock
sleep 0.5
echo 'screendump /tmp/vm_screen.ppm' | nc -U /tmp/qemu-monitor.sock
sips -s format png /tmp/vm_screen.ppm --out /tmp/vm_screen.png
```

