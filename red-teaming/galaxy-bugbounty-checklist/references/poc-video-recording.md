# PoC Video Recording Guide (Kali Linux / XFCE)

## Prerequisites
- ffmpeg (pre-installed on Kali)
- Terminal with screen recording capability
- Microphone (optional, for voice narration)

## Step 1: Disable Notifications
```bash
# XFCE notification disable
xfconf-query -c xfce4-notifyd -p /do-not-disturb -s true
```

## Step 2: Check Screen Resolution
```bash
xdpyinfo | grep dimensions
# Output: dimensions: 1920x1080 pixels
```

## Step 3: Start Recording
```bash
ffmpeg -f x11grab -framerate 30 -video_size 1920x1080 -i :0.0 -c:v libx264 -preset ultrafast ~/Desktop/poc_TARGET.mp4
```

## Step 4: Execute Demo Steps
Perform each step clearly with pauses:
1. Open terminal → run recon command (e.g., nslookup)
2. Open browser → show blocked page (403)
3. Open new tab → show bypassed page (e.g., cPanel)
4. Return to terminal → show service banner

## Step 5: Stop Recording
Press `Ctrl+C` in the ffmpeg terminal.

## Step 6: Upload
- YouTube (Unlisted) → copy link
- Google Drive (shareable) → copy link
- Streamable.com → copy link

## Step 7: Add to Report
In HackerOne report "Proof of Concept" field:
```
Video PoC: https://youtube.com/watch?v=XXXXX
```

## Voice Narration Script (Optional)
```
"This is a proof of concept video for [PROGRAM] bug bounty report.

Step 1: [Describe what you're doing]
[Show the action]

Step 2: [Describe what you're doing]
[Show the action]

This demonstrates [vulnerability type] which allows [impact].

End of proof of concept."
```

## Tips
- Disable notifications before recording
- Close unnecessary tabs/applications
- Zoom browser for readability
- Move mouse slowly and deliberately
- Pause 2-3 seconds at each step for reviewer
- If no microphone, ensure screen actions are clear enough to follow

## Alternative Recording Tools
- OBS Studio (GUI, more features): `sudo apt install obs-studio`
- SimpleScreenRecorder: `sudo apt install simplescreenrecorder`
- GNOME: built-in screencast (Ctrl+Shift+Alt+R)
