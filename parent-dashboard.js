// Navigation
const navItems = document.querySelectorAll('.nav-item');
const contentSections = document.querySelectorAll('.content-section');
const pageTitle = document.getElementById('pageTitle');
const currentDate = document.getElementById('currentDate');

// Overview elements
const totalSitesVisited = document.getElementById('totalSitesVisited');
const totalSitesBlocked = document.getElementById('totalSitesBlocked');
const totalTimeSpent = document.getElementById('totalTimeSpent');
const totalWarnings = document.getElementById('totalWarnings');
const recentActivity = document.getElementById('recentActivity');
const topSites = document.getElementById('topSites');

// Blocked sites elements
const addBlockBtn = document.getElementById('addBlockBtn');
const searchBlocked = document.getElementById('searchBlocked');
const blockedSitesTable = document.getElementById('blockedSitesTable');
const addBlockModal = document.getElementById('addBlockModal');
const closeBlockModal = document.getElementById('closeBlockModal');
const cancelBlockBtn = document.getElementById('cancelBlockBtn');
const confirmBlockBtn = document.getElementById('confirmBlockBtn');
const blockDomain = document.getElementById('blockDomain');
const blockCategory = document.getElementById('blockCategory');

// Time limits elements
const addTimeLimitBtn = document.getElementById('addTimeLimitBtn');
const timeLimitCards = document.getElementById('timeLimitCards');
const addTimeLimitModal = document.getElementById('addTimeLimitModal');
const closeTimeLimitModal = document.getElementById('closeTimeLimitModal');
const cancelTimeLimitBtn = document.getElementById('cancelTimeLimitBtn');
const confirmTimeLimitBtn = document.getElementById('confirmTimeLimitBtn');
const timeLimitType = document.getElementById('timeLimitType');
const siteInputGroup = document.getElementById('siteInputGroup');
const timeLimitSite = document.getElementById('timeLimitSite');
const timeLimitHours = document.getElementById('timeLimitHours');
const timeLimitMinutes = document.getElementById('timeLimitMinutes');

// Activity log elements
const dateFilter = document.getElementById('dateFilter');
const activityTimeline = document.getElementById('activityTimeline');

// Settings elements
const currentPIN = document.getElementById('currentPIN');
const newPIN = document.getElementById('newPIN');
const confirmPIN = document.getElementById('confirmPIN');
const changePINBtn = document.getElementById('changePINBtn');
const notifyBlocked = document.getElementById('notifyBlocked');
const notifyTimeLimit = document.getElementById('notifyTimeLimit');
const dailyReport = document.getElementById('dailyReport');
const blockAdult = document.getElementById('blockAdult');
const blockGambling = document.getElementById('blockGambling');
const blockSocial = document.getElementById('blockSocial');
const blockGaming = document.getElementById('blockGaming');
const exportDataBtn = document.getElementById('exportDataBtn');
const clearDataBtn = document.getElementById('clearDataBtn');

// Initialize
init();

function init() {
  // Set current date
  const now = new Date();
  currentDate.textContent = now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Load all data
  loadOverviewData();
  loadBlockedSites();
  loadTimeLimits();
  loadActivityLog();
  loadSettings();

  // Setup event listeners
  setupNavigation();
  setupBlockedSites();
  setupTimeLimits();
  setupActivityLog();
  setupSettings();
}

// Navigation
function setupNavigation() {
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const section = item.dataset.section;
      
      // Update active nav item
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      
      // Show selected section
      contentSections.forEach(sec => sec.classList.add('hidden'));
      document.getElementById(section).classList.remove('hidden');
      
      // Update page title
      const titles = {
        'overview': 'Overview',
        'blocked-sites': 'Blocked Sites',
        'time-limits': 'Time Limits',
        'activity-log': 'Activity Log',
        'settings': 'Settings'
      };
      pageTitle.textContent = titles[section];
    });
  });
}

// Overview Section
function loadOverviewData() {
  chrome.storage.local.get(['dailyStats', 'activityLog'], (result) => {
    const stats = result.dailyStats || {
      sitesVisited: 0,
      sitesBlocked: 0,
      timeSpent: 0,
      warnings: 0
    };
    
    totalSitesVisited.textContent = stats.sitesVisited || 0;
    totalSitesBlocked.textContent = stats.sitesBlocked || 0;
    totalWarnings.textContent = stats.warnings || 0;
    
    const hours = Math.floor(stats.timeSpent / 60);
    const minutes = stats.timeSpent % 60;
    totalTimeSpent.textContent = `${hours}h ${minutes}m`;
    
    // Load recent activity
    const logs = result.activityLog || [];
    if (logs.length > 0) {
      recentActivity.innerHTML = logs.slice(-5).reverse().map(log => `
        <div class="activity-item">
          <div>
            <strong>${log.action}</strong><br>
            <small>${log.url}</small>
          </div>
          <small>${new Date(log.timestamp).toLocaleTimeString()}</small>
        </div>
      `).join('');
    }
    
    // Load top sites
    const siteCounts = {};
    logs.forEach(log => {
      if (log.action === 'visited') {
        siteCounts[log.domain] = (siteCounts[log.domain] || 0) + 1;
      }
    });
    
    const topSitesList = Object.entries(siteCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    if (topSitesList.length > 0) {
      topSites.innerHTML = topSitesList.map(([domain, count]) => `
        <div class="site-item">
          <span>${domain}</span>
          <span><strong>${count}</strong> visits</span>
        </div>
      `).join('');
    }
  });
}

// Blocked Sites Section
function setupBlockedSites() {
  addBlockBtn.addEventListener('click', () => {
    addBlockModal.classList.remove('hidden');
  });

  closeBlockModal.addEventListener('click', () => {
    addBlockModal.classList.add('hidden');
    resetBlockForm();
  });

  cancelBlockBtn.addEventListener('click', () => {
    addBlockModal.classList.add('hidden');
    resetBlockForm();
  });

  confirmBlockBtn.addEventListener('click', () => {
    addBlockedSite();
  });

  searchBlocked.addEventListener('input', (e) => {
    filterBlockedSites(e.target.value);
  });
}

function loadBlockedSites() {
  chrome.storage.sync.get(['blockedSites'], (result) => {
    const sites = result.blockedSites || [];
    
    if (sites.length === 0) {
      blockedSitesTable.innerHTML = '<tr><td colspan="4" class="no-data">No blocked sites yet</td></tr>';
      return;
    }
    
    blockedSitesTable.innerHTML = sites.map(site => {
      const domain = typeof site === 'string' ? site : site.domain;
      const category = typeof site === 'object' ? site.category : 'Custom';
      const date = typeof site === 'object' ? site.blockedSince : new Date().toLocaleDateString();
      
      return `
        <tr data-domain="${domain}">
          <td>${domain}</td>
          <td><span class="badge">${category}</span></td>
          <td>${date}</td>
          <td>
            <button class="action-delete" onclick="removeBlockedSite('${domain}')">Remove</button>
          </td>
        </tr>
      `;
    }).join('');
  });
}

function addBlockedSite() {
  const domain = blockDomain.value.trim().toLowerCase();
  const category = blockCategory.value;
  
  if (!domain) {
    alert('Please enter a domain');
    return;
  }
  
  chrome.storage.sync.get(['blockedSites'], (result) => {
    const blockedSites = result.blockedSites || [];
    
    const newBlock = {
      domain: domain,
      category: category,
      blockedSince: new Date().toLocaleDateString()
    };
    
    blockedSites.push(newBlock);
    
    chrome.storage.sync.set({ blockedSites }, () => {
      loadBlockedSites();
      addBlockModal.classList.add('hidden');
      resetBlockForm();
      showNotification('Site blocked successfully!');
    });
  });
}

window.removeBlockedSite = function(domain) {
  if (confirm(`Remove block for ${domain}?`)) {
    chrome.storage.sync.get(['blockedSites'], (result) => {
      let blockedSites = result.blockedSites || [];
      blockedSites = blockedSites.filter(site => {
        const siteDomain = typeof site === 'string' ? site : site.domain;
        return siteDomain !== domain;
      });
      
      chrome.storage.sync.set({ blockedSites }, () => {
        loadBlockedSites();
        showNotification('Block removed!');
      });
    });
  }
};

function resetBlockForm() {
  blockDomain.value = '';
  blockCategory.value = 'adult';
}

function filterBlockedSites(query) {
  const rows = blockedSitesTable.querySelectorAll('tr');
  const lowerQuery = query.toLowerCase();
  
  rows.forEach(row => {
    const domain = row.dataset.domain;
    if (domain) {
      row.style.display = domain.includes(lowerQuery) ? '' : 'none';
    }
  });
}

// Time Limits Section
function setupTimeLimits() {
  addTimeLimitBtn.addEventListener('click', () => {
    addTimeLimitModal.classList.remove('hidden');
  });

  closeTimeLimitModal.addEventListener('click', () => {
    addTimeLimitModal.classList.add('hidden');
    resetTimeLimitForm();
  });

  cancelTimeLimitBtn.addEventListener('click', () => {
    addTimeLimitModal.classList.add('hidden');
    resetTimeLimitForm();
  });

  confirmTimeLimitBtn.addEventListener('click', () => {
    addTimeLimit();
  });

  timeLimitType.addEventListener('change', (e) => {
    siteInputGroup.style.display = e.target.value === 'perSite' ? 'block' : 'none';
  });
}

function loadTimeLimits() {
  chrome.storage.sync.get(['timeLimits'], (result) => {
    const limits = result.timeLimits || {};
    
    if (Object.keys(limits).length === 0) {
      timeLimitCards.innerHTML = `
        <div class="empty-state">
          <p>⏰ No time limits set</p>
          <p class="sub-text">Add daily or per-site time limits to manage screen time</p>
        </div>
      `;
      return;
    }
    
    timeLimitCards.innerHTML = Object.entries(limits).map(([key, limit]) => `
      <div class="time-limit-card">
        <h4>${limit.type === 'daily' ? '📅 Daily Limit' : '🌐 ' + limit.site}</h4>
        <p class="time-limit-info">
          Limit: <strong>${limit.hours}h ${limit.minutes}m</strong>
        </p>
        <button class="btn btn-danger" onclick="removeTimeLimit('${key}')">Remove</button>
      </div>
    `).join('');
  });
}

function addTimeLimit() {
  const type = timeLimitType.value;
  const hours = parseInt(timeLimitHours.value) || 0;
  const minutes = parseInt(timeLimitMinutes.value) || 0;
  const site = timeLimitSite.value.trim().toLowerCase();
  
  if (type === 'perSite' && !site) {
    alert('Please enter a website');
    return;
  }
  
  if (hours === 0 && minutes === 0) {
    alert('Please set a time limit');
    return;
  }
  
  chrome.storage.sync.get(['timeLimits'], (result) => {
    const timeLimits = result.timeLimits || {};
    
    const key = type === 'daily' ? 'daily' : site;
    timeLimits[key] = {
      type: type,
      site: type === 'perSite' ? site : null,
      hours: hours,
      minutes: minutes,
      totalMinutes: hours * 60 + minutes
    };
    
    chrome.storage.sync.set({ timeLimits }, () => {
      loadTimeLimits();
      addTimeLimitModal.classList.add('hidden');
      resetTimeLimitForm();
      showNotification('Time limit added!');
    });
  });
}

window.removeTimeLimit = function(key) {
  if (confirm('Remove this time limit?')) {
    chrome.storage.sync.get(['timeLimits'], (result) => {
      const timeLimits = result.timeLimits || {};
      delete timeLimits[key];
      
      chrome.storage.sync.set({ timeLimits }, () => {
        loadTimeLimits();
        showNotification('Time limit removed!');
      });
    });
  }
};

function resetTimeLimitForm() {
  timeLimitType.value = 'daily';
  timeLimitSite.value = '';
  timeLimitHours.value = '1';
  timeLimitMinutes.value = '0';
  siteInputGroup.style.display = 'none';
}

// Activity Log Section
function setupActivityLog() {
  dateFilter.addEventListener('change', (e) => {
    loadActivityLog(e.target.value);
  });
}

function loadActivityLog(filter = 'today') {
  chrome.storage.local.get(['activityLog'], (result) => {
    let logs = result.activityLog || [];
    
    // Filter by date
    const now = new Date();
    logs = logs.filter(log => {
      const logDate = new Date(log.timestamp);
      
      switch (filter) {
        case 'today':
          return logDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return logDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return logDate >= monthAgo;
        default:
          return true;
      }
    });
    
    if (logs.length === 0) {
      activityTimeline.innerHTML = '<p class="no-data">No activity recorded</p>';
      return;
    }
    
    activityTimeline.innerHTML = logs.reverse().map(log => `
      <div class="timeline-item">
        <div class="timeline-time">${new Date(log.timestamp).toLocaleString()}</div>
        <div class="timeline-content">
          <strong>${log.action === 'blocked' ? '🚫 Blocked' : '✅ Visited'}:</strong> ${log.url}
          ${log.reason ? `<br><small>Reason: ${log.reason}</small>` : ''}
        </div>
      </div>
    `).join('');
  });
}

// Settings Section
function setupSettings() {
  changePINBtn.addEventListener('click', changePIN);
  
  // Save settings on change
  [notifyBlocked, notifyTimeLimit, dailyReport, blockAdult, blockGambling, blockSocial, blockGaming].forEach(checkbox => {
    checkbox.addEventListener('change', saveSettings);
  });
  
  exportDataBtn.addEventListener('click', exportData);
  clearDataBtn.addEventListener('click', clearAllData);
}

function loadSettings() {
  chrome.storage.sync.get(['settings'], (result) => {
    const settings = result.settings || {
      notifyBlocked: true,
      notifyTimeLimit: true,
      dailyReport: true,
      blockAdult: true,
      blockGambling: true,
      blockSocial: false,
      blockGaming: false
    };
    
    notifyBlocked.checked = settings.notifyBlocked;
    notifyTimeLimit.checked = settings.notifyTimeLimit;
    dailyReport.checked = settings.dailyReport;
    blockAdult.checked = settings.blockAdult;
    blockGambling.checked = settings.blockGambling;
    blockSocial.checked = settings.blockSocial;
    blockGaming.checked = settings.blockGaming;
  });
}

function saveSettings() {
  const settings = {
    notifyBlocked: notifyBlocked.checked,
    notifyTimeLimit: notifyTimeLimit.checked,
    dailyReport: dailyReport.checked,
    blockAdult: blockAdult.checked,
    blockGambling: blockGambling.checked,
    blockSocial: blockSocial.checked,
    blockGaming: blockGaming.checked
  };
  
  chrome.storage.sync.set({ settings }, () => {
    showNotification('Settings saved!');
  });
}

function changePIN() {
  const current = currentPIN.value;
  const newPin = newPIN.value;
  const confirm = confirmPIN.value;
  
  if (!current || !newPin || !confirm) {
    alert('Please fill all fields');
    return;
  }
  
  if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
    alert('PIN must be 4 digits');
    return;
  }
  
  if (newPin !== confirm) {
    alert('New PINs do not match');
    return;
  }
  
  chrome.storage.sync.get(['parentPIN'], (result) => {
    const savedPIN = result.parentPIN || '1234';
    
    if (current !== savedPIN) {
      alert('Current PIN is incorrect');
      return;
    }
    
    chrome.storage.sync.set({ parentPIN: newPin }, () => {
      showNotification('PIN changed successfully!');
      currentPIN.value = '';
      newPIN.value = '';
      confirmPIN.value = '';
    });
  });
}

function exportData() {
  chrome.storage.local.get(null, (localData) => {
    chrome.storage.sync.get(null, (syncData) => {
      const data = { local: localData, sync: syncData };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `safe-browsing-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      showNotification('Data exported successfully!');
    });
  });
}

function clearAllData() {
  if (confirm('Are you sure you want to clear all data? This cannot be undone!')) {
    if (confirm('This will remove all activity logs, blocked sites, and time limits. Continue?')) {
      chrome.storage.local.clear(() => {
        chrome.storage.sync.clear(() => {
          showNotification('All data cleared!');
          setTimeout(() => location.reload(), 1000);
        });
      });
    }
  }
}

// Utility
function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #28a745;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}
