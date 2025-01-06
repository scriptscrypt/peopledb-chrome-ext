// content.js
function injectCTA() {
  // Create container for our CTA
  const container = document.createElement("div");
  container.id = "contact-saver-cta";

  // Add it to the page
  document.body.appendChild(container);

  // Create and inject our script
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("cta.js");
  script.type = "module";
  document.head.appendChild(script);

  // Listen for profile data
  document.addEventListener("PROFILE_DATA_READY", function (e) {
    chrome.runtime.sendMessage({
      type: "PROFILE_DATA",
      data: e.detail,
    });
  });
}

// Check if we're on a LinkedIn profile page
function isProfilePage() {
  return window.location.href.includes("linkedin.com/in/");
}

// Watch for page changes (LinkedIn is a SPA)
const observer = new MutationObserver((mutations) => {
  if (isProfilePage()) {
    const existingCTA = document.getElementById("contact-saver-cta");
    if (!existingCTA) {
      injectCTA();
      extractProfileData();
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Initial check
if (isProfilePage()) {
  injectCTA();
  extractProfileData();
}

// Function to extract profile data
function extractProfileData() {
  const profileData = {
    name: document.querySelector(".text-heading-xlarge")?.innerText,
    title: document.querySelector(".text-body-medium")?.innerText,
    company: document.querySelector(".experience-item__subtitle")?.innerText,
    location: document.querySelector(".text-body-small")?.innerText,
  };

  // Dispatch event with profile data
  const event = new CustomEvent("PROFILE_DATA_READY", {
    detail: profileData,
  });
  document.dispatchEvent(event);
}
