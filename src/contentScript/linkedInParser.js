// Add debug logging
const debug = (message, data = null) => {
  console.log(`[LinkedIn Parser] ${message}`, data || '');
};

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

debug('Content script loaded and ready'); 