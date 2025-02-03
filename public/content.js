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

// Wait for selector to be present in DOM
const waitForSelector = async (selector, timeout = 5000) => {
  return await waitForElement(selector, timeout);
};

// Find all elements matching a selector
const findAll = (selector) => {
  return Array.from(document.querySelectorAll(selector));
};

// Get text content of an element
const getText = async (element, selector) => {
  const el = element.querySelector(selector);
  return el ? el.textContent.trim() : null;
};

// Get href attribute of an element
const getHref = async (element, selector) => {
  const el = element.querySelector(selector);
  return el ? el.getAttribute('href') : null;
};

// Get image source attribute of an element
const getImageSrc = async (element, selector) => {
  const el = element.querySelector(selector);
  return el ? el.getAttribute('src') : null;
};

// Parse LinkedIn search results with retry
const parseLinkedInResults = async () => {
  debug('Starting to parse results');
  
  // Wait for results container
  const resultsContainer = await waitForSelector('.search-results-container');
  if (!resultsContainer) {
    debug('No results container found');
    return [];
  }

  // Get all result items
  const resultItems = await findAll('li.zohxiIWjFxOAJZgeyVXCwbZLkTFitQwlmErc');
  debug(`Found ${resultItems.length} result items`);

  const results = [];
  
  for (const item of resultItems) {
    try {
      // Extract profile data
      const profileData = {
        name: await getText(item, '.YYDYAPmgJNiHoOtGRjnLDnVQkrxYpXVJuwxY'),
        title: await getText(item, '.ZMkZYQlZeAuOhykAzSqyYnNJQcEFrPimDBIURWM'),
        location: await getText(item, '.iIOsLBoiozRfIcUBATfsiYIkQbtxiIkuBVFPI'),
        profileUrl: await getHref(item, '.PXSSFxjsKnzqamnTHCCRhjqzdnfLKUSEpmk a'),
        imageUrl: await getImageSrc(item, '.presence-entity__image'),
        connectionDegree: await getText(item, '.entity-result__badge-text'),
        mutualConnections: await getText(item, '.reusable-search-simple-insight__text--small'),
        timestamp: new Date().toISOString()
      };

      // Only add if we have valid data
      if (profileData.name && profileData.profileUrl) {
        results.push(profileData);
      }

    } catch (err) {
      debug(`Error parsing result item: ${err.message}`);
      continue;
    }
  }

  debug(`Successfully parsed ${results.length} results`);
  return results;
};

// Add message listener to handle requests from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  debug('Received message from extension', request);
  
  if (request.type === 'GET_PROSPECTS') {
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
    <iframe 
      id="peopledb-iframe"
      src="${chrome.runtime.getURL('index.html')}"
      style="
        width: 100% !important;
        height: 100% !important;
        border: none !important;
        background: white !important;
      "
    ></iframe>
  `;

  // Add drawer to page
  document.body.appendChild(drawer);

  // Inject styles
  const styles = document.createElement("style");
  styles.textContent = `
    .peopledb-drawer {
      position: fixed !important;
      top: 0 !important;
      right: -384px !important;
      width: 384px !important;
      height: 100vh !important;
      background: white !important;
      box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15) !important;
      z-index: 9999 !important;
      transition: right 0.3s ease !important;
    }

    .peopledb-drawer.open {
      right: 0 !important;
    }
  `;
  document.head.appendChild(styles);

  return drawer;
}

// Update manifest.json to include index.html
const manifestUpdate = {
  "web_accessible_resources": [
    {
      "resources": [
        "index.html",
        "assets/*",
        "*.js",
        "*.css"
      ],
      "matches": ["https://*.linkedin.com/*"]
    }
  ]
};

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
  // Create inner content with icon and text
  floatingBtn.innerHTML = `
    <div style="
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 8px !important;
    ">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM6 8a6 6 0 1 1 12 0A6 6 0 0 1 6 8zm2 10a3 3 0 0 0-3 3 1 1 0 1 1-2 0 5 5 0 0 1 5-5h8a5 5 0 0 1 5 5 1 1 0 1 1-2 0 3 3 0 0 0-3-3H8z" fill="currentColor"/>
      </svg>
      <span style="writing-mode: vertical-lr !important; text-orientation: upright !important;">
        PEOPLE
      </span>
      <span style="writing-mode: vertical-lr !important; text-orientation: upright !important;">
        DB
      </span>
    </div>
  `;
  
  // Updated styles to match Lusha
  const buttonStyles = `
    position: fixed !important;
    right: 0 !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    z-index: 2147483647 !important;
    background: #4040F2 !important;
    color: white !important;
    border: none !important;
    border-top-left-radius: 8px !important;
    border-bottom-left-radius: 8px !important;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    padding: 16px 8px !important;
    font-size: 12px !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    box-shadow: -2px 0 4px rgba(0,0,0,0.1) !important;
    transition: all 0.2s ease !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    visibility: visible !important;
    opacity: 1 !important;
    pointer-events: auto !important;
    min-width: 40px !important;
    min-height: 120px !important;
    line-height: 1.2 !important;
    letter-spacing: 1px !important;
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
    
    // Updated hover effects to match Lusha
    floatingBtn.addEventListener('mouseenter', () => {
      floatingBtn.style.background = '#3333D1 !important';
      floatingBtn.style.transform = 'translateY(-50%) translateX(-2px) !important';
    });

    floatingBtn.addEventListener('mouseleave', () => {
      floatingBtn.style.background = '#4040F2 !important';
      floatingBtn.style.transform = 'translateY(-50%) translateX(0) !important';
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