# Installation Steps - Safe Browsing Extension

## Step-by-Step Installation Guide

### Prerequisites

* Google Chrome, Microsoft Edge, or Brave Browser
* 5-10 minutes of time

---

## Step 1: Generate Icons (2 minutes)

### Why You Need Icons

The browser extension requires icon files to display in the toolbar and extension settings.

### How to Create Icons

1. **Open the icon generator**

   * Navigate to the SafeBrowing-Extension folder
   * Double-click `create-icons.html`
   * It will open in your default browser

2. **Download icons**

   * You'll see three shield icons (16x16, 48x48, 128x128)
   * Click "Download All Icons"
   * Three PNG files will download to your Downloads folder
   * Files: `icon16.png`, `icon48.png`, `icon128.png`

3. **Create icons folder**

   * In the `SafeBrowsing-Extension` folder
   * Create a new folder named `icons` (lowercase, no spaces)
   * Move the three downloaded PNG files into this folder

4. **Verify**

```
   SafeBrowsing-Extension/
   └── icons/
       ├── icon16.png
       ├── icon48.png
       └── icon128.png
   ```

---

## Step 2: Load Extension in Browser (2 minutes)

### For Google Chrome

1. **Open Extensions Page**

   * Open Google Chrome
   * Click the three-dot menu (⋮) in top-right
   * Go to: More Tools → Extensions
   * OR type in address bar: `chrome://extensions/`

2. **Enable Developer Mode**

   * Look for "Developer mode" toggle in top-right corner
   * Click to turn it ON (should turn blue/green)

3. **Load the Extension**

   * Click "Load unpacked" button (appears after enabling developer mode)
   * A file browser window opens
   * Navigate to your `SafeBrowsing-Extension` folder
   * Select the folder and click "Select Folder"

4. **Verify Installation**

   * You should see the Safe Browsing card appear
   * It shows: Name, Version, Enabled toggle
   * Look for the shield icon in your browser toolbar

### For Microsoft Edge

1. **Open Extensions Page**

   * Open Microsoft Edge
   * Click the three-dot menu (...) in top-right
   * Go to: Extensions
   * OR type in address bar: `edge://extensions/`

2. **Enable Developer Mode**

   * Look for "Developer mode" toggle on the left sidebar
   * Click to turn it ON

3. **Load the Extension**

   * Click "Load unpacked"
   * Navigate to `SafeBrowsing-Extension` folder
   * Select and click "Select Folder"

4. **Verify Installation**

   * Extension card appears
   * Shield icon appears in toolbar

### For Brave Browser

1. **Open Extensions Page**

   * Open Brave Browser
   * Click the hamburger menu (≡) in top-right
   * Go to: Settings → Extensions
   * OR type: `brave://extensions/`

2. **Enable Developer Mode**

   * Toggle "Developer mode" in top-right

3. **Load the Extension**

   * Click "Load unpacked"
   * Select `SafeBrowsing-Extension` folder

4. **Verify Installation**

   * Extension appears in list
   * Icon in toolbar

---

## Step 3: First Time Setup (3 minutes)

### Change the Default PIN (CRITICAL!)

1. **Access Parent Controls**

   * Click the shield icon in browser toolbar
   * Extension popup appears
   * Click "Parent Access" button
   * Enter default PIN: `1234`
   * Click "Unlock Dashboard"

2. **Open Full Dashboard**

   * In the popup, click "📊 Full Dashboard"
   * OR click "Open Full Dashboard" button
   * A new tab opens with the parent dashboard

3. **Navigate to Settings**

   * Look at the left sidebar
   * Click "⚙️ Settings" (last option)

4. **Change PIN**

   * Scroll to "🔐 Security Settings" section
   * Fill in:

     * Current PIN: `1234`
     * New PIN: Your 4-digit number (e.g., `5678`)
     * Confirm PIN: Same 4-digit number

   * Click "Update PIN"
   * You'll see a success notification
   * **WRITE DOWN YOUR NEW PIN!** Don't forget it!

---

## Step 4: Basic Configuration (5 minutes)

### Enable Safety Filters

1. **In Settings tab** (where you just changed PIN)
2. **Scroll to "🎯 Filter Categories"**
3. **Check these boxes:**

   * ✅ Adult Content (Recommended)
   * ✅ Gambling (Recommended)
   * ☐ Social Media (Optional - based on your needs)
   * ☐ Gaming Sites (Optional - based on your needs)

### Block Your First Website

1. **Click "🚫 Blocked Sites"** in the left sidebar
2. Click "**+ Add Site**" button (top right)
3. **A modal popup appears:**

   * Domain: Type `facebook.com` (or any site you want to block)
   * Category: Select from dropdown (e.g., "Social Media")

4. Click "**Add Block**"
5. **The site appears in the table**
6. **Test it:** Open a new tab and try visiting facebook.com

   * You should see the "Website Blocked" page

### Set a Daily Time Limit

1. **Click "⏰ Time Limits"** in left sidebar
2. Click "**+ Add Time Limit**" button
3. **In the modal:**

   * Limit Type: Select "Daily Limit"
   * Hours: Enter `2` (for 2 hours)
   * Minutes: Enter `0`

4. Click "**Add Limit**"
5. **Now your child has 2 hours of browsing per day**

---

## Step 5: Test Everything (2 minutes)

### Test 1: Website Blocking

1. Open a new tab
2. Try to visit a blocked website (e.g., facebook.com)
3. **You should see:**

   * "🛡️ Website Blocked" page
   * The blocked URL displayed
   * Reason for blocking
   * Today's stats
   * Options to go back or home

4. ✅ **If you see this, blocking works!**

### Test 2: Child View

1. Click the extension icon (shield in toolbar)
2. If in parent view, click "Logout"
3. **You should see:**

   * "🛡️ Safe Browsing" header
   * "Protection Active" status
   * Today's activity stats
   * Encouraging message
   * "Parent Access" button

4. ✅ **This is what your child sees**

### Test 3: Parent Authentication

1. From child view, click "Parent Access"
2. Enter your NEW PIN (not 1234!)
3. **You should see:**

   * Parent Control Panel
   * Quick actions
   * Summary information

4. ✅ **Authentication works!**

---

## Step 6: Pin Extension to Toolbar (Optional)

### Why Pin?

* Easy access for both parents and children
* Visible reminder that protection is active
* Quick stats access

### How to Pin

**Chrome/Edge/Brave:**

1. Click the puzzle piece icon in toolbar
2. Find "Safe Browsing - Parental Control"
3. Click the pin icon next to it
4. Shield icon now permanently visible

---

## Common Installation Issues

### Issue: "icons" folder error

**Solution:**

* Make sure `icons` folder exists
* Check folder name is lowercase: `icons`
* Verify 3 PNG files are inside
* File names must match exactly: icon16.png, icon48.png, icon128.png

### Issue: Extension won't load

**Solution:**

* Check Developer mode is ON
* Make sure you selected the correct folder (SafeBrowsing-Extension)
* Look at errors in extension page - click "Errors" button
* Try reloading: Click the refresh icon on the extension card

### Issue: Can't see extension icon

**Solution:**

* Click puzzle piece icon to see all extensions
* Pin the extension to toolbar
* Check if extension is enabled (toggle should be on)

### Issue: Blocked sites not working

**Solution:**

* Give it a few seconds after adding a block
* Try refreshing the page you want blocked
* Clear browser cache
* Make sure extension is enabled

---

## What's Next?

After installation, you should:

1. **Configure More Blocks**

   * Add websites your child shouldn't access
   * Consider blocking categories
   * Start conservative and adjust

2. **Set Appropriate Time Limits**

   * Daily limit based on age
   * Per-site limits for distracting sites
   * Leave time for homework/research

3. **Enable Notifications**

   * Get alerts when sites are blocked
   * Know when time limits are reached
   * Stay informed about browsing

4. **Review Regularly**

   * Check activity logs weekly
   * Adjust blocks based on usage
   * Talk with your child about findings

5. **Read Full Documentation**

   * Open `README.md` for complete features
   * Check `PROJECT\_SUMMARY.md` for details
   * Refer to `QUICK\_START.md` for reminders

---

## Installation Checklist

Use this checklist to ensure proper installation:

* \[ ] Created `icons` folder with 3 PNG files
* \[ ] Loaded extension in browser (no errors)
* \[ ] Extension icon appears in toolbar
* \[ ] Opened popup successfully
* \[ ] Accessed parent controls with PIN 1234
* \[ ] Changed PIN to personal 4-digit code
* \[ ] Wrote down new PIN in safe place
* \[ ] Enabled Adult Content filter
* \[ ] Enabled Gambling filter
* \[ ] Added at least 1 blocked website
* \[ ] Set daily time limit
* \[ ] Tested blocking on sample site
* \[ ] Verified blocked page appears
* \[ ] Checked child view shows stats
* \[ ] Verified parent authentication works
* \[ ] Pinned extension to toolbar
* \[ ] Read QUICK\_START.md guide

---

## Congratulations! 🎉

Your Safe Browsing Extension is now installed and configured!

**Remember:**

* This is a tool to assist parenting, not replace it
* Keep communication open with your children
* Review activity logs regularly
* Adjust settings as needed
* Update blocks based on age and maturity

**Your children are now browsing more safely!** 🛡️

---

## Quick Reference

### Access Parent Dashboard

`Extension Icon → Parent Access → Enter PIN → Full Dashboard`

### Block a Site Quickly

`Extension Icon → Parent Access → Quick Block → Confirm`

### Check Today's Stats

`Extension Icon → View child dashboard`

### Add Time Limit

`Dashboard → Time Limits → Add Time Limit`

### View Activity

`Dashboard → Activity Log → Filter by date`

### Change Settings

`Dashboard → Settings → Modify options`

---

