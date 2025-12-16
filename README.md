# SafeBrowser-The-AI-toolkit-to-keep-your-young-ones-safe-Hackathon-Project-Prototype-

# Safe Browsing - Parental Control Extension 🛡️

A comprehensive browser extension for parental controls with separate interfaces for parents and children.

## Features

### Parent Control Panel

* 🔐 **PIN-Protected Access** - Secure authentication with 4-digit PIN (default: 1234)
* 🚫 **Website Blocking** - Block specific domains or categories
* ⏰ **Time Limits** - Set daily or per-site browsing time limits
* 📊 **Activity Monitoring** - Track visited sites, blocked attempts, and browsing time
* 📝 **Activity Logs** - Detailed timeline of browsing history
* 🔔 **Notifications** - Get alerts when sites are blocked or time limits reached
* ⚙️ **Category Filters** - Block adult content, gambling, social media, and gaming sites
* 💾 **Data Export** - Export activity data for review

### Child-Side Features

* 📊 **Activity Dashboard** - View daily statistics (sites visited, blocked, time online)
* 🛡️ **Block Page** - Friendly interface when sites are blocked
* ⚠️ **Content Warnings** - Alerts for potentially inappropriate content
* ⏰ **Time Warnings** - Notifications when approaching time limits
* 🌟 **Positive Messaging** - Encouraging messages about safe browsing

## Installation

### For Chrome/Edge/Brave

1. Download or clone this repository to your computer
2. Open your browser and go to extensions page:

   * Chrome: `chrome://extensions/`
   * Edge: `edge://extensions/`
   * Brave: `brave://extensions/`

3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `SafeBrowsing-Extension` folder
6. The extension is now installed!

### Create Icons

The extension requires icon files. You can:

1. Create a folder named `icons` in the extension directory
2. Add three PNG files:

   * `icon16.png` (16x16 pixels)
   * `icon48.png` (48x48 pixels)
   * `icon128.png` (128x128 pixels)

You can use any image editing tool or online icon generator to create a shield or lock icon.

## Usage

### For Parents

1. **First Time Setup**

   * Click the extension icon
   * Click "Parent Access"
   * Enter default PIN: `1234`
   * **IMPORTANT:** Go to Settings and change your PIN immediately!

2. **Access Full Dashboard**

   * From the popup, click "📊 Full Dashboard"
   * Or click "Parent Access" → Enter PIN → "📊 Full Dashboard"

3. **Block a Website**

   * Navigate to Overview section
   * Click "🚫 Quick Block" to block current site
   * Or go to "Blocked Sites" → "Add Site"
   * Enter domain (e.g., `example.com`)
   * Select category
   * Click "Add Block"

4. **Set Time Limits**

   * Go to "Time Limits" section
   * Click "+ Add Time Limit"
   * Choose "Daily Limit" or "Per Site Limit"
   * Set hours and minutes
   * Click "Add Limit"

5. **View Activity**

   * Go to "Activity Log" section
   * Filter by Today, This Week, This Month, or All Time
   * Review browsing history and blocked attempts

6. **Configure Settings**

   * Go to "Settings" section
   * Change PIN
   * Toggle notifications
   * Enable/disable category filters
   * Export or clear data

### For Children

1. **Browse Normally**

   * The extension works automatically in the background
   * Browse as usual - protected sites will be blocked

2. **View Stats**

   * Click the extension icon to see today's activity
   * See sites visited, blocked, and time online

3. **If a Site is Blocked**

   * You'll see a friendly blocked page
   * It explains why the site was blocked
   * You can go back or go to a safe home page
   * Ask your parents if you think it was a mistake

## Default Settings

* **Default PIN:** `1234` (Change this immediately!)
* **Blocked Categories:** Adult Content ✓, Gambling ✓
* **Notifications:** All enabled
* **Time Limits:** None (must be set manually)

## Features Overview

### Automatic Blocking

* Blocks sites based on domain matching
* Category-based filtering (adult, gambling, social, gaming)
* Content scanning for inappropriate keywords
* Real-time URL checking

### Statistics Tracked

* Sites visited today
* Sites blocked today
* Total time online
* Safety warnings issued

### Notifications

* When sites are blocked (shows domain and reason)
* When time limits are approaching
* When time limits are reached

## Privacy \& Security

* All data stored locally in the browser
* PIN-protected parent controls
* No external servers or data sharing
* Activity logs stored locally only
* Export data feature for backup

## Customization

### Blocking Categories

You can enable/disable these categories in Settings:

* ✅ Adult Content (recommended)
* ✅ Gambling (recommended)
* ☐ Social Media (optional)
* ☐ Gaming Sites (optional)

### Time Management

* Set daily browsing time limits
* Set per-site time limits
* Warnings at 5 minutes remaining
* Automatic blocking when limit reached

## Troubleshooting

### Extension Not Working

1. Check if extension is enabled in browser extensions page
2. Reload the extension
3. Try restarting the browser

### Sites Not Being Blocked

1. Check if the domain is added to blocked sites list
2. Verify category filters are enabled in Settings
3. Some sites may bypass blocking if they use different domains

### Forgot PIN

1. Go to browser extensions page
2. Click "Remove" on Safe Browsing extension
3. Reinstall and set a new PIN
4. Note: This will clear all settings and activity logs

### Statistics Not Updating

1. Refresh the popup/dashboard
2. Check browser storage permissions
3. Try clearing extension data and reconfiguring

## File Structure

```
SafeBrowsing-Extension/
├── manifest.json           # Extension configuration
├── popup.html             # Quick access popup
├── popup.css              # Popup styles
├── popup.js               # Popup logic
├── parent-dashboard.html  # Full parent control panel
├── parent-dashboard.css   # Dashboard styles
├── parent-dashboard.js    # Dashboard logic
├── blocked.html           # Child-side block page
├── background.js          # Background service worker
├── content.js             # Content script for monitoring
├── content.css            # Content script styles
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # This file
```

## Technologies Used

* **Manifest V3** - Latest Chrome extension format
* **Vanilla JavaScript** - No frameworks required
* **Chrome Storage API** - For settings and data
* **Chrome Tabs API** - For tab management
* **Chrome Notifications API** - For alerts
* **Chrome WebNavigation API** - For URL monitoring

## Browser Compatibility

* ✅ Google Chrome (Manifest V3)
* ✅ Microsoft Edge (Manifest V3)
* ✅ Brave Browser (Manifest V3)
* ❌ Firefox (requires Manifest V2 modifications)
* ❌ Safari (different extension system)

## Important Notes

1. **Change Default PIN:** Always change the default PIN (1234) immediately after installation
2. **Regular Monitoring:** Check activity logs regularly to stay informed
3. **Communication:** Talk with your children about online safety
4. **Not Foolproof:** This is a tool to assist, not replace active parenting
5. **VPN/Proxy:** Children using VPNs or proxies may bypass some restrictions
6. **Incognito Mode:** Extension may not work in incognito/private browsing unless enabled

## Tips for Parents

* Start with conservative settings and adjust based on age
* Have open conversations about why certain sites are blocked
* Review activity logs together with your child
* Set reasonable time limits that allow homework and research
* Whitelist educational websites if they get blocked
* Update blocked sites list regularly

## Tips for Effectiveness

* Install on all browsers your child uses
* Set browser as default to prevent other browser usage
* Consider device-level parental controls as backup
* Monitor for new browsers being installed
* Educate about online safety, not just restrict
