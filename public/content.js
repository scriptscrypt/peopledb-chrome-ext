// Debug logging
const debug = (message, data = null) => {
  console.log(`[PeopleDB] ${message}`, data || '');
};

// Immediately log that the script is loaded
debug('Content script loaded');

// Wait for element to be present in DOM
const waitForElement = (selector, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkElement = () => {
      const element = document.querySelector(selector);
      if (element) {
        debug(`Element found: ${selector}`);
        resolve(element);
        return;
      }

      if (Date.now() - startTime > timeout) {
        debug(`Timeout waiting for element: ${selector}`);
        reject(new Error('Timeout waiting for element'));
        return;
      }

      requestAnimationFrame(checkElement);
    };

    checkElement();
  });
};

// Parse LinkedIn search results with retry
const parseLinkedInResults = async (retryCount = 3) => {
  debug('Starting to parse results');
  
  try {
    // Wait for the search results container
    await waitForElement('.search-results-container');
    
    // Additional wait for lazy-loaded content
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const results = document.querySelectorAll('.search-results-container .entity-result');
    debug(`Found ${results.length} results`);
    
    if (results.length === 0 && retryCount > 0) {
      debug(`No results found, retrying... (${retryCount} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return parseLinkedInResults(retryCount - 1);
    }
    
    return Array.from(results).map(result => {
      try {
        const profileImg = result.querySelector('.presence-entity__image')?.src || '';
        const name = result.querySelector('.entity-result__title-text a span[aria-hidden="true"]')?.textContent?.trim() || '';
        const title = result.querySelector('.entity-result__primary-subtitle')?.textContent?.trim() || '';
        const location = result.querySelector('.entity-result__secondary-subtitle')?.textContent?.trim() || '';
        const profileUrl = result.querySelector('.entity-result__title-text a')?.href || '';
        const connectionDegree = result.querySelector('.entity-result__badge-text')?.textContent?.trim() || '';
        const mutualConnections = result.querySelector('.reusable-search-simple-insight__text-container')?.textContent?.trim() || '';
        
        return {
          id: profileUrl,
          name,
          title,
          location,
          profileImg,
          profileUrl,
          connectionDegree,
          mutualConnections,
          selected: false,
          changed: title.includes('Changed jobs')
        };
      } catch (error) {
        debug('Error parsing result', error);
        return null;
      }
    }).filter(Boolean);
  } catch (error) {
    debug('Error in parseLinkedInResults', error);
    if (retryCount > 0) {
      debug(`Retrying... (${retryCount} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return parseLinkedInResults(retryCount - 1);
    }
    throw error;
  }
};

// Add message listener to handle requests from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  debug('Received message from extension', request);
  
  if (request.type === 'GET_PROSPECTS') {
    // Use async/await with Promise to handle the async parseLinkedInResults
    parseLinkedInResults()
      .then(prospects => {
        debug('Successfully parsed prospects', prospects);
        sendResponse({ prospects, success: true });
      })
      .catch(error => {
        debug('Error parsing prospects', error);
        sendResponse({ success: false, error: error.message });
      });
    
    return true; // Keep the message channel open for async response
  }
});

// Set up observer for URL changes (LinkedIn uses client-side routing)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    debug('URL changed, resetting parser');
    // Clear any existing state if needed
  }
}).observe(document, { subtree: true, childList: true });

function injectDrawer() {
  // Create drawer container
  const drawer = document.createElement("div");
  drawer.id = "peopledb-drawer";
  drawer.className = "peopledb-drawer";
  
  // Create drawer content with app mount point
  drawer.innerHTML = `
    <div class="peopledb-drawer-content">
      <div class="peopledb-drawer-header">
        <h2>PeopleDB</h2>
        <button class="peopledb-close-btn">×</button>
      </div>
      <div class="peopledb-drawer-body">
        <div id="peopledb-app-root"></div>
      </div>
    </div>
  `;

  // Add drawer to page
  document.body.appendChild(drawer);

  // Add event listener for close button
  const closeBtn = drawer.querySelector('.peopledb-close-btn');
  closeBtn.addEventListener('click', () => {
    drawer.classList.remove('open');
  });

  // Inject styles
  const styles = document.createElement("style");
  styles.textContent = `
    .peopledb-drawer {
      position: fixed;
      top: 0;
      right: -384px; /* Match the width */
      width: 384px; /* Match extension width */
      height: 100vh;
      background: white;
      box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      transition: right 0.3s ease;
    }

    .peopledb-drawer.open {
      right: 0;
    }

    .peopledb-drawer-content {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .peopledb-drawer-header {
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .peopledb-drawer-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .peopledb-close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      padding: 0 8px;
      color: #666;
    }

    .peopledb-close-btn:hover {
      color: #000;
    }

    .peopledb-drawer-body {
      flex: 1;
      overflow-y: auto;
    }

    #peopledb-app-root {
      height: 100%;
    }

    /* Import your app's CSS */
    ${getAppStyles()}
  `;
  document.head.appendChild(styles);

  // Mount React app
  mountReactApp();

  return drawer;
}

function getAppStyles() {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    /* Tailwind base styles */
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    /* Your app's custom styles */
    #peopledb-app-root {
      font-family: Inter, system-ui, -apple-system, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    #peopledb-app-root .extension {
      width: 384px;
      height: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
  `;
}

function mountReactApp() {
  // Create script to load React and your app
  const script = document.createElement('script');
  script.type = 'module';
  script.textContent = `
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import { NextUIProvider } from '@nextui-org/react';
    import App from '${chrome.runtime.getURL('src/App.jsx')}';

    const root = ReactDOM.createRoot(document.getElementById('peopledb-app-root'));
    root.render(
      <React.StrictMode>
        <NextUIProvider>
          <main className="dark text-foreground bg-background">
            <App />
          </main>
        </NextUIProvider>
      </React.StrictMode>
    );
  `;
  document.head.appendChild(script);
}

function updateDrawerContent(profileData) {
  const profileDataContainer = document.getElementById('peopledb-profile-data');
  if (!profileDataContainer) return;

  profileDataContainer.innerHTML = Object.entries(profileData)
    .map(([key, value]) => `
      <div class="peopledb-data-item">
        <div class="peopledb-data-label">${key}</div>
        <div class="peopledb-data-value">${value || 'N/A'}</div>
      </div>
    `)
    .join('');
}

// Ensure the button is always on top
function createFloatingButton() {
  debug('Creating floating button');
  
  const floatingBtn = document.createElement('button');
  floatingBtn.id = 'peopledb-floating-btn';
  floatingBtn.innerHTML = 'PDB';
  
  // Force visibility with !important
  const buttonStyles = `
    position: fixed !important;
    right: 20px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    z-index: 2147483647 !important;
    background: #0073b1 !important;
    color: white !important;
    border: none !important;
    border-radius: 8px !important;
    padding: 12px 20px !important;
    font-size: 14px !important;
    font-weight: bold !important;
    cursor: pointer !important;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
    transition: all 0.2s ease !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    pointer-events: auto !important;
    min-width: 60px !important;
    min-height: 40px !important;
  `;
  
  floatingBtn.style.cssText = buttonStyles;
  
  return floatingBtn;
}

// Function to ensure button exists
function ensureButtonExists() {
  let floatingBtn = document.getElementById('peopledb-floating-btn');
  
  if (!floatingBtn) {
    debug('Button not found, creating new one');
    floatingBtn = createFloatingButton();
    document.body.appendChild(floatingBtn);
    
    // Add event listeners
    floatingBtn.addEventListener('mouseenter', () => {
      floatingBtn.style.background = '#005582 !important';
      floatingBtn.style.transform = 'translateY(-50%) scale(1.05) !important';
      floatingBtn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3) !important';
    });

    floatingBtn.addEventListener('mouseleave', () => {
      floatingBtn.style.background = '#0073b1 !important';
      floatingBtn.style.transform = 'translateY(-50%) scale(1) !important';
      floatingBtn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2) !important';
    });

    floatingBtn.addEventListener('click', () => {
      debug('Button clicked');
      const drawer = document.getElementById('peopledb-drawer');
      if (drawer) {
        drawer.classList.add('open');
      } else {
        // If drawer doesn't exist, create it
        injectDrawer();
        document.getElementById('peopledb-drawer').classList.add('open');
      }
    });
  }
  
  return floatingBtn;
}

// Initialize as early as possible
function initializeExtension() {
  debug('Initializing extension');
  
  // Try to inject immediately if document.body exists
  if (document.body) {
    ensureButtonExists();
  }
  
  // Also inject on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    ensureButtonExists();
  }, { once: true });
  
  // Backup injection on load
  window.addEventListener('load', () => {
    ensureButtonExists();
  }, { once: true });
}

// Watch for potential body changes
const observer = new MutationObserver((mutations) => {
  ensureButtonExists();
});

// Start observing as soon as possible
if (document.documentElement) {
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}

// Initialize immediately
initializeExtension();

// Periodic check for button existence
const reinjectionInterval = setInterval(() => {
  if (!document.getElementById('peopledb-floating-btn')) {
    debug('Periodic check: Button not found, recreating');
    ensureButtonExists();
  }
}, 2000);

// Clear interval after 30 seconds
setTimeout(() => {
  clearInterval(reinjectionInterval);
}, 30000);

// Check if we're on a LinkedIn profile page
function isProfilePage() {
  const isProfile = window.location.href.includes("linkedin.com/in/");
  debug('Is profile page check:', isProfile);
  return isProfile;
}

// Watch for page changes
const observerPageChanges = new MutationObserver((mutations) => {
  const existingCTA = document.getElementById("peopledb-floating-btn");
  if (!existingCTA) {
    debug('No existing CTA found, injecting new one');
    injectCTA();
    if (isProfilePage()) {
      extractProfileData();
    }
  }
});

// Start observing
debug('Starting observer');
observerPageChanges.observe(document.body, {
  childList: true,
  subtree: true,
});

// Initial injection
debug('Performing initial injection');
injectCTA();
if (isProfilePage()) {
  extractProfileData();
} 