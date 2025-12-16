// View elements
const childView = document.getElementById('childView');
const parentView = document.getElementById('parentView');
const parentDashboard = document.getElementById('parentDashboard');

// Buttons
const parentAccessBtn = document.getElementById('parentAccessBtn');
const backToChildBtn = document.getElementById('backToChildBtn');
const unlockBtn = document.getElementById('unlockBtn');
const logoutBtn = document.getElementById('logoutBtn');
const openFullDashboard = document.getElementById('openFullDashboard');
const quickBlockBtn = document.getElementById('quickBlockBtn');

// Input
const parentPassword = document.getElementById('parentPassword');

// Stats elements
const sitesVisited = document.getElementById('sitesVisited');
const sitesBlocked = document.getElementById('sitesBlocked');
const timeSpent = document.getElementById('timeSpent');
const totalBlocked = document.getElementById('totalBlocked');
const activeTimeLimits = document.getElementById('activeTimeLimits');

// Initialize
loadChildStats();

// Event Listeners
parentAccessBtn.addEventListener('click', () => {
  showView('parent');
});

backToChildBtn.addEventListener('click', () => {
  showView('child');
  parentPassword.value = '';
});

unlockBtn.addEventListener('click', () => {
  authenticateParent();
});

parentPassword.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    authenticateParent();
  }
});

logoutBtn.addEventListener('click', () => {
  showView('child');
});

openFullDashboard.addEventListener('click', () => {
  chrome.tabs.create({ url: 'parent-dashboard.html' });
});

quickBlockBtn.addEventListener('click', async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs[0]) {
    const url = new URL(tabs[0].url);
    const domain = url.hostname;
    
    const confirmed = confirm(`Block ${domain}?`);
    if (confirmed) {
      chrome.storage.sync.get(['blockedSites'], (result) => {
        const blockedSites = result.blockedSites || [];
        if (!blockedSites.includes(domain)) {
          blockedSites.push(domain);
          chrome.storage.sync.set({ blockedSites }, () => {
            alert(`${domain} has been blocked!`);
            chrome.tabs.reload(tabs[0].id);
          });
        }
      });
    }
  }
});

// Functions
function showView(view) {
  childView.classList.add('hidden');
  parentView.classList.add('hidden');
  parentDashboard.classList.add('hidden');
  
  if (view === 'child') {
    childView.classList.remove('hidden');
  } else if (view === 'parent') {
    parentView.classList.remove('hidden');
  } else if (view === 'dashboard') {
    parentDashboard.classList.remove('hidden');
    loadParentStats();
  }
}

function authenticateParent() {
  const enteredPassword = parentPassword.value;
  
  chrome.storage.sync.get(['parentPIN'], (result) => {
    const savedPIN = result.parentPIN || '1234'; // Default PIN
    
    if (enteredPassword === savedPIN) {
      showView('dashboard');
      parentPassword.value = '';
    } else {
      alert('Incorrect PIN! Please try again.');
      parentPassword.value = '';
      parentPassword.focus();
    }
  });
}

function loadChildStats() {
  chrome.storage.local.get(['dailyStats'], (result) => {
    const stats = result.dailyStats || {
      sitesVisited: 0,
      sitesBlocked: 0,
      timeSpent: 0
    };
    
    sitesVisited.textContent = stats.sitesVisited || 0;
    sitesBlocked.textContent = stats.sitesBlocked || 0;
    
    const hours = Math.floor(stats.timeSpent / 60);
    const minutes = stats.timeSpent % 60;
    timeSpent.textContent = `${hours}h ${minutes}m`;
  });
}

function loadParentStats() {
  chrome.storage.sync.get(['blockedSites', 'timeLimits'], (result) => {
    const blockedSites = result.blockedSites || [];
    const timeLimits = result.timeLimits || {};
    
    totalBlocked.textContent = blockedSites.length;
    
    const activeLimits = Object.keys(timeLimits).length;
    activeTimeLimits.textContent = activeLimits > 0 ? `${activeLimits} limit(s)` : 'None';
  });
}
