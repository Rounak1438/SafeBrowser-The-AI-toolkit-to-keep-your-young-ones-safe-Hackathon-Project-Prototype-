// Background service worker for Safe Browsing Extension

// Initialize default settings on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['parentPIN', 'settings', 'blockedSites'], (result) => {
    if (!result.parentPIN) {
      chrome.storage.sync.set({ parentPIN: '1234' }); // Default PIN
    }
    
    if (!result.settings) {
      chrome.storage.sync.set({
        settings: {
          notifyBlocked: true,
          notifyTimeLimit: true,
          dailyReport: true,
          blockAdult: true,
          blockGambling: true,
          blockSocial: false,
          blockGaming: false
        }
      });
    }
    
    if (!result.blockedSites) {
      chrome.storage.sync.set({ blockedSites: [] });
    }
  });
  
  // Initialize daily stats
  chrome.storage.local.set({
    dailyStats: {
      sitesVisited: 0,
      sitesBlocked: 0,
      timeSpent: 0,
      warnings: 0
    },
    activityLog: []
  });
  
  // Set up daily reset alarm
  chrome.alarms.create('resetDailyStats', { periodInMinutes: 1440 }); // 24 hours
  chrome.alarms.create('trackTime', { periodInMinutes: 1 }); // Track every minute
});

// Listen for alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'resetDailyStats') {
    resetDailyStats();
  } else if (alarm.name === 'trackTime') {
    trackActiveTime();
  }
});

// Reset daily statistics
function resetDailyStats() {
  chrome.storage.local.set({
    dailyStats: {
      sitesVisited: 0,
      sitesBlocked: 0,
      timeSpent: 0,
      warnings: 0
    }
  });
}

// Track active browsing time
function trackActiveTime() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0 && tabs[0].url && !tabs[0].url.startsWith('chrome://')) {
      chrome.storage.local.get(['dailyStats'], (result) => {
        const stats = result.dailyStats || {};
        stats.timeSpent = (stats.timeSpent || 0) + 1;
        chrome.storage.local.set({ dailyStats: stats });
      });
    }
  });
}

// Check if a URL should be blocked
function shouldBlockURL(url, callback) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    chrome.storage.sync.get(['blockedSites', 'settings'], (result) => {
      const blockedSites = result.blockedSites || [];
      const settings = result.settings || {};
      
      // Check custom blocked sites
      for (let site of blockedSites) {
        const blockedDomain = typeof site === 'string' ? site : site.domain;
        if (domain.includes(blockedDomain) || blockedDomain.includes(domain)) {
          callback(true, 'Custom block rule', blockedDomain);
          return;
        }
      }
      
      // Check category-based blocking
      if (settings.blockAdult && isAdultContent(domain)) {
        callback(true, 'Adult content filter', domain);
        return;
      }
      
      if (settings.blockGambling && isGamblingContent(domain)) {
        callback(true, 'Gambling content filter', domain);
        return;
      }
      
      if (settings.blockSocial && isSocialMedia(domain)) {
        callback(true, 'Social media restriction', domain);
        return;
      }
      
      if (settings.blockGaming && isGamingSite(domain)) {
        callback(true, 'Gaming site restriction', domain);
        return;
      }
      
      callback(false);
    });
  } catch (e) {
    callback(false);
  }
}

// Category detection functions
function isAdultContent(domain) {
  const adultKeywords = ['porn', 'xxx', 'adult', 'sex', 'nsfw'];
  return adultKeywords.some(keyword => domain.includes(keyword));
}

function isGamblingContent(domain) {
  const gamblingKeywords = ['casino', 'poker', 'betting', 'gamble', 'slots', 'lottery'];
  return gamblingKeywords.some(keyword => domain.includes(keyword));
}

function isSocialMedia(domain) {
  const socialSites = ['facebook.com', 'instagram.com', 'twitter.com', 'x.com', 'tiktok.com', 
                       'snapchat.com', 'reddit.com', 'pinterest.com'];
  return socialSites.some(site => domain.includes(site));
}

function isGamingSite(domain) {
  const gamingSites = ['steam', 'epicgames', 'roblox', 'minecraft', 'fortnite', 
                       'playstation', 'xbox', 'nintendo'];
  return gamingSites.some(keyword => domain.includes(keyword));
}

// Listen for navigation events
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId === 0) { // Main frame only
    shouldBlockURL(details.url, (blocked, reason, domain) => {
      if (blocked) {
        blockPage(details.tabId, details.url, reason, domain);
      } else {
        logActivity('visited', details.url);
      }
    });
  }
});

// Block a page
function blockPage(tabId, url, reason, domain) {
  const blockedURL = chrome.runtime.getURL('blocked.html') + 
                     `?url=${encodeURIComponent(url)}&reason=${encodeURIComponent(reason)}`;
  
  chrome.tabs.update(tabId, { url: blockedURL });
  
  // Update statistics
  chrome.storage.local.get(['dailyStats'], (result) => {
    const stats = result.dailyStats || {};
    stats.sitesBlocked = (stats.sitesBlocked || 0) + 1;
    stats.warnings = (stats.warnings || 0) + 1;
    chrome.storage.local.set({ dailyStats: stats });
  });
  
  // Log the block
  logActivity('blocked', url, reason);
  
  // Send notification
  chrome.storage.sync.get(['settings'], (result) => {
    if (result.settings?.notifyBlocked) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Safe Browsing',
        message: `Blocked: ${domain}\nReason: ${reason}`
      });
    }
  });
}

// Log browsing activity
function logActivity(action, url, reason = null) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    chrome.storage.local.get(['activityLog', 'dailyStats'], (result) => {
      const activityLog = result.activityLog || [];
      const stats = result.dailyStats || {};
      
      const logEntry = {
        action: action,
        url: url,
        domain: domain,
        reason: reason,
        timestamp: new Date().toISOString()
      };
      
      activityLog.push(logEntry);
      
      // Keep only last 1000 entries
      if (activityLog.length > 1000) {
        activityLog.shift();
      }
      
      // Update visited count
      if (action === 'visited') {
        stats.sitesVisited = (stats.sitesVisited || 0) + 1;
      }
      
      chrome.storage.local.set({ 
        activityLog: activityLog,
        dailyStats: stats
      });
    });
  } catch (e) {
    // Invalid URL, skip logging
  }
}

// Check time limits
function checkTimeLimits() {
  chrome.storage.sync.get(['timeLimits'], (result) => {
    const timeLimits = result.timeLimits || {};
    
    chrome.storage.local.get(['dailyStats'], (statsResult) => {
      const stats = statsResult.dailyStats || {};
      const timeSpent = stats.timeSpent || 0;
      
      // Check daily limit
      if (timeLimits.daily) {
        const dailyLimit = timeLimits.daily.totalMinutes;
        if (timeSpent >= dailyLimit) {
          notifyTimeLimit('Daily time limit reached!');
        }
      }
    });
  });
}

// Notify about time limits
function notifyTimeLimit(message) {
  chrome.storage.sync.get(['settings'], (result) => {
    if (result.settings?.notifyTimeLimit) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Safe Browsing - Time Limit',
        message: message
      });
    }
  });
}

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkBlock') {
    shouldBlockURL(request.url, (blocked, reason) => {
      sendResponse({ blocked: blocked, reason: reason });
    });
    return true;
  }
  
  if (request.action === 'logActivity') {
    logActivity(request.type, request.url, request.reason);
    sendResponse({ success: true });
  }
  
  if (request.action === 'getStats') {
    chrome.storage.local.get(['dailyStats'], (result) => {
      sendResponse(result.dailyStats || {});
    });
    return true;
  }
});

// Check time limits every 5 minutes
setInterval(checkTimeLimits, 5 * 60 * 1000);
