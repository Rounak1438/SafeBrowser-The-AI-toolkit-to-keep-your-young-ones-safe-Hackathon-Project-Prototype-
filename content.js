// Content script - Monitors page content and behavior

// Monitor page load
window.addEventListener('load', () => {
  monitorPage();
});

// Monitor the current page
function monitorPage() {
  const currentUrl = window.location.href;
  
  // Send message to background to check if should be blocked
  chrome.runtime.sendMessage({
    action: 'checkBlock',
    url: currentUrl
  }, (response) => {
    if (response && response.blocked) {
      // Redirect to blocked page
      window.location.href = chrome.runtime.getURL('blocked.html') + 
        `?url=${encodeURIComponent(currentUrl)}&reason=${encodeURIComponent(response.reason)}`;
    }
  });
  
  // Check for inappropriate content
  scanPageContent();
}

// Scan page content for keywords
function scanPageContent() {
  const pageText = document.body.innerText.toLowerCase();
  
  chrome.storage.sync.get(['settings'], (result) => {
    const settings = result.settings || {};
    
    // Check for adult content keywords
    if (settings.blockAdult) {
      const adultKeywords = ['explicit', 'adult only', '18+', 'nsfw'];
      for (let keyword of adultKeywords) {
        if (pageText.includes(keyword)) {
          warnUser('Potentially inappropriate content detected');
          break;
        }
      }
    }
  });
}

// Display warning overlay
function warnUser(message) {
  // Create warning overlay
  const overlay = document.createElement('div');
  overlay.id = 'safe-browsing-warning';
  overlay.innerHTML = `
    <div class="warning-content">
      <div class="warning-icon">⚠️</div>
      <h2>Safety Warning</h2>
      <p>${message}</p>
      <button id="warning-close">I Understand</button>
    </div>
  `;
  document.body.appendChild(overlay);
  
  // Add close button listener
  document.getElementById('warning-close').addEventListener('click', () => {
    overlay.remove();
  });
  
  // Update statistics
  chrome.storage.local.get(['dailyStats'], (result) => {
    const stats = result.dailyStats || {};
    stats.warnings = (stats.warnings || 0) + 1;
    chrome.storage.local.set({ dailyStats: stats });
  });
}

// Monitor time spent on page
let pageStartTime = Date.now();
let timeSpentOnPage = 0;

// Track time every minute
setInterval(() => {
  timeSpentOnPage = Math.floor((Date.now() - pageStartTime) / 1000 / 60);
}, 60000);

// Track when user leaves the page
window.addEventListener('beforeunload', () => {
  const finalTime = Math.floor((Date.now() - pageStartTime) / 1000 / 60);
  
  chrome.runtime.sendMessage({
    action: 'logActivity',
    type: 'timeSpent',
    url: window.location.href,
    duration: finalTime
  });
});

// Monitor for new content (for single-page apps)
const observer = new MutationObserver(() => {
  // Re-check content when page changes
  scanPageContent();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Check for time limits
function checkTimeLimits() {
  chrome.runtime.sendMessage({ action: 'getStats' }, (stats) => {
    chrome.storage.sync.get(['timeLimits'], (result) => {
      const timeLimits = result.timeLimits || {};
      const timeSpent = stats.timeSpent || 0;
      
      // Check daily limit
      if (timeLimits.daily) {
        const limit = timeLimits.daily.totalMinutes;
        const remaining = limit - timeSpent;
        
        if (remaining <= 5 && remaining > 0) {
          showTimeWarning(`Only ${remaining} minutes remaining today!`);
        } else if (remaining <= 0) {
          showTimeLimitReached();
        }
      }
      
      // Check per-site limit
      const domain = window.location.hostname;
      if (timeLimits[domain]) {
        // Track site-specific time
        chrome.storage.local.get([`siteTime_${domain}`], (siteResult) => {
          const siteTime = siteResult[`siteTime_${domain}`] || 0;
          const siteLimit = timeLimits[domain].totalMinutes;
          const siteRemaining = siteLimit - siteTime;
          
          if (siteRemaining <= 5 && siteRemaining > 0) {
            showTimeWarning(`Only ${siteRemaining} minutes remaining on this site!`);
          } else if (siteRemaining <= 0) {
            showTimeLimitReached();
          }
        });
      }
    });
  });
}

// Show time warning
function showTimeWarning(message) {
  if (!document.getElementById('time-warning')) {
    const warning = document.createElement('div');
    warning.id = 'time-warning';
    warning.className = 'time-warning';
    warning.innerHTML = `
      <div class="time-warning-content">
        <span class="time-icon">⏰</span>
        <span class="time-message">${message}</span>
        <button class="time-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    document.body.appendChild(warning);
  }
}

// Show time limit reached
function showTimeLimitReached() {
  const overlay = document.createElement('div');
  overlay.id = 'time-limit-overlay';
  overlay.innerHTML = `
    <div class="time-limit-content">
      <div class="time-limit-icon">⏰</div>
      <h2>Time Limit Reached</h2>
      <p>You've reached your browsing time limit for today.</p>
      <p>Take a break and come back tomorrow!</p>
      <button onclick="window.close()">Close Tab</button>
    </div>
  `;
  document.body.appendChild(overlay);
}

// Check time limits every 5 minutes
setInterval(checkTimeLimits, 5 * 60 * 1000);

// Initial time limit check
setTimeout(checkTimeLimits, 5000);
